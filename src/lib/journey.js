const STARTED_DAYS_KEY = "365:started-days";
const REFLECTIONS_KEY = "365:reflections";

function normalizeDays(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(
    value
      .map(Number)
      .filter((day) => Number.isInteger(day) && day >= 1 && day <= 365)
  )].sort((a, b) => a - b);
}

export function loadStartedDays() {
  try {
    const stored = window.localStorage.getItem(STARTED_DAYS_KEY);
    return normalizeDays(stored ? JSON.parse(stored) : []);
  } catch {
    return [];
  }
}

export function markDayStarted(days, day) {
  const current = new Set(normalizeDays(days));
  current.add(Number(day));
  const next = normalizeDays([...current]);
  window.localStorage.setItem(STARTED_DAYS_KEY, JSON.stringify(next));
  return next;
}

export function removeStartedDay(days, day) {
  const next = normalizeDays(days).filter((item) => item !== Number(day));
  window.localStorage.setItem(STARTED_DAYS_KEY, JSON.stringify(next));
  return next;
}

export function isDayStarted(days, day) {
  return normalizeDays(days).includes(Number(day));
}

export function loadReflections() {
  try {
    const stored = window.localStorage.getItem(REFLECTIONS_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveReflection(reflections, day, text) {
  const next = { ...reflections };
  const value = String(text ?? "");

  if (value.trim()) next[String(day)] = value;
  else delete next[String(day)];

  window.localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(next));
  return next;
}

export function getReflection(reflections, day) {
  return reflections?.[String(day)] || "";
}

export function removeReflection(reflections, day) {
  const next = { ...reflections };
  delete next[String(day)];
  window.localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(next));
  return next;
}

export function countUnfinished(startedDays, completedDays) {
  const completed = new Set(normalizeDays(completedDays));
  return normalizeDays(startedDays).filter((day) => !completed.has(day)).length;
}
