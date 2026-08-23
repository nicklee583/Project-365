"use client";

import { useEffect } from "react";

const LAST_DAY_KEY = "365:last-day";

export default function RememberDay({ day }: { day: number }) {
  useEffect(() => {
    window.localStorage.setItem(LAST_DAY_KEY, String(day));
  }, [day]);

  return null;
}
