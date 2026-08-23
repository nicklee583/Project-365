export function ArrowUpRightIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 15L15 5" />
      <path d="M8 5H15V12" />
    </svg>
  );
}

export function StarIcon({ className = "", filled = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3.2l2.63 5.33 5.88.86-4.25 4.14 1 5.85L12 16.62l-5.26 2.76 1-5.85-4.25-4.14 5.88-.86L12 3.2z"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}
