import app from "../server/app.js";

// Vercel's Node runtime treats a default-exported Express app as a
// request handler directly. Combined with vercel.json's rewrite, every
// /api/* request lands here and Express does its own internal routing.
export default app;
