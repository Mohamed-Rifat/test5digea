"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

/** "← Back to sign in" link at the bottom of the password-recovery pages. */
export function BackToSignIn() {
  const { t } = useLanguage();

  return (
    <div className="mt-7 flex justify-center">
      <Link
        href="/login"
        className="group inline-flex items-center gap-2 text-sm font-medium text-[#9a8171] transition-all duration-200 hover:gap-3 hover:text-[#30251f]"
      >
        <ArrowLeft
          size={15}
          className="transition-transform duration-200 rtl:rotate-180 ltr:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
        />
        {t("auth.brand.backToSignIn")}
      </Link>
    </div>
  );
}

/** "— OR —" divider. */
export function AuthDivider({ delay }: { delay?: string }) {
  const { t } = useLanguage();

  return (
    <div
      className="my-7 flex items-center gap-4 animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="h-px flex-1 bg-[#e8e1dc]" />
      <span className="text-[10px] font-medium tracking-[0.18em] text-[#a59a92]">
        {t("auth.brand.or")}
      </span>
      <div className="h-px flex-1 bg-[#e8e1dc]" />
    </div>
  );
}

/** "No account? Create one" style prompt with an animated underline link. */
export function AuthSwitchLink({
  prompt,
  href,
  label,
  delay,
}: {
  prompt: string;
  href: string;
  label: string;
  delay?: string;
}) {
  return (
    <p
      className="text-center text-sm text-[#7b7069] animate-fade-in"
      style={{ animationDelay: delay }}
    >
      {prompt}{" "}
      <Link
        href={href}
        className="group relative font-semibold text-[#30251f] transition-colors duration-200 hover:text-[#9a8171]"
      >
        <span className="relative">
          {label}
          <span className="absolute -bottom-0.5 start-0 h-0.5 w-0 bg-[#9a8171] transition-all duration-300 group-hover:w-full" />
        </span>
      </Link>
    </p>
  );
}

/** "Continue as guest" link. */
export function GuestModeLink({ delay }: { delay?: string }) {
  const { t } = useLanguage();

  return (
    <div
      className="mt-7 flex justify-center animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm font-medium text-[#9a8171] transition-all duration-200 hover:gap-3 hover:text-[#30251f]"
      >
        {t("auth.brand.guestMode")}
      </Link>
    </div>
  );
}
