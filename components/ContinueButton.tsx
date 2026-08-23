"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LAST_DAY_KEY = "365:last-day";

export default function ContinueButton() {
  const [day, setDay] = useState(1);

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(LAST_DAY_KEY));
    if (Number.isInteger(saved) && saved >= 1 && saved <= 365) {
      setDay(saved);
    }
  }, []);

  return (
    <Link className="primaryButton" href={`/day/${day}`}>
      {day === 1 ? "Begin with Day 1" : `Continue with Day ${day}`}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
