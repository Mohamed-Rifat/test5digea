"use client";

import Link from "next/link";
import { ArrowRight, Heart, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Dark "contact us" card. */
export function ContactUsCard() {
  const { t } = useLanguage();

  return (
    <section className="relative mt-10 overflow-hidden rounded-4xl bg-[#30251f] p-8 text-white shadow-[0_20px_60px_rgba(48,37,31,0.18)] sm:p-10 lg:mt-12 lg:p-12">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#b99a62]/15" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full border-40 border-white/5" />

      <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] rtl:tracking-normal text-[#c9ad78]">
            {t("profile.contactUs.eyebrow")}
          </p>

          <h2 className="mt-3 font-serif text-3xl font-light rtl:leading-snug sm:text-4xl">
            {t("profile.contactUs.title")}
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-[15px] sm:leading-8">
            {t("profile.contactUs.description")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#30251f] transition hover:bg-[#f5efe8]"
          >
            <MessageCircle size={16} />
            {t("profile.contactUs.cta")}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>

          <p className="text-center text-xs text-white/60">
            {t("profile.contactUs.emailLabel")}{" "}
            <a
              href="mailto:hello@5digea.com"
              dir="ltr"
              className="font-semibold text-white underline-offset-4 hover:underline"
            >
              hello@5digea.com
            </a>
          </p>
        </div>
      </div>

      <p className="relative mt-8 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-white/60">
        <Heart size={13} className="shrink-0 text-[#c9ad78]" />
        {t("profile.contactUs.note")}
      </p>
    </section>
  );
}
