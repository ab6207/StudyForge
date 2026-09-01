import { Router } from "express";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import Session from "../models/Session.js";

const router = Router();

// This whole feature is optional — if MONGODB_URI isn't set, we tell the
// client plainly instead of crashing, and the app works fine without it.
function dbReady() {
  return Boolean(process.env.MONGODB_URI) && mongoose.connection.readyState === 1;
}

router.post("/", async (req, res) => {
  if (!dbReady()) {
    return res.status(501).json({
      code: "SESSIONS_DISABLED",
      message: "Saving sessions requires MONGODB_URI to be set on the server.",
    });
  }
  const { sourceText, mode, data } = req.body ?? {};
  if (!sourceText || !mode || !data) {
    return res.status(400).json({ code: "BAD_INPUT", message: "sourceText, mode and data are required." });
  }
  try {
    const slug = nanoid(8);
    await Session.create({ slug, sourceText, mode, data });
    return res.status(201).json({ slug });
  } catch (err) {
    console.error("Failed to save session:", err);
    return res.status(500).json({ code: "UNKNOWN", message: "Couldn't save this session." });
  }
});

router.get("/:slug", async (req, res) => {
  if (!dbReady()) {
    return res.status(501).json({
      code: "SESSIONS_DISABLED",
      message: "Loading sessions requires MONGODB_URI to be set on the server.",
    });
  }
  try {
    const session = await Session.findOne({ slug: req.params.slug }).lean();
    if (!session) {
      return res.status(404).json({ code: "NOT_FOUND", message: "No saved session with that link." });
    }
    return res.status(200).json(session);
  } catch (err) {
    console.error("Failed to load session:", err);
    return res.status(500).json({ code: "UNKNOWN", message: "Couldn't load this session." });
  }
});

export default router;
