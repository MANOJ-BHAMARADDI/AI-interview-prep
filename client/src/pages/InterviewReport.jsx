import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InterviewContext from "../context/InterviewContext";

const InterviewReport = () => {
  const { id } = useParams();
  const { fetchInterviewById } = useContext(InterviewContext);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterview = async () => {
      const res = await fetchInterviewById(id);
      if (res.success) {
        setInterview(res.data);
      }
      setLoading(false);
    };

    loadInterview();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Interview not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The requested interview could not be found.
          </p>
        </div>
      </div>
    );
  }

  const averageScore = interview.totalScore;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Interview Report</h1>
        <p className="mt-2 text-gray-600">
          Detailed analysis of your interview performance
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {interview.role}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {new Date(interview.createdAt).toLocaleString()} •{" "}
                {interview.difficulty}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-indigo-600">
                  {averageScore}/10
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  Average Score
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Questions Answered
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {interview.questions.length}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Completion Status
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Question Analysis
        </h2>
        <div className="space-y-6">
          {interview.questions.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Question {index + 1}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    Score: {item.evaluation?.score || "N/A"}/10
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{item.question}</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Your Answer
                </h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {item.userAnswer}
                  </p>
                </div>
              </div>
              {item.evaluation && (
                <>
                  <div className="px-6 py-4 bg-blue-50">
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Feedback
                    </h4>
                    <p className="text-gray-700">{item.evaluation.feedback}</p>
                  </div>
                  <div className="px-6 py-4">
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Recommendations
                    </h4>
                    <p className="text-gray-700">
                      {item.evaluation.recommendations}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Performance Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900">Strengths</h3>
            <ul className="mt-2 list-disc list-inside text-gray-700">
              <li>Strong technical knowledge</li>
              <li>Clear communication</li>
              <li>Problem-solving approach</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Areas for Improvement
            </h3>
            <ul className="mt-2 list-disc list-inside text-gray-700">
              <li>Provide more specific examples</li>
              <li>Improve time management</li>
              <li>Enhance technical depth</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900">Resources</h3>
            <ul className="mt-2 list-disc list-inside text-gray-700">
              <li>
                <a href="#" className="text-indigo-600 hover:underline">
                  System Design Primer
                </a>
              </li>
              <li>
                <a href="#" className="text-indigo-600 hover:underline">
                  Algorithm Practice
                </a>
              </li>
              <li>
                <a href="#" className="text-indigo-600 hover:underline">
                  Behavioral Questions Guide
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;
