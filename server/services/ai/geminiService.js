const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

// Generate a question
const generateQuestion = async (role, difficulty, previousQuestions = []) => {
  const history =
    previousQuestions.length > 0
      ? `Here are the questions that have already been asked, do not repeat them:\n- ${previousQuestions.join(
          "\n- "
        )}\n\nPlease generate a new, unique question.`
      : "Please generate the first question.";

  const prompt = `
    You are an expert technical interviewer. Generate a ${difficulty} level interview question for a ${role} position.
    ${history}
    Return only the question text itself without any introductory phrases, labels, or additional text.
  `;

  try {
    const response = await axios.post(
      `${BASE_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || "No question generated.";
  } catch (error) {
    console.error(
      "Error generating question:",
      error.response?.data || error.message
    );
    throw new Error("Failed to generate question");
  }
};

// Evaluate answer
const evaluateAnswer = async (question, answer, role, difficulty) => {
  const prompt = `
    As an expert interviewer for ${role} positions, evaluate the following answer to the question: "${question}"
    
    Question: ${question}
    Answer: ${answer}
    
    Please provide:
    1. A score out of 10 (just the number)
    2. Detailed feedback on what was good and what could be improved
    3. Specific recommendations for improvement

    Format your response as:
    SCORE: [score]
    FEEDBACK: [feedback]
    RECOMMENDATIONS: [recommendations]
  `;

  try {
    const response = await axios.post(
      `${BASE_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Parse parts from text
    const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
    const feedbackMatch = text.match(
      /FEEDBACK:\s*([\s\S]*?)(?=RECOMMENDATIONS:|$)/i
    );
    const recommendationsMatch = text.match(/RECOMMENDATIONS:\s*([\s\S]*)/i);

    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      feedback: feedbackMatch ? feedbackMatch[1].trim() : "",
      recommendations: recommendationsMatch
        ? recommendationsMatch[1].trim()
        : "",
    };
  } catch (error) {
    console.error(
      "Error evaluating answer:",
      error.response?.data || error.message
    );
    throw new Error("Failed to evaluate answer");
  }
};

module.exports = {
  generateQuestion,
  evaluateAnswer,
};
