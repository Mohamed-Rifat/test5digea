"use client";

import type { CSSProperties } from "react";
import { ArrowRight, BriefcaseBusiness, Camera, Heart, Tags } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";
import type { Vendor } from "@/types/vendor";

import OnboardingShell from "./OnboardingShell";
import { delay } from "./motion";

// ================================================================
// CONFETTI
// Generated once from a fixed formula (no Math.random) so the markup is
// identical on every render.
// ================================================================

const CONFETTI_COLORS = [
  "#b99a62",
  "#d9bd85",
  "#e3a8a8",
  "#f3c6c6",
  "#30251f",
  "#f3e4d0",
];

const seeded = (index: number, salt: number): number => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const CONFETTI = Array.from({ length: 34 }, (_, index) => ({
  left: `${Math.round(seeded(index, 1) * 100)}%`,
  size: 6 + Math.round(seeded(index, 2) * 8),
  delay: Math.round(seeded(index, 3) * 3500),
  duration: 5200 + Math.round(seeded(index, 4) * 3600),
  drift: Math.round((seeded(index, 5) - 0.5) * 180),
  rotation: 360 + Math.round(seeded(index, 6) * 720),
  round: seeded(index, 7) > 0.6,
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
}));

const TIPS: { icon: typeof Heart; text: TranslationKey }[] = [
  { icon: Camera, text: "vendorOnboarding.welcome.tip1" },
  { icon: Tags, text: "vendorOnboarding.welcome.tip2" },
  { icon: BriefcaseBusiness, text: "vendorOnboarding.welcome.tip3" },
];

/**
 * Stage 3 of onboarding: shown once, the first time the vendor opens the app
 * after the admin approved them. "Go to dashboard" hands over to the layout,
 * which then renders the real dashboard.
 */
export default function WelcomeAboard({
  vendor,
  onContinue,
}: {
  vendor: Vendor;
  onContinue: () => void;
}) {
  const { t } = useLanguage();

  return (
    <OnboardingShell>
      {/* Confetti */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {CONFETTI.map((piece, index) => (
          <span
            key={index}
            className="onb-confetti"
            style={
              {
                left: piece.left,
                width: piece.size,
                height: piece.round ? piece.size : piece.size * 1.6,
                backgroundColor: piece.color,
                borderRadius: piece.round ? "9999px" : "2px",
                "--onb-delay": `${piece.delay}ms`,
                "--dur": `${piece.duration}ms`,
                "--dx": `${piece.drift}px`,
                "--rot": `${piece.rotation}deg`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <main className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-12 text-center sm:px-6 lg:py-16">
        {/* Badge with a drawn check mark */}
        <div className="relative flex h-36 w-36 items-center justify-center">
          <span className="onb-ring absolute inset-4 rounded-full border-2 border-[#d9bd85]" />
          <span
            className="onb-ring absolute inset-4 rounded-full border-2 border-[#d9bd85]"
            style={delay(1400)}
          />

          <div
            className="onb-pop relative flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-[#b99a62] to-[#8e6b32] shadow-[0_18px_45px_rgba(164,126,67,0.35)]"
            style={delay(100)}
          >
            <svg
              viewBox="0 0 24 24"
              width="52"
              height="52"
              fill="none"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" className="onb-draw" style={delay(650)} />
            </svg>
          </div>
        </div>

        <p
          className="onb-rise mt-8 text-[10px] font-bold uppercase tracking-[0.26em] text-[#a47e43] rtl:tracking-normal"
          style={delay(500)}
        >
          {t("vendorOnboarding.welcome.eyebrow")}
        </p>

        <h1
          className="onb-rise mt-3 font-serif text-4xl font-light leading-tight tracking-tight sm:text-5xl rtl:leading-snug"
          style={delay(620)}
        >
          <span className="onb-shine">{t("vendorOnboarding.welcome.title")}</span>
        </h1>

        <div
          className="onb-rise mx-auto mt-5 flex items-center justify-center gap-3"
          style={delay(720)}
        >
          <span className="h-px w-12 bg-linear-to-r from-transparent to-[#d9c9a8]" />
          <Heart size={14} className="fill-[#f3e4d0] text-[#b99a62]" />
          <span className="h-px w-12 bg-linear-to-l from-transparent to-[#d9c9a8]" />
        </div>

        <p
          className="onb-rise mt-6 max-w-xl text-[15px] leading-8 text-[#81746d]"
          style={delay(800)}
        >
          {t("vendorOnboarding.welcome.text", {
            name: vendor.businessName || t("vendor.profile.defaultName"),
          })}
        </p>

        <p
          className="onb-rise mt-3 font-serif text-lg text-[#8e685e]"
          style={delay(880)}
        >
          {t("vendorOnboarding.welcome.wish")}
        </p>

        {/* First steps */}
        <section
          className="onb-rise mt-10 w-full rounded-4xl border border-[#e8dfd8] bg-white/90 p-6 text-start shadow-[0_10px_40px_rgba(48,37,31,0.05)] backdrop-blur sm:p-8"
          style={delay(960)}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a47e43] rtl:tracking-normal">
            {t("vendorOnboarding.welcome.tipsTitle")}
          </p>

          <ul className="mt-4 space-y-3">
            {TIPS.map(({ icon: Icon, text }, index) => (
              <li
                key={text}
                className="flex items-center gap-4 rounded-2xl bg-[#faf8f6] p-3.5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#a47e43] shadow-sm">
                  <Icon size={18} />
                </span>

                <span className="flex-1 text-sm font-medium text-[#40352f]">
                  {t(text)}
                </span>

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#30251f] text-[11px] font-bold text-white">
                  {index + 1}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          onClick={onContinue}
          className="onb-rise group relative mt-8 inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-[#30251f] px-10 text-base font-semibold text-white shadow-[0_12px_32px_rgba(48,37,31,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#45362d] hover:shadow-[0_16px_38px_rgba(48,37,31,0.28)]"
          style={delay(1080)}
        >
          <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          <span className="relative">{t("vendorOnboarding.welcome.cta")}</span>
          <ArrowRight
            size={18}
            className="relative transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
          />
        </button>
      </main>
    </OnboardingShell>
  );
}
