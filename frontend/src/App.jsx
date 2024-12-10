import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./utils/ProtectedRoute";
import Header from "./components/Header";

const App = () => {
  // Load the initial theme mode from localStorage or default to 'light'
  const [mode, setMode] = useState(() => localStorage.getItem("themeMode") || "light");

  // Update localStorage whenever the mode changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Create MUI theme based on the mode
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
      <Header mode={mode} setMode={setMode} />
        <Routes>
          {/* Redirect the root path to /login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Home Page */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage mode={mode} setMode={setMode} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
