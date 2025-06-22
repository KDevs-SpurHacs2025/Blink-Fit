import useUserStore from "../store/userStore";
import { ClockIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/outline";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Summary() {
  const totalScreenTime = useUserStore((state) => state.totalScreenTime);
  const totalBreakTime = useUserStore((state) => state.totalBreakTime);
  const resetTimes = useUserStore((state) => state.resetTimes);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TEST: Add test data setter for development
  const setTestData = () => {
    const setTotalScreenTime = useUserStore.getState().setTotalScreenTime;
    const setTotalBreakTime = useUserStore.getState().setTotalBreakTime;

    // Set test values (2 hours screen time, 30 minutes break time)
    setTotalScreenTime(7200); // 2 hours in seconds
    setTotalBreakTime(1800); // 30 minutes in seconds

    console.log("🧪 Test data set:", {
      screenTime: "2 hours",
      breakTime: "30 minutes",
    });
  };

  // Summary API call function
  const submitSessionSummary = async () => {
    try {
      // Get user information from localStorage
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.error("No user found in localStorage");
        return false;
      }

      const user = JSON.parse(userString);
      const userId = user.id;

      if (!userId) {
        console.error("No userId found in user data");
        return false;
      }

      // Convert time to hours (seconds → hours)
      const screenTimeHours = totalScreenTime;
      const breakTimeHours = totalBreakTime;

      console.log("Sending session summary:", {
        userId,
        totalScreenTime: screenTimeHours,
        totalBreakTime: breakTimeHours,
      });

      const response = await fetch(
        "https://api-lcq5pbmy4q-pd.a.run.app/summary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            sessionSummary: {
              totalScreenTime: screenTimeHours,
              totalBreakTime: breakTimeHours,
              breakCompletionRate: Number(breakCompletionRate),
            },
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Session summary sent successfully:", result);
        return true;
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to send session summary:",
          response.status,
          errorText
        );
        return false;
      }
    } catch (error) {
      console.error("Error sending session summary:", error);
      return false;
    }
  };
  // Time format function hh:mm:ss
  const formatTime = (sec) => {
    if (!Number.isFinite(sec) || sec < 0) return "00:00:00";
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const breakTimeCount = useUserStore((state) => state.breakTimeCount);
  const breakCompletionCount = useUserStore(
    (state) => state.breakCompletionCount
  );
  // Break Completion Rate 계산 (소수점 한자리까지)
  const breakCompletionRate =
    breakTimeCount > 0
      ? ((breakCompletionCount / breakTimeCount) * 100).toFixed(1)
      : "0.0";

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

      {/* TEST: Development testing button */}
      {process.env.NODE_ENV === "development" && (
        <button
          className="mt-4 w-full max-w-md py-2 bg-blue-400 text-white rounded-lg font-semibold text-sm hover:bg-blue-500 transition"
          onClick={setTestData}
        >
          🧪 Set Test Data (Dev Only)
        </button>
      )}

      <button
        className={`mt-10 w-full max-w-md py-3 text-white rounded-lg font-semibold text-lg transition ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-400 hover:bg-green-500"
        }`}
        onClick={async () => {
          if (isSubmitting) return;

          setIsSubmitting(true);

          try {
            // Call Summary API
            const success = await submitSessionSummary();

            if (success) {
              console.log("Session summary submitted successfully");
            } else {
              console.error("Failed to submit session summary");
              // Continue even if failed (for offline cases)
            }
          } catch (error) {
            console.error("Error during summary submission:", error);
          } finally {
            // Try to close tracker.html window
            if (window.trackerWindow && !window.trackerWindow.closed) {
              window.trackerWindow.close();
            }

            // Reset state and navigate to home
            resetTimes();
            navigate("/home");
          }
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Done"}
      </button>
    </div>
  );
}
