"use client";

import { Heart, PartyPopper } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

/** Shown in place of the path once every step is completed. */
export function AllDoneCard({ onOpenLetter }: { onOpenLetter?: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/60 p-8 text-center">
      <PartyPopper
        size={30}
        className="mx-auto text-emerald-600"
        aria-hidden="true"
      />
      <p className="mt-3 text-lg font-bold text-[#30251f]">
        {t("roadmap.next.allDoneTitle")}
      </p>
      <p className="mt-1 text-sm text-[#6f635b]">
        {t("roadmap.next.allDoneBody")}
      </p>
      {onOpenLetter && (
        <button
          type="button"
          onClick={onOpenLetter}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#46342a]"
        >
          <Heart size={15} fill="currentColor" className="text-[#e7c089]" aria-hidden="true" />
          {t("roadmap.next.seeMessage")}
        </button>
      )}
    </div>
  );
}
