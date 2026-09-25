"use client";

import { Check } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";
import {
  PASSWORD_REQUIREMENT_KEYS,
  checkPassword,
  passwordStrength,
} from "./passwordStrength";

interface PasswordStrengthMeterProps {
  password: string;
  /** Show the "e.g. Aa@12345" example line. */
  showExample?: boolean;
}

/** Strength bar + requirement checklist shown under a new-password field. */
export default function PasswordStrengthMeter({
  password,
  showExample = false,
}: PasswordStrengthMeterProps) {
  const { t } = useLanguage();

  if (!password) return null;

  const requirements = checkPassword(password);
  const strength = passwordStrength(password);
  const info = strengthInfo(strength, t);

  return (
    <div className="mt-2 space-y-2 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${info.color}`}
            style={{ width: info.width }}
          />
        </div>
        <span className={`text-xs font-medium transition-colors duration-300 ${info.textColor}`}>
          {info.text}
        </span>
      </div>

      {showExample && (
        <div className="mt-2 border-t border-gray-100/80 pt-1">
          <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className="text-gray-300">💡</span>
            <span>
              {t("auth.passwordStrength.example")}{" "}
              <span className="rounded border border-gray-100/60 bg-gray-50/80 px-1.5 py-0.5 font-mono text-gray-500">
                Aa@12345
              </span>
            </span>
            <span className="text-[10px] text-gray-300">
              {t("auth.passwordStrength.exampleHint")}
            </span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 text-start">
        {PASSWORD_REQUIREMENT_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            {requirements[key] ? (
              <Check size={12} className="shrink-0 text-emerald-500" />
            ) : (
              <div className="h-3 w-3 shrink-0 rounded-full border border-gray-300" />
            )}
            <span
              className={`transition-colors duration-300 ${
                requirements[key] ? "text-emerald-700" : "text-gray-500"
              }`}
            >
              {t(`auth.passwordRequirements.${key}` as TranslationKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function strengthInfo(strength: number, t: (key: TranslationKey) => string) {
  if (strength === 0)
    return { color: "bg-gray-200", text: "", width: "0%", textColor: "text-gray-400" };
  if (strength <= 20)
    return { color: "bg-red-500", text: t("auth.passwordStrength.weak"), width: "20%", textColor: "text-red-500" };
  if (strength <= 40)
    return { color: "bg-orange-500", text: t("auth.passwordStrength.fair"), width: "40%", textColor: "text-yellow-600" };
  if (strength <= 60)
    return { color: "bg-yellow-500", text: t("auth.passwordStrength.good"), width: "60%", textColor: "text-blue-600" };
  if (strength <= 80)
    return { color: "bg-blue-500", text: t("auth.passwordStrength.strong"), width: "80%", textColor: "text-emerald-600" };
  return { color: "bg-emerald-500", text: t("auth.passwordStrength.veryStrong"), width: "100%", textColor: "text-emerald-600" };
}
