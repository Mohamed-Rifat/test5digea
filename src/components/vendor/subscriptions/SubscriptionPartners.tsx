"use client";

import { BadgeCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Partner logos / social proof. */
export function SubscriptionPartners() {
  const { t } = useLanguage();

  return (
    <section className="py-9">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e8dcd6] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fbf0ec] text-[#916557]">
            <BadgeCheck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-bold text-[#382b26]">
              {t("vendor.subscriptions.partnersTitle")}
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#796a63]">
              {t("vendor.subscriptions.partnersText")}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-start sm:text-end">
          <p className="text-xs text-[#9a8981]">
            {t("vendor.subscriptions.duringTrial")}
          </p>

          <p className="mt-1 text-sm font-bold text-[#8b6255]">
            {t("vendor.subscriptions.premiumUnlocked")}
          </p>
        </div>
      </div>
    </section>
  );
}
