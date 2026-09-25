"use client";

import Link from "next/link";
import {
  CalendarDays,
  X,
  Heart,
  MessageSquareText,
  PartyPopper,
  Send,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";

import type { WeddingLetterState } from "./useWeddingLetter";

/** The letter itself: blessing, date, share and close. */
export function FinaleLetterCard({ letter }: { letter: WeddingLetterState }) {
  const { t, language } = useLanguage();
  const {
    closeRef,
    firstUserName,
    firstPartnerName,
    hasDate,
    isToday,
    shareUrl,
    shareText,
    handleShare,
    showLetter,
    eventDate,
    onClose,
    line,
  } = letter;

  return (
    <div
      className={`relative w-full max-w-2xl transition-all duration-[850ms] ease-[cubic-bezier(.2,.85,.25,1)] ${
        showLetter
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-24 scale-75 opacity-0"
      }`}
    >
      <div className="relative max-h-[90vh] overflow-y-auto overscroll-contain rounded-[28px] bg-[#fbf6ee] bg-[radial-gradient(circle_at_20%_0%,rgba(226,183,119,0.18),transparent_45%),radial-gradient(circle_at_100%_100%,rgba(198,138,114,0.12),transparent_40%)] px-6 py-12 text-center shadow-[0_50px_120px_-20px_rgba(0,0,0,0.75)] sm:px-12 sm:py-14">
        <div className="pointer-events-none absolute inset-3 rounded-[22px] border border-[#d9a363]/35" />
        <div className="pointer-events-none absolute inset-[18px] rounded-[18px] border border-[#d9a363]/15" />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute end-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#8b7e76] ring-1 ring-[#ebe0d3] transition hover:bg-white hover:text-[#30251f]"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="relative">
          <div {...line(150)}>
            <div className="relative mx-auto h-24 w-24">
              <span className="absolute inset-0 animate-[finaleGlow_3.2s_ease-in-out_infinite] rounded-full bg-[#e2b777]/30 blur-2xl" />
              <svg
                viewBox="0 0 120 120"
                className="relative h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="letterGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f3d6a8" />
                    <stop offset="50%" stopColor="#c9914f" />
                    <stop offset="100%" stopColor="#94622f" />
                  </linearGradient>
                </defs>
                <circle
                  cx="47"
                  cy="64"
                  r="24"
                  fill="none"
                  stroke="url(#letterGold)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={showLetter ? 0 : 1}
                  style={{
                    transition:
                      "stroke-dashoffset 1.6s cubic-bezier(.6,0,.2,1) .4s",
                  }}
                />
                <circle
                  cx="73"
                  cy="64"
                  r="24"
                  fill="none"
                  stroke="url(#letterGold)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={showLetter ? 0 : 1}
                  style={{
                    transition:
                      "stroke-dashoffset 1.6s cubic-bezier(.6,0,.2,1) .8s",
                  }}
                />
                <path d="M73 34 l-5 -8 h10 z" fill="#d9a363" />
              </svg>
            </div>
          </div>

          <p {...line(300)}>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f3e6d2] px-4 py-1.5 text-xs font-semibold text-[#94622f] sm:text-sm">
              <PartyPopper size={14} aria-hidden="true" />
              {t("roadmap.finale.eyebrow")}
            </span>
          </p>

          <p {...line(450)}>
            <span className="mt-5 flex items-center justify-center gap-3 text-xl font-bold text-[#8a5a2b] sm:text-2xl">
              {firstUserName}
              <Heart
                size={18}
                fill="#c9914f"
                strokeWidth={0}
                className="animate-[heartBeat_2.4s_ease-in-out_infinite]"
                aria-hidden="true"
              />
              {firstPartnerName}
            </span>
          </p>

          <h2 id="letter-title" {...line(600)}>
            <span className="mt-3 block bg-[linear-gradient(110deg,#94622f_20%,#d9a363_40%,#7a4d22_55%,#94622f_75%)] bg-[length:250%_100%] bg-clip-text text-3xl font-extrabold leading-[1.35] text-transparent animate-[finaleShimmer_6s_linear_infinite] sm:text-5xl">
              {t("roadmap.finale.title")}
            </span>
          </h2>

          <div {...line(800)}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-loose text-[#5b4c43] sm:text-lg">
              {t("roadmap.finale.body")}
            </p>
            <p className="mx-auto mt-2 max-w-xl text-base leading-loose text-[#7a6a60] sm:text-lg">
              {t("roadmap.finale.hope")}
            </p>
          </div>

          <div {...line(950)}>
            <div
              className="mx-auto mt-8 flex max-w-xs items-center gap-4"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#c9914f]/60" />
              <Heart size={14} fill="#c9914f" strokeWidth={0} />
              <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#c9914f]/60" />
            </div>
          </div>

          <figure {...line(1100)}>
            <div className="relative mx-auto mt-8 max-w-xl overflow-hidden rounded-3xl border border-[#e8d2ae] bg-[#f6ead7]/70 px-6 py-8 sm:px-9">
              <span
                className="pointer-events-none absolute -top-3 start-4 font-serif text-7xl leading-none text-[#c9914f]/20"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <figcaption className="text-xs font-semibold tracking-wide text-[#a8723a]">
                {t("roadmap.finale.duaLabel")}
              </figcaption>
              <blockquote className="mt-3 text-2xl font-bold leading-relaxed text-[#3a2c25] sm:text-[28px]">
                {t("roadmap.finale.dua")}
              </blockquote>
              <p className="mt-3 text-sm leading-loose text-[#6f5f55] sm:text-base">
                {t("roadmap.finale.duaMore")}
              </p>
              {hasDate && (
                <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#8a5a2b] ring-1 ring-[#e8d2ae]">
                  <CalendarDays size={15} aria-hidden="true" />
                  {isToday
                    ? t("roadmap.finale.today")
                    : t("roadmap.finale.dateOn", {
                        date: formatDate(
                          eventDate,
                          LANGUAGE_DATE_LOCALE[language],
                        ),
                      })}
                </p>
              )}
            </div>
          </figure>

          <div {...line(1250)}>
            <div className="mx-auto mt-10 max-w-xl">
              <h3 className="flex items-center justify-center gap-2 text-lg font-bold text-[#30251f] sm:text-xl">
                <Users
                  size={18}
                  className="text-[#a8723a]"
                  aria-hidden="true"
                />
                {t("roadmap.finale.shareTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7a6a60] sm:text-base">
                {t("roadmap.finale.shareBody")}
              </p>
              <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleShare}
                  className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-[#d9a363] to-[#a8723a] px-6 text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(168,114,58,0.6)] transition hover:brightness-105"
                >
                  <span
                    className="absolute inset-y-0 left-0 w-10 -translate-x-full skew-x-[-20deg] bg-white/35 transition-transform duration-700 group-hover:translate-x-[1200%]"
                    aria-hidden="true"
                  />
                  <Send
                    size={16}
                    className="rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                  {t("roadmap.finale.share")}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#5f544d] ring-1 ring-[#e6d9c8] transition hover:ring-[#c9914f] hover:text-[#30251f]"
                >
                  <MessageSquareText size={16} aria-hidden="true" />
                  {t("roadmap.finale.whatsapp")}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-xl px-4 text-sm font-semibold text-[#8a5a2b] underline-offset-4 hover:underline"
                >
                  {t("roadmap.finale.feedback")}
                </Link>
              </div>
            </div>
          </div>

          <div {...line(1400)}>
            <p className="mt-10 inline-flex items-center gap-2 text-base font-semibold text-[#a8723a]">
              <Heart size={14} fill="currentColor" aria-hidden="true" />
              {t("roadmap.finale.signature")}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl px-6 text-sm font-semibold text-[#7a6a60] ring-1 ring-[#e6d9c8] transition hover:bg-white hover:text-[#30251f]"
              >
                {t("roadmap.letter.close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
