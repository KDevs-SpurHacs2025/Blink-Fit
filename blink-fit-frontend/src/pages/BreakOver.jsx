import React, { useState, useEffect } from "react";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

export default function BreakOver() {
  const [showSkipHover, setShowSkipHover] = useState(false);
  const [showRestHover, setShowRestHover] = useState(false);
  const incrementBreakTime = useUserStore((state) => state.incrementBreakTime);
  const incrementBreakCompletion = useUserStore(
    (state) => state.incrementBreakCompletion
  );
  const breakTimeCount = useUserStore((state) => state.breakTimeCount);
  const breakCompletionCount = useUserStore(
    (state) => state.breakCompletionCount
  );
  const navigate = useNavigate();

  useEffect(() => {
    incrementBreakTime();
    console.log("[BreakOver] breakTime after increment:", breakTimeCount + 1); // 예상값 출력
  }, []); // mount 시에만 실행

  const handleSkipClick = () => {
    navigate("/screen-time");
  };

  const handleRestClick = () => {
    incrementBreakCompletion();
    console.log(
      "[BreakOver] breakCompletion after increment:",
      breakCompletionCount + 1
    ); // 예상값 출력
    navigate("/screen-time");
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <div className="w-full text-left mb-8">
          <span className="text-gray-300 text-lg font-semibold">
            Break Over
          </span>
        </div>
        <div className="flex flex-col items-center w-full">
          <h1 className="text-2xl font-bold text-black mb-2 text-center">
            Break complete. Ready to continue?
          </h1>
          <p className="text-base text-gray-600 mb-8 text-center">
            Take a moment to reflect before jumping back in
          </p>
          <div className="flex gap-6 w-full justify-center">
            <button
              className="border bg-gray-50 border-green-600 text-black rounded-lg px-6 py-4 text-base font-normal hover:bg-gray-200 transition w-56 relative"
              onMouseEnter={() => setShowSkipHover(true)}
              onMouseLeave={() => setShowSkipHover(false)}
              onClick={handleSkipClick}
            >
              Skipped the break
              {showSkipHover && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 text-xs text-gray-500 bg-white border border-gray-200 rounded px-3 py-1 shadow z-10 whitespace-nowrap">
                  Please take a break next time 😢
                </div>
              )}
            </button>
            <button
              className="border bg-gray-50 border-green-600 text-black rounded-lg px-6 py-4 text-base font-normal hover:bg-green-600 hover:text-white transition w-56 relative"
              onMouseEnter={() => setShowRestHover(true)}
              onMouseLeave={() => setShowRestHover(false)}
              onClick={handleRestClick}
            >
              Took a moment to rest my eyes
              {showRestHover && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 text-xs text-green-600 bg-white border border-green-200 rounded px-3 py-1 shadow z-10 whitespace-nowrap">
                  Great job! Keep going 😄
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
