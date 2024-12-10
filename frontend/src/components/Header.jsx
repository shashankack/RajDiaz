import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Switch, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Header = ({ mode, setMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove tokens from local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Raj Diamonds
        </Typography>

        {/* Dark/Light Mode Toggle */}
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Switch
            checked={mode === "dark"}
            onChange={() => setMode(mode === "dark" ? "light" : "dark")}
          />
        </Box>

        {/* Logout Button */}
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
