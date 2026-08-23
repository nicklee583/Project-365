export default function AppTabs({ active, onHome, onCalendar, favoriteCount = 0 }) {
  return (
    <nav className="appTabs" aria-label="Primary navigation">
      <button
        type="button"
        className={active === "home" ? "active" : ""}
        onClick={onHome}
      >
        <span>Daily</span>
      </button>
      <button
        type="button"
        className={active === "calendar" ? "active" : ""}
        onClick={onCalendar}
      >
        <span>Calendar</span>
        {favoriteCount > 0 ? <small>{favoriteCount} ★</small> : null}
      </button>
    </nav>
  );
}
