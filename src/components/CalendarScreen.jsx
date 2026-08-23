import { useMemo, useState } from "react";
import AppTabs from "./AppTabs";
import { StarIcon } from "./Icons";
import { getAllDays } from "../lib/content";

const FILTERS = [
  ["all", "All days"],
  ["favorites", "Favorites"],
  ["completed", "Completed"],
  ["progress", "In progress"]
];

export default function CalendarScreen({
  completedDays,
  startedDays,
  favoriteDays,
  onOpenDay,
  onHome,
  onCalendar
}) {
  const [filter, setFilter] = useState("all");
  const allDays = getAllDays();

  const completed = useMemo(() => new Set(completedDays), [completedDays]);
  const started = useMemo(() => new Set(startedDays), [startedDays]);
  const favorites = useMemo(() => new Set(favoriteDays), [favoriteDays]);

  const movements = useMemo(() => {
    const grouped = new Map();

    for (const entry of allDays) {
      const label = entry.part.label;
      if (!grouped.has(label)) {
        grouped.set(label, {
          label,
          code: entry.part.code,
          name: entry.part.name,
          ordinal: entry.part.ordinal,
          days: []
        });
      }
      grouped.get(label).days.push(entry);
    }

    return [...grouped.values()].sort((a, b) => a.ordinal - b.ordinal);
  }, [allDays]);

  function matches(entry) {
    if (filter === "favorites") return favorites.has(entry.day);
    if (filter === "completed") return completed.has(entry.day);
    if (filter === "progress") return started.has(entry.day) && !completed.has(entry.day);
    return true;
  }

  const visibleCount = allDays.filter(matches).length;

  return (
    <main className="calendarShell">
      <header className="calendarHeader">
        <div className="calendarBrandRow">
          <button className="wordmark calendarWordmark" onClick={onHome} aria-label="365 home">
            365
          </button>
          <AppTabs
            active="calendar"
            onHome={onHome}
            onCalendar={onCalendar}
            favoriteCount={favoriteDays.length}
          />
        </div>

        <div className="calendarHero">
          <p className="eyebrow">Your year at a glance</p>
          <h1>Calendar</h1>
          <p>
            Return to what mattered. Completed days, unfinished thoughts, and the
            poem–essay–art combinations you chose to keep.
          </p>
        </div>

        <div className="calendarStats">
          <div><strong>{completedDays.length}</strong><span>Completed</span></div>
          <div><strong>{startedDays.filter((day) => !completed.has(day)).length}</strong><span>In progress</span></div>
          <div><strong>{favoriteDays.length}</strong><span>Favorites</span></div>
        </div>
      </header>

      <section className="calendarControls" aria-label="Calendar filters">
        <div className="calendarFilterRow">
          {FILTERS.map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p>{visibleCount} {visibleCount === 1 ? "day" : "days"} shown</p>
      </section>

      <div className="calendarLegend" aria-label="Calendar legend">
        <span><i className="legendComplete" />Completed</span>
        <span><i className="legendProgress" />In progress</span>
        <span><StarIcon className="legendFavoriteIcon" filled />Favorite</span>
      </div>

      <section className="movementCalendars">
        {movements.map((movement) => {
          const visibleDays = movement.days.filter(matches);
          if (visibleDays.length === 0) return null;

          return (
            <article className="movementCalendar" key={movement.label}>
              <header>
                <span>{movement.code}</span>
                <div>
                  <p>Movement {movement.ordinal}</p>
                  <h2>{movement.name}</h2>
                </div>
              </header>

              <div className="dayGrid">
                {visibleDays.map((entry) => {
                  const isComplete = completed.has(entry.day);
                  const isStarted = started.has(entry.day);
                  const isFavorite = favorites.has(entry.day);
                  const stateClass = isComplete
                    ? "isComplete"
                    : isStarted
                      ? "isProgress"
                      : "";

                  return (
                    <button
                      type="button"
                      key={entry.day}
                      className={`calendarDay ${stateClass} ${isFavorite ? "isFavorite" : ""}`}
                      onClick={() => onOpenDay(entry.day)}
                      title={`Day ${entry.day}: ${entry.theme.motif}`}
                      aria-label={`Open Day ${entry.day}, ${entry.theme.motif}${isFavorite ? ", favorite" : ""}`}
                    >
                      <span className="calendarDayNumber">{entry.day}</span>
                      <span className="calendarDayMotif">{entry.theme.motif}</span>
                      {isFavorite ? <StarIcon className="calendarStar" filled /> : null}
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}

        {visibleCount === 0 ? (
          <div className="calendarEmpty">
            <StarIcon className="calendarEmptyStar" />
            <h2>Nothing here yet.</h2>
            <p>Favorite or complete a day and it will appear in this view.</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
