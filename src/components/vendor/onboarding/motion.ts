import type { CSSProperties } from "react";

/**
 * Stagger helper for the `.onb-*` animations in globals.css.
 * Usage: <div className="onb-rise" style={delay(120)} />
 */
export const delay = (ms: number): CSSProperties =>
  ({ "--onb-delay": `${ms}ms` }) as CSSProperties;
