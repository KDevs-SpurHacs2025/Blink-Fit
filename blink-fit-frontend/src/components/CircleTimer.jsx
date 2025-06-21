import { useCountdown } from "../hooks/useCountDown";

export default function CircleTimer({ startMinutes, isPaused }) {
  const { formatted: countdown, rawSeconds } = useCountdown(startMinutes, isPaused);

  const totalSeconds = startMinutes * 60;
  const progress = 1 - rawSeconds / totalSeconds;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative w-40 h-40 mb-4">
      <svg className="absolute top-0 left-0 w-full h-full">
        <circle cx="50%" cy="50%" r={radius} stroke="#e5e7eb" strokeWidth="10" fill="none" />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#7EB776"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-black">{countdown}</span>
      </div>
    </div>
  );
}
