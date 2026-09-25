"use client";

import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Dark card with password tips next to the change-password form. */
export function ChangePasswordAside() {
  const { t } = useLanguage();

  return (
    <aside className="overflow-hidden rounded-[30px] border border-[#e9dfd8] bg-[#30251f] text-white shadow-[0_18px_50px_rgba(48,37,31,0.12)]">
      <div className="relative overflow-hidden p-7 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border-25 border-white/5" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-[#a47e43]/10" />

        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-white/10 text-[#d5b67d] backdrop-blur">
            <ShieldCheck size={26} strokeWidth={1.5} />
          </div>

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.22em] rtl:tracking-normal text-[#cdb58d]">
            {t("auth.changePasswordPage.asideEyebrow")}
          </p>

          <h2 className="mt-2 font-serif text-3xl font-light leading-tight rtl:leading-snug">
            {t("auth.changePasswordPage.asideTitleLine1")}
            <br />
            {t("auth.changePasswordPage.asideTitleLine2")}
          </h2>

          <p className="mt-5 text-sm leading-7 text-white/60">
            {t("auth.changePasswordPage.asideText")}
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d5b67d]">
                <Check size={13} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  {t("auth.changePasswordPage.tipUniqueTitle")}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-white/45">
                  {t("auth.changePasswordPage.tipUniqueText")}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d5b67d]">
                <Check size={13} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  {t("auth.changePasswordPage.tipMixTitle")}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-white/45">
                  {t("auth.changePasswordPage.tipMixText")}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d5b67d]">
                <Check size={13} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  {t("auth.changePasswordPage.tipPrivateTitle")}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-white/45">
                  {t("auth.changePasswordPage.tipPrivateText")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-9 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] rtl:tracking-normal text-white/40">
              <Sparkles size={13} className="text-[#cdb58d]" />
              {t("auth.changePasswordPage.asideBadge")}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
