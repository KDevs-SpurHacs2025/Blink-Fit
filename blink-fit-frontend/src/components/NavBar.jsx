import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "../assets/icons/home.svg";
import HomeGreenIcon from "../assets/icons/home-green.svg";
import SettingsIcon from "../assets/icons/setting.svg";
import SettingsGreenIcon from "../assets/icons/setting-green.svg";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/home";
  const isSettings = location.pathname === "/settings";
  return (
    <nav className="w-[42vw] max-w-md bg-[#FCFCFC] rounded-full flex items-center justify-between px-12 py-4 shadow-md z-50">
      <button
        className="flex flex-col items-center focus:outline-none"
        onClick={() => navigate("/home")}
        aria-label="Home"
      >
        <img
          src={isHome ? HomeGreenIcon : HomeIcon}
          alt="Home"
          className="w-7 h-7"
        />
      </button>
      <button
        className="flex flex-col items-center focus:outline-none"
        onClick={() => navigate("/settings")}
        aria-label="Settings"
      >
        <img
          src={isSettings ? SettingsGreenIcon : SettingsIcon}
          alt="Settings"
          className="w-7 h-7"
        />
      </button>
    </nav>
  );
};

export default NavBar;
