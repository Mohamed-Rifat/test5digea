"use client";

import { CheckCircle2, MessageSquarePlus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ReviewPromptModal({
  categoryName,
  onReviewNow,
  onLater,
}: {
  categoryName: string;
  onReviewNow: () => void;
  onLater: () => void;
}) {
  const { t, localize } = useLanguage();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm overflow-hidden rounded-[28px] bg-white p-7 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={26} className="text-emerald-500" />
        </div>

        <h3 className="mt-4 text-xl font-bold text-[#30251f]">
          {t("roadmap.reviewPrompt.heading", { category: localize(categoryName) })}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#8b7e76]">
          {t("roadmap.reviewPrompt.body")}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onReviewNow}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30221d] text-sm font-semibold text-white transition hover:bg-[#46332a]"
          >
            <MessageSquarePlus size={14} />
            {t("roadmap.reviewPrompt.reviewNow")}
          </button>

          <button
            type="button"
            onClick={onLater}
            className="h-11 rounded-xl border border-[#e3d9d1] text-sm font-semibold text-[#766a62] transition hover:bg-[#f8f4f0]"
          >
            {t("roadmap.reviewPrompt.later")}
          </button>
        </div>
      </div>
    </div>
  );
}
