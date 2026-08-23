import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notFound">
      <p className="eyebrow">Outside the calendar</p>
      <h1>That day isn’t in the collection.</h1>
      <Link href="/day/1" className="primaryButton">
        Return to Day 1 <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
