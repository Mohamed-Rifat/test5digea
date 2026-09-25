"use client";

import { Clock3, Globe2, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import { useLanguage } from "@/context/LanguageContext";
import { DAYS_OF_WEEK } from "./profileUtils";
import { InfoRow, SocialCard } from "./ProfileViewBits";
import type { VendorProfileForm } from "./useVendorProfileForm";

/** Read-only profile: about, contact, social links and working hours. */
export function ProfileDetailsView({
  profile,
}: {
  profile: VendorProfileForm;
}) {
  const { t } = useLanguage();
  const { form, socialLinks, workingHours } = profile;
  const setIsEditing = profile.setIsEditing;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* About */}
        <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] lg:col-span-2">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
              {t("vendor.profile.view.aboutEyebrow")}
            </p>

            <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
              {t("vendor.profile.view.aboutTitle")}
            </h3>
          </div>

          <p className="whitespace-pre-line text-sm leading-7 text-[#756b65]">
            {form.bio || t("vendor.profile.view.bioEmpty")}
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)]">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
              {t("vendor.profile.contact.eyebrow")}
            </p>

            <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
              {t("vendor.profile.contact.viewTitle")}
            </h3>
          </div>

          <div className="space-y-4">
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              label={t("vendor.profile.fields.location")}
              value={form.location}
            />

            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              label={t("vendor.profile.fields.phone")}
              value={form.contactPhone}
              ltr
            />

            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              label={t("vendor.profile.fields.email")}
              value={form.contactEmail}
              ltr
            />
          </div>
        </section>
      </div>

      <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
              {t("vendor.profile.social.connectEyebrow")}
            </p>

            <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
              {t("vendor.profile.social.followTitle")}
            </h3>

            <p className="mt-1 text-sm text-[#756b65]">
              {t("vendor.profile.social.followText")}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.instagram && (
            <SocialCard
              icon={<FaInstagram className="h-6 w-6" />}
              label="Instagram"
              handle={socialLinks.instagram}
              href={socialLinks.instagram}
            />
          )}

          {socialLinks.facebook && (
            <SocialCard
              icon={<FaFacebookF className="h-6 w-6" />}
              label="Facebook"
              handle={socialLinks.facebook}
              href={socialLinks.facebook}
            />
          )}

          {socialLinks.tiktok && (
            <SocialCard
              icon={<FaTiktok className="h-6 w-6" />}
              label="TikTok"
              handle={socialLinks.tiktok}
              href={socialLinks.tiktok}
            />
          )}

          {socialLinks.website && (
            <SocialCard
              icon={<Globe2 className="h-6 w-6" />}
              label={t("vendor.profile.fields.website")}
              handle={socialLinks.website}
              href={socialLinks.website}
            />
          )}

          {!socialLinks.instagram &&
            !socialLinks.facebook &&
            !socialLinks.tiktok &&
            !socialLinks.website && (
              <div className="sm:col-span-2 lg:col-span-4 rounded-2xl border border-dashed border-[#ded4cc] bg-[#fcfaf8] p-8 text-center">
                <p className="text-sm font-medium text-[#514740]">
                  {t("vendor.profile.social.none")}
                </p>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="mt-3 text-sm font-semibold text-[#9b6d52] hover:underline"
                >
                  {t("vendor.profile.social.add")}
                </button>
              </div>
            )}
        </div>
      </section>

      <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
            {t("vendor.profile.hours.eyebrow")}
          </p>

          <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
            {t("vendor.profile.hours.title")}
          </h3>
        </div>

        {Object.keys(workingHours).length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(workingHours).map(([day, hours]) => {
              const dayKey = DAYS_OF_WEEK.find((d) => d.key === day)?.labelKey;
              const dayLabel = dayKey ? t(dayKey) : day;
              const isOff = hours === "OFF";

              return (
                <div
                  key={day}
                  className={`flex items-center justify-between rounded-2xl px-4 py-4 ${
                    isOff
                      ? "bg-rose-50/50 border border-dashed border-rose-200"
                      : "bg-[#fcfaf8]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ${
                        isOff ? "text-rose-400" : "text-[#806a5b]"
                      }`}
                    >
                      <Clock3 className="h-4 w-4" />
                    </div>

                    <span
                      className={`text-sm font-semibold capitalize ${
                        isOff ? "text-rose-500" : "text-[#40352f]"
                      }`}
                    >
                      {dayLabel}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      isOff ? "text-rose-500" : "text-[#756b65]"
                    }`}
                  >
                    {isOff ? t("vendor.profile.dayOff") : hours}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#ded4cc] bg-[#fcfaf8] p-8 text-center">
            <Clock3 className="mx-auto h-7 w-7 text-[#9b8171]" />

            <p className="mt-3 text-sm font-medium text-[#514740]">
              {t("vendor.profile.hours.none")}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
