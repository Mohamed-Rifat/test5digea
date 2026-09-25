"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-[#eee5df] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(48,37,31,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#faf5ee] text-[#a47e43]">
          {icon}
        </div>

        <span className="rounded-full bg-[#faf8f6] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] rtl:tracking-normal text-[#a4968e]">
          {t("profile.overview.eyebrow")}
        </span>
      </div>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] rtl:tracking-normal text-[#9b8d85]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-semibold tracking-tight text-[#30251f]">
        {value}
      </p>

      <p className="mt-1.5 text-xs leading-5 text-[#9b8d85]">{description}</p>
    </div>
  );
}

export function ActionCard({
  href,
  icon,
  eyebrow,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[26px] border border-[#eee5df] bg-white p-6 shadow-[0_8px_30px_rgba(48,37,31,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#dfd1c6] hover:shadow-[0_18px_45px_rgba(48,37,31,0.09)]"
    >
      <div className="absolute inset-e-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rtl:-translate-x-8 rounded-full bg-[#faf5ee] opacity-70 transition duration-500 group-hover:scale-150" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf5ee] text-[#a47e43] transition duration-300 group-hover:bg-[#30251f] group-hover:text-white">
            {icon}
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eee5df] text-[#a3958c] transition duration-300 group-hover:border-[#30251f] group-hover:bg-[#30251f] group-hover:text-white">
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
            />
          </div>
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
          {eyebrow}
        </p>

        <h3 className="mt-2 text-lg font-semibold text-[#30251f]">{title}</h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#81746d]">
          {description}
        </p>
      </div>
    </Link>
  );
}
