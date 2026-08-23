export default function CompletionPanel({
  day,
  completed,
  completedCount,
  totalDays,
  onToggle
}) {
  const percent = (completedCount / totalDays) * 100;

  return (
    <section className={`completionPanel ${completed ? "isComplete" : ""}`}>
      <div className="completionCopy">
        <p className="eyebrow">Your year</p>
        <h2>
          {completed
            ? `Day ${day} complete.`
            : `Complete Day ${day} when you're ready.`}
        </h2>
        <p>
          {completedCount} of {totalDays} days completed
        </p>
      </div>

      <div className="completionProgress" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>

      <button
        className={`completionButton ${completed ? "completed" : ""}`}
        onClick={onToggle}
        aria-pressed={completed}
      >
        <span className="completionMark" aria-hidden="true">
          {completed ? "✓" : "○"}
        </span>
        {completed ? "Completed" : "Mark day complete"}
      </button>
    </section>
  );
}
