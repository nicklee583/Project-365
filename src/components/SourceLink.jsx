export default function SourceLink({ href, source, children }) {
  return (
    <div className="sourceAction">
      <a
        className="sourceButton"
        href={href}
        target="_blank"
        rel="noreferrer noopener"
      >
        <span>{children}</span>
        <span className="sourceButtonIcon" aria-hidden="true">↗</span>
      </a>

      {source ? (
        <small className="sourceAttribution">Source: {source}</small>
      ) : null}
    </div>
  );
}
