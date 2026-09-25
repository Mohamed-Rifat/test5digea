"use client";

import { Plus, Sparkles } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function VendorsHeader({
  total,
  onAdd,
}: {
  total: number;
  onAdd: () => void;
}) {
  const { t } = useLanguage();

  return (
    <section className="relative mb-7 overflow-hidden">
      <div className="absolute right-[-80px] top-[-100px] h-64 w-64 rounded-full bg-[#f5eee9] blur-3xl" />
      <div className="absolute bottom-[-120px] left-[20%] h-64 w-64 rounded-full bg-[#faf0eb] blur-3xl" />

      <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e7ddd6] bg-[#fbf9f7] px-3 py-1.5">
            <Sparkles
              size={13}
              className="text-[#967966]"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#806b5d]">
              {t('admin.vendors.title')}
            </span>
          </div>

          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#30251f] sm:text-4xl">
              {t('admin.vendors.vendors')}
            </h1>

            <span className="mb-1 rounded-full bg-[#f3efec] px-2.5 py-1 text-xs font-semibold text-[#75675e]">
              {t('admin.vendors.totalCount', { count: total })}
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#766b65]">
            {t('admin.vendors.pageDesc')}
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(48,37,31,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#45362e] hover:shadow-[0_16px_32px_-12px_rgba(48,37,31,0.7)] active:translate-y-0"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 transition group-hover:bg-white/15">
            <Plus size={16} />
          </span>

          {t('admin.vendors.add')}
        </button>
      </div>
    </section>
  );
}
