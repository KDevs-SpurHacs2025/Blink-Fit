import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Survey from "./pages/Survey.jsx";
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/survey" element={<Survey />} />
        {/* Add more routes as needed */}
      </Routes>
    </HashRouter>
  );
}

export default App;
