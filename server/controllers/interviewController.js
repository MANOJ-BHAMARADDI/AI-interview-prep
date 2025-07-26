const Interview = require("../models/Interview");
const User = require("../models/User");
const {
  generateQuestion,
  evaluateAnswer,
} = require("../services/ai/geminiService");
const InterviewWorkflow = require("../services/ai/langGraphFlow");

// In-memory store for active interviews (in production, use Redis or DB)
const activeInterviews = new Map();

const startInterview = async (req, res) => {
  try {
    const { role, difficulty } = req.body;
    const userId = req.user.id;

    console.log(
      "Starting interview for user:",
      userId,
      "Role:",
      role,
      "Difficulty:",
      difficulty
    );

    // Create a new interview record
    const interview = new Interview({
      user: userId,
      role,
      difficulty,
    });

    await interview.save();
    console.log("Interview created:", interview._id);

    // Add user to interview history
    await User.findByIdAndUpdate(userId, {
      $push: { interviewHistory: interview._id },
    });

    // Initialize interview workflow
    const workflow = new InterviewWorkflow({
      generateQuestion,
      evaluateAnswer,
    });
    const questionData = await workflow.start(role, difficulty);

    // Store workflow in active interviews
    activeInterviews.set(interview._id.toString(), workflow);

    // Update interview with first question
    interview.questions.push({
      question: questionData.question,
    });
    await interview.save();

    res.status(201).json({
      interviewId: interview._id,
      ...questionData,
    });
  } catch (error) {
    console.error("Start interview error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to start interview" });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { id: interviewId } = req.params;
    const { answer } = req.body;
    const userId = req.user.id;

    console.log(
      "Submitting answer for interview:",
      interviewId,
      "User:",
      userId
    );

    const interview = await Interview.findOne({
      _id: interviewId,
      user: userId,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Get workflow from memory or re-create it if it doesn't exist
    let workflow = activeInterviews.get(interviewId);
    if (!workflow) {
      console.log("Re-creating workflow for interview:", interviewId);
      workflow = new InterviewWorkflow({
        generateQuestion,
        evaluateAnswer,
      });

      // Re-hydrate the state
      workflow.state.role = interview.role;
      workflow.state.difficulty = interview.difficulty;
      workflow.state.questionCount = interview.questions.length - 1;
      workflow.state.currentQuestion =
        interview.questions[interview.questions.length - 1].question;

      // Re-hydrate the history of answers and evaluations
      workflow.state.answers = interview.questions
        .filter((q) => q.userAnswer)
        .map((q) => ({
          question: q.question,
          answer: q.userAnswer,
        }));
      workflow.state.evaluations = interview.questions
        .filter((q) => q.evaluation)
        .map((q) => q.evaluation);

      activeInterviews.set(interviewId, workflow);
    }

    // Evaluate answer
    const evaluation = await workflow.evaluateAnswer(answer);

    // Update interview record
    const currentQuestionIndex = interview.questions.length - 1;
    interview.questions[currentQuestionIndex].userAnswer = answer;
    interview.questions[currentQuestionIndex].evaluation = evaluation;

    // Generate next question or complete interview
    const nextQuestionData = await workflow.generateNextQuestion();

    if (nextQuestionData.completed) {
      // Complete interview
      const results = workflow.getResults();
      interview.totalScore = results.totalScore;
      interview.completed = true;
      interview.completedAt = new Date();

      // Remove from active interviews
      activeInterviews.delete(interviewId);
    } else {
      // Add next question
      interview.questions.push({
        question: nextQuestionData.question,
      });
    }

    await interview.save();

    res.json({
      evaluation,
      nextQuestion: nextQuestionData.completed ? null : nextQuestionData,
      completed: nextQuestionData.completed,
      progress: workflow.getProgress(),
    });
  } catch (error) {
    console.error("Submit answer error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to submit answer" });
  }
};

const getInterviewHistory = async (req, res) => {
  try {
    console.log("Fetching interview history for user:", req.user.id);

    const interviews = await Interview.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    console.log("Found interviews:", interviews.length);
    res.json(interviews);
  } catch (error) {
    console.error("Get interview history error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch interview history" });
  }
};

const getInterviewById = async (req, res) => {
  try {
    console.log(
      "Fetching interview by ID:",
      req.params.id,
      "User:",
      req.user.id
    );

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("user", "name");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json(interview);
  } catch (error) {
    console.error("Get interview by ID error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch interview" });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewById,
};
