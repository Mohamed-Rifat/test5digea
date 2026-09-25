"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import {
  REQUIREMENTS,
  evaluateRequirements,
  getStrength,
  getStrengthInfo,
} from "./passwordRules";

/** Strength bar + requirement checklist for the vendor password form. */
export function VendorPasswordStrength({ password }: { password: string }) {
  const { t } = useLanguage();

  if (!password) return null;

  const requirements = evaluateRequirements(password);
  const strengthInfo = getStrengthInfo(getStrength(requirements));

  return (
    <div className="mt-3 rounded-2xl bg-[#faf8f6] p-3.5">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e8e1dc]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${strengthInfo.color}`}
            style={{ width: strengthInfo.width }}
          />
        </div>

        <span
          className={`min-w-17 text-end text-[11px] font-semibold ${strengthInfo.text}`}
        >
          {strengthInfo.labelKey ? t(strengthInfo.labelKey) : ""}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {REQUIREMENTS.map((item) => {
          const fulfilled = requirements[item.key];

          return (
            <div
              key={item.key}
              className={`flex items-center gap-1.5 text-[11px] ${
                fulfilled ? "text-[#66806f]" : "text-[#948982]"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  fulfilled ? "bg-[#e2eee6]" : "border border-[#d8d0ca]"
                }`}
              >
                {fulfilled && <Check size={10} />}
              </span>

              {t(item.labelKey)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
