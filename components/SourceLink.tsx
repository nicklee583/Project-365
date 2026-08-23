export default function SourceLink({
  href,
  source,
  label = "Open source"
}: {
  href: string;
  source?: string;
  label?: string;
}) {
  return (
    <a className="sourceLink" href={href} target="_blank" rel="noreferrer">
      <span>{label}</span>
      {source ? <small>{source}</small> : null}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
