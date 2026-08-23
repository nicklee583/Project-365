import dataset from "../data/daily_content.json";

export const TOTAL_DAYS = dataset.days.length;
export const DATASET_META = {
  schemaVersion: dataset.schema_version,
  name: dataset.dataset,
  counts: dataset.counts
};

export function getAllDays() {
  return dataset.days;
}

export function getDay(dayNumber) {
  return dataset.days.find((entry) => entry.day === Number(dayNumber));
}

export function isValidDay(dayNumber) {
  const day = Number(dayNumber);
  return Number.isInteger(day) && day >= 1 && day <= TOTAL_DAYS;
}
