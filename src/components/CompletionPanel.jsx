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
      <div className="completionSeal" aria-hidden="true">
        {completed ? "✓" : day}
      </div>

      <div className="completionCopy">
        <p className="eyebrow">Close the day</p>
        <h2>
          {completed
            ? `Day ${day} is part of your year.`
            : `When this day feels finished, mark it complete.`}
        </h2>
        <p>{completedCount} of {totalDays} days completed</p>
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
        {completed ? "Completed — tap to reopen" : "Mark day complete"}
      </button>
    </section>
  );
}
