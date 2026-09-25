"use client";

import { Crown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Current access / trial status bar. */
export function SubscriptionAccessBar() {
  const { t } = useLanguage();

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#e8dcd6] bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8b6255] text-white">
          <Crown className="h-4 w-4" />
        </div>

        <div>
          <p className="text-xs font-medium text-[#8b756c]">
            {t("vendor.subscriptions.currentAccess")}
          </p>

          <p className="text-sm font-bold text-[#352823]">
            {t("vendor.subscriptions.premiumTrial")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-[#fbf1ed] px-3 py-1.5 text-xs font-semibold text-[#805e52]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {t("vendor.subscriptions.activeFree")}
      </div>
    </div>
  );
}
