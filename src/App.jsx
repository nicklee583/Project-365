import { useEffect, useMemo, useState } from "react";
import CalendarScreen from "./components/CalendarScreen";
import HomeScreen from "./components/HomeScreen";
import DayScreen from "./components/DayScreen";
import { getDay, isValidDay, TOTAL_DAYS } from "./lib/content";
import {
  isDayComplete,
  loadCompletedDays,
  removeCompletedDay,
  toggleCompletedDay
} from "./lib/progress";
import {
  getReflection,
  isDayStarted,
  loadReflections,
  loadStartedDays,
  markDayStarted,
  removeReflection,
  removeStartedDay,
  saveReflection
} from "./lib/journey";
import {
  isDayFavorite,
  loadFavoriteDays,
  toggleFavoriteDay
} from "./lib/favorites";

const LAST_DAY_KEY = "365:last-day";

function readLocation() {
  const params = new URLSearchParams(window.location.search);
  const day = Number(params.get("day"));
  const view = params.get("view");

  if (isValidDay(day)) return { view: "day", day };
  if (view === "calendar") return { view: "calendar", day: null };
  return { view: "home", day: null };
}

function updateUrl(next, { replace = false } = {}) {
  const url = new URL(window.location.href);
  url.searchParams.delete("day");
  url.searchParams.delete("view");

  if (next.view === "day") url.searchParams.set("day", String(next.day));
  if (next.view === "calendar") url.searchParams.set("view", "calendar");

  const method = replace ? "replaceState" : "pushState";
  window.history[method](next, "", url);
}

export default function App() {
  const [location, setLocation] = useState(() => readLocation());
  const [completedDays, setCompletedDays] = useState(() => loadCompletedDays());
  const [startedDays, setStartedDays] = useState(() => loadStartedDays());
  const [reflections, setReflections] = useState(() => loadReflections());
  const [favoriteDays, setFavoriteDays] = useState(() => loadFavoriteDays());

  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (location.view !== "day" || !location.day) return;
    setStartedDays((current) => markDayStarted(current, location.day));
  }, [location]);

  const content = useMemo(
    () => (location.view === "day" ? getDay(location.day) : null),
    [location]
  );

  function openDay(day, options = {}) {
    if (!isValidDay(day)) return;
    window.localStorage.setItem(LAST_DAY_KEY, String(day));
    const next = { view: "day", day: Number(day) };
    updateUrl(next, options);
    setLocation(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goHome() {
    const next = { view: "home", day: null };
    updateUrl(next);
    setLocation(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCalendar() {
    const next = { view: "calendar", day: null };
    updateUrl(next);
    setLocation(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleComplete(day) {
    setCompletedDays((current) => toggleCompletedDay(current, Number(day)));
    setStartedDays((current) => markDayStarted(current, Number(day)));
  }

  function beginDay(day) {
    setStartedDays((current) => markDayStarted(current, Number(day)));
  }

  function updateReflection(day, text) {
    setReflections((current) => saveReflection(current, Number(day), text));
    beginDay(day);
  }

  function resetDay(day) {
    const target = Number(day);
    setReflections((current) => removeReflection(current, target));
    setCompletedDays((current) => removeCompletedDay(current, target));
    setStartedDays((current) => removeStartedDay(current, target));
  }

  function toggleFavorite(day) {
    setFavoriteDays((current) => toggleFavoriteDay(current, Number(day)));
  }

  if (location.view === "calendar") {
    return (
      <CalendarScreen
        completedDays={completedDays}
        startedDays={startedDays}
        favoriteDays={favoriteDays}
        onOpenDay={openDay}
        onHome={goHome}
        onCalendar={openCalendar}
      />
    );
  }

  if (!content) {
    return (
      <HomeScreen
        onOpenDay={openDay}
        onHome={goHome}
        onCalendar={openCalendar}
        totalDays={TOTAL_DAYS}
        lastDayKey={LAST_DAY_KEY}
        completedDays={completedDays}
        startedDays={startedDays}
        favoriteDays={favoriteDays}
      />
    );
  }

  return (
    <DayScreen
      content={content}
      totalDays={TOTAL_DAYS}
      onOpenDay={openDay}
      onHome={goHome}
      onCalendar={openCalendar}
      completed={isDayComplete(completedDays, content.day)}
      started={isDayStarted(startedDays, content.day)}
      favorite={isDayFavorite(favoriteDays, content.day)}
      favoriteCount={favoriteDays.length}
      completedCount={completedDays.length}
      reflection={getReflection(reflections, content.day)}
      onReflectionChange={(text) => updateReflection(content.day, text)}
      onBegin={() => beginDay(content.day)}
      onResetDay={() => resetDay(content.day)}
      onToggleComplete={() => toggleComplete(content.day)}
      onToggleFavorite={() => toggleFavorite(content.day)}
    />
  );
}
