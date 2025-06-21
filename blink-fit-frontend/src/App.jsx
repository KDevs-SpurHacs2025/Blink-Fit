import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Survey from "./pages/Survey.jsx";
import Loading from "./pages/Loading.jsx";
import Routine from "./pages/Routine.jsx";
import Policy from "./pages/Policy.jsx";
import Home from "./pages/Home.jsx";
import Settings from "./pages/Settings.jsx";
import Summary from "./pages/Summary.jsx";

//Screen-Break
import ScreenTime from "./pages/ScreenTime.jsx";
function App() {
  return (
    <div
      style={{
        width: "600px",
        height: "800px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/home" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/screen-time" element={<ScreenTime />} />
          <Route path="/summary" element={<Summary />} />
          {/* Add more routes as needed */}
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
