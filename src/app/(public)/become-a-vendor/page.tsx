"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  ApplicationError,
  ApplicationFormHeader,
} from "@/components/public/become-vendor/ApplicationFormHeader";
import { ApplicationSuccess } from "@/components/public/become-vendor/ApplicationSuccess";
import { VendorApplicationForm } from "@/components/public/become-vendor/VendorApplicationForm";
import { VendorPerksAside } from "@/components/public/become-vendor/VendorPerksAside";
import { useBecomeVendorForm } from "@/components/public/become-vendor/useBecomeVendorForm";

export default function BecomeAVendorPage() {
  const { t } = useLanguage();
  const form = useBecomeVendorForm();

  return (
    <main className="min-h-screen bg-[#f7f3ee] px-4 py-10 text-[#30251f] sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto lg:max-w-10/12">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="mt-5 font-serif text-3xl font-light leading-[1.15] tracking-tight text-[#30251f] sm:text-4xl lg:text-[46px]">
            {t("becomeVendor.hero.titleLine1")}
            <span className="block italic text-[#a47e43]">
              {t("becomeVendor.hero.titleLine2")}
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#766d67] sm:text-[15px]">
            {t("becomeVendor.hero.subtitle")}
          </p>
        </section>

        <div className="mt-10 grid gap-6 lg:mt-12 2xl:grid-cols-[1.50fr_0.50fr] lg:items-start lg:gap-8">
          <section className="overflow-hidden rounded-3xl border border-[#e8dfd8] bg-white shadow-[0_16px_60px_rgba(71,52,36,0.07)]">
            {form.submitted ? (
              <ApplicationSuccess />
            ) : (
              <>
                <ApplicationFormHeader />

                <div className="px-5 py-6 sm:px-7 sm:py-7">
                  {form.error && (
                    <ApplicationError
                      error={form.error}
                      onDismiss={() => form.setError("")}
                    />
                  )}

                  <VendorApplicationForm form={form} />
                </div>
              </>
            )}
          </section>

          <VendorPerksAside />
        </div>
      </div>
    </main>
  );
}
