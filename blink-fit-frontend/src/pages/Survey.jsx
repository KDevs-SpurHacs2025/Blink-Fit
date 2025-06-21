import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import questions from "../data/questions";
import useUserStore from "../store/userStore";
import ConfirmModal from "../components/ConfirmModal";

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

  const allChoicesAnswered = choiceQuestions.every((q) => answers[q.name]);
  const allInputsFilled = inputQuestions.every((q) => {
    const val = answers[q.name];
    return q.inputType === "number"
      ? val !== undefined && val !== "" && !isNaN(val)
      : val && val.trim() !== "";
  });

  const handleInput = (name, value, type) => {
    setAnswers((a) => ({ ...a, [name]: value }));
  };

  const handleNext = () => {
    setStep(2);
  };

  function buildApiPayload() {
    // 객관식(quiz) 변환
    const quiz = choiceQuestions.map((q, idx) => {
      const selected = q.options.find((opt) => opt.text === answers[q.name]);
      return {
        questionId: idx + 1,
        answer: answers[q.name],
        level: selected ? selected.level : 0,
      };
    });
    // 주관식(subjective) 변환
    const subjective = {};
    inputQuestions.forEach((q) => {
      subjective[q.name] = answers[q.name] || "";
    });
    // userId 예시 (실제 userStore에서 가져와도 됨)
    return {
      userId: "janeDoe@gmail.com",
      quiz,
      subjective,
    };
  }

  const handleSave = () => {
    const apiPayload = buildApiPayload();
    setSurveyAnswers(answers);
    setModalPayload(apiPayload);
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate("/routine");
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const renderModalContent = () => {
    if (!modalPayload) return null;
    // Map questionId to question text for quiz
    const quizMap = {};
    choiceQuestions.forEach((q, idx) => {
      quizMap[idx + 1] = q.question;
    });
    // Map subjective name to question text
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
    <div className="w-full h-full flex items-center justify-center bg-gray-100 overflow-hidden">
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
        <div className="w-3/4 h-2 bg-gray-200 rounded-full my-10">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            style={{ width: progress }}
            layout
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="space-y-8 mb-8 text-black text-medium font-medium flex-1 overflow-y-auto hide-scrollbar w-full">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="choices"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl text-black font-semibold text-center mb-10">
                  Eye Health Quiz
                </h2>
                {choiceQuestions.map((q) => (
                  <div key={q.name} className="w-full mb-8">
                    <p className="text-md mb-2">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-2 bg-white border rounded-lg shadow-md p-4 cursor-pointer"
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
                <button
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition mt-8"
                  onClick={handleNext}
                  disabled={!allChoicesAnswered}
                >
                  Next
                </button>
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
                    <label className="block mb-2 font-md">{q.question}</label>
                    <input
                      type={q.inputType}
                      name={q.name}
                      className="w-full border rounded-lg p-3"
                      value={answers[q.name] || ""}
                      onChange={(e) =>
                        handleInput(q.name, e.target.value, q.inputType)
                      }
                      inputMode={
                        q.inputType === "number" ? "numeric" : undefined
                      }
                    />
                  </div>
                ))}
                <button
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition mt-8"
                  onClick={handleSave}
                  disabled={!allInputsFilled}
                >
                  Save
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
