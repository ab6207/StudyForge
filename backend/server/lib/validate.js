// Everything in this file exists because LLMs do not reliably return
// well-formed JSON matching the exact shape you asked for. We assume
// the model WILL misbehave and design for it, rather than trusting it.

/**
 * Try to pull a JSON object out of raw model text.
 * Models sometimes wrap JSON in ```json fences or add a stray sentence
 * before/after it even when told not to. We try the strict path first,
 * then fall back to extracting the outermost {...} block.
 */
export function extractJson(raw) {
  if (typeof raw !== "string") {
    throw new AiOutputError("EMPTY_RESPONSE", "Model returned no text content.");
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    throw new AiOutputError("EMPTY_RESPONSE", "Model returned an empty response.");
  }

  // 1. Straightforward parse
  try {
    return JSON.parse(trimmed);
  } catch {
    /* fall through */
  }

  // 2. Strip ```json ... ``` or ``` ... ``` fences
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      /* fall through */
    }
  }

  // 3. Grab the outermost { ... } span and try that
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      /* fall through */
    }
  }

  throw new AiOutputError(
    "PARSE_ERROR",
    "Model response wasn't valid JSON and couldn't be recovered."
  );
}

export class AiOutputError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code; // machine-readable: used by the client to pick UI copy
  }
}

/**
 * Validate + normalize the parsed payload against the shape we asked the
 * model for. Throws AiOutputError with a specific code on any mismatch.
 * Silently drops individual malformed items rather than failing the whole
 * batch, as long as at least one usable item survives.
 */
export function validateStudySet(payload, mode) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AiOutputError("SCHEMA_ERROR", "Response wasn't a JSON object.");
  }

  if (!Array.isArray(payload.items)) {
    throw new AiOutputError("SCHEMA_ERROR", "Response had no 'items' array.");
  }

  const cleaned =
    mode === "quiz"
      ? payload.items.filter(isValidQuizItem).map(normalizeQuizItem)
      : payload.items.filter(isValidFlashcard).map(normalizeFlashcard);

  if (cleaned.length === 0) {
    throw new AiOutputError(
      "SCHEMA_ERROR",
      `Model returned ${payload.items.length} item(s) but none matched the expected ${mode} shape.`
    );
  }

  return { type: mode, items: cleaned };
}

function isValidFlashcard(item) {
  return (
    item &&
    typeof item === "object" &&
    typeof item.front === "string" &&
    item.front.trim().length > 0 &&
    typeof item.back === "string" &&
    item.back.trim().length > 0
  );
}

function normalizeFlashcard(item, i) {
  return {
    id: String(item.id ?? `card-${i}`),
    front: item.front.trim(),
    back: item.back.trim(),
  };
}

function isValidQuizItem(item) {
  if (!item || typeof item !== "object") return false;
  if (typeof item.question !== "string" || !item.question.trim()) return false;
  if (!Array.isArray(item.options) || item.options.length < 2) return false;
  if (!item.options.every((o) => typeof o === "string" && o.trim().length > 0)) return false;
  if (!Number.isInteger(item.correctIndex)) return false;
  if (item.correctIndex < 0 || item.correctIndex >= item.options.length) return false;
  return true;
}

function normalizeQuizItem(item, i) {
  return {
    id: String(item.id ?? `q-${i}`),
    question: item.question.trim(),
    options: item.options.map((o) => o.trim()),
    correctIndex: item.correctIndex,
    explanation: typeof item.explanation === "string" ? item.explanation.trim() : "",
  };
}
