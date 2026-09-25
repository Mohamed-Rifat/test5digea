"use client";

import { useEffect } from "react";

export const FINALE_PETALS = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37 + 7) % 100,
  delay: (i * 0.73) % 9,
  duration: 10 + ((i * 1.7) % 8),
  size: 5 + ((i * 5) % 9),
  drift: ((i % 5) - 2) * 28,
  kind: i % 3,
}));

export const HEART_COLORS = [
  "#e7c089",
  "#d9a363",
  "#f3d6a8",
  "#c68a72",
  "#f5e3c3",
];

const CONFETTI_COLORS = [
  "#e7c089",
  "#c9914f",
  "#f5e3c3",
  "#b27a3d",
  "#ffffff",
  "#d9a363",
];

const CONFETTI = Array.from({ length: 80 }, (_, i) => ({
  left: (i * 53 + 11) % 100,
  delay: ((i * 0.061) % 1.2).toFixed(2),
  duration: (2.6 + ((i * 0.37) % 2.2)).toFixed(2),
  drift: ((i % 7) - 3) * 45,
  spin: 360 + ((i * 97) % 540),
  w: 6 + (i % 4) * 2,
  h: i % 3 === 0 ? 6 + (i % 4) * 2 : 12 + (i % 3) * 3,
  round: i % 3 === 0,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

export function ConfettiBurst({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 5200);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="absolute -top-6 block"
          style={
            {
              left: `${c.left}%`,
              width: c.w,
              height: c.h,
              background: c.color,
              borderRadius: c.round ? "9999px" : "2px",
              animation: `confettiFall ${c.duration}s cubic-bezier(.25,.6,.4,1) ${c.delay}s both`,
              "--drift": `${c.drift}px`,
              "--spin": `${c.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
