import { Router } from "express";
import { callModel } from "../lib/groqClient.js";
import { extractJson, validateStudySet, AiOutputError } from "../lib/validate.js";

const router = Router();

const MAX_INPUT_LENGTH = 6000;

router.post("/", async (req, res) => {
  const { text, mode, count } = req.body ?? {};

  // --- Input validation (client bugs, not AI failures) ---
  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ code: "BAD_INPUT", message: "Notes/topic text is required." });
  }
  if (text.length > MAX_INPUT_LENGTH) {
    return res.status(400).json({
      code: "BAD_INPUT",
      message: `Text is too long (max ${MAX_INPUT_LENGTH} characters).`,
    });
  }
  if (mode !== "flashcards" && mode !== "quiz") {
    return res.status(400).json({ code: "BAD_INPUT", message: "mode must be 'flashcards' or 'quiz'." });
  }
  const safeCount = Number.isInteger(count) ? Math.min(Math.max(count, 3), 12) : 6;

  // --- AI call + defensive parsing ---
  try {
    const raw = await callModel({ text, mode, count: safeCount });
    const parsed = extractJson(raw);
    const validated = validateStudySet(parsed, mode);
    return res.status(200).json(validated);
  } catch (err) {
    if (err instanceof AiOutputError) {
      const status = err.code === "CONFIG_ERROR" ? 500 : 502;
      return res.status(status).json({ code: err.code, message: err.message });
    }
    // Genuinely unexpected — log server-side, never leak internals to client
    console.error("Unhandled error in /api/generate:", err);
    return res.status(500).json({ code: "UNKNOWN", message: "Something went wrong generating your study set." });
  }
});

export default router;
