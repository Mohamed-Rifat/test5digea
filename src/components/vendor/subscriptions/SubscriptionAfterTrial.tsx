"use client";

import { CalendarHeart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** What happens after the trial. */
export function SubscriptionAfterTrial() {
  const { t } = useLanguage();

  return (
    <section className="mt-10">
      <div className="overflow-hidden rounded-2xl border border-[#e3d5ce] bg-[#382b26]">
        <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
          <div className="p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                <CalendarHeart className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] rtl:tracking-normal text-white/45">
                  {t("vendor.subscriptions.after.eyebrow")}
                </p>

                <h2 className="mt-1 text-xl font-bold text-white">
                  {t("vendor.subscriptions.after.title")}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                  {t("vendor.subscriptions.after.text")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center border-t border-white/10 bg-white/5 px-6 py-5 lg:border-s lg:border-t-0">
            <div>
              <p className="text-xs text-white/45">
                {t("vendor.subscriptions.after.currentAccess")}
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-sm font-bold text-white">
                  {t("vendor.subscriptions.premiumTrial")}
                </span>
              </div>

              <p className="mt-2 text-xs text-white/45">
                {t("vendor.subscriptions.after.noPayment")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
