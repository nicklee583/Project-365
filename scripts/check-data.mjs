import fs from "node:fs";

const path = new URL("../src/data/daily_content.json", import.meta.url);
const payload = JSON.parse(fs.readFileSync(path, "utf8"));
const days = payload.days || [];

const failures = [];

if (days.length !== 365) failures.push(`Expected 365 days, found ${days.length}.`);

for (let i = 0; i < days.length; i += 1) {
  const expected = i + 1;
  const entry = days[i];

  if (entry.day !== expected) {
    failures.push(`Expected day ${expected}, found ${entry.day}.`);
  }

  const required = [
    entry?.theme?.motif,
    entry?.theme?.guiding_question,
    entry?.poem?.title,
    entry?.poem?.poet,
    entry?.poem?.source?.url,
    entry?.essay?.title,
    entry?.essay?.author,
    entry?.essay?.source?.url,
    entry?.art?.title,
    entry?.art?.artist_or_culture,
    entry?.art?.source?.url
  ];

  if (required.some((value) => !String(value || "").trim())) {
    failures.push(`Day ${entry.day} has a missing core field.`);
  }

  if (
    entry?.art?.image_url &&
    !/^https?:\/\//i.test(String(entry.art.image_url))
  ) {
    failures.push(`Day ${entry.day} has an invalid art image_url.`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Data QA passed: 365 complete sequential days.");
