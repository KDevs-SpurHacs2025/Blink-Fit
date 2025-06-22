import React from "react";

const PrimaryButton = ({ onClick, children, className = "", ...props }) => (
  <button
    onClick={onClick}
    className={`bg-primary w-full text-black font-normal py-3 rounded-lg hover:bg-opacity-90 mb-4 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default PrimaryButton;
