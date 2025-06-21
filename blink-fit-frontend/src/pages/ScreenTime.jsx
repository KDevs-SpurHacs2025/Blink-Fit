import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StopWatch from "../assets/icons/stopWatch.svg";
import Eye from "../assets/icons/eye.svg";
import Rule from "../assets/icons/rule.svg";
import Pause from "../assets/icons/pause.svg";
import Stop from "../assets/icons/stop.svg";
import Play from "../assets/icons/play.svg";
import CircleTimer from "../components/CircleTimer";
import ConfirmModal from "../components/ConfirmModal";

export default function ScreenTime() {
  const [status, setStatus] = useState("Danger");
  const [blinkCount, setBlinkCount] = useState(5);
  const [totalScreenTime, setTotalScreenTime] = useState(2);
  const [distance, setDistance] = useState(130);
  const [statusColor, setStatusColor] = useState("bg-orange-600");
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen  w-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            {/* Circle Graph */}
            <div className="flex flex-col items-center mb-2">
              <CircleTimer startMinutes={1} isPaused={isPaused} />
            </div>
            {/* Control Buttons */}
            <div className="flex gap-6 mt-2 justify-center">
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border-none focus:outline-none transition"
              >
                <img
                  src={isPaused ? Play : Pause}
                  alt={isPaused ? "Play Icon" : "Pause Icon"}
                  className="w-5 h-5 transition-transform hover:scale-110 active:scale-95"
                />
              </button>
              <button
                onClick={() => setShowConfirm(true)} // Show confirmation modal
                className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border-none focus:outline-none transition"
              >
                <img src={Stop} alt="Stop Icon" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            {/* Total Screen Time */}
            <div className="flex flex-col items-center bg-white rounded-lg shadow p-4">
              <img
                src={StopWatch}
                alt="Stopwatch Icon"
                className="w-4 h-4 mb-2"
              />
              <div className="text-xs font-bold text-black text-center w-full">
                {totalScreenTime}h
              </div>
              <div className="text-[0.625rem] text-gray-500 whitespace-nowrap w-full text-center">
                Total Screen Time
              </div>
            </div>

            {/* Blink Count */}
            <div className="flex flex-col items-center bg-white rounded-lg shadow p-4">
              <img src={Eye} alt="Eye Icon" className="w-4 h-4 mb-2" />
              <div className="text-xs font-bold text-black text-center w-full">
                {blinkCount}
              </div>
              <div className="text-[0.625rem] text-gray-500 whitespace-nowrap w-full text-center">
                Blink Count
              </div>
            </div>

            {/* Distance */}
            {/*
            <div className="flex flex-col items-center bg-white rounded-lg shadow p-4">
              <img src={Rule} alt="Rule Icon" className="w-4 h-4 mb-2" />
              <div className="text-xs font-bold text-black text-center w-full">
                {distance} cm
              </div>
              <div className="text-[0.625rem] text-gray-500 whitespace-nowrap w-full text-center">
                Distance
              </div>
            </div>
            */}
          </div>

          <div className="text-center mb-2">
            <div className="text-xs text-[#626262]">Status: {status}</div>
            <div className="text-sm text-black mt-1 whitespace-nowrap">
              Please blink at least <a className="font-medium">{blinkCount}</a>{" "}
              times
              {/* Maintain a distance of at least {distance} cm from the screen. */}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <div className={`w-12 h-2 ${statusColor} rounded`} />
            <div className={`w-12 h-2 ${statusColor} rounded`} />
            <div className={`w-12 h-2 ${statusColor} rounded`} />
          </div>
        </div>
      </div>
      {showConfirm && (
        <ConfirmModal
          title="Are you sure you want to stop?"
          message="Stopping now will end tracking, and your current routine progress will not be saved."
          onConfirm={() => navigate("/summary")}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
