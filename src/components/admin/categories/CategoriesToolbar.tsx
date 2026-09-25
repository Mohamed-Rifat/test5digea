"use client";

import { Check, ChevronDown, Filter, Search, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { TextField } from "@/components/ui";
import type { StatusFilter } from "./categoryForm";

interface CategoriesToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilter: (value: StatusFilter) => void;
  statusLabel: string;
  filterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shown: number;
  total: number;
}

/** Search box, status dropdown and "showing X of Y". */
export function CategoriesToolbar({
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  statusLabel,
  filterOpen,
  setFilterOpen,
  shown,
  total,
}: CategoriesToolbarProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-5 rounded-xl border border-[#ebe3dd] bg-white p-3 shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
        {/* Search */}

        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t("admin.categories.searchPlaceholder")}
          aria-label={t("admin.categories.searchPlaceholder")}
          startIcon={<Search size={16} />}
          size="sm"
          containerClassName="flex-1"
          endAdornment={
            search ? (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="rounded-md p-1 text-[#a99b92] transition hover:bg-[#f3ece7] hover:text-[#5f5048]"
                aria-label={t("admin.ui.clearSearch")}
              >
                <X size={14} />
              </button>
            ) : undefined
          }
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((current) => !current)}
            className="flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-[#eee6e1] bg-[#fcfaf8] px-3.5 text-xs font-medium text-[#665951] transition hover:bg-white sm:min-w-36.25"
          >
            <span className="flex items-center gap-2">
              <Filter size={14} />

              {statusLabel}
            </span>

            <ChevronDown
              size={14}
              className={`transition-transform ${
                filterOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-11 z-50 w-full min-w-36.25 overflow-hidden rounded-xl border border-[#e9e0da] bg-white p-1.5 shadow-xl">
              {[
                {
                  value: "all",
                  label: t("admin.categories.allStatus"),
                },
                {
                  value: "active",
                  label: t("admin.categories.active"),
                },
                {
                  value: "inactive",
                  label: t("admin.categories.inactive"),
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onStatusFilter(option.value as StatusFilter);
                    setFilterOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${
                    statusFilter === option.value
                      ? "bg-[#f5eee9] text-[#30251f]"
                      : "text-[#756960] hover:bg-[#faf7f4]"
                  }`}
                >
                  {option.label}

                  {statusFilter === option.value && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden h-7 w-px bg-[#eee6e1] lg:block" />

        <div className="px-1 text-[11px] text-[#9a8d85]">
          Showing <span className="font-semibold text-[#64564e]">{shown}</span>{" "}
          of <span className="font-semibold text-[#64564e]">{total}</span>
        </div>
      </div>
    </div>
  );
}
