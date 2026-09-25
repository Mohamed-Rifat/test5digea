"use client";

import { useLanguage } from "@/context/LanguageContext";

export function StatCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="group rounded-xl border border-[#ebe3dd] bg-white px-3 py-3 shadow-[0_2px_10px_rgba(48,37,31,0.03)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_7px_20px_rgba(48,37,31,0.06)] sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7f1ed] text-[#806d61] transition group-hover:bg-[#30251f] group-hover:text-white sm:h-9 sm:w-9">
          {icon}
        </div>

        <span className="hidden text-[9px] font-medium uppercase tracking-widest text-[#b0a29a] sm:block">
          {t("admin.categories.overview")}
        </span>
      </div>

      <p className="mt-2 text-[10px] font-medium text-[#94867e] sm:mt-3 sm:text-xs">
        {label}
      </p>

      <div className="mt-0.5 flex items-end justify-between gap-2">
        <p className="text-xl font-semibold tracking-tight text-[#30251f] sm:text-2xl">
          {value}
        </p>

        <p className="hidden pb-0.5 text-[9px] text-[#aaa098] sm:block">
          {description}
        </p>
      </div>
    </div>
  );
}

export function CategoriesHeaderSkeleton() {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2.5">
        <div className="h-3 w-28 animate-pulse rounded bg-[#eee8e3]" />

        <div className="h-8 w-44 animate-pulse rounded-lg bg-[#eee8e3]" />

        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[#f3eee9]" />
      </div>

      <div className="flex gap-2.5">
        <div className="h-10 w-24 animate-pulse rounded-xl bg-[#eee8e3]" />

        <div className="h-10 w-32 animate-pulse rounded-xl bg-[#eee8e3]" />
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="mb-5 grid grid-cols-3 gap-2.5 sm:gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-[#ebe3dd] bg-white px-3 py-3 shadow-[0_2px_10px_rgba(48,37,31,0.03)] sm:p-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-[#eee8e3] sm:h-9 sm:w-9" />

            <div className="hidden h-2.5 w-14 animate-pulse rounded bg-[#f3eee9] sm:block" />
          </div>

          <div className="mt-3 h-2.5 w-14 animate-pulse rounded bg-[#f0e9e4]" />

          <div className="mt-1.5 h-6 w-10 animate-pulse rounded bg-[#eee8e3]" />
        </div>
      ))}
    </div>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className="mb-5 rounded-xl border border-[#ebe3dd] bg-white p-3">
      <div className="flex flex-col gap-2.5 lg:flex-row">
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-[#f1ece8]" />

        <div className="h-10 w-full animate-pulse rounded-lg bg-[#f1ece8] sm:w-36" />

        <div className="hidden h-7 w-20 animate-pulse rounded bg-[#f5efeb] lg:block" />
      </div>
    </div>
  );
}

export function CategoriesSkeleton() {
  return (
    <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-[#ebe3dd] bg-white shadow-[0_2px_10px_rgba(48,37,31,0.025)]"
        >
          {/* IMAGE AREA */}

          <div className="relative h-32 animate-pulse bg-[#f3eee9]">
            {/* Fake status */}

            <div className="absolute left-3 top-3 h-5 w-14 rounded-full bg-[#e9e2dd]" />

            {/* Fake menu */}

            <div className="absolute right-3 top-3 h-8 w-8 rounded-lg bg-[#e9e2dd]" />

            {/* Fake icon */}

            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#e9e2dd]" />
          </div>

          {/* CONTENT */}

          <div className="p-3.5">
            {/* Name + Description */}

            <div className="min-h-14.5">
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#eee8e3]" />

              <div className="mt-2.5 space-y-2">
                <div className="h-2.5 w-full animate-pulse rounded bg-[#f2ede9]" />

                <div className="h-2.5 w-4/5 animate-pulse rounded bg-[#f2ede9]" />
              </div>
            </div>

            {/* SERVICES + TOGGLE */}

            <div className="mt-3 flex items-center justify-between rounded-lg bg-[#f8f4f1] px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                {/* Icon */}

                <div className="h-7 w-7 animate-pulse rounded-md bg-white" />

                {/* Text */}

                <div>
                  <div className="h-2 w-12 animate-pulse rounded bg-[#e8e1dc]" />

                  <div className="mt-1.5 h-3 w-6 animate-pulse rounded bg-[#e8e1dc]" />
                </div>
              </div>

              {/* Toggle */}

              <div className="flex items-center gap-2">
                <div className="hidden h-2 w-12 animate-pulse rounded bg-[#e8e1dc] sm:block" />

                <div className="h-5 w-9 animate-pulse rounded-full bg-[#dcd4ce]" />
              </div>
            </div>

            {/* FOOTER */}

            <div className="mt-3 flex items-center justify-between border-t border-[#f1ebe7] pt-3">
              {/* Created */}

              <div>
                <div className="h-2 w-10 animate-pulse rounded bg-[#eee8e3]" />

                <div className="mt-1.5 h-2.5 w-16 animate-pulse rounded bg-[#f2ede9]" />
              </div>

              {/* Edit */}

              <div className="h-7 w-14 animate-pulse rounded-lg bg-[#f0e9e4]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
