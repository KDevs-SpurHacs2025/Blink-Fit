import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import questions from "../data/questions";
import useUserStore from "../store/userStore"; // userStore 임포트
import ConfirmModal from "../components/ConfirmModal";
import PrimaryButton from "../components/PrimaryButton";

const choiceQuestions = questions.filter((q) => q.type === "choice");
const inputQuestions = questions.filter((q) => q.type === "input");

export default function Survey() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalPayload, setModalPayload] = useState(null);
  const progress = step === 1 ? "50%" : "100%";
  const navigate = useNavigate();
  const setSurveyAnswers = useUserStore((state) => state.setSurveyAnswers);
  const userId = useUserStore((state) => state.user.id);

  const allChoicesAnswered = choiceQuestions.every((q) => answers[q.name]);
  const allInputsFilled = inputQuestions.every((q) => {
    const val = answers[q.name];
    return q.inputType === "number"
      ? val !== undefined && val !== "" && !isNaN(val)
      : val && val.trim() !== "";
  });

  const handleInput = (name, value) => {
    setAnswers((a) => ({ ...a, [name]: value }));
  };

  const handleNext = () => {
    setStep(2);
  };

  function buildApiPayload() {
    const quiz = choiceQuestions.map((q, idx) => {
      const selected = q.options.find((opt) => opt.text === answers[q.name]);
      return {
        questionId: idx + 1,
        answer: answers[q.name],
        level: selected ? selected.level : 0,
      };
    });
    const subjective = {};
    inputQuestions.forEach((q) => {
      subjective[q.name] = answers[q.name] || "";
    });

    return {
      userId: userId,
      quiz,
      subjective,
    };
  }

  const handleSave = () => {
    const apiPayload = buildApiPayload();
    console.log("[Survey] 실제 서버 전송 payload:", apiPayload); // 여기서 최종 payload 확인
    setSurveyAnswers(answers);
    setModalPayload(apiPayload);
    setShowModal(true);

    // Debugging logs
    console.log("[Debug] handleSave called");
    console.log("[Debug] Generated API Payload:", apiPayload);
    console.log("[Debug] Answers:", answers);
    console.log("[Debug] All Choices Answered:", allChoicesAnswered);
    console.log("[Debug] All Inputs Filled:", allInputsFilled);
  };

  const handleModalConfirm = async () => {
    setShowModal(false);

    const apiPayload = buildApiPayload(); // Confirm 직전에도 최신 payload를 다시 생성
    try {
      const response = await fetch("https://api-lcq5pbmy4q-pd.a.run.app/generate-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate guide: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log("Guide generated successfully:", result);

      // 숫자만 추출해서 int로 변환
      const breakDurationInt = parseInt(result.guide.breakDuration.match(/\d+/)?.[0] || "0", 10);
      const screenTimeLimitInt = parseInt(result.guide.screenTimeLimit.match(/\d+/)?.[0] || "0", 10);
      const workDurationInt = parseInt(result.guide.workDuration.match(/\d+/)?.[0] || "0", 10);
      console.log("breakDurationInt:", breakDurationInt);
      console.log("screenTimeLimitInt:", screenTimeLimitInt);
      console.log("workDurationInt:", workDurationInt);

      // 추출한 값을 userStore에 저장
      useUserStore.getState().setRoutineGuide({
        breakDuration: breakDurationInt,
        screenTimeLimit: screenTimeLimitInt,
        workDuration: workDurationInt,
      });

      navigate("/routine");
    } catch (error) {
      console.error("Error generating guide:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const renderModalContent = () => {
    if (!modalPayload) return null;
    const quizMap = {};
    choiceQuestions.forEach((q, idx) => {
      quizMap[idx + 1] = q.question;
    });
    const subjectiveMap = {};
    inputQuestions.forEach((q) => {
      subjectiveMap[q.name] = q.question;
    });
    return (
      <div className="text-left">
        <h3 className="font-semibold mb-2 text-sm">Quiz Answers</h3>
        <ul className="mb-3 list-disc pl-4 text-xs">
          {modalPayload.quiz.map((item) => (
            <li
              key={item.questionId}
              className="mb-1 flex gap-1 items-start whitespace-normal break-words"
            >
              <span className="font-medium whitespace-normal break-words">
                {quizMap[item.questionId]}:
              </span>
              <span className="whitespace-normal break-words text-gray-700">
                {item.answer}
              </span>
            </li>
          ))}
        </ul>
        <h3 className="font-semibold mb-2 text-sm">Your Info</h3>
        <ul className="list-disc pl-4 text-xs">
          {Object.entries(modalPayload.subjective).map(([key, value]) => (
            <li
              key={key}
              className="mb-1 flex gap-1 items-start whitespace-normal break-words"
            >
              <span className="font-medium whitespace-normal break-words">
                {subjectiveMap[key]}:
              </span>
              <span className="whitespace-normal break-words text-gray-700">
                {value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-color overflow-hidden">
      {showModal && (
        <ConfirmModal
          title="Confirm Your Answers"
          message={renderModalContent()}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}
      <div className="w-3/4 h-full flex flex-col items-center">
        {/* Progress bar */}
        <div className="w-3/4 h-2 bg-[#D9D9D9] rounded-full mt-10 mb-12">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: progress }}
            layout
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="w-full space-y-8 mb-8 flex-1 overflow-y-auto hide-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="choices"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl text-black font-semibold text-center mb-6">
                  Eye Health Quiz
                </h2>
                {choiceQuestions.map((q) => (
                  <div key={q.name} className="w-full mb-10">
                    <div className="text-medium font-medium mb-2">
                      {q.question}
                    </div>
                    <div className="space-y-2">
                      {q.options.map((option, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-2 bg-white border rounded-lg shadow-sm p-4 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={q.name}
                            className="form-radio"
                            checked={answers[q.name] === option.text}
                            onChange={() =>
                              handleInput(q.name, option.text, "choice")
                            }
                          />
                          <span className="text-sm">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <PrimaryButton
                  onClick={handleNext}
                  disabled={!allChoicesAnswered}
                  className="mt-8"
                >
                  Next
                </PrimaryButton>
              </motion.div>
            ) : (
              <motion.div
                key="inputs"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl text-black font-semibold text-center mb-10">
                  Tell Us Abour Yourself
                </h2>
                {inputQuestions.map((q) => (
                  <div key={q.name} className="mb-6">
                    <label className="block mb-2 text-medium font-medium">
                      {q.question}
                    </label>
                    <input
                      type={q.inputType}
                      name={q.name}
                      className="w-full border rounded-lg p-3"
                      value={answers[q.name] || ""}
                      onChange={(e) => handleInput(q.name, e.target.value)}
                      inputMode={
                        q.inputType === "number" ? "numeric" : undefined
                      }
                    />
                  </div>
                ))}
                <PrimaryButton onClick={handleSave} disabled={!allInputsFilled}>
                  Save
                </PrimaryButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}