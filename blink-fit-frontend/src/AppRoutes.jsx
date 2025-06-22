import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import useUserStore from "./store/userStore";
import Login from "./pages/Login.jsx";
import Survey from "./pages/Survey.jsx";
import Loading from "./pages/Loading.jsx";
import Routine from "./pages/Routine.jsx";
import Policy from "./pages/Policy.jsx";
import Home from "./pages/Home.jsx";
import Settings from "./pages/Settings.jsx";
import EyeHealthInfo from "./pages/EyeHealthInfo.jsx";
import Summary from "./pages/Summary.jsx";
import BreakTime from "./pages/BreakTime.jsx";
import ScreenTime from "./pages/ScreenTime.jsx";
import BreakOver from "./pages/BreakOver.jsx";
import Limit from "./pages/Limit.jsx";

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const user = localStorage.getItem("user");
    const surveyAnswers = localStorage.getItem("surveyAnswers");
    const selectedRoutine = localStorage.getItem("selectedRoutine");
    if (user) {
      useUserStore.getState().setUser(JSON.parse(user));
      if (surveyAnswers) {
        useUserStore.getState().setSurveyAnswers(JSON.parse(surveyAnswers));
      }
      if (selectedRoutine) {
        useUserStore.getState().setSelectedRoutine(JSON.parse(selectedRoutine));
      }
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate("/home", { replace: true });
      }
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/routine" element={<Routine />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/home" element={<Home />} />
      <Route path="/screen-time" element={<ScreenTime />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/eye-health-info" element={<EyeHealthInfo />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/break-time" element={<BreakTime />} />
      <Route path="/break-over" element={<BreakOver />} />
      <Route path="/limit" element={<Limit />} />
    </Routes>
  );
}

export default AppRoutes;
