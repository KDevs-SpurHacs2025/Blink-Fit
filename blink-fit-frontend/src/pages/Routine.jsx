import React from "react";
import { useNavigate } from "react-router-dom";

export default function Routine() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-black mb-2 text-center">
        We've prepared routines for you!
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Pick the routine that works best
      </p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-xl">
        {/* Micro Routine Card */}
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">
            Short and eye-friendly Micro routine
          </h2>
          <div className="text-gray-700 mb-1">25m screen time</div>
          <div className="text-gray-700 mb-4">1m break</div>
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition mt-auto"
            onClick={() => navigate("/policy")}
          >
            Start with this routine
          </button>
        </div>
        {/* Regular Routine Card */}
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">
            Suited for longer focus blocks
          </h2>
          <div className="text-gray-700 mb-1">1h screen time</div>
          <div className="text-gray-700 mb-4">1m break</div>
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition mt-auto"
            onClick={() => navigate("/policy")}
          >
            Start with this routine
          </button>
        </div>
      </div>
    </div>
  );
}
