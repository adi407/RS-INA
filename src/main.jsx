import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted fonts (no request to Google before text can show)
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import App from "./App.jsx";
import "./index.css";

// The footer "Reduce motion" switch is remembered per visitor
try {
  if (localStorage.getItem("rs-motion") === "reduce") document.documentElement.dataset.motion = "reduce";
} catch {
  /* storage blocked: follow the OS setting only */
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
