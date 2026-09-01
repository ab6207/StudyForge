import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Local dev: React runs on :5173, Express runs on :5050.
// Any request to /api/* from the browser gets forwarded to Express,
// so the frontend code always just calls fetch("/api/...") regardless
// of whether it's running locally or deployed on Vercel.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
    },
  },
});
