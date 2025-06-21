import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Loading() {
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get props from location.state or use defaults
  const {
    title = "Let’s understand your screen habits and eye health to personalize your experience",
    buttonText = "Continue",
    next = "/survey",
    subText = null,
  } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-2xl text-center font-medium text-black mb-4 w-3/4"
      >
        {title}
      </motion.div>
      {subText && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg text-center text-gray-700 mb-8 w-3/4"
        >
          {subText}
        </motion.div>
      )}
      <motion.button
        initial={false}
        animate={{ opacity: showButton ? 1 : 0 }}
        transition={{ duration: 0.7 }}
        className="bg-green-500 text-white py-3 px-8 rounded-xl mt-4 text-lg hover:bg-green-600 transition"
        onClick={() => navigate(next)}
        style={{ pointerEvents: showButton ? "auto" : "none" }}
      >
        {buttonText}
      </motion.button>
    </div>
  );
}
