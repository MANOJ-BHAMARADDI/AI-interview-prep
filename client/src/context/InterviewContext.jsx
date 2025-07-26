import React, { createContext, useState, useContext } from "react";
import { interviewService } from "../services/interviewService";

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [currentInterview, setCurrentInterview] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const startInterview = async (role, difficulty) => {
    setLoading(true);
    try {
      const data = await interviewService.startInterview({ role, difficulty });
      setCurrentInterview(data);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to start interview",
      };
    }
  };

  const submitAnswer = async (interviewId, answer) => {
    setLoading(true);
    try {
      const data = await interviewService.submitAnswer(interviewId, answer);
      setCurrentInterview((prev) => {
        const updatedInterview = {
          ...prev,
          evaluation: data.evaluation,
          completed: data.completed,
          progress: data.progress,
        };

        if (!data.completed && data.nextQuestion) {
          updatedInterview.question = data.nextQuestion.question;
          updatedInterview.questionNumber = data.nextQuestion.questionNumber;
          updatedInterview.totalQuestions = data.nextQuestion.totalQuestions;
        }

        return updatedInterview;
      });
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to submit answer",
      };
    }
  };

  const fetchInterviewHistory = async () => {
    setLoading(true);
    try {
      const data = await interviewService.getInterviewHistory();
      setInterviewHistory(data);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch history",
      };
    }
  };

  const fetchInterviewById = async (id) => {
    setLoading(true);
    try {
      const data = await interviewService.getInterviewById(id);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch interview",
      };
    }
  };

  return (
    <InterviewContext.Provider
      value={{
        currentInterview,
        interviewHistory,
        loading,
        startInterview,
        submitAnswer,
        fetchInterviewHistory,
        fetchInterviewById,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export default InterviewContext;
