import { useCountdown } from "../hooks/useCountDown";

export default function CircleTimer({
  startMinutes,
  isPaused,
  totalSeconds: propTotalSeconds,
  secondsLeft: propSecondsLeft,
  children,
}) {
  // 항상 Hook은 최상단에서 호출
  const countdownData = useCountdown(startMinutes, isPaused);

  const totalSeconds =
    Number(propTotalSeconds) > 0
      ? Number(propTotalSeconds)
      : Number(startMinutes) > 0
      ? Number(startMinutes) * 60
      : 1;
  const secondsLeft =
    typeof propSecondsLeft === "number"
      ? propSecondsLeft
      : countdownData.rawSeconds;

  // NaN 방지
  const safeSecondsLeft =
    Number.isFinite(secondsLeft) && secondsLeft >= 0 ? secondsLeft : 0;
  const progress = 1 - safeSecondsLeft / totalSeconds;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative w-40 h-40 mb-4">
      <svg className="absolute top-0 left-0 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#7EB776"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={Number.isFinite(offset) ? offset : 0}
          strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ? (
          children
        ) : (
          <span className="text-3xl font-bold text-black">
            {countdownData.formatted}
          </span>
        )}
      </div>
    </div>
  );
}
