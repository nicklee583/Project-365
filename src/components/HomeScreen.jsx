import { useEffect, useMemo, useState } from "react";
import AppTabs from "./AppTabs";
import { getFirstIncompleteDay } from "../lib/progress";
import { countUnfinished } from "../lib/journey";

const MOVEMENTS = [
  ["I", "Looking"],
  ["II", "Others"],
  ["III", "Complication"],
  ["IV", "Time & Inheritance"],
  ["V", "Meaning"]
];

export default function HomeScreen({
  onOpenDay,
  onHome,
  onCalendar,
  totalDays,
  lastDayKey,
  completedDays,
  startedDays,
  favoriteDays
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
  const unfinishedCount = countUnfinished(startedDays, completedDays);
  const firstIncomplete = useMemo(
    () => getFirstIncompleteDay(completedDays),
    [completedDays]
  );

  return (
    <main className="homeShell">
      <section className="homeHero">
        <div className="homeNavRow">
          <span className="homeEdition">Project 365</span>
          <AppTabs
            active="home"
            onHome={onHome}
            onCalendar={onCalendar}
            favoriteCount={favoriteDays.length}
          />
        </div>

        <div className="homeTopline">
          <p className="eyebrow">A daily practice in attention</p>
          <span>Poem · Essay · Art · Reflection</span>
        </div>

        <div className="homeTitleGrid">
          <h1 className="homeTitle">365</h1>
          <div className="homeTitleSide">
            <span className="titleRule" aria-hidden="true" />
            <p>A year of poems, essays & art.</p>
          </div>
        </div>

        <p className="homeIntro">
          One question at a time. Read slowly, look closely, leave a thought
          behind, and let the year become a record of what you noticed.
        </p>

        <div className="homeActions">
          <button className="primaryButton" onClick={() => onOpenDay(continueDay)}>
            {continueDay === 1 ? "Begin with Day 1" : `Continue Day ${continueDay}`}
            <span aria-hidden="true">→</span>
          </button>

          {completedCount > 0 && completedCount < totalDays ? (
            <button className="secondaryButton" onClick={() => onOpenDay(firstIncomplete)}>
              Next unfinished day
            </button>
          ) : null}
        </div>

        <section className="homeProgress" aria-label="Completion progress">
          <div className="homeProgressTop">
            <div>
              <span>Your year</span>
              <strong>{completedCount} / {totalDays}</strong>
            </div>
            <p>
              {unfinishedCount > 0
                ? `${unfinishedCount} day${unfinishedCount === 1 ? "" : "s"} in progress`
                : completedCount === 0
                  ? "Ready when you are"
                  : "No unfinished days"}
            </p>
          </div>

          <div className="homeProgressTrack">
            <span style={{ width: `${progress}%` }} />
          </div>

          <button className="homeCalendarLink" type="button" onClick={onCalendar}>
            <span>Open calendar</span>
            <strong>{favoriteDays.length} favorite{favoriteDays.length === 1 ? "" : "s"}</strong>
            <span aria-hidden="true">↗</span>
          </button>
        </section>

        <div className="movementStrip" aria-label="Five movements">
          {MOVEMENTS.map(([roman, name], index) => (
            <div className="movement" key={roman}>
              <span>{roman}</span>
              <strong>{name}</strong>
              <i aria-hidden="true" className={index % 2 === 0 ? "maroon" : "green"} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
