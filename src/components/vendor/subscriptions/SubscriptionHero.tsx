"use client";

import { Check, Clock3, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { trialBenefits } from "@/components/vendor/subscriptions/subscriptionsConfig";

/** Hero with the free-trial offer. */
export function SubscriptionHero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#e7dcd7] bg-white px-5 py-8 shadow-[0_15px_45px_rgba(66,45,38,0.06)] sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-[#f1e3de] opacity-70 blur-3xl" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e6d6cf] bg-[#fcf6f3] px-3 py-1.5 text-xs font-semibold text-[#89665a]">
            <Heart className="h-3.5 w-3.5 fill-current" />
            {t("vendor.subscriptions.partnerBadge")}
          </div>

          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight rtl:tracking-normal text-[#332722] sm:text-4xl">
            {t("vendor.subscriptions.headlineLine1")}
            <span className="block text-[#986b5c]">
              {t("vendor.subscriptions.headlineLine2")}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#766760] sm:text-base">
            {t("vendor.subscriptions.intro")}
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {trialBenefits.map((benefitKey) => (
              <div
                key={benefitKey}
                className="flex items-center gap-2 text-sm text-[#5f4d46]"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2e5df] text-[#916557]">
                  <Check className="h-3 w-3" />
                </div>

                {t(benefitKey)}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e7d9d3] bg-[#fcfaf9] p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider rtl:tracking-normal text-[#9a6d5d]">
            <Clock3 className="h-4 w-4" />
            {t("vendor.subscriptions.limitedTrial")}
          </div>

          <div className="mt-4">
            <p className="text-3xl font-bold text-[#352823]">
              {t("vendor.subscriptions.premium")}
            </p>

            <p className="mt-1 text-sm text-[#85746d]">
              {t("vendor.subscriptions.fullAccessNoCharge")}
            </p>
          </div>

          <div className="my-5 h-px bg-[#e7dcd7]" />

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#8a7972]">
                {t("vendor.subscriptions.currentPlan")}
              </span>

              <span className="font-semibold text-[#4a3831]">
                {t("vendor.subscriptions.premiumTrial")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8a7972]">
                {t("vendor.subscriptions.priceToday")}
              </span>

              <span className="font-semibold text-emerald-600">
                {t("vendor.subscriptions.free")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8a7972]">
                {t("vendor.subscriptions.access")}
              </span>

              <span className="font-semibold text-[#4a3831]">
                {t("vendor.subscriptions.fullPremium")}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-[#f1e5e0] px-3 py-2.5 text-center">
            <p className="text-xs text-[#7c6257]">
              {t("vendor.subscriptions.trialNote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
