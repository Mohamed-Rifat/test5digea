"use client";

import { Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Compact "you've got a letter" card shown once every step is done. */
export function LetterTeaser({ onOpen }: { onOpen: () => void }) {
  const { t } = useLanguage();
  return (
    <section
      aria-labelledby="letter-teaser-title"
      className="relative mt-14 overflow-hidden rounded-[28px] bg-[#1f1613] p-6 text-white shadow-[0_30px_80px_-30px_rgba(48,30,20,0.6)] sm:mt-16 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(226,183,119,0.22),transparent_50%)] rtl:bg-[radial-gradient(circle_at_15%_20%,rgba(226,183,119,0.22),transparent_50%)]" />
      <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-start">
        <button
          type="button"
          onClick={onOpen}
          aria-label={t("roadmap.letter.open")}
          className="group relative h-20 w-28 shrink-0 animate-[envelopeFloat_3.2s_ease-in-out_infinite]"
        >
          <span className="absolute inset-0 rounded-lg bg-linear-to-br from-[#f6e7cc] to-[#e4c797] shadow-lg" />
          <span
            className="absolute inset-0 rounded-lg bg-linear-to-t from-[#e9cfa3] to-[#f3e2c4]"
            style={{ clipPath: "polygon(0 100%, 50% 45%, 100% 100%)" }}
          />
          <span
            className="absolute inset-x-0 top-0 h-[58%] rounded-t-lg bg-linear-to-b from-[#f3e1bf] to-[#d8b883] transition-transform duration-500 group-hover:-translate-y-0.5"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
          <span className="absolute left-1/2 top-[58%] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d0645a,#9b2f2a_60%,#6e1c19)] shadow-md transition-transform group-hover:scale-110">
            <Heart size={13} fill="#fbe9e4" strokeWidth={0} />
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <h2
            id="letter-teaser-title"
            className="text-xl font-bold text-[#f1d4a6] sm:text-2xl"
          >
            {t("roadmap.letter.teaserTitle")}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-white/70">
            {t("roadmap.letter.teaserBody")}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e7c089] to-[#c9914f] px-6 text-sm font-bold text-[#2a1c16] shadow-[0_10px_30px_-8px_rgba(217,163,99,0.6)] transition hover:brightness-105"
        >
          <Heart size={15} fill="currentColor" aria-hidden="true" />
          {t("roadmap.letter.open")}
        </button>
      </div>
    </section>
  );
}
