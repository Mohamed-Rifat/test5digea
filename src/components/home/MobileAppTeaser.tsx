"use client";

import { Smartphone } from "lucide-react";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

/** "Mobile app coming soon" glass card. */
export function MobileAppTeaser() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-[#eee7e1] bg-[#f8f5ef] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto lg:max-w-10/12">
        {/* Glass card */}
        <div className="relative overflow-hidden rounded-md border border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_rgba(48,37,31,0.08),0_1px_0_rgba(255,255,255,0.9)_inset,0_-1px_0_rgba(48,37,31,0.04)_inset] backdrop-blur-xl sm:p-12">
          {/* Soft gradient tint behind the glass */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/60 via-white/20 to-[#f3ece2]/40" />

          {/* Colorful blobs (blurred) that show through the glass */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#e8d4b0]/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#d9c2a1]/40 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 top-1/4 h-56 w-56 rounded-full bg-[#f5e6cf]/40 blur-3xl" />

          {/* Top highlight line */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />

          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 shadow-sm backdrop-blur">
                <Smartphone size={13} className="text-[#a47e43]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b8367] rtl:tracking-normal">
                  {t("home.app.badge")}
                </span>
              </div>

              <h2 className="mt-5 font-serif text-3xl font-light leading-tight rtl:leading-snug text-[#30251f] sm:text-4xl">
                {t("home.app.title")}{" "}
                <span className="italic rtl:not-italic text-[#a47e43]">
                  {t("home.app.titleHighlight")}
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#766d67]">
                {t("home.app.description")}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div
                  aria-disabled="true"
                  className="group flex cursor-not-allowed items-center gap-3 rounded-2xl border border-[#30251f]/10 bg-[#30251f] px-5 py-3 text-start text-white opacity-90 shadow-lg transition"
                >
                  <FaApple className="h-6 w-6" />

                  <div className="leading-tight">
                    <p className="text-[9px] uppercase tracking-widest text-white/60 rtl:tracking-normal">
                      {t("home.app.comingSoonOn")}
                    </p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </div>

                <div
                  aria-disabled="true"
                  className="group flex cursor-not-allowed items-center gap-3 rounded-2xl border border-[#30251f]/10 bg-[#30251f] px-5 py-3 text-start text-white opacity-90 shadow-lg transition"
                >
                  <FaGooglePlay className="h-5 w-5" />

                  <div className="leading-tight">
                    <p className="text-[9px] uppercase tracking-widest text-white/60 rtl:tracking-normal">
                      {t("home.app.comingSoonOn")}
                    </p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone mockup */}

            <div className="relative mx-auto w-full max-w-65">
              <div className="relative rounded-[2.5rem] border-10 border-[#30251f] bg-[#30251f] shadow-2xl">
                <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-[#5a4a3f]" />

                <div className="overflow-hidden rounded-4xl bg-[#faf8f6]">
                  <div className="flex h-105 flex-col">
                    <div className="bg-linear-to-br from-[#30251f] to-[#42332a] px-5 pb-6 pt-8 text-white">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-white/50">
                        5digea
                      </p>

                      <p className="mt-1 font-serif text-lg font-light">
                        {t("home.app.phoneTitle")}
                      </p>

                      <div className="mt-4 h-2 w-3/4 rounded-full bg-white/15" />
                      <div className="mt-2 h-2 w-1/2 rounded-full bg-white/10" />
                    </div>

                    <div className="flex-1 space-y-3 p-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl border border-[#eee5df] bg-white p-3"
                        >
                          <div className="h-8 w-8 shrink-0 rounded-lg bg-[#faf5ee]" />

                          <div className="flex-1 space-y-1.5">
                            <div className="h-2 w-3/4 rounded-full bg-[#eee5df]" />
                            <div className="h-2 w-1/2 rounded-full bg-[#f3ece2]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
