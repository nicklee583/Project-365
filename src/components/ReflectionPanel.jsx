import { useEffect, useRef, useState } from "react";

export default function ReflectionPanel({
  day,
  question,
  value,
  completed,
  onChange,
  onBegin,
  onReset
}) {
  const [saved, setSaved] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    setSaved(true);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [day]);

  function handleChange(event) {
    const next = event.target.value;
    onBegin();
    onChange(next);
    setSaved(false);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setSaved(true), 500);
  }

  function handleReset() {
    const hasWriting = Boolean(value.trim());
    const message = hasWriting
      ? `Reset Day ${day}? This will permanently delete this day’s saved reflection and clear its in-progress state.`
      : `Reset Day ${day}? This will clear its in-progress state.`;

    if (window.confirm(message)) onReset();
  }

  return (
    <section className="reflectionPanel">
      <div className="reflectionOrnament" aria-hidden="true">
        <span />
        <strong>IV</strong>
        <span />
      </div>

      <div className="reflectionHeader">
        <div>
          <p className="eyebrow reflectionEyebrow">Daily reflection</p>
          <h2>What are you taking with you?</h2>
        </div>
        <span className={`saveStatus ${saved ? "saved" : "saving"}`}>
          {saved ? "Saved on this device" : "Saving…"}
        </span>
      </div>

      <p className="reflectionPrompt">{question}</p>

      <label className="srOnly" htmlFor={`reflection-${day}`}>
        Your private reflection for Day {day}
      </label>
      <textarea
        id={`reflection-${day}`}
        className="reflectionTextarea"
        value={value}
        onChange={handleChange}
        placeholder="Write a sentence, a paragraph, or simply a phrase you want to remember…"
        rows={7}
      />

      <div className="reflectionFooter">
        <p>Private to this browser for now. Nothing is sent anywhere.</p>
        {!completed ? (
          <button className="resetDayButton" type="button" onClick={handleReset}>
            Reset this day
          </button>
        ) : null}
      </div>
    </section>
  );
}
