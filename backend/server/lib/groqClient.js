import { AiOutputError } from "./validate.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const TIMEOUT_MS = 25_000;

function buildSystemPrompt(mode, count) {
  if (mode === "quiz") {
    return `You are a study-tool backend. You output ONLY raw JSON, nothing else — no markdown fences, no commentary, no leading/trailing text.

Generate exactly ${count} multiple-choice quiz questions from the material the user gives you.

Output shape (must match exactly):
{
  "items": [
    {
      "id": "q1",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "one sentence on why that answer is correct"
    }
  ]
}

Rules: each question needs exactly 4 options, correctIndex is a 0-based index into options, questions must be answerable from the given material only. If the input is too short or vague to make good questions, do your best with what's there rather than refusing.`;
  }

  return `You are a study-tool backend. You output ONLY raw JSON, nothing else — no markdown fences, no commentary, no leading/trailing text.

Generate exactly ${count} flashcards from the material the user gives you.

Output shape (must match exactly):
{
  "items": [
    { "id": "card1", "front": "short question or term", "back": "concise answer or definition" }
  ]
}

Rules: front should be a short prompt (a term or question), back should be a concise, accurate answer (1-3 sentences max). If the input is too short or vague, do your best with what's there rather than refusing.`;
}

/**
 * Calls Groq's chat completions endpoint and returns the raw text content.
 * Throws AiOutputError('UPSTREAM_ERROR' | 'TIMEOUT') on failure — never
 * throws a raw fetch/network error up to the route handler.
 */
export async function callModel({ text, mode, count }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new AiOutputError(
      "CONFIG_ERROR",
      "GROQ_API_KEY is not set on the server. Add it to your .env (local) or Vercel project env vars."
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(GROQ_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt(mode, count) },
          { role: "user", content: text },
        ],
      }),
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new AiOutputError("TIMEOUT", "The model took too long to respond.");
    }
    throw new AiOutputError("UPSTREAM_ERROR", "Couldn't reach the AI provider.");
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const status = res.status;
    const body = await res.text().catch(() => "");
    const hint =
      status === 401
        ? "Check that GROQ_API_KEY is valid."
        : status === 429
        ? "Rate limited by the provider — try again shortly."
        : "";
    throw new AiOutputError(
      "UPSTREAM_ERROR",
      `AI provider returned ${status}. ${hint} ${body.slice(0, 200)}`.trim()
    );
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new AiOutputError("EMPTY_RESPONSE", "Model returned no content.");
  }
  return content;
}
