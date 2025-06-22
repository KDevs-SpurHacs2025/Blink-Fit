import React from "react";
import { useNavigate } from "react-router-dom";
import questions from "../data/questions";

const EyeHealthInfo = () => {
  const navigate = useNavigate();

  // Placeholder: Replace with actual user answers from state, context, or storage
  const answers = {
    wearGlasses: "Glasses",
    eyeConditions: "Dry eyes",
    eyeStrain: "Very often",
    screenHours: "2-6 hours",
    lightSensitive: "Yes",
    headaches: "Sometimes",
    screenTimeGoal: "6",
    focusSessionLength: "45",
    breakVibe: "Listening to music",
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-white py-8 px-4 overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-xl flex items-center mb-8">
        <button
          className="mr-4 text-blue-500 hover:underline"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold flex-1 text-center">
          Eye Health Information
        </h1>
      </div>
      {/* Q&A List */}
      <div className="w-full max-w-xl bg-gray-50 rounded-lg shadow p-6 mb-8">
        {questions.map((q) => (
          <div key={q.name || q.question} className="mb-6">
            <div className="font-semibold text-gray-700 mb-1">{q.question}</div>
            <div className="text-gray-900 pl-2">
              {answers[q.name] || (
                <span className="italic text-gray-400">No answer</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Reset Button */}
      <button
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition mb-4"
        onClick={() => navigate("/survey")}
      >
        Reset
      </button>
    </div>
  );
};

export default EyeHealthInfo;
