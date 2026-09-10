"use client";

import { useMemo, useState } from "react";
import {
  Info,
  Tags,
  Sparkles,
  FolderTree,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  Tooltip,
  Badge,
  CircularProgress,
  Button,
} from "@mui/material";

import { useVendor } from "@/features/vendors/hooks/useVendor";

export default function VendorCategoriesPage() {
  const { vendor, loading, refetch } = useVendor();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = vendor?.categories ?? [];

  // ✅ إحصائيات التصنيفات
  const stats = useMemo(() => {
    return {
      total: categories.length,
    };
  }, [categories]);

  // ✅ تحديث البيانات
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // ✅ عرض التصنيفات حسب الأحرف الأبجدية
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.localeCompare(b));
  }, [categories]);

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        {/* =================================================
            Header
        ================================================= */}

        <header className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex-1">
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b8171] sm:mb-2 sm:text-xs">
                <Sparkles size={11} className="sm:h-3.25 sm:w-3.25" />
                Vendor Dashboard
              </p>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                  <FolderTree size={16} className="text-[#a47e43] sm:h-5 sm:w-5" strokeWidth={1.8} />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
                  Categories
                </h1>
              </div>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
                The categories below represent your business on 5digea. These help customers find your services more easily.
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] disabled:opacity-50 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin" : "sm:h-4 sm:w-4"} />
                <span className="hidden xs:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                <span className="xs:hidden">{isRefreshing ? "..." : "⟳"}</span>
              </button>

              {!loading && categories.length > 0 && (
                <Badge
                  badgeContent={categories.length}
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

        {/* =================================================
            Stats - إحصائيات سريعة
        ================================================= */}

        {!loading && categories.length > 0 && (
          <section className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-3 lg:gap-4">
            <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8d8077] sm:text-xs">
                Total Categories
              </p>
              <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#30251f] sm:mt-2 sm:text-3xl">
                {stats.total}
              </p>
              <p className="mt-1 text-[10px] text-[#9a8d85] sm:text-xs">
                Active categories
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8d8077] sm:text-xs">
                Vendor Status
              </p>
              <div className="mt-1.5 flex items-center gap-2 sm:mt-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 sm:h-3 sm:w-3" />
                <span className="text-sm font-semibold text-[#30251f] sm:text-base">Active</span>
              </div>
              <p className="mt-1 text-[10px] text-[#9a8d85] sm:text-xs">
                {vendor?.businessName || "Your business"}
              </p>
            </div>
          </section>
        )}

        {/* =================================================
            Info Notice
        ================================================= */}

        <div className="flex items-start gap-3 rounded-2xl border border-[#e8dfd8] bg-[#fbf6f1] p-3 text-xs text-[#6f625a] shadow-sm sm:p-4 sm:text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#a47e43] sm:h-4.5 sm:w-4.5" />
          <p className="leading-5 sm:leading-6">
            Categories are assigned by the <span className="font-semibold text-[#30251f]">5digea team</span> and shown here for
            reference only. If you&apos;d like a category added or changed,
            please <a href="/vendor/support" className="font-semibold text-[#a47e43] hover:underline">contact support</a>.
          </p>
        </div>

        {/* =================================================
            Categories List
        ================================================= */}

        <section className="mt-4 rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:mt-6 sm:p-6 lg:p-8">
          {/* Loading State */}
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
          ) : categories.length === 0 ? (
            /* Empty State */
            <div className="py-8 text-center sm:py-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5eee9] text-[#8d715e] sm:h-16 sm:w-16">
                <Tags size={24} strokeWidth={1.7} className="sm:h-7 sm:w-7" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#40342e] sm:mt-5 sm:text-base">
                No categories assigned yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8b817a] sm:text-sm sm:leading-6">
                Your business hasn&apos;t been assigned any categories yet. Categories help customers discover your services.
              </p>
              <button
                onClick={handleRefresh}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:mt-5 sm:px-5 sm:py-2.5"
              >
                <RefreshCw size={14} />
                Check again
              </button>
            </div>
          ) : (
            /* Categories Grid */
            <div>
              {/* Header */}
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <h2 className="text-xs font-semibold text-[#40342e] sm:text-sm">
                  Your Categories
                </h2>
                <span className="text-[10px] text-[#9b8f86] sm:text-xs">
                  {categories.length} {categories.length === 1 ? "category" : "categories"}
                </span>
              </div>

              {/* Categories - Full Width */}
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

              {/* Info indicator */}
              {categories.length > 6 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#fbf6f1] px-3 py-2 text-[10px] text-[#8b817a] sm:mt-5 sm:px-4 sm:py-2.5 sm:text-xs">
                  <AlertCircle size={13} className="text-[#a47e43] sm:h-3.75 sm:w-3.75" />
                  <span>
                    Showing <span className="font-semibold text-[#40352f]">{categories.length}</span> categories
                    for your business
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* =================================================
            Help Section
        ================================================= */}

        {!loading && categories.length > 0 && (
          <div className="mt-4 rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:mt-6 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                  <Info size={16} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#40342e] sm:text-sm">
                    Need to update your categories?
                  </p>
                  <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                    Contact our support team for assistance
                  </p>
                </div>
              </div>

              <a
                href="/vendor/support"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Contact Support
                <ChevronRight size={14} className="sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}