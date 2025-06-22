import React from "react";
import { useNavigate } from "react-router-dom";

const handleStartEyeTracking = () => {
  const trackerUrl = "/tracker.html"; // public 폴더 기준
  window.open(trackerUrl, "_blank", "width=800,height=600");
};

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => {
          handleStartEyeTracking();
          navigate("/screen-time");
        }}
      >
        Go to Screen Time
      </button>
      <button
        className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        onClick={() => navigate("/settings")}
      >
        Go to Settings
      </button>
    </div>
  );
};

export default Home;
