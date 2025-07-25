// This is a simplified implementation of LangGraph-like workflow
// In a real implementation, you would use the actual LangGraph library

class InterviewWorkflow {
  constructor(geminiService) {
    this.geminiService = geminiService;
    this.state = {
      currentQuestion: null,
      answers: [],
      evaluations: [],
      questionCount: 0,
      maxQuestions: 5,
    };
  }

  async start(role, difficulty) {
    this.state.role = role;
    this.state.difficulty = difficulty;
    return await this.generateNextQuestion();
  }

  async generateNextQuestion() {
    if (this.state.questionCount >= this.state.maxQuestions) {
      return { completed: true };
    }

    try {
      const question = await this.geminiService.generateQuestion(
        this.state.role,
        this.state.difficulty
      );

      this.state.currentQuestion = question;
      this.state.questionCount++;

      return {
        question,
        questionNumber: this.state.questionCount,
        totalQuestions: this.state.maxQuestions,
      };
    } catch (error) {
      throw new Error("Failed to generate question");
    }
  }

  async evaluateAnswer(answer) {
    if (!this.state.currentQuestion) {
      throw new Error("No current question to evaluate");
    }

    try {
      const evaluation = await this.geminiService.evaluateAnswer(
        this.state.currentQuestion,
        answer,
        this.state.role,
        this.state.difficulty
      );

      this.state.answers.push({
        question: this.state.currentQuestion,
        answer,
      });

      this.state.evaluations.push(evaluation);

      return evaluation;
    } catch (error) {
      throw new Error("Failed to evaluate answer");
    }
  }

  getProgress() {
    return {
      current: this.state.questionCount,
      total: this.state.maxQuestions,
      completed: this.state.questionCount >= this.state.maxQuestions,
    };
  }

  getResults() {
    const totalScore = this.state.evaluations.reduce(
      (sum, evaluation) => sum + evaluation.score,
      0
    );
    const averageScore =
      this.state.evaluations.length > 0
        ? Math.round(totalScore / this.state.evaluations.length)
        : 0;

    return {
      questions: this.state.answers.map((ans, index) => ({
        question: ans.question,
        userAnswer: ans.answer,
        evaluation: this.state.evaluations[index],
      })),
      totalScore: averageScore,
      completed: this.state.questionCount >= this.state.maxQuestions,
    };
  }
}

module.exports = InterviewWorkflow;
