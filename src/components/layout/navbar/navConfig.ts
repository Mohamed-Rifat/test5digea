import { Store, BriefcaseBusiness } from "lucide-react";
import type { TranslationKey } from "@/locales";

// Primary links rendered before the Categories dropdown.
export const primaryLinks: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: "navbar.home", href: "/" },
  { labelKey: "navbar.services", href: "/services" },
  { labelKey: "navbar.vendors", href: "/vendors" },
];

// Links rendered after the Categories dropdown.
export const secondaryLinks: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: "navbar.about", href: "/about" },
  { labelKey: "navbar.contact", href: "/contact" },
];

// Where the navbar search can jump to (Vendors or Services) — same pattern
// as the admin dashboard's quick search.
export const searchTargets: {
  labelKey: TranslationKey;
  href: string;
  icon: typeof Store;
}[] = [
  { labelKey: "navbar.vendors", href: "/vendors", icon: Store },
  { labelKey: "navbar.services", href: "/services", icon: BriefcaseBusiness },
];

// Shared classes for the underline-on-hover nav link treatment, so the
// primary and secondary links (and the Categories trigger) stay identical.
export const navLinkClass = (active: boolean) =>
  `group relative whitespace-nowrap px-2.5 py-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 xl:px-3 ${
    active ? "text-[#30251f]" : "text-[#71655d] hover:text-[#30251f]"
  }`;

export const navUnderlineClass = (active: boolean) =>
  `pointer-events-none absolute inset-x-3 -bottom-px h-px origin-center rounded-full bg-gradient-to-r from-[#a47e43] via-[#d3b483] to-[#a47e43] transition-transform duration-300 ease-out ${
    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
  }`;
