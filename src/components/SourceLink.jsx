export default function SourceLink({ href, source, children }) {
  return (
    <a
      className="sourceLink"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      <span>{children}</span>
      <small>{source}</small>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
