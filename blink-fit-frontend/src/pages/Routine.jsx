import React from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";

//Convert minutes to a formatted string
function formatMinutes(min) {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }
  return `${min}m`;
}

export default function Routine() {
  const navigate = useNavigate();
  const setSelectedRoutine = useUserStore((state) => state.setSelectedRoutine);
  // Simulate the server sending a miniute of screen time and break
  const [routines] = React.useState([
    {
      id: 1,
      label: "Short and eye-friendly Micro routine",
      screen: 2,
      break: 1,
    },
    {
      id: 2,
      label: "Suited for longer focus blocks",
      screen: 65,
      break: 1,
    },
  ]);

  const handleSelectRoutine = (routine) => {
    // screen, break을 숫자로 강제 변환해서 저장
    setSelectedRoutine({
      ...routine,
      screen: Number(routine.screen),
      break: Number(routine.break),
    });
    navigate("/policy");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-black mb-2 text-center">
        We've prepared routines for you!
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Pick the routine that works best
      </p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-xl">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold mb-2">{routine.label}</h2>
            <div className="text-gray-700 mb-1">
              {formatMinutes(routine.screen)} screen time
            </div>
            <div className="text-gray-700 mb-4">
              {formatMinutes(routine.break)} break
            </div>
            <button
              className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition mt-auto"
              onClick={() => handleSelectRoutine(routine)}
            >
              Start with this routine
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
