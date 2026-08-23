import { useEffect, useState } from "react";

export default function HomeScreen({ onOpenDay, totalDays, lastDayKey }) {
  const [continueDay, setContinueDay] = useState(1);

  useEffect(() => {
    document.title = "365 — A Daily Reflection";
    const saved = Number(window.localStorage.getItem(lastDayKey));

    if (Number.isInteger(saved) && saved >= 1 && saved <= totalDays) {
      setContinueDay(saved);
    }
  }, [lastDayKey, totalDays]);

  return (
    <main className="homeShell">
      <section className="homeHero">
        <p className="eyebrow">A daily practice in attention</p>

        <h1 className="homeTitle">
          365
          <span>A year of poems, essays & art.</span>
        </h1>

        <p className="homeIntro">
          One question. One poem. One essay. One work of art.
          A few quiet minutes to notice the world differently.
        </p>

        <button
          className="primaryButton"
          onClick={() => onOpenDay(continueDay)}
        >
          {continueDay === 1
            ? "Begin with Day 1"
            : `Continue with Day ${continueDay}`}
          <span aria-hidden="true">→</span>
        </button>

        <div className="homeMeta">
          <span>365 days</span>
          <span>5 movements</span>
          <span>1 unfolding arc</span>
        </div>
      </section>
    </main>
  );
}
