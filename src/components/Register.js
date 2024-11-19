import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  // destructuring the object which is return from useSnackbar() for success/error/warning cards
  const { enqueueSnackbar } = useSnackbar();

  // adding state value to this component to store the users input and set initial value as object
  const [formData, setFormdata] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  // to asscess and manipulate the history object of browser using react hook
  const history = useHistory();

  // making state for loading animation and setting initial value as false
  const [loading, setLoading] = useState(false);

  const userInput = (e) => {
    /*
    we are accessing the copy of the object (formData) using spread {...} operater
    {...formData} -> {username:"someValue", password:"someValue", confirmPassword:"someValue"}
    
    we are adding new key or updating the key if present in object
    {...formData, [newKey]: "newValue"}

    as we are passing this in state-updation function so it will directly update the actual state
    in this case we are updating the value of existing key
    */
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  };
  const passInput = (e) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  };
  const passCnfInput = (e) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  // function to empty the input filed after submitting
  const emptyStateAfterSubmit = (formData) => {
    const updateStatedata = {
      ...formData,
      username: "",
      password: "",
      confirmPassword: "",
    };
    // updating the state
    setFormdata(updateStatedata);
  };

  // async function to post the user's input from register form to backend
  const register = async (formData) => {
    // if it clears all the form validation
    if (validateInput(formData)) {
      // changing state to show load symbol
      setLoading(true);
      const data = {
        username: formData.username,
        password: formData.password,
      };

      // posting the data to the backend using axios.post
      try {
        let response = await axios.post(
          `${config.endpoint}/auth/register`,
          data
        );
        // if success then using MUi function to show success card
        if (response.status === 201) {
          enqueueSnackbar("Registered successfully", {
            variant: "success",
          });
          // this will add new path in history of browser and take us to that path
          history.push("/login");
        }
        // to empty the input filed after submitting
        emptyStateAfterSubmit(formData);
      } catch (error) {
        // to catch any error occure while posting the data to backend
        // if error while sending then using MUi function to show error card
        if (error.response.status === 400) {
          console.log(error.response);
          enqueueSnackbar(error.response.data.message, {
            variant: "error",
          });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON",
            {
              variant: "error",
            }
          );
        }
      } finally {
        // doesnt matter weather posting data in backend is successfull(try) or FamilyRestroom(catch) this (finally)
        // will execute after executing try and catch.
        setLoading(false);
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */

  // validating the users input in registration form
  const validateInput = (data) => {
    let username = data.username;
    let password = data.password;
    let confirmPassword = data.confirmPassword;

    let result = true;

    // if validation found error then show warning using Mui cards
    if (username === "") {
      result = false;
      enqueueSnackbar("Username is a required field", { variant: "warning" });
    } else if (username.length < 6) {
      result = false;
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
    } else if (password === "") {
      result = false;
      enqueueSnackbar("Password is a required field", { variant: "warning" });
    } else if (password.length < 6) {
      result = false;
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
    } else if (password !== confirmPassword) {
      result = false;
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
    }

    return result;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={formData.username}
            onChange={userInput}
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            value={formData.password}
            onChange={passInput}
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            value={formData.confirmPassword}
            onChange={passCnfInput}
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
          />
          {/* ternetri operater (conditional rendering) */}
          {loading ? (
            <div className="loadingReg">
              <CircularProgress color="success" />
            </div>
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={() => register(formData)}
            >
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link to={`/login`} className="link" href="#">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
