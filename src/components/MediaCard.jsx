import SourceLink from "./SourceLink";

export default function MediaCard({
  index,
  kicker,
  title,
  creator,
  details,
  body,
  href,
  source,
  linkLabel
}) {
  return (
    <article className="mediaCard">
      <div className="cardIndex">{String(index).padStart(2, "0")}</div>
      <div className="cardKicker">{kicker}</div>

      <h2>{title}</h2>
      <p className="creator">{creator}</p>

      {details ? <p className="detailLine">{details}</p> : null}
      {body ? <p className="cardBody">{body}</p> : null}

      <SourceLink href={href} source={source}>
        {linkLabel}
      </SourceLink>
    </article>
  );
}
