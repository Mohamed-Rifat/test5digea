"use client";

import { AlertCircle, CheckCircle2, Save } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import {
  ContactFields,
  IdentityFields,
  SocialLinksFields,
  WorkingHoursFields,
  type VendorFieldsProps,
} from "@/components/vendor/details/VendorFields";
import { ProfileSection } from "./ProfileSection";
import type { VendorProfileForm } from "./useVendorProfileForm";

/** The vendor profile edit form: identity, contact, social, hours, save bar. */
export function ProfileEditForm({ profile }: { profile: VendorProfileForm }) {
  const { t } = useLanguage();
  const { formError, actionError } = profile;

  const fieldProps: VendorFieldsProps = {
    form: profile.form,
    touched: profile.touchedFields,
    errorText: profile.errorText,
    onChange: profile.handleChange,
    onBlur: profile.handleBlur,
    idPrefix: "profile",
  };

  return (
    <form onSubmit={profile.handleSubmit} noValidate className="space-y-6">
      {(formError || actionError) && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {formError ? t(formError) : actionError}
        </div>
      )}

      <ProfileSection
        eyebrow={t("vendor.profile.identity.eyebrow")}
        title={t("vendor.profile.identity.title")}
        subtitle={t("vendor.profile.identity.subtitle")}
      >
        <IdentityFields {...fieldProps} />
      </ProfileSection>

      <ProfileSection
        eyebrow={t("vendor.profile.contact.eyebrow")}
        title={t("vendor.profile.contact.editTitle")}
        subtitle={t("vendor.profile.contact.editSubtitle")}
      >
        <ContactFields {...fieldProps} />
      </ProfileSection>

      <ProfileSection
        eyebrow={t("vendor.profile.social.eyebrow")}
        title={t("vendor.profile.social.title")}
        subtitle={t("vendor.profile.social.subtitle")}
      >
        <SocialLinksFields
          links={profile.socialLinks}
          onChange={profile.updateSocialLink}
          idPrefix="profile"
        />
      </ProfileSection>

      <ProfileSection
        eyebrow={t("vendor.profile.hours.eyebrow")}
        title={t("vendor.profile.hours.title")}
        subtitle={t("vendor.profile.hours.subtitle")}
      >
        <WorkingHoursFields
          hours={profile.workingHours}
          onChange={profile.updateWorkingHour}
          onToggleDayOff={profile.toggleDayOff}
        />
      </ProfileSection>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-4xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-[#30251f]">
            {t("vendor.profile.save.readyTitle")}
          </p>
          <p className="mt-1 text-xs text-[#756b65]">
            {t("vendor.profile.save.readyText")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={profile.handleCancel}
            className="h-11 rounded-xl px-5 text-sm font-semibold text-[#514740] transition hover:bg-[#f7f2ef]"
          >
            {t("vendor.profile.cancel")}
          </button>

          <button
            type="submit"
            disabled={profile.isSaving}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#30251f] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#463831] disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {profile.isSaving
              ? t("vendor.profile.save.saving")
              : t("vendor.profile.save.save")}
          </button>

          {profile.success && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              {t("vendor.profile.save.saved")}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
