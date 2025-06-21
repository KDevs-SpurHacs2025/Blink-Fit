import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {/* ICON*/}
        <div className="mb-4"></div>

        <h1 className="text-4xl text-black font-extrabold mb-2 tracking-wide">
          <span className="italic">BLINK</span>{" "}
          <span className="font-bold">FIT</span>
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Digital life meets mindful habits
        </p>

        <button
          onClick={() => navigate("/survey")}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 w-full mb-4 transition"
        >
          Continue with Google
        </button>
        <button className="border border-green-500 text-green-700 py-2 px-4 rounded-md hover:bg-green-50 w-full transition">
          Enter as guest
        </button>
      </div>
    </div>
  );
}
