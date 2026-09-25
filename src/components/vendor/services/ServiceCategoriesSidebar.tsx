"use client";

import Link from "next/link";
import {
  CheckCircle2,
  HelpCircle,
  Info,
  Lock,
  Mail,
  MessageSquarePlus,
  Package,
  Search,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { CategoryCard } from "@/components/vendor/CategoryRequest";
import TextWithSlot from "@/components/shared/TextWithSlot";
import { TextField } from "@/components/ui";
import type { Category } from "@/types/category";

interface ServiceCategoriesSidebarProps {
  loading: boolean;
  search: string;
  onSearch: (value: string) => void;
  categories: Category[];
  assignedNames: Set<string>;
  assignedCount: number;
  onRequest: (category: Category) => void;
}

/** Right column of the edit-service page: category catalogue + support card. */
export default function ServiceCategoriesSidebar({
  loading,
  search,
  onSearch,
  categories,
  assignedNames,
  assignedCount,
  onRequest,
}: ServiceCategoriesSidebarProps) {
  const { t } = useLanguage();

  return (
    <aside className="space-y-4 lg:sticky lg:top-4 lg:h-fit">
      <div className="rounded-3xl border border-[#e8dfd8] bg-white shadow-sm">
        <div className="border-b border-[#f0eae5] p-4 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
              <Package size={16} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
            </div>

            <div className="flex-1">
              <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                {t("vendor.services.detail.categoriesTitle")}
              </h2>
              <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                {t("vendor.services.detail.categoriesSub")}
              </p>
            </div>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a47e43] px-1.5 text-[10px] font-semibold text-white">
              {categories.length}
            </span>
          </div>

          <TextField
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder={t("vendor.services.detail.searchCategories")}
            aria-label={t("vendor.services.detail.searchCategories")}
            startIcon={<Search size={14} />}
            size="sm"
            containerClassName="mt-3"
          />

          <div className="mt-3 flex items-center justify-between text-[10px] text-[#9b8f86] sm:text-xs">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-600" />
              <span className="font-medium text-emerald-700">{assignedCount}</span>{" "}
              {t("vendor.services.detail.activeCount")}
            </span>

            <span className="inline-flex items-center gap-1">
              <Lock size={11} className="text-[#a47e43]" />
              <span className="font-medium text-[#a47e43]">{categories.length - assignedCount}</span>{" "}
              {t("vendor.services.detail.availableCount")}
            </span>
          </div>
        </div>

        <div className="max-h-150 overflow-y-auto p-3 sm:p-4">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-[#f5f1ee]"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center">
              <Search className="mx-auto h-8 w-8 text-[#d5c8be]" />
              <p className="mt-3 text-xs text-[#9b8f86]">{t("vendor.services.detail.noCategories")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isAssigned={assignedNames.has(category.name)}
                  onRequest={onRequest}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#f0eae5] p-3 sm:p-4">
          <div className="flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-2.5 text-[10px] text-[#6f625a] sm:p-3 sm:text-xs">
            <Info size={12} className="mt-0.5 shrink-0 text-[#a47e43] sm:h-3.5 sm:w-3.5" />
            <p className="leading-4 sm:leading-5">
              <TextWithSlot
                text={t("vendor.services.detail.categoriesFooter")}
                token="{bold}"
                slot={
                  <strong className="text-[#a47e43]">
                    {t("vendor.services.detail.notifyAdminBold")}
                  </strong>
                }
              />
            </p>
          </div>
        </div>
      </div>

      <SupportCard />
    </aside>
  );
}

function SupportCard() {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-[#e8dfd8] bg-linear-to-br from-[#fbf6f1] to-[#f5ede5] p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm sm:h-10 sm:w-10">
          <HelpCircle size={16} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#30251f] sm:text-base">
            {t("vendor.services.detail.needHelpTitle")}
          </h3>
          <p className="text-[10px] text-[#9b8f86] sm:text-xs">{t("vendor.services.detail.contactTeam")}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <a
          href="mailto:support@5digea.com"
          className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#5f544d] transition hover:bg-[#f5eee9] sm:text-sm"
        >
          <Mail size={13} className="text-[#a47e43]" />
          support@5digea.com
        </a>
        <Link
          href="/vendor/support"
          className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#5f544d] transition hover:bg-[#f5eee9] sm:text-sm"
        >
          <MessageSquarePlus size={13} className="text-[#a47e43]" />
          {t("vendor.services.detail.visitSupport")}
        </Link>
      </div>
    </div>
  );
}
