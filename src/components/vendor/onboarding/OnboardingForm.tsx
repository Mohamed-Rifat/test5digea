"use client";

import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";
import {
  ContactFields,
  IdentityFields,
  SocialLinksFields,
  WorkingHoursFields,
  type VendorFieldsProps,
} from "@/components/vendor/details/VendorFields";

import JourneyStepper from "./JourneyStepper";
import { AboutSidebar } from "./OnboardingAbout";
import { OnboardingIntro } from "./OnboardingIntro";
import { OnboardingLogoPicker } from "./OnboardingLogoPicker";
import { OnboardingSubmitBar } from "./OnboardingSubmitBar";
import { delay } from "./motion";
import { useOnboardingForm } from "./useOnboardingForm";

const CARD =
  "rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8";

/** First-time vendor details form (step 1 of the onboarding journey). */
export default function OnboardingForm({ vendor }: { vendor: Vendor }) {
  const { t } = useLanguage();
  const onb = useOnboardingForm(vendor);

  const fieldProps: VendorFieldsProps = {
    form: onb.form,
    touched: onb.touched,
    errorText: onb.errorText,
    onChange: onb.handleChange,
    onBlur: onb.handleBlur,
    idPrefix: "onb",
  };

  return (
    <main className="mx-auto w-full lg:max-w-10/12 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <JourneyStepper current={1} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          <OnboardingIntro vendor={vendor} isRejected={onb.isRejected} />

          <form
            onSubmit={onb.handleSubmit}
            noValidate
            className="mt-6 space-y-6"
          >
            {(onb.formError || onb.actionError) && (
              <div
                className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
                role="alert"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                {onb.formError ? t(onb.formError) : onb.actionError}
              </div>
            )}

            <OnboardingLogoPicker
              logoInputRef={onb.logoInputRef}
              logoFile={onb.logoFile}
              logoSrc={onb.logoSrc}
              logoInvalid={onb.logoInvalid}
              handleLogoSelected={onb.handleLogoSelected}
              clearLogo={onb.clearLogo}
            />

            <OnboardingSection
              delayMs={220}
              eyebrow={t("vendor.profile.identity.eyebrow")}
              title={t("vendor.profile.identity.title")}
              subtitle={t("vendor.profile.identity.subtitle")}
            >
              <IdentityFields {...fieldProps} />
            </OnboardingSection>

            <OnboardingSection
              delayMs={280}
              eyebrow={t("vendor.profile.contact.eyebrow")}
              title={t("vendor.profile.contact.editTitle")}
              subtitle={t("vendor.profile.contact.editSubtitle")}
            >
              <ContactFields {...fieldProps} emailFullWidth />
            </OnboardingSection>

            <OnboardingSection
              delayMs={340}
              eyebrow={t("vendor.profile.social.eyebrow")}
              title={t("vendor.profile.social.title")}
              subtitle={t("vendor.profile.social.subtitle")}
            >
              <SocialLinksFields
                links={onb.socialLinks}
                onChange={onb.updateSocialLink}
                idPrefix="onb"
                className="grid gap-7 sm:grid-cols-2"
              />
            </OnboardingSection>

            <OnboardingSection
              delayMs={400}
              eyebrow={t("vendor.profile.hours.eyebrow")}
              title={t("vendor.profile.hours.title")}
              subtitle={t("vendor.profile.hours.subtitle")}
            >
              <WorkingHoursFields
                hours={onb.workingHours}
                onChange={onb.updateWorkingHour}
                onToggleDayOff={onb.toggleDayOff}
                className="grid gap-6 sm:grid-cols-2"
              />
            </OnboardingSection>

            <OnboardingSubmitBar
              requiredDone={onb.requiredDone}
              requiredTotal={onb.requiredTotal}
              requiredPercent={onb.requiredPercent}
              submitting={onb.submitting}
              isRejected={onb.isRejected}
            />
          </form>
        </div>

        <AboutSidebar />
      </div>
    </main>
  );
}

function OnboardingSection({
  delayMs,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  delayMs: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className={`onb-rise ${CARD}`} style={delay(delayMs)}>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171] rtl:tracking-normal">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#30251f]">{title}</h2>
        <p className="mt-1 text-sm text-[#756b65]">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
