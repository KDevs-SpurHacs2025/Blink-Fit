import React from "react";
import LaptopIcon from "../assets/icons/laptop.svg";
import CoffeeIcon from "../assets/icons/coffee.svg";
import LeafIcon from "../assets/icons/leaf.svg";
import LoopIcon from "../assets/icons/loop.svg";

const RoutineCard = ({
  description,
  title,
  screenTime,
  breakTime,
  selected,
  onClick,
  icon,
}) => (
  <div
    className={`relative flex-1 bg-bg-color-light-gray rounded-xl shadow-md p-8 flex flex-col items-start cursor-pointer transition border-2 overflow-hidden ${
      selected ? "border-primary" : "border-transparent"
    }`}
    onClick={onClick}
  >
    {/* Overlapping Icon */}
    {icon === "leaf" && (
      <img
        src={LeafIcon}
        alt="leaf"
        className="absolute -bottom-2 -right-3 scale-160"
      />
    )}
    {icon === "loop" && (
      <img
        src={LoopIcon}
        alt="loop"
        className="absolute top-1/2 right-4 -translate-y-1/2 scale-200"
      />
    )}
    <p className="text-sm text-text-dark-gray">{description}</p>
    <h2 className="text-xl font-bold mb-5">{title}</h2>
    <div className="text-black mb-1 flex items-center gap-2">
      <img src={LaptopIcon} alt="laptop" className="w-3" />
      <span className="font-medium">{screenTime}</span> screen time
    </div>
    <div className="text-black flex items-center gap-2">
      <img src={CoffeeIcon} alt="coffee" className="w-3" />
      <span className="font-medium">{breakTime}</span> break
    </div>
  </div>
);

export default RoutineCard;
