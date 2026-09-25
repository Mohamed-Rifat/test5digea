"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** "Why join" perks + "already a vendor? sign in" card. */
export function VendorPerksAside() {
  const { t, isArabic } = useLanguage();

  return (
    <aside className="space-y-3">
      <div className="mb-5 hidden px-1 lg:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a28d7e]">
          {t("becomeVendor.perks.eyebrow")}
        </p>

        <h2 className="mt-2 font-serif text-2xl font-light text-[#30251f]">
          {t("becomeVendor.perks.heading")}
        </h2>
      </div>

      {[
        {
          icon: Users2,
          title: t("becomeVendor.perks.reach.title"),
          description: t("becomeVendor.perks.reach.description"),
        },
        {
          icon: BadgeCheck,
          title: t("becomeVendor.perks.verified.title"),
          description: t("becomeVendor.perks.verified.description"),
        },
        {
          icon: TrendingUp,
          title: t("becomeVendor.perks.grow.title"),
          description: t("becomeVendor.perks.grow.description"),
        },
      ].map((perk, index) => {
        const Icon = perk.icon;

        return (
          <div
            key={perk.title}
            className="group rounded-2xl border border-[#e9e0d9] bg-white p-5 shadow-[0_6px_25px_rgba(71,52,36,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d9c8b5] hover:shadow-[0_12px_35px_rgba(71,52,36,0.07)]"
          >
            <div className="flex items-start gap-4">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faf6f1] text-[#a47e43]">
                <Icon size={19} strokeWidth={1.7} />

                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#30251f] text-[8px] font-semibold text-white">
                  {index + 1}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#30251f]">
                  {perk.title}
                </h3>

                <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                  {perk.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="relative overflow-hidden rounded-2xl bg-[#30251f] p-5 text-white shadow-[0_12px_35px_rgba(48,37,31,0.12)]">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#c6a66f]/10 blur-2xl" />

        <div className="relative">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d8bd89]">
            <Sparkles size={13} />
            {t("becomeVendor.alreadyVendor.eyebrow")}
          </p>

          <p className="mt-2 max-w-sm text-xs leading-6 text-white/65">
            {t("becomeVendor.alreadyVendor.body")}
          </p>

          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white transition hover:text-[#d8bd89]"
          >
            {t("becomeVendor.alreadyVendor.cta")}
            <ArrowRight size={13} className={isArabic ? "rotate-180" : ""} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
