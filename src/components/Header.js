import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import logo from "../assets/logoQkart.png";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    function getDataFromLocalStorage() {
      const userData = localStorage.getItem("username");
      if (userData === "" || userData === null) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    }
    getDataFromLocalStorage();
  }, []);

  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <Box className="header">
      <Box className="header-title">
        <img className="header-title-img" src={logo} alt="QKart-icon"></img>
      </Box>

      {/* when product.js will render this children will render otherwise not */}
      {children}

      {isLoggedIn ? (
        <Stack direction="row" spacing={{ xs: 0.2, sm: 1 }} alignItems="center">
          <Avatar
            src="avatar.png"
            alt={localStorage.getItem("username")}
            sx={{ width: 30, height: 30 }}
          />
          <span>{localStorage.getItem("username")}</span>
          <Button variant="text" size="medium" onClick={() => logOut()}>
            <strong>LOGOUT</strong>
          </Button>
          {/*  */}
        </Stack>
      ) : !hasHiddenAuthButtons ? (
        <div>
          <Link to="/login">
            <Button
              size="medium"
              variant="text"
              className="prd-noLogin-head-btn"
            >
              LOGIN
            </Button>
          </Link>
          <Link to="/register">
            <Button
              size="medium"
              variant="contained"
              className="prd-noLogin-head-btn"
            >
              REGISTER
            </Button>
          </Link>
        </div>
      ) : (
        <Link to={`/`}>
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
          >
            Back to explore
          </Button>
        </Link>
      )}
    </Box>
  );
};

export default Header;
