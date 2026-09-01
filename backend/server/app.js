import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import generateRouter from "./routes/generate.js";
import sessionsRouter from "./routes/sessions.js";

const app = express();

// CORS_ORIGIN can be a comma-separated list of allowed frontend origins,
// e.g. "http://localhost:5173,https://study-forge.vercel.app".
// Falls back to allowing all origins, which is fine for this assignment
// but worth tightening for anything beyond a demo.
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  })
);
app.use(express.json({ limit: "1mb" }));

// Lazily connect to Mongo if a URI is configured. Sessions routes check
// connection state themselves and degrade gracefully if this never fires.
if (process.env.MONGODB_URI && mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection failed:", err.message));
}

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/generate", generateRouter);
app.use("/api/sessions", sessionsRouter);

export default app;
