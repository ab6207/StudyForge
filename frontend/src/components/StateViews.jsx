export function LoadingState({ mode }) {
  return (
    <div className="state-panel state-loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>Turning your notes into {mode === "quiz" ? "a quiz" : "flashcards"}…</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state-panel state-error" role="alert">
      <p className="state-title">Couldn't generate that</p>
      <p className="state-message">{error?.message}</p>
      {error?.detail && (
        <details className="state-detail">
          <summary>Technical detail</summary>
          <code>{error.detail}</code>
        </details>
      )}
      <button className="primary-btn" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="state-panel state-empty">
      <p className="state-title">Nothing generated yet</p>
      <p className="state-message">
        Paste some notes or a topic above and pick flashcards or a quiz to get started.
      </p>
    </div>
  );
}
