"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Handshake,
  TrendingUp,
  Users2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** "Join us" pitch shown to guests and couples. */
export function JoinAsVendor() {
  const { t } = useLanguage();

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid gap-10 rounded-4xl border border-[#e4dbd0] bg-white p-8 shadow-sm lg:max-w-10/12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:p-14">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-[#faf7f4] px-3 py-1.5">
            <Handshake size={14} className="text-[#a47e43]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b8171] rtl:tracking-normal">
              {t("home.join.badge")}
            </span>
          </div>

          <h2 className="mt-5 max-w-lg font-serif text-3xl font-light leading-tight rtl:leading-snug text-[#30251f] sm:text-4xl">
            {t("home.join.title")}{" "}
            <span className="italic rtl:not-italic text-[#a47e43]">
              {t("home.join.titleHighlight")}
            </span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-[#766d67]">
            {t("home.join.description")}
          </p>

          <Link
            href="/become-a-vendor"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#c6a66f] bg-[#30251f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#42332a]"
          >
            <Handshake size={15} />
            {t("home.join.cta")}
            <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#eee5df] bg-[#faf7f4] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#a47e43]">
              <Users2 size={18} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
              {t("home.join.reach.title")}
            </h3>
            <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
              {t("home.join.reach.description")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#eee5df] bg-[#faf7f4] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#a47e43]">
              <BadgeCheck size={18} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
              {t("home.join.badgeCard.title")}
            </h3>
            <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
              {t("home.join.badgeCard.description")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#eee5df] bg-[#faf7f4] p-5 sm:col-span-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#a47e43]">
              <TrendingUp size={18} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
              {t("home.join.grow.title")}
            </h3>
            <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
              {t("home.join.grow.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
