import { useEffect, useState } from "react";
import PromptForm from "./components/PromptForm.jsx";
import Flashcards from "./components/Flashcards.jsx";
import Quiz from "./components/Quiz.jsx";
import { LoadingState, ErrorState, EmptyState } from "./components/StateViews.jsx";
import { useAIGenerate } from "./hooks/useAIGenerate.js";
import { apiUrl } from "./lib/api.js";

export default function App() {
  const { status, data, error, run, retry } = useAIGenerate();
  const [dark, setDark] = useState(false);
  const [savedNotice, setSavedNotice] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Load a shared session from the URL, e.g. /?s=aB3xY9kq
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("s");
    if (!slug) return;
    fetch(apiUrl(`/api/sessions/${slug}`))
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => {
        // A full implementation would hydrate the hook's state here;
        // kept out of scope for the assignment's core requirements.
        setSavedNotice("Loaded a shared session link (view-only demo).");
      })
      .catch(() => {});
  }, []);

  async function saveSession() {
    if (!data) return;
    try {
      const res = await fetch(apiUrl("/api/sessions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceText: "saved-session", mode: data.type, data }),
      });
      const body = await res.json();
      if (!res.ok) {
        setSavedNotice(body.message || "Couldn't save — sessions may not be configured.");
        return;
      }
      const url = `${window.location.origin}?s=${body.slug}`;
      await navigator.clipboard?.writeText(url).catch(() => {});
      setSavedNotice(`Saved! Link copied: ${url}`);
    } catch {
      setSavedNotice("Couldn't reach the server to save this session.");
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">SF</span>
          <div>
            <h1>StudyForge</h1>
            <p className="tagline">Notes in, flashcards or a quiz out.</p>
          </div>
        </div>
        <button
          className="icon-btn"
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Light mode" : "Dark mode"}
        >
          {dark ? "☀" : "☾"}
        </button>
      </header>

      <main className="app-main">
        <PromptForm onSubmit={run} disabled={status === "loading"} />

        <section className="result-area">
          {status === "idle" && <EmptyState />}
          {status === "loading" && <LoadingState mode={data?.type} />}
          {status === "error" && <ErrorState error={error} onRetry={retry} />}
          {status === "success" && data && (
            <>
              <div className="result-toolbar">
                <span className="result-count">
                  {data.items.length} {data.type === "quiz" ? "questions" : "cards"}
                </span>
                <button className="text-btn" onClick={saveSession}>
                  Save & share link
                </button>
              </div>
              {savedNotice && <p className="saved-notice">{savedNotice}</p>}
              {data.type === "quiz" ? <Quiz items={data.items} /> : <Flashcards items={data.items} />}
            </>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>
    <strong>StudyForge</strong> — Your AI-powered study companion.
    </p>

    <p>
    Turn your notes into flashcards and quizzes and study smarter.
    </p>

    <p>
    Built with React, Node.js, Express & Groq AI.
    </p>
      </footer>
    </div>
  );
}
