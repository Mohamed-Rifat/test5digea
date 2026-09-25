"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";

export function SocialIconButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8ddd4] bg-[#faf7f4] text-[#a47e43] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d8c5b0] hover:bg-[#f0e8e0] hover:text-[#30251f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
    >
      {icon}
    </a>
  );
}

export function ContactRow({
  href,
  icon,
  children,
  ariaLabel,
  ltr,
}: {
  href?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  ariaLabel?: string;
  ltr?: boolean;
}) {
  const baseClass =
    "flex min-w-0 items-center gap-3 rounded-2xl bg-[#faf7f4] px-4 py-3 text-sm text-[#5f544d] transition-all duration-200";

  const interactiveClass = href
    ? `${baseClass} hover:bg-[#f0e9e0] hover:text-[#30251f]`
    : baseClass;

  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#a47e43] shadow-sm">
        {icon}
      </span>

      <span dir={ltr ? "ltr" : undefined} className="min-w-0 wrap-break-word">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={interactiveClass}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={baseClass}>
      {content}
    </div>
  );
}

export function ContactCard({
  vendor,
}: {
  vendor: Vendor;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-[#e3d7cd] bg-white p-6 shadow-[0_12px_32px_rgba(48,37,31,0.05)]">

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
          {t("vendors.detail.contact.eyebrow")}
        </p>

        <h2 className="mt-1.5 font-serif text-xl font-light text-[#30251f]">
          {t("vendors.detail.contact.title")}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#958980]">
          {t("vendors.detail.contact.text", { name: vendor.businessName })}
        </p>
      </div>

      <div className="mt-5 space-y-2.5">

        {vendor.contactPhone && (
          <ContactRow
            href={`tel:${vendor.contactPhone}`}
            ltr
            icon={<Phone size={15} />}
            ariaLabel={t("vendors.detail.contact.call", {
              name: vendor.businessName,
            })}
          >
            {vendor.contactPhone}
          </ContactRow>
        )}

        {vendor.contactEmail && (
          <ContactRow
            href={`mailto:${vendor.contactEmail}`}
            ltr
            icon={<Mail size={15} />}
            ariaLabel={t("vendors.detail.contact.email", {
              name: vendor.businessName,
            })}
          >
            {vendor.contactEmail}
          </ContactRow>
        )}

        {vendor.location && (
          <ContactRow
            icon={<MapPin size={15} />}
          >
            {vendor.location}
          </ContactRow>
        )}

        {!vendor.contactPhone &&
          !vendor.contactEmail &&
          !vendor.location && (
            <p className="rounded-2xl bg-[#faf7f4] p-4 text-sm text-[#968a82]">
              {t("vendors.detail.contact.none")}
            </p>
          )}
      </div>
    </div>
  );
}
