import DayNavigator from "@/components/DayNavigator";
import RememberDay from "@/components/RememberDay";
import SourceLink from "@/components/SourceLink";
import { getDay, TOTAL_DAYS } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ day: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { day: dayParam } = await params;
  const day = Number(dayParam);
  const content = getDay(day);

  if (!content) return { title: "Day not found" };

  return {
    title: `Day ${content.day} — ${content.theme.motif}`,
    description: content.theme.guiding_question
  };
}

export function generateStaticParams() {
  return Array.from({ length: TOTAL_DAYS }, (_, index) => ({
    day: String(index + 1)
  }));
}

export default async function DayPage({ params }: PageProps) {
  const { day: dayParam } = await params;
  const day = Number(dayParam);
  const content = getDay(day);

  if (!content) notFound();

  const partProgress =
    ((content.day - (content.part.ordinal - 1) * 73) / 73) * 100;
  const yearProgress = (content.day / TOTAL_DAYS) * 100;

  return (
    <main className="dayShell">
      <RememberDay day={content.day} />

      <header className="dayHeader">
        <Link href="/" className="wordmark" aria-label="365 home">
          365
        </Link>
        <div className="headerDay">Day {content.day} / {TOTAL_DAYS}</div>
        <div className="yearProgress" aria-label={`${Math.round(yearProgress)}% through the year`}>
          <span style={{ width: `${yearProgress}%` }} />
        </div>
      </header>

      <section className="dayIntro">
        <div className="partLabel">
          <span>{content.part.code}</span>
          <span>{content.part.name}</span>
        </div>
        <div className="partProgress">
          <span style={{ width: `${partProgress}%` }} />
        </div>

        <p className="motif">{content.theme.motif}</p>
        <h1>{content.theme.guiding_question}</h1>
        <p className="family">{content.theme.family}</p>
      </section>

      <div className="contentStack">
        <article className="mediaCard poemCard">
          <div className="cardIndex">01</div>
          <div className="cardKicker">Poem · {content.poem.read_min} min</div>
          <h2>{content.poem.title}</h2>
          <p className="creator">{content.poem.poet}</p>
          <p className="detailLine">
            {[content.poem.form, content.poem.date_era, content.poem.tradition_region]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <SourceLink
            href={content.poem.source.url}
            source={content.poem.source.name}
            label="Read the poem"
          />
        </article>

        <article className="mediaCard essayCard">
          <div className="cardIndex">02</div>
          <div className="cardKicker">Essay · {content.essay.read_min} min</div>
          <h2>{content.essay.title}</h2>
          <p className="creator">{content.essay.author}</p>
          <p className="relationship">{content.essay.relationship_to_poem}</p>
          <SourceLink
            href={content.essay.source.url}
            source={content.essay.source.name}
            label="Read the essay"
          />
        </article>

        <article className="mediaCard artCard">
          <div className="cardIndex">03</div>
          <div className="cardKicker">Artwork</div>
          <h2>{content.art.title}</h2>
          <p className="creator">{content.art.artist_or_culture}</p>
          <p className="artPrompt">
            Spend a minute with the image before reading anything about it.
            What do you notice first? What changes after you stay?
          </p>
          <SourceLink
            href={content.art.source.url}
            source={content.art.source.name}
            label="View the artwork"
          />
        </article>
      </div>

      <section className="closingPrompt">
        <div className="closingRule" />
        <p>Carry the question with you.</p>
        <blockquote>{content.theme.guiding_question}</blockquote>
      </section>

      <DayNavigator day={content.day} totalDays={TOTAL_DAYS} />

      <footer className="dayFooter">
        <span>{content.part.label}</span>
        <span>Day {content.day}</span>
      </footer>
    </main>
  );
}
