"use client";

import Link from "next/link";
import { ArrowRight, Compass, Heart, ShieldCheck, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function AboutTeaser() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-[#eee7e1] bg-[#f8f5ef] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid gap-10 lg:max-w-10/12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171] rtl:tracking-normal">
            {t("home.about.eyebrow")}
          </p>

          <h2 className="mt-2 max-w-lg font-serif text-3xl font-light leading-tight rtl:leading-snug text-[#30251f] sm:text-4xl">
            {t("home.about.title")}{" "}
            <span className="italic rtl:not-italic text-[#a47e43]">
              {t("home.about.titleHighlight")}
            </span>
            .
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-[#766d67]">
            {t("home.about.description")}
          </p>

          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-6 py-3 text-sm font-semibold text-[#5f544d] transition hover:border-[#b99a62] hover:text-[#30251f]"
          >
            {t("home.about.cta")}
            <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
              <ShieldCheck size={18} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
              {t("home.about.vetted.title")}
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
              {t("home.about.vetted.description")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
              <Compass size={18} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
              {t("home.about.guided.title")}
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
              {t("home.about.guided.description")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
              <Heart size={18} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
              {t("home.about.reviews.title")}
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
              {t("home.about.reviews.description")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
              <Users size={18} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
              {t("home.about.couples.title")}
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
              {t("home.about.couples.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
