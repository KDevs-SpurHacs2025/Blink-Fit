import React from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const email = "user@example.com"; // Replace with actual user email if available
  return (
    <div className="w-full h-full flex flex-col items-center min-h-screen bg-gray-100 py-[80px]">
      {/* Profile Picture */}
      <div className="w-[160px] h-[160px] rounded-full bg-gray-200 flex items-center justify-center mb-6">
        {/* Placeholder for profile image */}
        <span className="text-4xl">👤</span>
      </div>
      {/* Email */}
      <div className="text-base font-normal">{email}</div>
      {/* Divider */}
      <div className="w-3/4 border-b border-gray-300 m-12"></div>
      {/* Options */}
      <div className="w-full bg-white px-6 py-8 flex flex-col items-center max-w-md rounded-lg shadow-sm">
        <div
          className="w-full  cursor-pointer hover:bg-gray-50"
          onClick={() => navigate("/eye-health-info")}
        >
          Eye Health Information
        </div>
        {/* Divider */}
        <div className="w-full border-b border-gray-300 m-6"></div>
        <div className="w-full cursor-pointer hover:bg-gray-50">
          Privacy and Permissions
        </div>
      </div>
      {/* Sign Out Button */}
      <div className="flex-1" />
      <button className="bg-transparent text-red-500 text-sm font-base hover:underline">
        Sign Out
      </button>
    </div>
  );
};

export default Settings;
