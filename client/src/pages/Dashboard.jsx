import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import InterviewContext from "../context/InterviewContext";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { interviewHistory, fetchInterviewHistory } =
    useContext(InterviewContext);

  useEffect(() => {
    fetchInterviewHistory();
  }, []);

  const recentInterviews = interviewHistory.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Ready to practice your interview skills?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Start New Interview
          </h3>
          <p className="mt-2 text-gray-600">
            Practice with AI-powered interview simulations
          </p>
          <Link
            to="/interview"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Begin Practice
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Interview History
          </h3>
          <p className="mt-2 text-gray-600">
            Review your past interviews and track progress
          </p>
          <Link
            to="/history"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View History
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Resources</h3>
          <p className="mt-2 text-gray-600">
            Access study materials and interview tips
          </p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Browse Resources
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Interviews
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentInterviews.length > 0 ? (
            recentInterviews.map((interview) => (
              <div key={interview._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">
                      {interview.role}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(interview.createdAt).toLocaleDateString()} •{" "}
                      {interview.difficulty}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Score: {interview.totalScore}/10
                    </span>
                    <Link
                      to={`/report/${interview._id}`}
                      className="ml-4 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      View Report
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">
                No interviews yet. Start your first practice session!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
