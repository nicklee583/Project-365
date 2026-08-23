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

        <svg
          className="sourceButtonIcon"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M5 15L15 5" />
          <path d="M8 5H15V12" />
        </svg>
      </a>

      {source ? (
        <small className="sourceAttribution">Source: {source}</small>
      ) : null}
    </div>
  );
}
