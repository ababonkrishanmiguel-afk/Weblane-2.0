export default function ScrollVelocity({ text }) {
  const content = Array.from({ length: 6 }, (_, index) => (
    <span key={index}>
      {text}
      <i aria-hidden="true">•</i>
    </span>
  ));

  return (
    <div className="scroll-velocity" aria-label={text}>
      <div className="scroll-velocity-track">{content}</div>
      <div className="scroll-velocity-track" aria-hidden="true">{content}</div>
    </div>
  );
}
