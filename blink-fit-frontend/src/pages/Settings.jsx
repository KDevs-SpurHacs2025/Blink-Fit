import React from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const email = "user@example.com"; // Replace with actual user email if available
  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-6">
      {/* Profile Picture */}
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 mt-8">
        {/* Placeholder for profile image */}
        <span className="text-4xl text-gray-400">👤</span>
      </div>
      {/* Email */}
      <div className="text-lg font-medium mb-4 text-gray-700">{email}</div>
      {/* Divider */}
      <div className="w-full border-b border-gray-300 mb-4"></div>
      {/* Options */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm">
        <div
          className="px-6 py-4 cursor-pointer hover:bg-gray-50"
          onClick={() => navigate("/eye-health-info")}
        >
          Eye Health Information
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="px-6 py-4 cursor-pointer hover:bg-gray-50">
          Privacy and Permissions
        </div>
      </div>
      {/* Sign Out Button */}
      <div className="flex-1" />
      <button className="mt-12 underline text-red-500 text-lg font-semibold hover:text-red-700">
        Sign Out
      </button>
    </div>
  );
};

export default Settings;
