"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import Image from "next/image";

import { useLanguage } from "@/context/LanguageContext";
import { SOCIAL_LINKS } from "@/lib/site";
import type { TranslationKey } from "@/locales";

const footerLinks: Record<
  string,
  { labelKey: TranslationKey; href: string }[]
> = {
  discover: [
    { labelKey: "footer.vendors", href: "/vendors" },
    { labelKey: "footer.services", href: "/services" },
    { labelKey: "footer.browseByCategory", href: "/vendors" },
    { labelKey: "footer.compare", href: "/compare" },
  ],

  forCouples: [
    { labelKey: "footer.favorites", href: "/favorites" },
    { labelKey: "footer.weddingRoadmap", href: "/roadmap" },
    { labelKey: "footer.myProfile", href: "/profile" },
  ],

  company: [
    { labelKey: "footer.aboutUs", href: "/about" },
    { labelKey: "footer.contactUs", href: "/contact" },
    { labelKey: "footer.helpCenter", href: "/support" },
  ],
};

// Only profiles configured in NEXT_PUBLIC_*_URL are shown (no dead "#" links).
const socialLinks = [
  { label: "Instagram", href: SOCIAL_LINKS.instagram, icon: FaInstagram },
  { label: "Facebook", href: SOCIAL_LINKS.facebook, icon: FaFacebookF },
  { label: "TikTok", href: SOCIAL_LINKS.tiktok, icon: FaTiktok },
].filter((social) => social.href);

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden bg-[#30251f] text-white">
      {/* =========================================================
          BACKGROUND DETAILS
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#cdb9aa]/5 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-[#cdb9aa]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full 2xl:max-w-10/12 px-5 sm:px-8 lg:px-10 xl:px-12">
        {/* =======================================================
            MAIN FOOTER CONTENT
        ======================================================= */}
        <div className="grid gap-12 py-14 sm:gap-14 sm:py-16 lg:grid-cols-[minmax(260px,1.15fr)_2fr] lg:gap-16 lg:pt-12 lg:pb-6 xl:gap-24">
          {/* =====================================================
              BRAND
          ===================================================== */}
          <div className="max-w-md">
            <Link href="/" className="group inline-flex items-center">
              <Image
                src="/Logo.png"
                alt="5digea"
                width={80}
                height={80}
                className="object-contain"
              />
              <span className="text-[30px] font-semibold leading-none tracking-[-0.06em] text-white transition-opacity duration-300 group-hover:opacity-80">
                5digea
                <span className="text-[#cdb9aa]">.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-90 text-[13px] leading-6 text-white/45 sm:text-sm sm:leading-7">
              {t("footer.tagline")}
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-3">
              <a
                href="mailto:hello@5digea.com"
                className="group flex w-fit items-center gap-3 text-[13px] text-white/45 transition-colors duration-300 hover:text-white sm:text-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/3 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.07]">
                  <Mail className="h-3.5 w-3.5" />
                </span>

                <span dir="ltr">hello@5digea.com</span>
              </a>

              <a
                href="tel:+201222800121"
                className="group flex w-fit items-center gap-3 text-[13px] text-white/45 transition-colors duration-300 hover:text-white sm:text-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/3 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.07]">
                  <Phone className="h-3.5 w-3.5" />
                </span>

                <span dir="ltr">+20 122 280 0121</span>
              </a>

              <div className="flex items-center gap-3 text-[13px] text-white/45 sm:text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/3">
                  <MapPin className="h-3.5 w-3.5" />
                </span>

                <span>{t("footer.location")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-x-10 lg:pt-8 ">
            {/* Discover */}
            <FooterColumn
              title={t("footer.discover")}
              links={footerLinks.discover}
            />

            {/* For Couples */}
            <FooterColumn
              title={t("footer.forCouples")}
              links={footerLinks.forCouples}
            />

            {/* Company */}
            <FooterColumn
              title={t("footer.company")}
              links={footerLinks.company}
            />
          </div>
        </div>

        {/* =======================================================
            DIVIDER
        ======================================================= */}
        <div className="h-px w-full bg-white/10" />

        {/* =======================================================
    FOOTER BOTTOM
======================================================= */}
        <div className="flex items-center justify-between gap-4 py-6 sm:py-7">
          {/* Copyright */}
          <p className="text-[14px] leading-5 text-white/30 sm:text-xs">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>

          {/* Social */}
          <div className="flex shrink-0 items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white sm:h-9 sm:w-9"
                >
                  <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===============================================================
   FOOTER COLUMN
================================================================ */

interface FooterColumnProps {
  title: string;
  links: {
    labelKey: TranslationKey;
    href: string;
  }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] rtl:tracking-normal text-[#cdb9aa] sm:text-[11px]">
        {title}
      </h3>

      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.labelKey}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-[13px] text-white/45 transition-colors duration-300 hover:text-white sm:text-sm"
            >
              <span>{t(link.labelKey)}</span>

              <ArrowUpRight className="h-3 w-3 -translate-y-0.5 opacity-0 transition-all duration-300 rtl:-scale-x-100 ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:opacity-60" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
