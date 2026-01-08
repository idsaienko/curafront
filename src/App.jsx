import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./components/main/Dashboard";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { Box } from "@mui/material";
import LeftSide from "./components/main/LeftSide";
import RightSide from "./components/main/RightSide";
import Center from "./components/main/Center";
import Main from "./components/main/Main";
import Reports from "./components/main/Reports";
import Documents from "./components/main/Documents";
import Appointments from "./components/main/Appointments";
import Schedule from "./components/main/Schedule";
function App() {
  const [activeScreen, setActiveScreen] = useState("dashboard"); // default

  const renderScreen = () => {
    switch (activeScreen) {
      case "dashboard":
        return <Dashboard />;

      case "reports":
        return <Reports />;

      case "nachweise":
        return <div>Nachweise Screen</div>;

      case "zeitplan":
        return <Schedule />;

      case "dokumente":
        return <Documents />;

      case "termine":
        return <Appointments />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected route (requires login) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <NavBar />
              <Box
                sx={{
                  mt: 8,
                  display: "flex",
                  gap: 2,
                }}
              >
                <Box sx={{ width: "260px", flexShrink: 0 }}>
                  <LeftSide setActiveScreen={setActiveScreen} />
                </Box>

                <Box sx={{ flex: 1 }}>{renderScreen()}</Box>

                <Box sx={{ width: "300px", flexShrink: 0 }}>
                  <RightSide />
                </Box>
              </Box>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
