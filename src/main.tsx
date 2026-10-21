import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider";

// Dynamically inject the theme-color meta tag to avoid static HTML compatibility warnings
const meta = document.createElement("meta");
meta.name = "theme-color";
meta.content = "#0a0a0a";
document.head.appendChild(meta);

import { registerServiceWorker } from "./lib/pwa";

// Register Service Worker for PWA & Push Notifications
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    registerServiceWorker();
  });
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark">
    <App />
  </ThemeProvider>
);

