import { useState } from "react";

export default function DayNavigator({
  day,
  totalDays,
  onOpenDay,
  onHome
}) {
  const [jumpDay, setJumpDay] = useState(day);

  function submit(event) {
    event.preventDefault();
    const parsed = Number(jumpDay);

    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= totalDays) {
      onOpenDay(parsed);
    }
  }

  return (
    <nav className="dayNavigator" aria-label="Day navigation">
      <div>
        {day > 1 ? (
          <button
            className="navButton"
            onClick={() => onOpenDay(day - 1)}
          >
            <span aria-hidden="true">←</span>
            <span>Day {day - 1}</span>
          </button>
        ) : null}
      </div>

      <form className="jumpForm" onSubmit={submit}>
        <label className="srOnly" htmlFor="jump-day">
          Jump to a day
        </label>
        <input
          id="jump-day"
          type="number"
          inputMode="numeric"
          min="1"
          max={totalDays}
          value={jumpDay}
          onChange={(event) => setJumpDay(event.target.value)}
        />
        <button type="submit">Go</button>
      </form>

      <div className="navRight">
        {day < totalDays ? (
          <button
            className="navButton"
            onClick={() => onOpenDay(day + 1)}
          >
            <span>Day {day + 1}</span>
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button className="navButton" onClick={onHome}>
            <span>Home</span>
            <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
    </nav>
  );
}
