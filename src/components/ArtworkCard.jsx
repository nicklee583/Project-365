import SourceLink from "./SourceLink";

export default function ArtworkCard({ art }) {
  const hasImage = Boolean(art.image_url);

  return (
    <article className="mediaCard artworkCard">
      <div className="cardIndex">03</div>
      <div className="cardKicker">Artwork</div>

      {hasImage ? (
        <figure className="artworkFigure">
          <img
            className="artworkImage"
            src={art.image_url}
            alt={`${art.title} by ${art.artist_or_culture}`}
            loading="lazy"
          />
        </figure>
      ) : null}

      <h2>{art.title}</h2>
      <p className="creator">{art.artist_or_culture}</p>

      <p className="cardBody artPrompt">
        Spend a minute with the work before reading anything about it. Notice
        where your eye lands first, then what changes after you stay.
      </p>

      <SourceLink href={art.source.url} source={art.source.name}>
        View the artwork
      </SourceLink>
    </article>
  );
}
