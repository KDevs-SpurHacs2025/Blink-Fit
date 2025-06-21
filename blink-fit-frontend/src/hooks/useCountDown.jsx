import { useEffect, useState } from "react";

/**
 * @param {number} startMinutes
 * @param {boolean} isPaused
 * @returns {{ formatted: string, rawSeconds: number }}
 */
export function useCountdown(startMinutes, isPaused) {
  const [timeLeft, setTimeLeft] = useState(startMinutes * 60);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return {
    formatted: `${minutes} : ${seconds}`,
    rawSeconds: timeLeft,
  };
}
