"use client";

import { useLanguage } from "@/context/LanguageContext";
import { steps } from "@/components/vendor/subscriptions/subscriptionsConfig";

/** How the subscription works. */
export function SubscriptionSteps() {
  const { t } = useLanguage();

  return (
    <section className="mt-10">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9a6d5d]">
          {t("vendor.subscriptions.howEyebrow")}
        </p>

        <h2 className="mt-1 text-2xl font-bold text-[#352823]">
          {t("vendor.subscriptions.howTitle")}
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="relative rounded-2xl border border-[#e9ded9] bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b6255] text-sm font-bold text-white">
                {step.number}
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#3b2d28]">
                  {t(step.titleKey)}
                </h3>

                <p className="text-xs text-[#8a7972]">{t(step.subtitleKey)}</p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-[#786963]">
              {t(step.textKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
