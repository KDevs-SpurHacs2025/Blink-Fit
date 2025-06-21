import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Loading() {
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get props from location.state or use defaults
  const {
    title = null,
    buttonText = "Continue",
    next = "/survey",
    subText = "Let’s understand your screen habits and eye health to personalize your experience",
  } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-color">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className=" w-3/4 text-xl text-center font-bold text-black mb-4"
      >
        {title}
      </motion.div>
      {subText && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0, ease: "easeOut" }}
          className="w-3/4 text-xl text-center font-medium text-black mb-3"
        >
          {subText}
        </motion.div>
      )}
      <motion.button
        initial={false}
        animate={{ opacity: showButton ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="bg-transparent text-black text-md hover:underline transition focus:outline-none border-none"
        onClick={() => navigate(next)}
        style={{ pointerEvents: showButton ? "auto" : "none" }}
      >
        {buttonText}
      </motion.button>
    </div>
  );
}
