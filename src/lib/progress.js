const COMPLETED_DAYS_KEY = "365:completed-days";

function normalizeDays(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(
    value
      .map(Number)
      .filter((day) => Number.isInteger(day) && day >= 1 && day <= 365)
  )].sort((a, b) => a - b);
}

export function loadCompletedDays() {
  try {
    const stored = window.localStorage.getItem(COMPLETED_DAYS_KEY);
    return normalizeDays(stored ? JSON.parse(stored) : []);
  } catch {
    return [];
  }
}

export function saveCompletedDays(days) {
  const normalized = normalizeDays(days);
  window.localStorage.setItem(COMPLETED_DAYS_KEY, JSON.stringify(normalized));
  return normalized;
}

export function toggleCompletedDay(days, day) {
  const current = new Set(normalizeDays(days));

  if (current.has(day)) current.delete(day);
  else current.add(day);

  return saveCompletedDays([...current]);
}

export function isDayComplete(days, day) {
  return normalizeDays(days).includes(Number(day));
}

export function getFirstIncompleteDay(days) {
  const complete = new Set(normalizeDays(days));

  for (let day = 1; day <= 365; day += 1) {
    if (!complete.has(day)) return day;
  }

  return 365;
}
