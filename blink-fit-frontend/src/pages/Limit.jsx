import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

export default function Limit() {
  const totalScreenTime = useUserStore((state) => state.totalScreenTime);
  const surveyAnswers = useUserStore((state) => state.surveyAnswers);
  const navigate = useNavigate();
  // 목표 시간(초)
  const screenTimeGoalHour = Number(surveyAnswers?.screenTimeGoal);
  const screenTimeGoalSec = screenTimeGoalHour * 60 * 60;

  // 시간 포맷 hh:mm:ss
  const formatTime = (sec) => {
    if (!Number.isFinite(sec) || sec < 0) return "00:00:00";
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg px-8 py-12 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-black">
          You’ve reached your screen time goal
        </h1>
        <p className="text-gray-600 text-center mb-6 text-base">
          Would you like to keep going, or call it a day?
        </p>
        <div className="mb-6 text-center">
          <span className="text-gray-700 text-sm">
            You have already exceeded your screen time goal of{" "}
            <span className="font-semibold">
              {formatTime(screenTimeGoalSec)}
            </span>
            .
            <br />
            (Current total screen time:{" "}
            <span className="font-semibold">{formatTime(totalScreenTime)}</span>
            )
          </span>
        </div>
        <div className="flex gap-4 w-full justify-center">
          <button
            className="flex-1 border bg-gray-500 text-white border-green-600 font-medium py-2 rounded-lg transition hover:bg-green-50 focus:outline-none"
            onClick={() => navigate(-1)}
          >
            Resume Timer
          </button>
          <button
            className="flex-1 border bg-green-500 border-green-600 text-green-700 font-medium py-2 rounded-lg transition hover:bg-green-50 focus:outline-none"
            onClick={() => navigate("/summary")}
          >
            End for Today
          </button>
        </div>
      </div>
    </div>
  );
}
