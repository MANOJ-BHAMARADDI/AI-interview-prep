import React, { useState } from "react";

const RoleSelector = ({ onStart }) => {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full-stack Developer",
    "Data Structures & Algorithms",
    "System Design",
    "DevOps Engineer",
    "Product Manager",
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role) {
      onStart({ role, difficulty });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Select Interview Role
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select a role</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="difficulty"
          >
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`py-3 px-4 rounded-lg border ${
                  difficulty === level
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        >
          Start Interview
        </button>
      </form>
    </div>
  );
};

export default RoleSelector;
