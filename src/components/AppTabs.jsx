export default function AppTabs({
  active,
  onHome,
  onCalendar,
  favoriteCount = 0
}) {
  return (
    <nav className="appTabs" aria-label="Primary navigation">
      <button
        type="button"
        className={active === "home" || active === "day" ? "active" : ""}
        onClick={onHome}
        aria-current={active === "home" || active === "day" ? "page" : undefined}
      >
        <span>Daily</span>
      </button>

      <button
        type="button"
        className={active === "calendar" ? "active" : ""}
        onClick={onCalendar}
        aria-current={active === "calendar" ? "page" : undefined}
      >
        <span>Calendar</span>
        {favoriteCount > 0 ? <small>{favoriteCount} ★</small> : null}
      </button>
    </nav>
  );
}
