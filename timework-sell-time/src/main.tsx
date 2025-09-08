import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
      body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        background-color: #f0f2f5;
      }
    `;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <GlobalStyle />
  </StrictMode>
);
