"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  KeyRound,
  Sparkles,
  Store,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { ActionCard } from "./ProfileCards";

/** Shortcut cards to roadmap, favourites, security… */
export function QuickAccessSection() {
  const { t } = useLanguage();

  return (
    <section className="mt-10 lg:mt-12">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] rtl:tracking-normal text-[#a47e43]">
          {t("profile.quickAccess.eyebrow")}
        </p>

        <h2 className="mt-1 font-serif text-2xl font-light text-[#30251f]">
          {t("profile.quickAccess.title")}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          href="/roadmap"
          icon={<CalendarDays size={20} />}
          eyebrow={t("profile.quickAccess.roadmap.eyebrow")}
          title={t("profile.quickAccess.roadmap.title")}
          description={t("profile.quickAccess.roadmap.description")}
        />

        <ActionCard
          href="/favorites"
          icon={<Heart size={20} />}
          eyebrow={t("profile.quickAccess.favorites.eyebrow")}
          title={t("profile.quickAccess.favorites.title")}
          description={t("profile.quickAccess.favorites.description")}
        />

        <ActionCard
          href="/vendors"
          icon={<Store size={20} />}
          eyebrow={t("profile.quickAccess.vendors.eyebrow")}
          title={t("profile.quickAccess.vendors.title")}
          description={t("profile.quickAccess.vendors.description")}
        />

        <ActionCard
          href="/compare"
          icon={<Sparkles size={20} />}
          eyebrow={t("profile.quickAccess.compare.eyebrow")}
          title={t("profile.quickAccess.compare.title")}
          description={t("profile.quickAccess.compare.description")}
        />

        <ActionCard
          href="/change-password"
          icon={<KeyRound size={20} />}
          eyebrow={t("profile.quickAccess.security.eyebrow")}
          title={t("profile.quickAccess.security.title")}
          description={t("profile.quickAccess.security.description")}
        />

        <Link
          href="/roadmap"
          className="group flex min-h-52.5 flex-col justify-between rounded-[26px] border border-dashed border-[#d9ccc2] bg-[#faf8f6] p-6 transition-all duration-300 hover:border-[#b99a62] hover:bg-[#faf5ee]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#a47e43] shadow-sm">
            <Sparkles size={20} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
              {t("profile.quickAccess.keepPlanning.eyebrow")}
            </p>

            <h3 className="mt-2 font-serif text-xl font-light text-[#30251f]">
              {t("profile.quickAccess.keepPlanning.title")}
            </h3>

            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#8e685e]">
              {t("profile.quickAccess.keepPlanning.cta")}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
