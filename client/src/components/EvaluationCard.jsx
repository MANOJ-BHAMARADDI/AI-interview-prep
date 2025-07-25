import React from "react";

const EvaluationCard = ({ evaluation, onNext }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Evaluation</h3>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Score:</span>
            <span className="text-2xl font-bold text-indigo-600">
              {evaluation.score}/10
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Feedback</h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{evaluation.feedback}</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Recommendations
          </h4>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700">{evaluation.recommendations}</p>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default EvaluationCard;
