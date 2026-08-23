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
      ) : (
        <div className="artworkPreviewPlaceholder" aria-hidden="true">
          <span>ART</span>
          <div />
        </div>
      )}

      <h2>{art.title}</h2>
      <p className="creator">{art.artist_or_culture}</p>

      <p className="cardBody">
        Spend a minute with the image before reading anything about it.
        What do you notice first? What changes after you stay?
      </p>

      {!hasImage ? (
        <p className="imageStatus">
          Direct in-app image support is ready. This artwork still needs a
          vetted image URL before we display it here.
        </p>
      ) : null}

      <SourceLink href={art.source.url} source={art.source.name}>
        View the artwork
      </SourceLink>
    </article>
  );
}
