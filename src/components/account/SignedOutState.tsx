"use client";

import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Shown on /change-password when nobody is signed in. */
export default function SignedOutState() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-4 py-20">
      <div className="w-full max-w-md overflow-hidden rounded-4xl border border-[#eee5df] bg-white shadow-[0_20px_60px_rgba(48,37,31,0.08)]">
        <div className="h-2 bg-[#30251f]" />

        <div className="p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#faf5ee] text-[#a47e43]">
            <KeyRound size={26} strokeWidth={1.7} />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.24em] rtl:tracking-normal text-[#a47e43]">
            {t("auth.changePasswordPage.signedOutEyebrow")}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-light text-[#30251f]">
            {t("auth.changePasswordPage.signedOutTitle")}
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#81746d]">
            {t("auth.changePasswordPage.signedOutText")}
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#30251f] px-6 text-sm font-semibold text-white transition hover:bg-[#45362d]"
          >
            {t("auth.signIn")}
            <ArrowLeft size={15} className="rotate-180 rtl:rotate-0" />
          </Link>
        </div>
      </div>
    </main>
  );
}
