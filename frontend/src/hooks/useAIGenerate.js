import { useCallback, useRef, useState } from "react";
import { apiUrl } from "../lib/api.js";

const ERROR_COPY = {
  BAD_INPUT: "That input isn't quite right. Add a bit more text and try again.",
  CONFIG_ERROR: "The server isn't configured with an API key yet.",
  TIMEOUT: "The AI took too long to respond. Try again, or shorten your notes.",
  UPSTREAM_ERROR: "The AI provider had a problem on their end. Try again in a moment.",
  EMPTY_RESPONSE: "The AI didn't return anything usable. Try again.",
  PARSE_ERROR: "The AI's response wasn't valid data. Try again — this happens occasionally with smaller models.",
  SCHEMA_ERROR: "The AI returned data in the wrong shape. Try again, or simplify your input.",
  NETWORK_ERROR: "Couldn't reach the server. Check your connection and try again.",
  UNKNOWN: "Something unexpected went wrong.",
};

export function useAIGenerate() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Guards against race conditions: if the user fires a second request
  // before the first resolves, we abort the first AND tag every request
  // with an id so a late-arriving stale response is ignored even if the
  // abort itself doesn't win the race.
  const abortRef = useRef(null);
  const requestIdRef = useRef(0);
  const lastParamsRef = useRef(null);

  const run = useCallback(async (params) => {
    lastParamsRef.current = params;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const thisRequestId = ++requestIdRef.current;

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch(apiUrl("/api/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      let body;
      try {
        body = await res.json();
      } catch {
        throw { code: "PARSE_ERROR" };
      }

      if (thisRequestId !== requestIdRef.current) return; // stale, a newer request superseded this one

      if (!res.ok) {
        throw { code: body.code || "UNKNOWN", message: body.message };
      }

      setData(body);
      setStatus("success");
    } catch (err) {
      if (controller.signal.aborted) return; // superseded — the newer request owns state now
      if (thisRequestId !== requestIdRef.current) return;

      const code = err?.code || "NETWORK_ERROR";
      setError({
        code,
        message: ERROR_COPY[code] || ERROR_COPY.UNKNOWN,
        detail: err?.message,
      });
      setStatus("error");
    }
  }, []);

  const retry = useCallback(() => {
    if (lastParamsRef.current) run(lastParamsRef.current);
  }, [run]);

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, run, retry, reset };
}
