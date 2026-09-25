"use client";

import { Plus, Search, Store } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function EmptyVendors({
  hasFilters,
  onClear,
  onCreate,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onCreate: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-[28px] border border-dashed border-[#dcd3cd] bg-white px-6 py-20 text-center shadow-[0_8px_28px_rgba(48,37,31,0.025)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f4efec] text-[#8b7464]">
        {hasFilters ? (
          <Search size={25} />
        ) : (
          <Store size={25} />
        )}
      </div>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b7b67]">
        {hasFilters ? t('admin.vendors.noMatching') : t('admin.vendors.title')}
      </p>

      <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#30251f]">
        {hasFilters ? t('admin.vendors.noVendorsFound') : t('admin.vendors.noVendorsYet')}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#766b65]">
        {hasFilters ? t('admin.vendors.adjustFilters') : t('admin.vendors.noVendorsDesc')}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="h-11 rounded-xl border border-[#ddd4ce] px-5 text-sm font-semibold text-[#5f544e] transition hover:bg-[#f8f5f3]"
          >
            {t('admin.vendors.clearFilters')}
          </button>
        )}

        {!hasFilters && (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-5 text-sm font-semibold text-white transition hover:bg-[#45362e]"
          >
            <Plus size={16} />
            {t('admin.vendors.add')}
          </button>
        )}
      </div>
    </div>
  );
}
