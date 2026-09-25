"use client";

import { ClipboardList, RotateCcw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { ModerationQueueState } from "./useModerationPage";

/** Title + refresh. */
export function ModerationHeader({ queue }: { queue: ModerationQueueState }) {
  const { t } = useLanguage();
  const { refetch } = queue;

  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
          <ClipboardList size={13} />
          {t("admin.moderation.eyebrow")}
        </p>

        <h1 className="font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
          {t("admin.moderation.title")}
        </h1>

        <p className="mt-1 text-sm text-[#958980]">
          {t("admin.moderation.subtitle")}
        </p>
      </div>

      <button
        type="button"
        onClick={refetch}
        className="flex shrink-0 items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition hover:border-[#b99a62] hover:bg-[#faf7f4]"
      >
        <RotateCcw size={13} />
        {t("admin.moderation.refresh")}
      </button>
    </div>
  );
}
