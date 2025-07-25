import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InterviewContext from "../context/InterviewContext";
import RoleSelector from "../components/RoleSelector";
import QuestionCard from "../components/QuestionCard";
import EvaluationCard from "../components/EvaluationCard";

const InterviewSimulator = () => {
  const [interviewState, setInterviewState] = useState("selecting"); // selecting, answering, evaluating, completed
  const { currentInterview, startInterview, submitAnswer } =
    useContext(InterviewContext);
  const navigate = useNavigate();

  const handleStartInterview = async ({ role, difficulty }) => {
    const res = await startInterview(role, difficulty);
    if (res.success) {
      setInterviewState("answering");
    }
  };

  const handleSubmitAnswer = async (answer) => {
    if (!currentInterview) return;

    const res = await submitAnswer(currentInterview.interviewId, answer);
    if (res.success) {
      if (res.data.completed) {
        setInterviewState("completed");
        // Redirect to report page after a short delay
        setTimeout(() => {
          navigate(`/report/${currentInterview.interviewId}`);
        }, 2000);
      } else {
        setInterviewState("evaluating");
      }
    }
  };

  const handleNextQuestion = () => {
    setInterviewState("answering");
  };

  useEffect(() => {
    if (currentInterview && currentInterview.completed) {
      setInterviewState("completed");
    }
  }, [currentInterview]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Interview Simulator
        </h1>
        <p className="mt-2 text-gray-600">
          Practice your technical interview skills with AI-powered feedback
        </p>
      </div>

      {interviewState === "selecting" && (
        <RoleSelector onStart={handleStartInterview} />
      )}

      {interviewState === "answering" && currentInterview && (
        <QuestionCard
          question={currentInterview.question}
          questionNumber={currentInterview.questionNumber}
          totalQuestions={currentInterview.totalQuestions}
          onSubmit={handleSubmitAnswer}
        />
      )}

      {interviewState === "evaluating" &&
        currentInterview &&
        currentInterview.evaluation && (
          <EvaluationCard
            evaluation={currentInterview.evaluation}
            onNext={handleNextQuestion}
          />
        )}

      {interviewState === "completed" && (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <div className="text-green-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Interview Completed!
          </h2>
          <p className="text-gray-600 mb-6">
            Your detailed report is being generated. You'll be redirected
            shortly...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSimulator;
