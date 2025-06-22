import useUserStore from "../store/userStore";
import { ClockIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/outline";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Summary() {
  const totalScreenTime = useUserStore((state) => state.totalScreenTime);
  const totalBreakTime = useUserStore((state) => state.totalBreakTime); // 추가
  const resetTimes = useUserStore((state) => state.resetTimes);
  const navigate = useNavigate();
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
        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          Summary
        </h1>
        <div className="flex flex-col gap-8 w-full">
          <div className="flex items-center gap-4">
            <ClockIcon className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-gray-700 text-sm">Total screen time</div>
              <div className="text-lg font-semibold text-black">
                {formatTime(totalScreenTime)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <BeakerIcon className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-gray-700 text-sm">Total break time</div>
              <div className="text-lg font-semibold text-black">
                {formatTime(totalBreakTime)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <EyeIcon className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-gray-700 text-sm">
                Average blinks per minute
              </div>
              <div className="text-lg font-semibold text-black">0</div>
            </div>
          </div>
        </div>
      </div>
      <button
        className="mt-10 w-full max-w-md py-3 bg-green-400 text-white rounded-lg font-semibold text-lg hover:bg-green-500 transition"
        onClick={() => {
          // tracker.html 창 닫기 시도
          if (window.trackerWindow && !window.trackerWindow.closed) {
            window.trackerWindow.close();
          }
          resetTimes();
          navigate("/home");
        }}
      >
        Done
      </button>
    </div>
  );
}
