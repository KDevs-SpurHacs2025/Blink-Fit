import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import questions from "../data/questions";
import PrimaryButton from "../components/PrimaryButton";

const choiceQuestions = questions.filter((q) => q.type === "choice");
const inputQuestions = questions.filter((q) => q.type === "input");

export default function Survey() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const progress = step === 1 ? "50%" : "100%";
  const navigate = useNavigate();

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

  const handleSave = () => {
    alert("Survey saved!" + JSON.stringify(answers, null, 2));
    navigate("/routine");
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-color overflow-hidden">
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
                    <p className="text-medium mb-2">{q.question}</p>
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
                            checked={answers[q.name] === option}
                            onChange={() => handleInput(q.name, option)}
                          />
                          <span className="text-sm">{option}</span>
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
                    <label className="block mb-2 text-medium font-base">
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
                <PrimaryButton
                  onClick={handleSave}
                  disabled={!allInputsFilled}
                  className="mt-8"
                >
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
