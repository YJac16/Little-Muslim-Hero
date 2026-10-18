"use client";

import type { CSSProperties } from "react";

const COLORS = ["#ffd36b", "#6ec6ff", "#ffb4a2", "#8fe39a", "#ffffff"];

function Star() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden>
      <path
        d="M12 2.2l2.9 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17l-6 3.3 1.3-6.6L2.4 9.1l6.7-.8L12 2.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function Crescent() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden>
      <path
        d="M16.5 3.2a9.2 9.2 0 1 0 4.3 15.9A8 8 0 0 1 16.5 3.2z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Celebration of stars and crescents. Pure CSS (no deps, no assets).
 * "burst" shoots outward from the centre; "fall" rains down for the end screen.
 */
export function Burst({
  mode = "burst",
  count = 18,
}: {
  mode?: "burst" | "fall";
  count?: number;
}) {
  const items = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.2;
    const dist = 110 + ((i * 37) % 110);
    return {
      key: i,
      crescent: i % 4 === 3,
      color: COLORS[i % COLORS.length],
      size: 24 + ((i * 7) % 24),
      style: {
        "--dx": `${Math.cos(angle) * dist}px`,
        "--dy": `${Math.sin(angle) * dist - 20}px`,
        "--rot": `${(i % 2 ? 1 : -1) * (120 + ((i * 53) % 220))}deg`,
        "--delay": `${(i % 6) * 40}ms`,
        "--left": `${4 + ((i * 29) % 92)}%`,
        "--fall-dur": `${3.2 + ((i * 13) % 20) / 10}s`,
        "--fall-delay": `${((i * 31) % 30) / 10}s`,
      } as CSSProperties,
    };
  });

  return (
    <div
      className={`burst burst-${mode} pointer-events-none absolute inset-0 overflow-hidden`}
      aria-hidden
    >
      {items.map((it) => (
        <span
          key={it.key}
          className="burst-piece"
          style={{
            ...it.style,
            width: it.size,
            height: it.size,
            color: it.color,
          }}
        >
          {it.crescent ? <Crescent /> : <Star />}
        </span>
      ))}
    </div>
  );
}
