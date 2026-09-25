"use client";

import Link from "next/link";
import { Building2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export function FinalCta() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <section className="mx-auto max-full pb-12 ">
      <div className="relative overflow-hidden bg-linear-to-br from-[#30251f] via-[#3d3028] to-[#2a201b] p-10 text-center shadow-xl sm:p-16">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#a47e43]/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#8e685e]/20 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex items-center justify-center gap-2 text-[#d5b77d]">
            <Sparkles size={16} />

            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] rtl:tracking-normal">
              {t("home.cta.eyebrow")}
            </span>
          </div>

          <h2 className="mx-auto mt-4 max-w-xl font-serif text-3xl font-light leading-tight rtl:leading-snug text-white sm:text-4xl">
            {t("home.cta.title")}{" "}
            <span className="italic rtl:not-italic text-[#d8bd89]">
              {t("home.cta.titleHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
            {t("home.cta.description")}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={isAuthenticated ? "/roadmap" : "/register"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#30251f] transition hover:bg-[#f3ede6]"
            >
              <Sparkles size={16} />

              {isAuthenticated
                ? t("home.cta.openRoadmap")
                : t("home.cta.getStarted")}
            </Link>

            <Link
              href="/vendors"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
            >
              <Building2 size={16} />
              {t("home.cta.browseVendors")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
