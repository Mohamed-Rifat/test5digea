"use client";

import { AlertCircle, Camera, ImageIcon, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { delay } from "./motion";

import type { OnboardingFormState } from "./useOnboardingForm";

const CARD =
  "rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8";

type Props = Pick<
  OnboardingFormState,
  | "logoInputRef"
  | "logoFile"
  | "logoSrc"
  | "logoInvalid"
  | "handleLogoSelected"
  | "clearLogo"
>;

/** Optional logo picker with preview. */
export function OnboardingLogoPicker({
  logoInputRef,
  logoFile,
  logoSrc,
  logoInvalid,
  handleLogoSelected,
  clearLogo,
}: Props) {
  const { t } = useLanguage();

  return (
    <section className={`onb-rise ${CARD}`} style={delay(160)}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#faf5ee] shadow-lg ring-1 ring-[#eadfce]">
          {logoSrc ? (
            // Local preview / remote URL: a plain <img> avoids
            // next/image domain configuration.
            <img
              src={logoSrc}
              alt={t("vendorOnboarding.form.logoTitle")}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#c9ad78]">
              <ImageIcon size={30} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-[#30251f]">
            {t("vendorOnboarding.form.logoTitle")}
            <span className="ms-2 text-xs font-normal text-[#756b65]">
              {t("vendor.profile.optional")}
            </span>
          </h2>

          <p className="mt-1 text-xs leading-6 text-[#756b65]">
            {t("vendorOnboarding.form.logoHint")}
          </p>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoSelected}
            className="hidden"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-sm font-semibold text-[#514740] transition hover:bg-[#f7f2ef]"
            >
              <Camera className="h-4 w-4" />
              {logoFile
                ? t("vendorOnboarding.form.logoChange")
                : t("vendorOnboarding.form.logoChoose")}
            </button>

            {logoFile && (
              <button
                type="button"
                onClick={clearLogo}
                className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#9b6d52] transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                {t("vendorOnboarding.form.logoRemove")}
              </button>
            )}
          </div>

          {logoInvalid && (
            <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {t("vendorOnboarding.form.logoInvalid")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
