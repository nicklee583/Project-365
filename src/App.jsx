import { useEffect, useMemo, useState } from "react";
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

const LAST_DAY_KEY = "365:last-day";

function readDayFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const day = Number(params.get("day"));
  return isValidDay(day) ? day : null;
}

function updateUrl(day, { replace = false } = {}) {
  const url = new URL(window.location.href);

  if (day) url.searchParams.set("day", String(day));
  else url.searchParams.delete("day");

  const method = replace ? "replaceState" : "pushState";
  window.history[method]({ day: day || null }, "", url);
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState(() => readDayFromUrl());
  const [completedDays, setCompletedDays] = useState(() => loadCompletedDays());
  const [startedDays, setStartedDays] = useState(() => loadStartedDays());
  const [reflections, setReflections] = useState(() => loadReflections());

  useEffect(() => {
    const onPopState = () => setSelectedDay(readDayFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!selectedDay) return;
    setStartedDays((current) => markDayStarted(current, selectedDay));
  }, [selectedDay]);

  const content = useMemo(
    () => (selectedDay ? getDay(selectedDay) : null),
    [selectedDay]
  );

  function openDay(day, options = {}) {
    if (!isValidDay(day)) return;
    window.localStorage.setItem(LAST_DAY_KEY, String(day));
    updateUrl(day, options);
    setSelectedDay(Number(day));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goHome() {
    updateUrl(null);
    setSelectedDay(null);
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

  if (!content) {
    return (
      <HomeScreen
        onOpenDay={openDay}
        totalDays={TOTAL_DAYS}
        lastDayKey={LAST_DAY_KEY}
        completedDays={completedDays}
        startedDays={startedDays}
      />
    );
  }

  return (
    <DayScreen
      content={content}
      totalDays={TOTAL_DAYS}
      onOpenDay={openDay}
      onHome={goHome}
      completed={isDayComplete(completedDays, content.day)}
      started={isDayStarted(startedDays, content.day)}
      completedCount={completedDays.length}
      reflection={getReflection(reflections, content.day)}
      onReflectionChange={(text) => updateReflection(content.day, text)}
      onBegin={() => beginDay(content.day)}
      onResetDay={() => resetDay(content.day)}
      onToggleComplete={() => toggleComplete(content.day)}
    />
  );
}
