import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import PrimaryButton from "../components/PrimaryButton";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = () => {
    setUser({ id: email, pwd: password });
    navigate("/survey");
  };

  const handleGuest = () => {
    setUser({ id: "janeDoe@gmail.com", pwd: "!Jane123" });
    navigate("/survey");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-bg-colortext-center pt-36 pb-20">
      <div className="text-center">
        <h1 className="text-6xl text-black font-bold italic mb-1">BLINK FIT</h1>
        <p className="text-lg text-text-dark-gray font-normal">
          Digital life meets mindful habits
        </p>
      </div>
      <div className="w-3/4 max-w-md bg-white rounded-xl shadow-md p-8 mt-20 flex flex-col">
        <div className="flex items-center justify-between mb-7">
          <span className="text-2xl font-medium text-black">Sign in</span>
        </div>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="jane.doe@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg p-3 text-base mb-10 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PrimaryButton onClick={handleLogin}>Log in</PrimaryButton>
        <div className="w-full flex justify-end">
          <span className="text-sm text-text-dark-gray">
            Don't have an account?{" "}
            <a href="#" className="underline">
              Sign up
            </a>
          </span>
        </div>
        {/* <div className="w-full border-b border-gray-200 my-9"></div>
        <PrimaryButton
          onClick={handleGuest}
          className="bg-white text-black border border-primary hover:bg-primary transition"
        >
          Enter as guest
        </PrimaryButton> */}
      </div>
    </div>
  );
}
