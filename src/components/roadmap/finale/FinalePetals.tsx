"use client";

import { Heart } from "lucide-react";
import {
  FINALE_PETALS,
  HEART_COLORS,
} from "@/components/roadmap/finale/finaleEffects";

/** Floating petals behind the envelope. */
export function FinalePetals() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {FINALE_PETALS.map((p, i) => (
        <span
          key={i}
          className="absolute -top-10 block"
          style={
            {
              left: `${p.left}%`,
              animation: `heartFall ${p.duration}s linear ${p.delay}s infinite`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        >
          <Heart
            fill={HEART_COLORS[i % HEART_COLORS.length]}
            strokeWidth={0}
            style={{
              width: 10 + p.size,
              height: 10 + p.size,
              opacity: p.kind === 2 ? 0.3 : 0.65,
              filter:
                p.kind === 2
                  ? "blur(1.5px)"
                  : "drop-shadow(0 0 6px rgba(231,192,137,0.45))",
            }}
          />
        </span>
      ))}
    </div>
  );
}
