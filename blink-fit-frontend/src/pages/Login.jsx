import { useNavigate } from "react-router-dom";

const handleStartEyeTracking = () => {
    const trackerUrl = chrome.runtime.getURL("tracker.html");
    window.open(trackerUrl, "_blank", "width=800,height=600");
  };


export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-gray-100 text-center py-40">
      <div>
        <h1 className="text-6xl text-black font-extrabold mb-1">
          <span className="italic">BLINK FIT</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Digital life meets mindful habits
        </p>
      </div>
      <div className="w-3/4">
        <button
          onClick={() => navigate("/loading")}
          className="bg-green-500 w-full text-black py-2 px-4 rounded-lg hover:bg-opacity-90 w-full mb-4 transition"
        >
          Continue with Google
        </button>
        <button className="border border-green-500 w-full py-2 px-4 rounded-lg hover:transition">
          Enter as guest
        </button>
        <button
          onClick={handleStartEyeTracking}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full mt-4 transition"
          type="button"
        >
          Start Eye Tracking (New Page)
        </button>
        <button onClick={() => navigate("/screen-time")}>
          Check Screen Time
        </button>
      </div>
    </div>
  );
}
