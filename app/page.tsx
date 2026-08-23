import ContinueButton from "@/components/ContinueButton";

export default function Home() {
  return (
    <main className="homeShell">
      <section className="homeHero">
        <div className="eyebrow">A daily practice in attention</div>
        <h1>
          365
          <span>A year of poems, essays & art.</span>
        </h1>
        <p className="homeIntro">
          One question. One poem. One essay. One work of art.
          A few quiet minutes to notice the world differently.
        </p>
        <ContinueButton />
        <div className="homeMeta">
          <span>365 days</span>
          <span>5 movements</span>
          <span>1 unfolding arc</span>
        </div>
      </section>
    </main>
  );
}
