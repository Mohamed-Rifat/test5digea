"use client";

import { CalendarOff, Globe2, Lock, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { delay } from "../motion";

import type { UnderReviewState } from "./useUnderReview";
import {
  CARD,
  DAYS,
  InfoRow,
  Label,
  SocialPill,
} from "@/components/vendor/onboarding/under-review/underReviewParts";

/** Read-only copy of what the vendor sent. */
export function SubmittedDetails({ review }: { review: UnderReviewState }) {
  const { t } = useLanguage();
  const { data, socialLinks, workingHours, hasSocial, vendor } = review;

  return (
    <section className={`onb-rise ${CARD} overflow-hidden`} style={delay(200)}>
      <div className="flex items-start justify-between gap-3 border-b border-[#f0e9e4] bg-[#fcfaf8] px-6 py-5 sm:px-8">
        <div>
          <h2 className="font-serif text-xl font-light text-[#30251f]">
            {t("vendorOnboarding.review.dataTitle")}
          </h2>
          <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-[#81746d]">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a47e43]" />
            {t("vendorOnboarding.review.dataLocked")}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[#faf5ee] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a47e43] rtl:tracking-normal">
          {t("vendorOnboarding.review.readOnly")}
        </span>
      </div>

      <div className="space-y-7 p-6 sm:p-8">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#30251f] shadow-md ring-1 ring-[#eadfce]">
            {vendor.profileImageUrl ? (
              <img
                loading="lazy"
                decoding="async"
                src={vendor.profileImageUrl}
                alt={data.businessName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
                {data.businessName?.charAt(0)?.toUpperCase() || "V"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-[#30251f]">
              {data.businessName}
            </p>
            {data.slogan && (
              <p className="mt-0.5 text-sm text-[#756b65]">{data.slogan}</p>
            )}
          </div>
        </div>

        {data.bio && (
          <div>
            <Label>{t("vendor.profile.fields.about")}</Label>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#756b65]">
              {data.bio}
            </p>
          </div>
        )}

        {/* Contact */}
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow
            icon={<MapPin className="h-4 w-4" />}
            label={t("vendor.profile.fields.location")}
            value={data.location}
          />
          <InfoRow
            icon={<Phone className="h-4 w-4" />}
            label={t("vendor.profile.fields.phone")}
            value={data.contactPhone}
            ltr
          />
          <div className="sm:col-span-2">
            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              label={t("vendor.profile.fields.email")}
              value={data.contactEmail}
              ltr
            />
          </div>
        </div>

        {/* Social */}
        {hasSocial && (
          <div>
            <Label>{t("vendor.profile.social.title")}</Label>

            <div className="mt-3 flex flex-wrap gap-2">
              <SocialPill
                icon={<FaInstagram className="h-4 w-4" />}
                label="Instagram"
                href={socialLinks.instagram}
              />
              <SocialPill
                icon={<FaFacebookF className="h-4 w-4" />}
                label="Facebook"
                href={socialLinks.facebook}
              />
              <SocialPill
                icon={<FaTiktok className="h-4 w-4" />}
                label="TikTok"
                href={socialLinks.tiktok}
              />
              <SocialPill
                icon={<Globe2 className="h-4 w-4" />}
                label={t("vendor.profile.fields.website")}
                href={socialLinks.website}
              />
            </div>
          </div>
        )}

        {/* Working hours */}
        {DAYS.some(({ key }) => workingHours[key]) && (
          <div>
            <Label>{t("vendor.profile.hours.title")}</Label>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {DAYS.filter(({ key }) => workingHours[key]).map(
                ({ key, labelKey }) => {
                  const isOff = workingHours[key] === "OFF";

                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs ${
                        isOff
                          ? "border border-dashed border-rose-200 bg-rose-50/50 text-rose-500"
                          : "bg-[#fcfaf8] text-[#40352f]"
                      }`}
                    >
                      <span className="font-semibold">{t(labelKey)}</span>

                      {isOff ? (
                        <span className="inline-flex items-center gap-1 font-medium">
                          <CalendarOff className="h-3.5 w-3.5" />
                          {t("vendor.profile.dayOff")}
                        </span>
                      ) : (
                        <span dir="ltr" className="font-medium text-[#756b65]">
                          {workingHours[key]}
                        </span>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
