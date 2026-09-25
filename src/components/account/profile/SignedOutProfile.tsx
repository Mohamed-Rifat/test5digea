"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Heart, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function SignedOutState() {
  const { t } = useLanguage();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf8f6] px-4 py-16 sm:px-6 sm:py-20">
      {/* Soft decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#f4eadc] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#f7e9e5] opacity-60 blur-3xl" />

      {/* Fine grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #30251f 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative w-full max-w-7xl">
        {/* Main card */}
        <div className="group/card relative overflow-hidden rounded-32px border border-[#e9dfd8] bg-white shadow-[0_24px_80px_rgba(48,37,31,0.09)] transition-shadow duration-500 hover:shadow-[0_30px_90px_rgba(48,37,31,0.12)]">
          {/* Top accent */}
          <div className="relative h-1.5 overflow-hidden bg-gradient-to-r from-[#30251f] via-[#b99a62] to-[#30251f]">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full border border-[#eee5df]" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#faf5ee]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full border border-[#f0e7df]" />

          {/* Corner sparkles */}
          <div className="pointer-events-none absolute left-6 top-6 h-3 w-3 rotate-45 rounded-sm border border-[#b99a62]/25" />
          <div className="pointer-events-none absolute right-6 top-10 h-2 w-2 rotate-45 rounded-sm border border-[#b99a62]/20" />
          <div className="pointer-events-none absolute bottom-10 left-10 h-2 w-2 rotate-45 rounded-sm border border-[#b99a62]/20" />

          <div className="relative px-6 py-9 text-center sm:px-10 sm:py-11">
            {/* Emotional icon */}
            <div className="relative mx-auto w-fit">
              {/* Pulsing halo */}
              <div className="absolute inset-[-14px] animate-[pulseSlow_3s_ease-in-out_infinite] rounded-32px border border-[#eee5df]" />

              <div className="absolute inset-[-8px] rounded-[28px] border border-[#eee5df]" />

              <div className="relative flex h-18 w-18 items-center justify-center rounded-24px bg-[#faf5ee] text-[#a47e43] shadow-[0_8px_25px_rgba(164,126,67,0.10)]">
                <Heart size={28} strokeWidth={1.5} className="fill-[#f3e4d0]" />
              </div>

              {/* Status dot with ping */}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-[#b99a62]/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#b99a62]" />
              </span>
            </div>

            {/* Eyebrow */}
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47e43] rtl:tracking-normal">
              {t("profile.signedOut.eyebrow")}
            </p>

            {/* Heading */}
            <h1 className="mt-3 font-serif text-[34px] font-light leading-tight tracking-tight text-[#30251f] sm:text-[40px] rtl:leading-snug">
              {t("profile.signedOut.title")}
            </h1>

            {/* Decorative divider */}
            <div className="mx-auto mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d9c9a8]" />
              <span className="h-1.5 w-1.5 rotate-45 border border-[#b99a62]/50" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d9c9a8]" />
            </div>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-lg text-[14px] leading-7 text-[#81746d] sm:text-[15px] sm:leading-8">
              {t("profile.signedOut.description")}
            </p>

            {/* Benefits */}
            <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 overflow-hidden rounded-2xl border border-[#eee5df] bg-gradient-to-b from-[#faf8f6] to-[#faf5ee]/60">
              {/* Benefit 1 */}
              <div className="group/benefit px-2.5 py-4 transition-colors duration-300 hover:bg-white/70 sm:px-4">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#a47e43] shadow-sm transition-all duration-300 group-hover/benefit:-translate-y-0.5 group-hover/benefit:shadow-[0_6px_18px_rgba(164,126,67,0.18)]">
                  <Heart size={15} strokeWidth={1.7} />
                </div>
                <p className="mt-2.5 text-[10px] font-semibold leading-4 text-[#5f544d] sm:text-[11px]">
                  {t("profile.signedOut.benefits.favorites")}
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute left-0 top-1/2 h-12 -translate-y-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#e8ded6] to-transparent" />
              </div>

              {/* Benefit 2 */}
              <div className="group/benefit px-2.5 py-4 transition-colors duration-300 hover:bg-white/70 sm:px-4">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#a47e43] shadow-sm transition-all duration-300 group-hover/benefit:-translate-y-0.5 group-hover/benefit:shadow-[0_6px_18px_rgba(164,126,67,0.18)]">
                  <CalendarDays size={15} strokeWidth={1.7} />
                </div>
                <p className="mt-2.5 text-[10px] font-semibold leading-4 text-[#5f544d] sm:text-[11px]">
                  {t("profile.signedOut.benefits.roadmap")}
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute left-0 top-1/2 h-12 -translate-y-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#e8ded6] to-transparent" />
              </div>

              {/* Benefit 3 */}
              <div className="group/benefit px-2.5 py-4 transition-colors duration-300 hover:bg-white/70 sm:px-4">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#a47e43] shadow-sm transition-all duration-300 group-hover/benefit:-translate-y-0.5 group-hover/benefit:shadow-[0_6px_18px_rgba(164,126,67,0.18)]">
                  <Sparkles size={15} strokeWidth={1.7} />
                </div>
                <p className="mt-2.5 text-[10px] font-semibold leading-4 text-[#5f544d] sm:text-[11px]">
                  {t("profile.signedOut.benefits.planning")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="group relative inline-flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#30251f] px-6 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(48,37,31,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#45362d] hover:shadow-[0_12px_28px_rgba(48,37,31,0.22)]"
              >
                {/* Shine effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative">
                  {t("profile.signedOut.signIn")}
                </span>
                <ArrowRight
                  size={16}
                  className="relative transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </Link>

              <Link
                href="/register"
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-[#e3d8cf] bg-white px-6 text-sm font-semibold text-[#5f544d] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b99a62] hover:bg-[#faf8f6] hover:text-[#30251f]"
              >
                {t("profile.signedOut.createAccount")}
              </Link>
            </div>

            {/* Small emotional footer */}
            <div className="mt-7 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#e8ded6]" />
              <p className="text-[10px] font-medium text-[#a3958c]">
                {t("profile.signedOut.footer")}
              </p>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#e8ded6]" />
            </div>
          </div>
        </div>

        {/* Brand note */}
        <p className="mt-5 text-center text-[9px] font-bold uppercase tracking-[0.28em] text-[#b3a69e] rtl:tracking-normal">
          Digea · Your story, beautifully planned
        </p>
      </div>

      {/* Keyframes for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulseSlow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
      `}</style>
    </main>
  );
}
