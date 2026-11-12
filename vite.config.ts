import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// VAPID public key — safe to embed at build time (this is the PUBLIC key only, never the private key).
// This ensures push notifications work on Vercel even without VITE_VAPID_PUBLIC_KEY set in dashboard.
const VAPID_PUBLIC_KEY =
  process.env.VITE_VAPID_PUBLIC_KEY ||
  "BDjZxChL4wXGsIKeoIJMHlAdJIbhOBtp323D3FbRLh0_IIZKigcV8vrFqZls3jyVyumMz0oqiH-sLTPd0EYD6Lo";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
    open: false,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  assetsInclude: ["**/*.JPG"],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Inject VAPID public key so it's always available at runtime — even on Vercel without env vars set
    "import.meta.env.VITE_VAPID_PUBLIC_KEY": JSON.stringify(VAPID_PUBLIC_KEY),
  },
}));
