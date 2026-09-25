"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ApplicationSuccess() {
  const { t, isArabic } = useLanguage();

  return (
    <div className="flex min-h-130 flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[#b8d99a]/30 blur-xl" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#eef7e7] text-[#4f7b2c] ring-8 ring-[#f7fbf3]">
          <CheckCircle2 size={30} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a47e43]">
          {t("becomeVendor.success.eyebrow")}
        </p>

        <h2 className="mt-2 font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
          {t("becomeVendor.success.heading")}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#766d67]">
          {t("becomeVendor.success.body")}
        </p>
      </div>

      <Link
        href="/"
        className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#ded3ca] bg-white px-6 py-3 text-xs font-semibold text-[#5f544d] transition hover:border-[#b99a62] hover:bg-[#faf7f4] hover:text-[#30251f]"
      >
        {t("becomeVendor.success.backHome")}
        <ArrowRight size={14} className={isArabic ? "rotate-180" : ""} />
      </Link>
    </div>
  );
}
