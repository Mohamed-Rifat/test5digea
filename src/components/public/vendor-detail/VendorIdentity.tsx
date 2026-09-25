"use client";

import { BadgeCheck, Building2, Globe2, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import { useLanguage } from "@/context/LanguageContext";
import RatingStars from "@/components/shared/RatingStars";
import RoadmapPickButton from "@/components/roadmap/RoadmapPickButton";
import type { Vendor } from "@/types/vendor";
import { SocialIconButton } from "./ContactCard";
import type { VendorDetail } from "./useVendorDetail";

type VendorIdentityProps = { vendor: Vendor } & Pick<
  VendorDetail,
  "roadmapPicker" | "roadmapTargets" | "socialLinks" | "hasSocialLinks"
>;

/** Logo, name, slogan, rating, location, roadmap buttons and social links. */
export function VendorIdentity({
  vendor,
  roadmapPicker,
  roadmapTargets,
  socialLinks,
  hasSocialLinks,
}: VendorIdentityProps) {
  const { t } = useLanguage();

  return (
    <section className="relative -mt-14 bg-transparent p-4 sm:-mt-16 sm:p-7">

      <div className="flex items-center gap-3 sm:items-start sm:gap-5">

        {/* Logo */}
        <div className="relative h-20 w-20 shrink-0 sm:h-28 sm:w-28">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#f4eee9] shadow-md ring-1 ring-[#e8ddd4]">

            {vendor.profileImageUrl ? (
              <img
                src={vendor.profileImageUrl}
                alt={vendor.businessName}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2
                size={38}
                className="text-[#a47e43]"
              />
            )}
          </div>

          {/* Verified */}
          <span
            className="absolute -bottom-1 -end-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#a47e43] text-white shadow-sm"
            title={t("vendors.detail.verified")}
          >
            <BadgeCheck size={13} />
          </span>
        </div>

        {/* Vendor information + social on the right */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

          {/* Text block */}
          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="wrap-break-word font-serif text-xl font-light leading-tight rtl:leading-snug tracking-[-0.02em] rtl:tracking-normal text-[#30251f] sm:text-3xl">
                {vendor.businessName}
              </h1>
            </div>

            {vendor.slogan && (
              <p className="mt-1.5 max-w-2xl text-sm italic rtl:not-italic leading-6 text-[#a47e43]">
                {vendor.slogan}
              </p>
            )}

            <div className="mt-2 flex min-w-0 flex-col items-start gap-1.5 sm:mt-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
              <RatingStars
                rating={vendor.averageRating}
                reviewsCount={vendor.reviewsCount}
              />

              {vendor.location && (
                <span className="flex min-w-0 max-w-full items-center gap-1.5 text-xs text-[#9b8f86] sm:text-sm">
                  <MapPin
                    size={13}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {vendor.location}
                  </span>
                </span>
              )}
            </div>

            {/* Add to wedding roadmap */}
            {(roadmapTargets.length > 0 ||
              roadmapPicker.isGuest ||
              (roadmapPicker.canUse && roadmapPicker.ready && !roadmapPicker.roadmap)) && (
              <div className="mt-4 flex max-w-2xl flex-col gap-2 sm:flex-row sm:flex-wrap">
                {roadmapTargets.length > 0 ? (
                  roadmapTargets.map((item) => (
                    <RoadmapPickButton
                      key={String(item.categoryId)}
                      picker={roadmapPicker}
                      vendor={{ id: vendor.id, name: vendor.businessName }}
                      item={item}
                      size="sm"
                      showCategory={roadmapTargets.length > 1}
                      className="sm:w-auto sm:min-w-60"
                    />
                  ))
                ) : (
                  <RoadmapPickButton
                    picker={roadmapPicker}
                    vendor={{ id: vendor.id, name: vendor.businessName }}
                    item={null}
                    size="sm"
                    className="sm:w-auto sm:min-w-60"
                  />
                )}
              </div>
            )}
          </div>

          {/* Social icons — right side */}
          {hasSocialLinks && (
            <div className="flex shrink-0 items-center gap-2.5 sm:pt-1">
              {socialLinks.instagram && (
                <SocialIconButton
                  href={socialLinks.instagram}
                  icon={
                    <FaInstagram className="h-4 w-4" />
                  }
                  label="Instagram"
                />
              )}

              {socialLinks.facebook && (
                <SocialIconButton
                  href={socialLinks.facebook}
                  icon={
                    <FaFacebookF className="h-4 w-4" />
                  }
                  label="Facebook"
                />
              )}

              {socialLinks.tiktok && (
                <SocialIconButton
                  href={socialLinks.tiktok}
                  icon={
                    <FaTiktok className="h-4 w-4" />
                  }
                  label="TikTok"
                />
              )}

              {socialLinks.website && (
                <SocialIconButton
                  href={socialLinks.website}
                  icon={<Globe2 size={16} />}
                  label={t("vendors.detail.website")}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
