"use client";

import React from "react";
import {
  BarChart3,
  BadgeCheck,
  CalendarHeart,
  Check,
  Clock3,
  Crown,
  Heart,
  ImageIcon,
  MapPin,
  Rocket,
  Search,
  Sparkles,
  Star,
  Store,
  Users,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";

const features: {
  icon: typeof Store;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}[] = [
  { icon: Store, titleKey: "vendor.subscriptions.features.profile.title", descriptionKey: "vendor.subscriptions.features.profile.description" },
  { icon: Sparkles, titleKey: "vendor.subscriptions.features.services.title", descriptionKey: "vendor.subscriptions.features.services.description" },
  { icon: ImageIcon, titleKey: "vendor.subscriptions.features.portfolio.title", descriptionKey: "vendor.subscriptions.features.portfolio.description" },
  { icon: Search, titleKey: "vendor.subscriptions.features.discover.title", descriptionKey: "vendor.subscriptions.features.discover.description" },
  { icon: Star, titleKey: "vendor.subscriptions.features.reviews.title", descriptionKey: "vendor.subscriptions.features.reviews.description" },
  { icon: Heart, titleKey: "vendor.subscriptions.features.favorites.title", descriptionKey: "vendor.subscriptions.features.favorites.description" },
  { icon: BarChart3, titleKey: "vendor.subscriptions.features.dashboard.title", descriptionKey: "vendor.subscriptions.features.dashboard.description" },
  { icon: MapPin, titleKey: "vendor.subscriptions.features.location.title", descriptionKey: "vendor.subscriptions.features.location.description" },
  { icon: Users, titleKey: "vendor.subscriptions.features.reach.title", descriptionKey: "vendor.subscriptions.features.reach.description" },
];

const trialBenefits: TranslationKey[] = [
  "vendor.subscriptions.benefits.fullAccess",
  "vendor.subscriptions.benefits.profile",
  "vendor.subscriptions.benefits.services",
  "vendor.subscriptions.benefits.reviews",
  "vendor.subscriptions.benefits.discovery",
  "vendor.subscriptions.benefits.favorites",
];

const steps: {
  number: number;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  textKey: TranslationKey;
}[] = [
  { number: 1, titleKey: "vendor.subscriptions.steps.one.title", subtitleKey: "vendor.subscriptions.steps.one.subtitle", textKey: "vendor.subscriptions.steps.one.text" },
  { number: 2, titleKey: "vendor.subscriptions.steps.two.title", subtitleKey: "vendor.subscriptions.steps.two.subtitle", textKey: "vendor.subscriptions.steps.two.text" },
  { number: 3, titleKey: "vendor.subscriptions.steps.three.title", subtitleKey: "vendor.subscriptions.steps.three.subtitle", textKey: "vendor.subscriptions.steps.three.text" },
];

export default function Page() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#faf8f6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-full">
        {/* Current access bar */}
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

        {/* Hero */}
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

        {/* Partners */}
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

        {/* What's included */}
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

        {/* How it works */}
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

                    <p className="text-xs text-[#8a7972]">
                      {t(step.subtitleKey)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-6 text-[#786963]">
                  {t(step.textKey)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* After the trial */}
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

        {/* Closing */}
        <section className="py-10 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#8b6255] text-white">
            <Rocket className="h-5 w-5" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-[#352823] sm:text-2xl">
            {t("vendor.subscriptions.ctaTitle")}
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#786963]">
            {t("vendor.subscriptions.ctaText")}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8b6255]">
            <Heart className="h-4 w-4 fill-current" />
            {t("vendor.subscriptions.partnersFooter")}
          </div>
        </section>
      </div>
    </div>
  );
}
