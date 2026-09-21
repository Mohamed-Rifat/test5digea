"use client";

import { useLanguage } from "@/context/LanguageContext";

type Loader5DigeaProps = {
  label?: string;
};

export default function Loader5Digea({ label }: Loader5DigeaProps) {
  const { t } = useLanguage();

  return (
    <div className="loader5digea" role="status" aria-label={label ?? t("common.loading")}>
      <div className="loader5d-hearts" aria-hidden="true">
        <span className="heart h1">♥</span>
        <span className="heart h2">♥</span>
        <span className="heart h3">♥</span>
        <span className="heart h4">♥</span>
        <span className="heart h5">♥</span>
        <span className="heart h6">♥</span>
      </div>

      <div className="loader5d-word" aria-hidden="true">
        <svg viewBox="0 0 440 150" className="loader5d-word-svg">
          <defs>
            <linearGradient id="wordGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#9d5c64" />
              <stop offset="30%"  stopColor="#cf848a" />
              <stop offset="50%"  stopColor="#f2b5bd" />
              <stop offset="70%"  stopColor="#d4a574" />
              <stop offset="100%" stopColor="#9d5c64" />
            </linearGradient>
            <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#ffffff" />
              <stop offset="40%"  stopColor="#fbe8ec" />
              <stop offset="70%"  stopColor="#f2b5bd" />
              <stop offset="100%" stopColor="#d4a574" />
            </linearGradient>
          </defs>

          <text x="220" y="88" textAnchor="middle" className="loader5d-word-track">5Digea</text>
          <text x="220" y="88" textAnchor="middle" className="loader5d-word-flow" stroke="url(#wordGrad)">
            5Digea
          </text>

          <g className="loader5d-wrings">
            <circle cx="205" cy="122" r="14" className="wring-track" />
            <circle cx="205" cy="122" r="14" className="wring-flow r1" />
            <circle cx="225" cy="122" r="14" className="wring-track" />
            <circle cx="225" cy="122" r="14" className="wring-flow r2" />

            <polygon
              points="215,96 222,108 215,116 208,108"
              fill="url(#diamondGrad)"
              stroke="#9d5c64"
              strokeWidth="0.6"
              className="ring-diamond"
            />
            <polygon points="215,99 219,107 211,107" className="ring-diamond-facet" />
          </g>
        </svg>
      </div>

      {label && <p className="loader5d-label">{label}</p>}

      <div className="loader5d-glow" aria-hidden="true" />
    </div>
  );
}