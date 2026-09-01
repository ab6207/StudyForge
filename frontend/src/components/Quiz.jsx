import { useMemo, useState } from "react";

export default function Quiz({ items }) {
  // activeItems lets us "retest" — swap in just the previously-wrong items
  // and run the same quiz flow again without touching the original set.
  const [activeItems, setActiveItems] = useState(items);
  const [answers, setAnswers] = useState({}); // id -> selectedIndex
  const [submitted, setSubmitted] = useState(false);

  const wrongItems = useMemo(
    () => activeItems.filter((q) => answers[q.id] !== q.correctIndex),
    [activeItems, answers]
  );
  const score = activeItems.length - wrongItems.length;
  const allAnswered = activeItems.every((q) => answers[q.id] !== undefined);

  function selectAnswer(qid, optIndex) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: optIndex }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  function retestWrong() {
    setActiveItems(wrongItems);
    setAnswers({});
    setSubmitted(false);
  }

  function restartAll() {
    setActiveItems(items);
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="quiz">
      {submitted && (
        <div className="quiz-score">
          <p className="state-title">
            {score} / {activeItems.length} correct
          </p>
          <div className="quiz-score-actions">
            {wrongItems.length > 0 && (
              <button className="primary-btn" onClick={retestWrong}>
                Retest the {wrongItems.length} I got wrong
              </button>
            )}
            {activeItems.length !== items.length && (
              <button className="text-btn" onClick={restartAll}>
                Restart full quiz
              </button>
            )}
          </div>
        </div>
      )}

      <ol className="quiz-list">
        {activeItems.map((q, qi) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correctIndex;
          return (
            <li key={q.id} className="quiz-item">
              <p className="quiz-question">
                <span className="quiz-index">{qi + 1}.</span> {q.question}
              </p>
              <div className="quiz-options">
                {q.options.map((opt, oi) => {
                  let optClass = "";
                  if (submitted) {
                    if (oi === q.correctIndex) optClass = "correct";
                    else if (oi === selected) optClass = "incorrect";
                  } else if (oi === selected) {
                    optClass = "selected";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      className={`quiz-option ${optClass}`}
                      onClick={() => selectAnswer(q.id, oi)}
                      disabled={submitted}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && q.explanation && (
                <p className={`quiz-explanation ${isCorrect ? "ok" : "off"}`}>{q.explanation}</p>
              )}
            </li>
          );
        })}
      </ol>

      {!submitted && (
        <button className="primary-btn" onClick={handleSubmit} disabled={!allAnswered}>
          {allAnswered ? "Submit answers" : `Answer all ${activeItems.length} to submit`}
        </button>
      )}
    </div>
  );
}
