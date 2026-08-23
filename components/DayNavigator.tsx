"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function DayNavigator({
  day,
  totalDays
}: {
  day: number;
  totalDays: number;
}) {
  const router = useRouter();
  const [jumpDay, setJumpDay] = useState(String(day));

  function jump(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(jumpDay);
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= totalDays) {
      router.push(`/day/${parsed}`);
    }
  }

  return (
    <nav className="dayNavigator" aria-label="Day navigation">
      <div className="navEdge">
        {day > 1 ? (
          <Link href={`/day/${day - 1}`} className="navLink">
            <span aria-hidden="true">←</span>
            <span>Day {day - 1}</span>
          </Link>
        ) : (
          <span />
        )}
      </div>

      <form className="jumpForm" onSubmit={jump}>
        <label className="srOnly" htmlFor="jump-day">
          Jump to a day
        </label>
        <input
          id="jump-day"
          inputMode="numeric"
          min={1}
          max={totalDays}
          type="number"
          value={jumpDay}
          onChange={(event) => setJumpDay(event.target.value)}
        />
        <button type="submit">Go</button>
      </form>

      <div className="navEdge navEdgeRight">
        {day < totalDays ? (
          <Link href={`/day/${day + 1}`} className="navLink">
            <span>Day {day + 1}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link href="/" className="navLink">
            <span>Home</span>
            <span aria-hidden="true">↗</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
