import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import StopWatch from "../assets/icons/stopWatch.svg";
import Eye from "../assets/icons/eye.svg";
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
  const selectedRoutine = useUserStore((state) => state.selectedRoutine);
  const addScreenTime = useUserStore((state) => state.addScreenTime);
  const totalScreenTimeStore = useUserStore((state) => state.totalScreenTime);
  const surveyAnswers = useUserStore((state) => state.surveyAnswers);
  const screenTimeGoal = useUserStore((state) => state.screenTimeGoal);

  const startMinutes = Number(selectedRoutine?.screen);
  const [secondsLeft, setSecondsLeft] = useState(
    Number.isFinite(startMinutes) && startMinutes > 0 ? startMinutes * 60 : 60
  );

  // 세션 시작 시점의 secondsLeft를 기억
  const initialSecondsRef = useRef(
    Number.isFinite(startMinutes) && startMinutes > 0 ? startMinutes * 60 : 60
  );

  // selectedRoutine이 바뀔 때마다 secondsLeft, initialSecondsRef 재설정
  useEffect(() => {
    const newStart = Number(selectedRoutine?.screen);
    const newSeconds =
      Number.isFinite(newStart) && newStart > 0 ? newStart * 60 : 60;
    setSecondsLeft(newSeconds);
    initialSecondsRef.current = newSeconds;
  }, [selectedRoutine]);

  // selectedRoutine이 없거나 잘못된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (
      !selectedRoutine ||
      typeof selectedRoutine.screen === "undefined" ||
      !Number.isFinite(Number(selectedRoutine.screen)) ||
      Number(selectedRoutine.screen) <= 0
    ) {
      navigate("/");
    }
  }, [selectedRoutine, navigate]);

  useEffect(() => {
    if (isPaused) return;
    if (secondsLeft <= 0) {
      // 실제로 사용한 시간(초)
      const usedSeconds = initialSecondsRef.current;
      addScreenTime(usedSeconds);
      navigate("/break-time");
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, secondsLeft, navigate, addScreenTime]);

  // Stop(중단) 버튼 눌렀을 때도 누적
  const handleStop = () => {
    const usedSeconds = initialSecondsRef.current - secondsLeft;
    addScreenTime(usedSeconds);
    navigate("/summary");
  };

  // 브라우저 종료/새로고침 시에도 누적
  useEffect(() => {
    const handleBeforeUnload = () => {
      const usedSeconds = initialSecondsRef.current - secondsLeft;
      addScreenTime(usedSeconds);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [addScreenTime, secondsLeft]);

  // 목표 화면 시간 초과 시 제한 페이지로 이동
  useEffect(() => {
    // const screenTimeGoalHour = Number(surveyAnswers?.subjective?.screenTimeGoal);
    // const screenTimeGoalSec = screenTimeGoalHour * 60 * 60;
    const screenTimeGoalSec = 130; // 테스트용: 목표 시간 2분 10초(130초)로 고정

    if (totalScreenTimeStore >= screenTimeGoalSec) {
      navigate("/limit");
    }
  }, [totalScreenTimeStore, surveyAnswers, navigate]);

  // 시간 포맷 mm:ss
  const formatTime = (sec) => {
    if (!Number.isFinite(sec) || sec < 0) return "00:00";
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatHMS = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // 디버깅: secondsLeft, startMinutes, selectedRoutine 확인
  // console.log("[ScreenTime] secondsLeft:", secondsLeft, "startMinutes:", startMinutes, "selectedRoutine:", selectedRoutine);

  return (
    <>
      <div className="min-h-screen  w-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            {/* Circle Graph */}
            <div className="flex flex-col items-center mb-2">
              <CircleTimer
                totalSeconds={
                  Number.isFinite(startMinutes) && startMinutes > 0
                    ? startMinutes * 60
                    : 60
                }
                secondsLeft={Number.isFinite(secondsLeft) ? secondsLeft : 0}
              >
                <span className="text-3xl font-bold mt-2 text-black">
                  {formatTime(Number.isFinite(secondsLeft) ? secondsLeft : 0)}
                </span>
              </CircleTimer>
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
                {formatHMS(totalScreenTimeStore)}
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
          onConfirm={handleStop}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
