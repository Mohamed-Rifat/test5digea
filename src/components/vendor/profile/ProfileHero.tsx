"use client";

import { Camera, Edit3, Loader2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { STATUS_BADGE_CLASSES, STATUS_KEYS } from "./profileUtils";
import type { VendorProfileForm } from "./useVendorProfileForm";

/** Cover, avatar (with change-photo button), name, status and slogan. */
export function ProfileHero({ profile }: { profile: VendorProfileForm }) {
  const { t } = useLanguage();
  const {
    vendor,
    form,
    isLocked,
    isUploadingProfileImage,
    profileImageInputRef,
    handleProfileImageSelected,
  } = profile;

  return (
    <section className="relative overflow-hidden rounded-4xl border border-[#e8dfd8] bg-white shadow-[0_20px_60px_rgba(48,37,31,0.06)]">
      <div className="h-36 bg-linear-to-br from-[#d9c5b7] via-[#eaded5] to-[#f7f1ed]" />

      <div className="relative px-6 pb-7 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div className="relative h-24 w-24 shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-[#30251f] shadow-lg">
                {vendor?.profileImageUrl ? (
                  <img
                    loading="lazy"
                    decoding="async"
                    src={vendor.profileImageUrl}
                    alt={form.businessName || t("vendor.header.vendor")}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white">
                    {form.businessName?.charAt(0)?.toUpperCase() || "V"}
                  </div>
                )}
              </div>

              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                disabled={isUploadingProfileImage}
                onChange={handleProfileImageSelected}
                className="hidden"
              />

              {/* Always-visible edit badge — not hidden behind
                  hover, so it's discoverable on touch devices too. */}
              <button
                type="button"
                onClick={() => profileImageInputRef.current?.click()}
                disabled={isUploadingProfileImage || isLocked}
                title={
                  isLocked ? t("vendor.profile.pending.buttonHint") : undefined
                }
                aria-label={t("vendor.profile.view.changePhoto")}
                className="absolute -bottom-1 -end-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#30251f] text-white shadow-md transition hover:bg-[#463831] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUploadingProfileImage ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
                  {form.businessName || t("vendor.profile.defaultName")}
                </h2>

                {vendor?.status && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_BADGE_CLASSES[vendor.status] ??
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUS_KEYS[vendor.status]
                      ? t(STATUS_KEYS[vendor.status])
                      : vendor.status}
                  </span>
                )}
              </div>

              {form.slogan && (
                <p className="mt-1 text-sm text-[#756b65]">{form.slogan}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => profile.setIsEditing(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-sm font-semibold text-[#514740] transition hover:bg-[#f7f2ef]"
          >
            <Edit3 className="h-4 w-4" />
            {t("vendor.profile.view.editProfile")}
          </button>
        </div>
      </div>
    </section>
  );
}
