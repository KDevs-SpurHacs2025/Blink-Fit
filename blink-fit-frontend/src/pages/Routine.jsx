import React from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import RoutineCard from "../components/RoutineCard";

export default function Routine() {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState("micro");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-bg-color">
      <div className="w-3/4 h-full py-20 flex flex-col items-center justify-between">
        {/* Title and Description */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-black mb-2">
            We've prepared routines for you!
          </h1>
          <p className="text-lg text-text-dark-gray mb-8">
            Pick the routine that works best
          </p>
        </div>
        {/* Routine Cards */}
        <div className="w-full flex flex-col gap-8 mb-14">
          <RoutineCard
            description="Short and eye-friendly"
            title="Micro Routine"
            screenTime="1h"
            breakTime="1m"
            selected={selected === "micro"}
            onClick={() => setSelected("micro")}
            icon="leaf"
          />
          <RoutineCard
            description="Suited for longer focus blocks"
            title="Regular Routine"
            screenTime="1h"
            breakTime="1m"
            selected={selected === "regular"}
            onClick={() => setSelected("regular")}
            icon="loop"
          />
        </div>
        <PrimaryButton
          onClick={() => navigate("/policy")}
          className="px-6 mt-auto"
        >
          Start with this routine
        </PrimaryButton>
      </div>
    </div>
  );
}
