"use client";

import { Heart, Rocket } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Closing call to action. */
export function SubscriptionClosing() {
  const { t } = useLanguage();

  return (
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
  );
}
