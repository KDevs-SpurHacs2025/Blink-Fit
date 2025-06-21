import { useNavigate } from "react-router-dom";

export default function Policy() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">
        Camera Access & Privacy
      </h1>
      <div className="text-gray-700 text-md mb-10 max-w-xl text-center">
        We use your webcam solely to support your eye health by detecting
        blinking frequency, measuring screen distance, and monitoring ambient
        brightness. This allows us to provide real-time feedback and
        personalized break recommendations. Importantly, we do not record,
        store, or stream any video or audio. We do not perform facial
        recognition, and no identity-related data is collected. All webcam data
        is processed locally on your device and never leaves it. The webcam is
        only active while you are actively using the app, and you can enable or
        disable camera access at any time in your settings. You are always in
        control — we will never access your camera without your clear
        permission.
      </div>
      <button
        className="bg-green-500 text-white py-3 px-8 rounded-xl text-lg hover:bg-green-600 transition"
        onClick={() =>
          navigate("/loading", {
            state: {
              title: "You’re all set!",
              subText:
                "We’ve personalized your journey based on your answers. Let’s turn your answers into better screen habits",
              buttonText: "Start",
              next: "/",
            },
          })
        }
      >
        Agree and Enable Web Camera
      </button>
    </div>
  );
}
