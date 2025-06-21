import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Survey from "./pages/Survey.jsx";
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
          {/* Screen-Break */}
          <Route path="/screen-time" element={<ScreenTime />} />
          <Route path="/summary" element={<Summary />} />
          {/* Add more routes as needed */}
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
