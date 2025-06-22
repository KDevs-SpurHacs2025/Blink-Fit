import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import RoutineCard from "../components/RoutineCard";
import useUserStore from "../store/userStore";

export default function Routine() {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState("micro");
  // Micro Routine: 서버에서 받은 값이라고 가정
  const routineGuide = useUserStore((state) => state.routineGuide);
  const [microRoutine] = useState({
    screen: routineGuide?.workDuration || 1, // 서버에서 받은 workDuration 사용
    break: routineGuide?.breakDuration || 1, // 서버에서 받은 breakDuration 사용
  });
  // Regular Routine: focusSessionLength 기반 계산
  const surveyAnswers = useUserStore((state) => state.surveyAnswers);
  const setSelectedRoutine = useUserStore((state) => state.setSelectedRoutine);
  const screenTime = Number(surveyAnswers?.focusSessionLength) || 1;
  const breakTime = Math.round(screenTime * 0.2) || 1;

  // 마운트 시 micro routine을 기본 선택
  useEffect(() => {
    setSelectedRoutine({
      type: "micro",
      screen: microRoutine.screen,
      break: microRoutine.break,
    });
  }, [setSelectedRoutine, microRoutine.screen, microRoutine.break]);

  // 루틴 선택 핸들러
  const handleSelectMicro = () => {
    setSelected("micro");
    setSelectedRoutine({
      type: "micro",
      screen: microRoutine.screen,
      break: microRoutine.break,
    });
  };
  const handleSelectRegular = () => {
    setSelected("regular");
    setSelectedRoutine({
      type: "regular",
      screen: screenTime,
      break: breakTime,
    });
  };

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
            screenTime={`${microRoutine.screen}m`}
            breakTime={`${microRoutine.break}m`}
            selected={selected === "micro"}
            onClick={handleSelectMicro}
            icon="leaf"
          />
          <RoutineCard
            description="Suited for longer focus blocks"
            title="Regular Routine"
            screenTime={`${screenTime}m`}
            breakTime={`${breakTime}m`}
            selected={selected === "regular"}
            onClick={handleSelectRegular}
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
