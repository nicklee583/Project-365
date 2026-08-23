const FAVORITE_DAYS_KEY = "365:favorite-days";

function normalizeDays(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(
    value
      .map(Number)
      .filter((day) => Number.isInteger(day) && day >= 1 && day <= 365)
  )].sort((a, b) => a - b);
}

export function loadFavoriteDays() {
  try {
    const stored = window.localStorage.getItem(FAVORITE_DAYS_KEY);
    return normalizeDays(stored ? JSON.parse(stored) : []);
  } catch {
    return [];
  }
}

export function saveFavoriteDays(days) {
  const normalized = normalizeDays(days);
  window.localStorage.setItem(FAVORITE_DAYS_KEY, JSON.stringify(normalized));
  return normalized;
}

export function toggleFavoriteDay(days, day) {
  const current = new Set(normalizeDays(days));
  const target = Number(day);

  if (current.has(target)) current.delete(target);
  else current.add(target);

  return saveFavoriteDays([...current]);
}

export function isDayFavorite(days, day) {
  return normalizeDays(days).includes(Number(day));
}
