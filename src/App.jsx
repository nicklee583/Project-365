import { useEffect, useMemo, useState } from "react";
import HomeScreen from "./components/HomeScreen";
import DayScreen from "./components/DayScreen";
import { getDay, isValidDay, TOTAL_DAYS } from "./lib/content";

const LAST_DAY_KEY = "365:last-day";

function readDayFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const day = Number(params.get("day"));
  return isValidDay(day) ? day : null;
}

function updateUrl(day, { replace = false } = {}) {
  const url = new URL(window.location.href);

  if (day) {
    url.searchParams.set("day", String(day));
  } else {
    url.searchParams.delete("day");
  }

  const method = replace ? "replaceState" : "pushState";
  window.history[method]({ day: day || null }, "", url);
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState(() => readDayFromUrl());

  useEffect(() => {
    const onPopState = () => setSelectedDay(readDayFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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

  if (!content) {
    return (
      <HomeScreen
        onOpenDay={openDay}
        totalDays={TOTAL_DAYS}
        lastDayKey={LAST_DAY_KEY}
      />
    );
  }

  return (
    <DayScreen
      content={content}
      totalDays={TOTAL_DAYS}
      onOpenDay={openDay}
      onHome={goHome}
    />
  );
}
