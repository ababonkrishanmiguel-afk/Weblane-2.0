import { useEffect, useState } from "react";

export default function RotatingText({ items, interval = 1800 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items?.length) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval, items]);

  if (!items?.length) return null;

  return (
    <span className="rotating-text" aria-live="polite">
      <span key={items[index]}>{items[index]}</span>
    </span>
  );
}
