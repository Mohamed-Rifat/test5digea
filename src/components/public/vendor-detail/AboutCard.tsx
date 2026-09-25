"use client";

import { Building2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";

export function AboutCard({
  vendor,
}: {
  vendor: Vendor;
}) {
  const { t } = useLanguage();

  if (!vendor.bio) return null;

  return (
    <section className="rounded-xl border border-[#e3d7cd] bg-white p-6 shadow-[0_12px_32px_rgba(48,37,31,0.05)] ">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
          {t("vendors.detail.about.eyebrow")}
        </p>

        <h2 className="mt-1.5 flex items-center gap-2 font-serif text-xl font-light text-[#30251f]">
          <Building2
            size={17}
            className="text-[#a47e43]"
          />
          {t("vendors.detail.about.title")}
        </h2>
      </div>

      <div className="mt-5 rounded-2xl p-4">
        <p className="whitespace-pre-line text-sm leading-7 text-[#958980]">
          {vendor.bio}
        </p>
      </div>
    </section>
  );
}
