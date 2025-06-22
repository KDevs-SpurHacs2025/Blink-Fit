import React from "react";
import { useNavigate } from "react-router-dom";
import HealthIcon from "../assets/icons/health.svg";
import LockIcon from "../assets/icons/lock.svg";
import ArrowGreenIcon from "../assets/icons/arrow-green.svg";

const Settings = () => {
  const navigate = useNavigate();
  const email = "user@example.com"; // Replace with actual user email if available
  return (
    <div className="w-full h-full flex flex-col items-center min-h-screen bg-bg-color py-[80px]">
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
          className="w-full flex items-center justify-between cursor-pointer hover:bg-gray-50 py-2"
          onClick={() => navigate("/eye-health-info")}
        >
          <span className="flex items-center gap-3">
            <img src={HealthIcon} alt="health" className="w-6 h-6" />
            Eye Health Information
          </span>
          <img src={ArrowGreenIcon} alt="arrow" className="w-4 h-4" />
        </div>
        {/* Divider */}
        <div className="w-full border-b border-gray-300 m-6"></div>
        <div className="w-full flex items-center justify-between cursor-pointer hover:bg-gray-50 py-2">
          <span className="flex items-center gap-3">
            <img src={LockIcon} alt="lock" className="w-6 h-6" />
            Privacy and Permissions
          </span>
          <img src={ArrowGreenIcon} alt="arrow" className="w-4 h-4" />
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
