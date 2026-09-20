"use client";

import { useMemo, useState } from "react";
import {
  Info,
  Tags,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  CheckCircle2,
  Lock,
  Search,
} from "lucide-react";
import {
  Badge,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";
import TextWithSlots from "@/components/shared/TextWithSlots";
import { CategoryCard, ContactAdminDialog } from "@/components/vendor/CategoryRequest";

// Vendor account status -> label + dot colour (comes from the API, not fixed).
const VENDOR_STATUS: Record<string, { labelKey: TranslationKey; dot: string }> = {
  Approved: { labelKey: "vendor.status.approved", dot: "bg-emerald-500" },
  Pending: { labelKey: "vendor.status.pending", dot: "bg-amber-500" },
  Rejected: { labelKey: "vendor.status.rejected", dot: "bg-red-500" },
  Inactive: { labelKey: "vendor.status.inactive", dot: "bg-gray-400" },
};

export default function VendorCategoriesPage() {
  const { t } = useLanguage();
  const { vendor, loading, refetch } = useVendor();
  const { categories: allCategories, loading: categoriesLoading } = useCategories();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState("");

  const assignedCategoryNames = useMemo(
    () => new Set(vendor?.categories || []),
    [vendor]
  );

  const stats = useMemo(() => {
    return {
      total: assignedCategoryNames.size,
    };
  }, [assignedCategoryNames]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const sortedCategories = useMemo(() => {
    return [...(vendor?.categories ?? [])].sort((a, b) => a.localeCompare(b));
  }, [vendor]);

  const filteredAllCategories = useMemo(() => {
    const activeCategories = allCategories.filter((c) => c.isActive);

    if (!categorySearch.trim()) return activeCategories;

    const query = categorySearch.toLowerCase();
    return activeCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
    );
  }, [allCategories, categorySearch]);

  const assignedCountInFiltered = useMemo(
    () =>
      filteredAllCategories.filter((c) => assignedCategoryNames.has(c.name))
        .length,
    [filteredAllCategories, assignedCategoryNames]
  );

  const handleContactAdmin = (category: any) => {
    setSelectedCategory(category);
    setContactDialogOpen(true);
  };

  const handleContactSuccess = () => {
    setToastMessage(t("vendor.services.detail.toastText"));
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">

        {toastMessage && (
          <div className="fixed bottom-6 end-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#30251f]">{t("vendor.services.detail.toastTitle")}</p>
                <p className="text-xs text-[#9b8f86]">{toastMessage}</p>
              </div>
            </div>
          </div>
        )}

        <header className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex-1">

              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
                  {t("vendor.categories.title")}
                </h1>
              </div>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
                {t("vendor.categories.subtitle")}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                aria-label={t("vendor.categories.refresh")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] disabled:opacity-50 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin" : "sm:h-5 sm:w-5"} />
              </button>

              {!loading && sortedCategories.length > 0 && (
                <Badge
                  badgeContent={sortedCategories.length}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#a47e43",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "11px",
                      height: 20,
                      minWidth: 20,
                      padding: "0 6px",
                    },
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-[#f5eee9] flex items-center justify-center sm:h-10 sm:w-10">
                    <Tags size={14} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
                  </div>
                </Badge>
              )}
            </div>
          </div>
        </header>

        {!loading && sortedCategories.length > 0 && (
          <section className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-3 lg:gap-4">
            <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.08em] rtl:tracking-normal text-[#8d8077] sm:text-xs">
                {t("vendor.categories.totalTitle")}
              </p>
              <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#30251f] sm:mt-2 sm:text-3xl">
                {stats.total}
              </p>
              <p className="mt-1 text-[10px] text-[#9a8d85] sm:text-xs">
                {t("vendor.categories.totalSub")}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.08em] rtl:tracking-normal text-[#8d8077] sm:text-xs">
                {t("vendor.categories.statusTitle")}
              </p>
              <div className="mt-1.5 flex items-center gap-2 sm:mt-2">
                <span className={`inline-flex h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3 ${(VENDOR_STATUS[vendor?.status ?? ""] ?? VENDOR_STATUS.Pending).dot}`} />
                <span className="text-sm font-semibold text-[#30251f] sm:text-base">
                  {t((VENDOR_STATUS[vendor?.status ?? ""] ?? VENDOR_STATUS.Pending).labelKey)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-[#9a8d85] sm:text-xs">
                {vendor?.businessName || t("vendor.categories.fallbackBusiness")}
              </p>
            </div>
          </section>
        )}


        <div className="flex items-start gap-3 rounded-2xl border border-[#e8dfd8] bg-[#fbf6f1] p-3 text-xs text-[#6f625a] shadow-sm sm:p-4 sm:text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#a47e43] sm:h-4.5 sm:w-4.5" />
          <p className="leading-5 sm:leading-6">
            <TextWithSlots
              text={t("vendor.categories.info")}
              slots={{
                bold: <strong className="text-[#a47e43]">{t("vendor.categories.infoBold")}</strong>,
                link: (
                  <a href="/vendor/support" className="font-semibold text-[#a47e43] hover:underline">
                    {t("vendor.categories.infoLink")}
                  </a>
                ),
              }}
            />
          </p>
        </div>


        <div className="mt-4 grid gap-4 sm:gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6 lg:col-span-2 lg:p-8">
            {loading ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-10 animate-pulse rounded-xl bg-[#f3ebe6] sm:h-12"
                    style={{ animationDelay: `${index * 50}ms` }}
                  />
                ))}
              </div>
            ) : sortedCategories.length === 0 ? (
              <div className="py-8 text-center sm:py-12">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5eee9] text-[#8d715e] sm:h-16 sm:w-16">
                  <Tags size={24} strokeWidth={1.7} className="sm:h-7 sm:w-7" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#40342e] sm:mt-5 sm:text-base">
                  {t("vendor.categories.emptyTitle")}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8b817a] sm:text-sm sm:leading-6">
                  {t("vendor.categories.emptyText")}
                </p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:mt-5 sm:px-5 sm:py-2.5"
                >
                  <RefreshCw size={14} />
                  {t("vendor.categories.checkAgain")}
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <h2 className="text-xs font-semibold text-[#40342e] sm:text-sm">
                    {t("vendor.categories.yourCategories")}
                  </h2>
                  <span className="text-[10px] text-[#9b8f86] sm:text-xs">
                    {t(sortedCategories.length === 1 ? "vendor.categories.countOne" : "vendor.categories.countMany", { count: sortedCategories.length })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {sortedCategories.map((name) => (
                    <span
                      key={name}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-[#e3d9d1] bg-[#fcfaf8] px-3 py-1.5 text-xs font-medium text-[#40352f] transition-all hover:border-[#a47e43] hover:bg-[#fbf6f1] hover:shadow-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                    >
                      <Tags className="h-3 w-3 text-[#a47e43] transition-transform group-hover:scale-110 sm:h-3.5 sm:w-3.5" />
                      {name}
                      <span className="hidden opacity-0 transition-opacity group-hover:opacity-100 sm:inline">
                        <ChevronRight size={12} className="text-[#a47e43]" />
                      </span>
                    </span>
                  ))}
                </div>

                {sortedCategories.length > 6 && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#fbf6f1] px-3 py-2 text-[10px] text-[#8b817a] sm:mt-5 sm:px-4 sm:py-2.5 sm:text-xs">
                    <AlertCircle size={13} className="text-[#a47e43] sm:h-3.75 sm:w-3.75" />
                    <span>
                      {t("vendor.categories.showingAll", { count: sortedCategories.length })}
                    </span>
                  </div>
                )}
              </div>
            )}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-4 lg:h-fit">
            <div className="rounded-3xl border border-[#e8dfd8] bg-white shadow-sm">
              <div className="border-b border-[#f0eae5] p-4 sm:p-5">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                    <Tags size={16} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                      {t("vendor.services.detail.categoriesTitle")}
                    </h2>
                    <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                      {t("vendor.services.detail.categoriesSub")}
                    </p>
                  </div>

                  <Badge
                    badgeContent={filteredAllCategories.length}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#a47e43",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 600,
                        height: 20,
                        minWidth: 20,
                      },
                    }}
                  >
                    <span className="h-2 w-2" />
                  </Badge>
                </div>

                <div className="mt-3">
                  <TextField
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder={t("vendor.services.detail.searchCategories")}
                    size="small"
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={14} className="text-[#9b8f86]" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 38,
                        borderRadius: "10px",
                        backgroundColor: "#fcfaf8",
                        fontSize: "12px",
                        "& fieldset": { borderColor: "#e3d9d1" },
                        "&:hover fieldset": { borderColor: "#d5c8be" },
                        "&.Mui-focused fieldset": { borderColor: "#a47e43", borderWidth: "1px" },
                      },
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-[#9b8f86] sm:text-xs">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    <span className="font-medium text-emerald-700">{assignedCountInFiltered}</span> {t("vendor.services.detail.activeCount")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Lock size={11} className="text-[#a47e43]" />
                    <span className="font-medium text-[#a47e43]">
                      {filteredAllCategories.length - assignedCountInFiltered}
                    </span> {t("vendor.services.detail.availableCount")}
                  </span>
                </div>
              </div>

              <div className="max-h-150 overflow-y-auto p-3 sm:p-4">
                {categoriesLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 animate-pulse rounded-xl bg-[#f5f1ee]"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                ) : filteredAllCategories.length === 0 ? (
                  <div className="py-8 text-center">
                    <Search className="mx-auto h-8 w-8 text-[#d5c8be]" />
                    <p className="mt-3 text-xs text-[#9b8f86]">
                      {t("vendor.services.detail.noCategories")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAllCategories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        isAssigned={assignedCategoryNames.has(category.name)}
                        onRequest={handleContactAdmin}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-[#f0eae5] p-3 sm:p-4">
                <div className="flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-2.5 text-[10px] text-[#6f625a] sm:p-3 sm:text-xs">
                  <Info size={12} className="mt-0.5 shrink-0 text-[#a47e43] sm:h-3.5 sm:w-3.5" />
                  <p className="leading-4 sm:leading-5">
                    <TextWithSlots
                      text={t("vendor.services.detail.categoriesFooter")}
                      slots={{
                        bold: <strong className="text-[#a47e43]">{t("vendor.services.detail.notifyAdminBold")}</strong>,
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {!loading && sortedCategories.length > 0 && (
          <div className="mt-4 rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:mt-6 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                  <Info size={16} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#40342e] sm:text-sm">
                    {t("vendor.categories.needUpdateTitle")}
                  </p>
                  <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                    {t("vendor.categories.needUpdateText")}
                  </p>
                </div>
              </div>

              <a
                href="/vendor/support"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {t("vendor.categories.contactSupport")}
                <ChevronRight size={14} className="sm:h-4 sm:w-4 rtl:rotate-180" />
              </a>
            </div>
          </div>
        )}
      </div>

      <ContactAdminDialog
        open={contactDialogOpen}
        category={selectedCategory}
        vendorName={vendor?.businessName || t("vendor.services.detail.dialog.myBusiness")}
        onClose={() => {
          setContactDialogOpen(false);
          setSelectedCategory(null);
        }}
        onSuccess={handleContactSuccess}
      />
    </main>
  );
}