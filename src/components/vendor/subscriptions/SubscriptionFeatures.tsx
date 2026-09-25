"use client";

import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { features } from "@/components/vendor/subscriptions/subscriptionsConfig";

/** What's included in the plan. */
export function SubscriptionFeatures() {
  const { t } = useLanguage();

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9a6d5d]">
            {t("vendor.subscriptions.includedEyebrow")}
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#352823] sm:text-3xl">
            {t("vendor.subscriptions.includedTitle")}
          </h2>
        </div>

        <div className="hidden items-center gap-1.5 text-xs text-[#8b7971] sm:flex">
          <Sparkles className="h-3.5 w-3.5 text-[#9a6d5d]" />
          {t("vendor.subscriptions.premiumTrial")}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.titleKey}
              className="group rounded-2xl border border-[#e9ded9] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d7c0b6] hover:shadow-[0_10px_30px_rgba(67,46,39,0.06)]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fbf1ed] text-[#916557] transition-colors group-hover:bg-[#8b6255] group-hover:text-white">
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#3b2d28]">
                    {t(feature.titleKey)}
                  </h3>

                  <p className="mt-1.5 text-xs leading-6 text-[#7c6c65]">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
