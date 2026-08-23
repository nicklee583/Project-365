import dataset from "@/data/daily_content.json";

export type DayContent = (typeof dataset.days)[number];

const days = dataset.days as DayContent[];

export const TOTAL_DAYS = days.length;

export function getAllDays(): DayContent[] {
  return days;
}

export function getDay(day: number): DayContent | undefined {
  return days.find((entry) => entry.day === day);
}

export function isValidDay(day: number): boolean {
  return Number.isInteger(day) && day >= 1 && day <= TOTAL_DAYS;
}

export function getDatasetMeta() {
  return {
    schemaVersion: dataset.schema_version,
    dataset: dataset.dataset,
    counts: dataset.counts
  };
}
