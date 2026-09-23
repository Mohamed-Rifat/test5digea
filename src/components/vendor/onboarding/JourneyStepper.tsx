"use client";

import { Check } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";

import { delay } from "./motion";

const STEPS: TranslationKey[] = [
  "vendorOnboarding.journey.step1",
  "vendorOnboarding.journey.step2",
  "vendorOnboarding.journey.step3",
];

/**
 * "Send your details -> Team review -> Start working".
 * `current` is the step the vendor is on right now (1-based): earlier steps
 * are ticked, the current one pulses, later ones are dimmed.
 */
export default function JourneyStepper({ current }: { current: 1 | 2 | 3 }) {
  const { t } = useLanguage();

  return (
    <div
      className="onb-rise rounded-3xl border border-[#eee5df] bg-white/90 p-4 shadow-[0_8px_30px_rgba(48,37,31,0.04)] backdrop-blur sm:p-5"
      style={delay(0)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a47e43] rtl:tracking-normal">
          {t("vendorOnboarding.journey.eyebrow")}
        </p>

        <span className="rounded-full bg-[#faf5ee] px-3 py-1 text-[11px] font-semibold text-[#8e685e]">
          {t("vendorOnboarding.journey.stepOf", {
            current,
            total: STEPS.length,
          })}
        </span>
      </div>

      <ol className="flex items-start">
        {STEPS.map((labelKey, index) => {
          const number = index + 1;
          const done = number < current;
          const active = number === current;
          const isLast = number === STEPS.length;

          return (
            <li
              key={labelKey}
              className={`flex items-start ${isLast ? "" : "flex-1"}`}
            >
              <div className="flex w-20 flex-col items-center gap-2 text-center sm:w-28">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-500 ${
                    done
                      ? "border-[#b99a62] bg-[#b99a62] text-white"
                      : active
                        ? "onb-dot border-[#30251f] bg-[#30251f] text-white"
                        : "border-[#e3d8cf] bg-white text-[#b3a69e]"
                  }`}
                >
                  {done ? <Check size={16} strokeWidth={3} /> : number}
                </span>

                <span
                  className={`text-[11px] font-semibold leading-4 sm:text-xs ${
                    done || active ? "text-[#30251f]" : "text-[#b3a69e]"
                  }`}
                >
                  {t(labelKey)}
                </span>
              </div>

              {!isLast && (
                <div className="relative mt-[17px] h-0.5 flex-1 overflow-hidden rounded-full bg-[#eee5df]">
                  <div
                    className={`absolute inset-y-0 start-0 rounded-full bg-[#b99a62] transition-all duration-700 ${
                      done ? "w-full" : active ? "w-1/2" : "w-0"
                    }`}
                  />
                  {active && (
                    <div className="onb-sweep absolute inset-y-0 start-0 w-1/4 bg-linear-to-r from-transparent via-white/80 to-transparent" />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
