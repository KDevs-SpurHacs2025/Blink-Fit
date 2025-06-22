import React from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

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
        <AppRoutes />
      </HashRouter>
    </div>
  );
}

export default App;
