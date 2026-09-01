import { useEffect, useState } from "react";

export default function Flashcards({ items }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = items[index];

  function goTo(next) {
    setIndex((i) => Math.max(0, Math.min(items.length - 1, i)));
    setFlipped(false);
    setIndex(next);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") goTo(Math.min(items.length - 1, index + 1));
      if (e.key === "ArrowLeft") goTo(Math.max(0, index - 1));
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length]);

  if (!card) return null;

  return (
    <div className="flashcards">
      <p className="progress-label">
        Card {index + 1} of {items.length}
      </p>

      <div
        className={`flip-card ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Showing answer, click to show question" : "Showing question, click to reveal answer"}
        onKeyDown={(e) => {
          if (e.key === "Enter") setFlipped((f) => !f);
        }}
      >
        <div className="flip-card-inner">
          <div className="flip-face flip-front">
            <span className="flip-eyebrow">Term</span>
            <p>{card.front}</p>
          </div>
          <div className="flip-face flip-back">
            <span className="flip-eyebrow">Answer</span>
            <p>{card.back}</p>
          </div>
        </div>
      </div>

      <div className="card-nav">
        <button onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}>
          ← Prev
        </button>
        <button className="text-btn" onClick={() => setFlipped((f) => !f)}>
          {flipped ? "Show question" : "Flip card"}
        </button>
        <button onClick={() => goTo(Math.min(items.length - 1, index + 1))} disabled={index === items.length - 1}>
          Next →
        </button>
      </div>
      <p className="hint">Tip: use ← → to move between cards, space to flip.</p>
    </div>
  );
}
