import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./main.css";
<<<<<<< HEAD:client/app/entry.client.tsx
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
=======
>>>>>>> a044ffa (Add initial migration files):client/src/entry.client.tsx

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>,
);
