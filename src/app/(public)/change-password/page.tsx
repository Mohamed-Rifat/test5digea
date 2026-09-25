"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ChangePasswordAside } from "@/components/account/ChangePasswordAside";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import SignedOutState from "@/components/account/SignedOutState";

export default function ChangePasswordPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  if (!isAuthenticated) return <SignedOutState />;

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto w-full xl:max-w-10/12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          href="/profile"
          className="group mb-7 inline-flex items-center gap-2 text-xs font-semibold text-[#8e7c72] transition hover:text-[#30251f]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e6ddd6] bg-white transition group-hover:border-[#cfc0b5]">
            <ArrowLeft size={14} className="rtl:rotate-180" />
          </span>
          {t("auth.changePasswordPage.backToAccount")}
        </Link>

        <div className="mb-8 lg:mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] rtl:tracking-normal text-[#a47e43]">
            {t("auth.changePasswordPage.eyebrow")}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-light tracking-tight rtl:tracking-normal text-[#30251f] sm:text-4xl lg:text-[44px]">
            {t("auth.changePasswordPage.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#81746d]">
            {t("auth.changePasswordPage.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <ChangePasswordAside />
          <ChangePasswordForm />
        </div>

        <div className="mt-7 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] rtl:tracking-normal text-[#aaa099]">
          <ShieldCheck size={13} />
          {t("auth.changePasswordPage.reassurance")}
        </div>
      </div>
    </main>
  );
}
