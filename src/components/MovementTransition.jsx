const MOVEMENT_ENDINGS = {
  73: {
    closing: "Looking ends here.",
    line: "Attention has taught us how to see. The next movement asks what happens when another person enters the frame.",
    nextCode: "II",
    nextName: "Others",
    nextDay: 74
  },
  146: {
    closing: "Others ends here.",
    line: "Relationship has widened the world. Now come friction, ambiguity, contradiction, and consequence.",
    nextCode: "III",
    nextName: "Complication",
    nextDay: 147
  },
  219: {
    closing: "Complication ends here.",
    line: "What resists easy answers begins to gather into memory, history, inheritance, and time.",
    nextCode: "IV",
    nextName: "Time & Inheritance",
    nextDay: 220
  },
  292: {
    closing: "Time & Inheritance ends here.",
    line: "What has been received, lost, remembered, and carried forward now gives way to the final question: what does it mean?",
    nextCode: "V",
    nextName: "Meaning",
    nextDay: 293
  },
  365: {
    closing: "Meaning ends here.",
    line: "The year is complete. Keep the habit of attention.",
    finalLine: "There is no next movement—only the world, newly noticed."
  }
};

export default function MovementTransition({
  day,
  completed,
  onOpenDay,
  onCalendar
}) {
  const transition = MOVEMENT_ENDINGS[day];

  if (!transition) return null;

  const isFinalDay = day === 365;

  return (
    <section
      className={`movementTransition ${completed ? "isComplete" : ""}`}
      aria-label={isFinalDay ? "End of Project 365" : "End of movement"}
    >
      <div className="movementTransitionRule" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>

      <p className="movementTransitionEyebrow">
        {isFinalDay ? "Finis · Day 365" : `End of Movement · Day ${day}`}
      </p>

      <h2>{transition.closing}</h2>
      <p className="movementTransitionLine">{transition.line}</p>

      {isFinalDay ? (
        <>
          <blockquote>{transition.finalLine}</blockquote>
          <button
            type="button"
            className="movementTransitionAction final"
            onClick={onCalendar}
          >
            Return to the year
          </button>
        </>
      ) : (
        <div className="nextMovement">
          <span className="nextMovementLabel">Next movement</span>

          <button
            type="button"
            className="movementTransitionAction"
            onClick={() => onOpenDay(transition.nextDay)}
            aria-label={`Continue to ${transition.nextCode} — ${transition.nextName}`}
          >
            <span className="nextMovementCode">{transition.nextCode}</span>
            <span className="nextMovementName">{transition.nextName}</span>

            <svg
              className="movementTransitionArrow"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 10H16" />
              <path d="M11 5L16 10L11 15" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
