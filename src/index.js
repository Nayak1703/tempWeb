import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// wrapping our App with SnackbarProvider which help us to create notification like tost for warning, success, failure.
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
// default theme
import { ThemeProvider } from "@mui/system";
import theme from "./theme";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          preventDuplicate
        >
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
