import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import PrimaryButton from "../components/PrimaryButton";

const handleStartEyeTracking = () => {
  const trackerUrl = "/tracker.html"; // public 폴더 기준
  window.open(trackerUrl, "_blank", "width=800,height=600");
};

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 relative bg-bg-color">
      <div className="w-6/7 h-full pt-6">
        <h2 className="text-xl font-bold mb-4 text-left">
          Screen Time Overview: Last 7 Sessions
        </h2>
        {/* Grid 1 */}
        <div className="flex items-center justify-between bg-[#F3F3F3] rounded-xl shadow-md p-4 mb-4 h-2/5">
          <div className="w-1/2 h-full flex flex-col items-start justify-center">
            <div className="text-sm font-semibold text-text-dark-gray">
              Total
            </div>
            <div className="text-2xl font-semibold text-black mb-4">20h</div>
            <div className="text-sm font-semibold text-text-dark-gray">
              Average
            </div>
            <div className="text-2xl font-semibold text-black mb-6">
              5 hours/day
            </div>
            <div className="flex items-start gap-2 mt-2">
              <span className="text-xl">💡</span>
              <span className="text-sm text-text-dark-gray">
                Tip: Remember to blink often to keep your eyes moist and reduce
                strain.
              </span>
            </div>
          </div>
          {/* Placeholder for bar graph */}
          <div className="w-1/2 h-full flex items-center flex items-end gap-1"></div>
        </div>
        {/* Grid 2 & 3 */}
        <div className="h-1/4 grid grid-cols-2 gap-4 mb-4">
          {/* Grid 2 */}
          <div className="bg-[#F3F3F3] rounded-xl shadow p-6 flex flex-col text-center justify-center items-center">
            <div className="text-sm text-text-dark-gray font-base mb-2">
              Your average blinks
            </div>
            <div className="text-4xl font-bold mb-3">12/min</div>
            <div className="text-sm text-black">
              3 below healthy average (15-20/min)
            </div>
          </div>
          {/* Grid 3 */}
          <div className="bg-[#F3F3F3] rounded-xl shadow p-6 flex flex-col text-center justify-center items-center">
            <div className="text-sm text-text-dark-gray font-base mb-2">
              Break Completion Rate
            </div>
            <div className="text-4xl font-bold mb-3">65%</div>
            <div className="text-sm text-black">Try to take more breaks</div>
          </div>
        </div>
        {/* Grid 4 */}
        <div className="w-full flex justify-center mt-2">
          <PrimaryButton onClick={() => navigate("/screen-time")}>
            Start Today's Routine &gt;
          </PrimaryButton>
        </div>
      </div>
      <NavBar />
    </div>
  );
};

export default Home;
