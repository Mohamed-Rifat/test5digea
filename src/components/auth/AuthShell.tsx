"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";

interface AuthShellProps {
  /** Translation namespace of the page, e.g. "loginPage" → auth.loginPage.* */
  page: string;
  /** Page heading (h1) on the form side. */
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional badge shown above the heading. */
  icon?: ReactNode;
  children: ReactNode;
}

/** Two-column layout shared by every auth page: brand hero + form card. */
export default function AuthShell({
  page,
  title,
  subtitle,
  icon,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#faf8f6] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <div className="grid w-full overflow-hidden rounded-sm border border-[#e8e1dc] bg-white shadow-[0_24px_80px_rgba(48,37,31,0.08)] transition-all duration-500 hover:shadow-[0_32px_100px_rgba(48,37,31,0.15)] lg:min-h-170 lg:grid-cols-2">
          <AuthHero page={page} />

          <section className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
            <div className="w-full max-w-107.5 text-center">
              <Link
                href="/"
                className="mb-2 inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:opacity-70"
              >
                <Image
                  src="/Logo.png"
                  alt="5digea"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </Link>

              <div className="mb-9">
                {icon && (
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#faf5ee] text-[#a47e43]">
                    {icon}
                  </div>
                )}

                <h1
                  className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] rtl:tracking-normal rtl:leading-snug text-[#30251f] sm:text-4xl animate-slide-up"
                  style={{ animationDelay: "0.05s" }}
                >
                  {title}
                </h1>

                {subtitle && (
                  <p
                    className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#7b7069] animate-slide-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function AuthHero({ page }: { page: string }) {
  const { t } = useLanguage();

  return (
    <section className="relative hidden animate-slide-in-left overflow-hidden bg-[#30251f] lg:flex">
      <div className="absolute -left-32 -top-32 h-80 w-80 animate-pulse-slow rounded-full bg-white/4 blur-3xl" />
      <div
        className="absolute -bottom-32 -right-20 h-96 w-96 animate-pulse-slow rounded-full bg-[#9a8171]/10 blur-3xl"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
        <Link
          href="/"
          className="w-fit text-3xl font-semibold tracking-[0.2em] text-white transition-all duration-300 hover:scale-105 hover:opacity-80"
        >
          5Digea
        </Link>

        <div className="max-w-lg">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#d8c8bc]" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] rtl:tracking-normal text-[#d8c8bc]">
              {t(`auth.${page}.eyebrow` as TranslationKey)}
            </p>
          </div>

          <h2 className="animate-slide-up text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[3.25rem] rtl:leading-[1.4] rtl:tracking-normal">
            {t(`auth.${page}.heroTitle` as TranslationKey)}
          </h2>

          <p
            className="mt-7 max-w-md text-[15px] leading-7 text-[#d9d0ca] animate-slide-up"
            style={{ animationDelay: "0.15s" }}
          >
            {t(`auth.${page}.heroText` as TranslationKey)}
          </p>
        </div>

        <p
          className="text-sm tracking-wide rtl:tracking-normal text-[#bdb1a8] animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          {t("auth.brand.tagline")}
        </p>
      </div>
    </section>
  );
}
