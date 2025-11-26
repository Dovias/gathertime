import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./main.css";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>,
);
