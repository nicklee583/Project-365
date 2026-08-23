import { useEffect } from "react";
import ArtworkCard from "./ArtworkCard";
import CompletionPanel from "./CompletionPanel";
import DayNavigator from "./DayNavigator";
import MediaCard from "./MediaCard";
import ReflectionPanel from "./ReflectionPanel";

export default function DayScreen({
  content,
  totalDays,
  onOpenDay,
  onHome,
  completed,
  started,
  completedCount,
  reflection,
  onReflectionChange,
  onBegin,
  onResetDay,
  onToggleComplete
}) {
  useEffect(() => {
    document.title = `Day ${content.day} — ${content.theme.motif} · 365`;
  }, [content]);

  const yearProgress = (content.day / totalDays) * 100;
  const partDay = content.day - (content.part.ordinal - 1) * 73;
  const partProgress = (partDay / 73) * 100;

  const poemDetails = [
    content.poem.form,
    content.poem.date_era,
    content.poem.tradition_region
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="dayShell">
      <header className="dayHeader">
        <button className="wordmark" onClick={onHome} aria-label="365 home">
          365
        </button>

        <div className="headerStatus">
          {completed ? (
            <span className="completePill">Completed</span>
          ) : started ? (
            <span className="progressPill">In progress</span>
          ) : null}
          <div className="headerDay">
            Day {content.day} / {totalDays}
          </div>
        </div>

        <div className="yearProgress" aria-hidden="true">
          <span style={{ width: `${yearProgress}%` }} />
        </div>
      </header>

      <section className="dayIntro">
        <aside className="partMarker" aria-hidden="true">
          <span>{content.part.code}</span>
          <i />
        </aside>

        <div className="dayIntroContent">
          <div className="partLabel">
            <span>{content.part.code}</span>
            <span>{content.part.name}</span>
          </div>

          <div className="partProgress" aria-hidden="true">
            <span style={{ width: `${partProgress}%` }} />
          </div>

          <p className="motif">{content.theme.motif}</p>
          <h1>{content.theme.guiding_question}</h1>
          <p className="family">{content.theme.family}</p>
        </div>
      </section>

      <section className="contentStack">
        <MediaCard
          index={1}
          variant="poem"
          kicker={`Poem · ${content.poem.read_min} min`}
          title={content.poem.title}
          creator={content.poem.poet}
          details={poemDetails}
          href={content.poem.source.url}
          source={content.poem.source.name}
          linkLabel="Read the poem"
        />

        <MediaCard
          index={2}
          variant="essay"
          kicker={`Essay · ${content.essay.read_min} min`}
          title={content.essay.title}
          creator={content.essay.author}
          body={content.essay.relationship_to_poem}
          href={content.essay.source.url}
          source={content.essay.source.name}
          linkLabel="Read the essay"
        />

        <ArtworkCard art={content.art} />
      </section>

      <ReflectionPanel
        day={content.day}
        question={content.theme.guiding_question}
        value={reflection}
        completed={completed}
        onChange={onReflectionChange}
        onBegin={onBegin}
        onReset={onResetDay}
      />

      <section className="closingPrompt">
        <div className="closingRule" />
        <p>Carry the question with you.</p>
        <blockquote>{content.theme.guiding_question}</blockquote>
      </section>

      <CompletionPanel
        day={content.day}
        completed={completed}
        completedCount={completedCount}
        totalDays={totalDays}
        onToggle={onToggleComplete}
      />

      <DayNavigator
        day={content.day}
        totalDays={totalDays}
        onOpenDay={onOpenDay}
        onHome={onHome}
      />

      <footer className="dayFooter">
        <span>{content.part.label}</span>
        <span>Day {content.day}</span>
      </footer>
    </main>
  );
}
