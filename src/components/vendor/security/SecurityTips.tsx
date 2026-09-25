"use client";

import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { TIP_KEYS } from "./passwordRules";

export function SecurityTips() {
  const { t } = useLanguage();

  return (
    <aside className="space-y-4">
      <div className="border border-[#ebe3dd] bg-[#f5eee9] p-5 sm:p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80">
          <Sparkles size={18} className="text-[#a17c4d]" strokeWidth={1.7} />
        </div>

        <h3 className="mt-5 text-sm font-semibold text-[#3a2e27]">
          {t("vendor.security.tipsTitle")}
        </h3>

        <p className="mt-2 text-xs leading-5 text-[#786c64]">
          {t("vendor.security.tipsText")}
        </p>

        <div className="mt-5 space-y-3">
          {TIP_KEYS.map((tipKey) => (
            <div
              key={tipKey}
              className="flex gap-2.5 text-xs leading-5 text-[#6f625a]"
            >
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white">
                <Check size={10} className="text-[#7d927f]" strokeWidth={2.5} />
              </span>

              <span>{t(tipKey)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-[#ebe3dd] bg-white px-5 py-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={17} className="text-[#8b7668]" strokeWidth={1.7} />

          <span className="text-xs font-medium text-[#5e5149]">
            {t("vendor.security.sessionTitle")}
          </span>
        </div>

        <p className="mt-2 ps-6.75 text-[11px] leading-5 text-[#938780]">
          {t("vendor.security.sessionText")}
        </p>
      </div>
    </aside>
  );
}
