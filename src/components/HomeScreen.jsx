import { useEffect, useMemo, useState } from "react";
import { getFirstIncompleteDay } from "../lib/progress";

export default function HomeScreen({
  onOpenDay,
  totalDays,
  lastDayKey,
  completedDays
}) {
  const [continueDay, setContinueDay] = useState(1);

  useEffect(() => {
    document.title = "365 — A Daily Reflection";
    const saved = Number(window.localStorage.getItem(lastDayKey));

    if (Number.isInteger(saved) && saved >= 1 && saved <= totalDays) {
      setContinueDay(saved);
    }
  }, [lastDayKey, totalDays]);

  const completedCount = completedDays.length;
  const progress = (completedCount / totalDays) * 100;
  const firstIncomplete = useMemo(
    () => getFirstIncompleteDay(completedDays),
    [completedDays]
  );

  return (
    <main className="homeShell">
      <section className="homeHero">
        <div className="homeAccent" aria-hidden="true" />

        <p className="eyebrow">A daily practice in attention</p>

        <h1 className="homeTitle">
          365
          <span>A year of poems, essays & art.</span>
        </h1>

        <p className="homeIntro">
          One question. One poem. One essay. One work of art.
          A few quiet minutes to notice the world differently.
        </p>

        <div className="homeActions">
          <button
            className="primaryButton"
            onClick={() => onOpenDay(continueDay)}
          >
            {continueDay === 1
              ? "Begin with Day 1"
              : `Continue Day ${continueDay}`}
            <span aria-hidden="true">→</span>
          </button>

          {completedCount > 0 && completedCount < totalDays ? (
            <button
              className="secondaryButton"
              onClick={() => onOpenDay(firstIncomplete)}
            >
              Next unfinished day
            </button>
          ) : null}
        </div>

        <section className="homeProgress" aria-label="Completion progress">
          <div className="homeProgressTop">
            <span>Your year</span>
            <strong>{completedCount} / {totalDays}</strong>
          </div>
          <div className="homeProgressTrack">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>
            {completedCount === 0
              ? "Your completed days will be remembered on this device."
              : completedCount === totalDays
                ? "You completed the entire year."
                : `${Math.round(progress)}% complete`}
          </p>
        </section>

        <div className="homeMeta">
          <span>365 days</span>
          <span>5 movements</span>
          <span>1 unfolding arc</span>
        </div>
      </section>
    </main>
  );
}
