import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";

const handleStartEyeTracking = () => {
  const trackerUrl = chrome.runtime.getURL("tracker.html");
  window.open(trackerUrl, "_blank", "width=800,height=600");
};

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-color text-center pt-40 pb-20">
      <div>
        <h1 className="text-6xl text-black font-extrabold italic mb-1">
          BLINK FIT
        </h1>
        <p className="text-lg text-dark-gray font-normal">
          Digital life meets mindful habits
        </p>
      </div>
      <div className="w-3/4">
        <PrimaryButton onClick={() => navigate("/loading")}>
          Continue with Google
        </PrimaryButton>
        <button
          onClick={() => navigate("/loading")}
          className="w-full border border-primary py-3 rounded-lg hover:bg-opacity-90 mb-4 transition"
        >
          Enter as guest
        </button>
        {/* <button
          onClick={handleStartEyeTracking}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full mt-4 transition"
          type="button"
        >
          Start Eye Tracking (New Page)
        </button>
        <button onClick={() => navigate("/screen-time")}>
          Check Screen Time
        </button> */}
      </div>
    </div>
  );
}
