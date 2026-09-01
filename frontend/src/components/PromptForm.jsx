import { useState } from "react";

const EXAMPLE =
  "Mitochondria are membrane-bound organelles found in most eukaryotic cells. They generate most of the cell's supply of ATP through cellular respiration, which is why they're often called the powerhouse of the cell. Mitochondria have their own DNA, separate from the nucleus, and are believed to have originated from free-living bacteria that were engulfed by an ancestral eukaryotic cell — a theory known as endosymbiosis.";

export default function PromptForm({ onSubmit, disabled }) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("flashcards");
  const [count, setCount] = useState(6);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ text: text.trim(), mode, count });
  }

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="notes">
        Paste your notes or name a topic
      </label>
      <textarea
        id="notes"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. paste a paragraph from your textbook, or just type a topic like 'the French Revolution'"
        rows={7}
        maxLength={6000}
      />
      <div className="form-row">
        <button
          type="button"
          className="text-btn"
          onClick={() => setText(EXAMPLE)}
        >
          Use an example
        </button>
        <span className="char-count">{text.length}/6000</span>
      </div>

      <div className="form-controls">
        <div className="segmented" role="tablist" aria-label="Study mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "flashcards"}
            className={mode === "flashcards" ? "active" : ""}
            onClick={() => setMode("flashcards")}
          >
            Flashcards
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "quiz"}
            className={mode === "quiz" ? "active" : ""}
            onClick={() => setMode("quiz")}
          >
            Quiz
          </button>
        </div>

        <label className="count-field">
          Items
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[4, 6, 8, 10, 12].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="primary-btn" disabled={disabled || !text.trim()}>
          {disabled ? "Generating…" : `Generate ${mode === "quiz" ? "quiz" : "flashcards"}`}
        </button>
      </div>
    </form>
  );
}
