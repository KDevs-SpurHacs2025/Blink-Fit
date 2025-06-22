import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import CircleTimer from "../components/CircleTimer";
import Pause from "../assets/icons/pause.svg";
import Play from "../assets/icons/play.svg";
import Stop from "../assets/icons/stop.svg";
import ConfirmModal from "../components/ConfirmModal";

export default function BreakTime() {
  const navigate = useNavigate();
  const addBreakTime = useUserStore((state) => state.addBreakTime);
  const { selectedRoutine } = useUserStore();
  // breakTime이 분 단위로 저장되어 있다고 가정
  const breakMinutes = selectedRoutine?.break || 5; // fallback 5분
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(breakMinutes * 60); // seconds
  // 서버에서 받아올 break 행동 문구를 위한 state
  const [breakMessage, setBreakMessage] = useState(
    "Why don’t you take a moment to lean back, close your eyes, and enjoy a favorite song?"
  );

  useEffect(() => {
    if (isPaused || isStopped) return;
    if (timeLeft <= 0) {
      addBreakTime(breakMinutes * 60); // break 끝날 때 누적 업데이트
      navigate("/break-over");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, isStopped, timeLeft, navigate, addBreakTime, breakMinutes]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // 남은 시간만큼 실제 사용한 break 시간 누적
      addBreakTime(breakMinutes * 60 - timeLeft);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [addBreakTime, breakMinutes, timeLeft]);

  const handlePause = () => setIsPaused((prev) => !prev);
  const handleStop = () => {
    setIsPaused(true);
    setShowConfirm(true);
  };

  const handleConfirmStop = () => {
    setShowConfirm(false);
    addBreakTime(breakMinutes * 60 - timeLeft); // 실제 사용한 break 시간 누적
    navigate("/summary");
  };
  const handleCancelStop = () => {
    setShowConfirm(false);
    setIsPaused(false);
  };

  // 시간 포맷 mm:ss
  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <div className="flex flex-col items-center mb-6 w-full">
          <div className="flex flex-col items-center mb-2 w-full">
            <CircleTimer
              totalSeconds={breakMinutes * 60}
              secondsLeft={timeLeft}
            >
              <span className="text-3xl font-bold text-black mt-2">
                {formatTime(timeLeft)}
              </span>
            </CircleTimer>
          </div>
          <div className="flex gap-6 mt-2 justify-center">
            <button
              onClick={handlePause}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border-none focus:outline-none transition"
            >
              <img
                src={isPaused ? Play : Pause}
                alt={isPaused ? "Play Icon" : "Pause Icon"}
                className="w-5 h-5 transition-transform hover:scale-110 active:scale-95"
              />
            </button>
            <button
              onClick={handleStop}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border-none focus:outline-none transition"
            >
              <img src={Stop} alt="Stop Icon" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="text-center text-gray-700 mb-4 font-semibold w-full">
          Time for a little break for your eyes
        </div>
        <div className="flex items-center justify-center text-black bg-white rounded-lg shadow p-4 max-w-xs mx-auto w-full">
          <span className="mr-2">🎵</span>
          <span>{breakMessage}</span>
        </div>
        {showConfirm && (
          <ConfirmModal
            title="Are you sure you want to stop?"
            message="Stopping now will end your break and take you to the summary."
            onConfirm={handleConfirmStop}
            onCancel={handleCancelStop}
          />
        )}
      </div>
    </div>
  );
}
