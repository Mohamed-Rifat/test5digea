"use client";

import { Heart } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

/** Dark "enjoy the journey" card next to the summary. */
export function EnjoyAside() {
  const { t } = useLanguage();

  return (
    <aside className="relative overflow-hidden rounded-[28px] bg-[#30221d] p-6 text-white sm:p-7">
      <div className="pointer-events-none absolute -end-16 -top-16 h-44 w-44 rounded-full bg-[#d5a05e]/15 blur-3xl" />
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#d8aa6d]/15 ring-1 ring-[#d8aa6d]/30">
        <Heart
          size={19}
          fill="currentColor"
          className="text-[#d8aa6d]"
          aria-hidden="true"
        />
      </span>
      <h2 className="relative mt-4 text-lg font-bold">
        {t("roadmap.progress.enjoyHeading")}
      </h2>
      <p className="relative mt-1.5 text-sm leading-relaxed text-white/65">
        {t("roadmap.progress.enjoyBody")}
      </p>
    </aside>
  );
}
