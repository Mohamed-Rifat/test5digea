"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  GitCompare,
  X,
  MapPin,
  Map as MapIcon,
  Star,
  Tag,
  Check,
} from "lucide-react";

import CompareCategoryDialog from "@/components/public/CompareCategoryDialog";
import VendorCard from "@/components/public/VendorCard";
import RoadmapPickButton from "@/components/roadmap/RoadmapPickButton";
import { useRoadmapPicker } from "@/features/roadmap/hooks/useRoadmapPicker";
import GovernorateSelect from "@/components/shared/GovernorateSelect";
import Pagination from "@/components/shared/Pagination";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useToast } from "@/components/providers/ToastProvider";
import { searchVendorList } from "@/features/vendors/api";
import { findGovernorate, governorateLabel } from "@/lib/governorates";
import { FavoriteTargetType } from "@/types/favorite";
import type {
  Vendor,
  VendorSearchParams,
  VendorSearchResponse,
} from "@/types/vendor";

const PAGE_SIZE = 12;
const MAX_COMPARE = 4;

export default function VendorsPage() {
  return (
    <Suspense fallback={null}>
      <VendorsPageContent />
    </Suspense>
  );
}

function VendorsPageContent() {
  const searchParams = useSearchParams();
  const { t, language, localize } = useLanguage();
  const initialCategoryId = searchParams.get("categoryId") || "";
  const initialSearch = searchParams.get("search") || "";

  const { categories } = useCategories();
  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();
  const roadmapPicker = useRoadmapPicker();
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  // English name of the chosen governorate (the API gets it in the page language).
  const [governorate, setGovernorate] = useState("");
  const [minRating, setMinRating] = useState("");
  const [page, setPage] = useState(1);
  // The panel only opens when the user asks for it. A category coming from
  // the URL (navbar) is applied silently: it shows in the filter badge and in
  // the category chip above the results.
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  // true when the category filter was set automatically by picking a vendor
  // to compare (so it goes back to "All" once nothing is selected anymore).
  const [categoryFromCompare, setCategoryFromCompare] = useState(false);
  // vendor working in several categories: ask which one to compare in.
  const [categoryPicker, setCategoryPicker] = useState<{
    vendor: Vendor;
    options: { id: string; name: string }[];
  } | null>(null);

  const [result, setResult] = useState<VendorSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const filtersRef = useRef<HTMLDivElement>(null);

  const locationParam = useMemo(() => {
    const match = findGovernorate(governorate);
    return match ? governorateLabel(match, language) : "";
  }, [governorate, language]);

  const params: VendorSearchParams = useMemo(
    () => ({
      searchTerm: searchTerm || undefined,
      categoryId: categoryId || undefined,
      location: locationParam || undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sortBy: 0,
      page,
      pageSize: PAGE_SIZE,
    }),
    [searchTerm, categoryId, locationParam, minRating, page]
  );

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await searchVendorList(params);

      setResult(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoryId") || "";
    const searchFromUrl = searchParams.get("search") || "";

    setCategoryId(categoryFromUrl);
    setCategoryFromCompare(false);

    if (searchFromUrl) {
      setSearchInput(searchFromUrl);
      setSearchTerm(searchFromUrl);
    }

    setPage(1);
  }, [searchParams]);

  // Close filters panel on outside click or Escape
  useEffect(() => {
    if (!filtersOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setFiltersOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [filtersOpen]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  // Goes back to "All categories" if that filter only exists because of a
  // comparison that is now over.
  const releaseCompareCategory = () => {
    if (!categoryFromCompare) return;

    setCategoryFromCompare(false);
    setCategoryId("");
    setPage(1);
  };

  const startCompareInCategory = (vendorId: string, newCategoryId: string) => {
    setPage(1);
    setCategoryId(newCategoryId);
    setCategoryFromCompare(true);
    setSelected([vendorId]);
    setCategoryPicker(null);
  };

  const clearSelected = () => {
    setSelected([]);
    releaseCompareCategory();
  };

  // Manual category choice from the filters panel.
  const chooseCategory = (newCategoryId: string) => {
    setPage(1);
    setCategoryId(newCategoryId);
    setCategoryFromCompare(false);
    setSelected([]);
  };

  const toggleSelected = (vendorId: string) => {
    if (selected.includes(vendorId)) {
      const remaining = selected.filter((id) => id !== vendorId);
      setSelected(remaining);
      if (remaining.length === 0) releaseCompareCategory();
      return;
    }

    // Toasts must not be fired from inside a state updater (React warns
    // "Cannot update a component while rendering a different component").
    if (!categoryId) {
      // No category filter yet: use the vendor's own category, so the list
      // narrows down to the vendors it can be compared with.
      const vendor = (result?.items ?? []).find((item) => item.id === vendorId);
      const options = categories.filter((category) =>
        (vendor?.categories ?? []).includes(category.name)
      );

      if (!vendor || options.length === 0) {
        toast(t("compare.errors.selectCategory"), "error");
        return;
      }

      if (options.length === 1) {
        startCompareInCategory(vendorId, options[0].id);
        return;
      }

      setCategoryPicker({
        vendor,
        options: options.map((category) => ({
          id: category.id,
          name: localize(category.name),
        })),
      });
      return;
    }

    if (selected.length >= MAX_COMPARE) {
      toast(t("vendors.list.maxCompare", { max: MAX_COMPARE }), "error");
      return;
    }

    setSelected((previous) => [...previous, vendorId]);
  };

  const clearAllFilters = () => {
    setPage(1);
    setCategoryId("");
    setCategoryFromCompare(false);
    setGovernorate("");
    setMinRating("");
    setSearchInput("");
    setSearchTerm("");
    setSelected([]);
  };

  const activeFiltersCount = [categoryId, governorate, minRating, searchTerm].filter(
    Boolean
  ).length;

  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;
  const selectedCategory = categories.find((c) => c.id === categoryId);
  // Couple browsing a category that is part of their roadmap: each card gets
  // a one-click "Choose for my wedding" button.
  const roadmapStep =
    categoryId && roadmapPicker.canUse
      ? roadmapPicker.findItem(categoryId, selectedCategory?.name)
      : null;

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-visible border-b border-[#eee7e1] bg-linear-to-b from-[#f8f5ef] to-[#faf8f6] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#b99a62]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#a47e43]/5 blur-3xl" />

        <div className="relative mx-auto lg:max-w-10/12">
          {/* Badge */}
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b99a62]/15">
              <Sparkles className="h-3 w-3 text-[#b99a62]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] rtl:tracking-normal text-[#9b8367]">
              {t("vendors.list.eyebrow")}
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl font-serif text-3xl font-light leading-tight rtl:leading-snug text-[#30251f] sm:text-4xl lg:text-5xl">
            {t("vendors.list.titlePrefix")}{" "}
            <span className="italic rtl:not-italic text-[#a47e43]">{t("vendors.list.titleHighlight")}</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#766d67] sm:text-base">
            {t("vendors.list.description")}
          </p>

          {/* Search Form + Filters Panel Wrapper */}
          <div ref={filtersRef} className="relative">
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute start-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8f86]" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t("vendors.list.searchPlaceholder")}
                  className="w-full rounded-full border border-[#e4dbd0] bg-white py-3.5 ps-12 pe-4 text-sm text-[#30251f] shadow-sm outline-none transition placeholder:text-[#b0a69c] focus:border-[#b99a62] focus:ring-4 focus:ring-[#b99a62]/10"
                />
              </div>

              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className={`relative flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition ${
                  filtersOpen
                    ? "border-[#b99a62] bg-[#f9f1e9] text-[#8c6a3c]"
                    : "border-[#e4dbd0] bg-white text-[#5f544d] hover:border-[#b99a62]"
                }`}
              >
                <SlidersHorizontal size={16} />
                {t("vendors.list.filters")}
                {activeFiltersCount > 0 && (
                  <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#a47e43] text-[10px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                type="submit"
                className="min-h-12 rounded-full bg-[#30251f] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42332a] hover:shadow-md"
              >
                {t("vendors.list.search")}
              </button>
            </form>

            {/* ============ FILTERS PANEL ============ */}
            {filtersOpen && (
              <div className="relative z-30 mt-3 rounded-3xl border border-[#eee7e1] bg-white shadow-[0_24px_60px_-12px_rgba(48,37,31,0.18)]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#f1ece6] px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f9f1e9]">
                      <SlidersHorizontal size={14} className="text-[#a47e43]" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#30251f]">
                        {t("vendors.list.refineTitle")}
                      </p>
                      <p className="text-[11px] text-[#9b8f86]">
                        {t("vendors.list.refineSubtitle")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#9b8f86] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
                    aria-label={t("vendors.list.closeFilters")}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <div className="grid gap-8 px-6 py-6 lg:grid-cols-[1.4fr_1fr]">
                  {/* LEFT: Category */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag size={13} className="text-[#b99a62]" />
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8367]">
                          {t("vendors.list.category")}
                        </label>
                      </div>
                      {categoryId && (
                        <button
                          type="button"
                          onClick={() => chooseCategory("")}
                          className="text-[11px] font-medium text-[#a47e43] transition hover:text-[#8c6a3c]"
                        >
                          {t("vendors.list.reset")}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => chooseCategory("")}
                        className={`group flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-start text-xs font-medium transition ${
                          !categoryId
                            ? "border-[#30251f] bg-[#30251f] text-white"
                            : "border-[#eee7e1] bg-white text-[#5f544d] hover:border-[#d9cbb8] hover:bg-[#faf7f4]"
                        }`}
                      >
                        <span>{t("vendors.list.allCategories")}</span>
                        {!categoryId && <Check size={12} />}
                      </button>

                      {categories.map((c) => {
                        const active = categoryId === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => chooseCategory(c.id)}
                            className={`group flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-start text-xs font-medium transition ${
                              active
                                ? "border-[#a47e43] bg-[#f9f1e9] text-[#8c6a3c]"
                                : "border-[#eee7e1] bg-white text-[#5f544d] hover:border-[#d9cbb8] hover:bg-[#faf7f4]"
                            }`}
                          >
                            <span className="truncate">{localize(c.name)}</span>
                            {active && (
                              <Check size={12} className="shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT: Location + Rating */}
                  <div className="space-y-6">
                    {/* Location */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <MapPin size={13} className="text-[#b99a62]" />
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8367]">
                          {t("vendors.list.location")}
                        </label>
                      </div>
                      <GovernorateSelect
                        value={governorate}
                        onChange={(value) => {
                          setPage(1);
                          setGovernorate(value);
                        }}
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Star size={13} className="text-[#b99a62]" />
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8367]">
                          {t("vendors.list.minimumRating")}
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "", label: t("vendors.list.anyRating") },
                          { value: "3", label: "3+" },
                          { value: "4", label: "4+" },
                          { value: "4.5", label: "4.5+" },
                        ].map((option) => {
                          const active = minRating === option.value;
                          return (
                            <button
                              key={option.value || "any"}
                              type="button"
                              onClick={() => {
                                setPage(1);
                                setMinRating(option.value);
                              }}
                              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                                active
                                  ? "border-[#a47e43] bg-[#a47e43] text-white"
                                  : "border-[#eee7e1] bg-white text-[#5f544d] hover:border-[#d9cbb8] hover:bg-[#faf7f4]"
                              }`}
                            >
                              {option.value && (
                                <Star
                                  size={11}
                                  className={
                                    active
                                      ? "fill-white text-white"
                                      : "fill-[#e8c98a] text-[#e8c98a]"
                                  }
                                />
                              )}
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between rounded-b-3xl border-t border-[#f1ece6] bg-[#faf7f4] px-6 py-4">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    disabled={activeFiltersCount === 0}
                    className="text-xs font-semibold text-[#8c6a3c] transition hover:text-[#30251f] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("vendors.list.clearAllFilters")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="rounded-full bg-[#30251f] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#42332a]"
                  >
                    {t("vendors.list.showResults")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ RESULTS SECTION ============ */}
      <section className="mx-auto lg:max-w-10/12 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Compare Bar */}
        {selected.length > 0 && (
          <div className="sticky bottom-4 z-20 mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-[#30251f] to-[#42332a] px-4 py-3.5 text-white shadow-[0_16px_40px_rgba(48,37,31,0.28)] sm:flex sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                {selected.length}
              </span>
              <span className="text-sm font-medium">
                {selected.length === 1
                  ? t("vendors.list.selectedOne")
                  : t("vendors.list.selectedMany")}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 sm:mt-0">
              <button
                type="button"
                onClick={clearSelected}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:text-white"
              >
                {t("compare.clearAll")}
              </button>
              <Link
                href={
                  selected.length >= 2 && categoryId
                    ? `/compare?type=vendor&ids=${selected.join(
                        ","
                      )}&categoryId=${categoryId}`
                    : "#"
                }
                aria-disabled={selected.length < 2 || !categoryId}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                  selected.length >= 2 && categoryId
                    ? "bg-white text-[#30251f] hover:bg-[#f5efe8]"
                    : "pointer-events-none bg-white/20 text-white/50"
                }`}
              >
                <GitCompare size={15} />
                {t("vendors.list.compareButton", { count: selected.length })}
              </Link>
            </div>
          </div>
        )}

        {/* Loading skeleton: a full page of cards, so the layout doesn't jump */}
        {loading && (
          <>
            <div className="mb-6 h-5 w-40 animate-pulse rounded bg-[#f0e9e2]" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-2xl border border-[#eee7e1] bg-white ${
                    i >= 4 ? "hidden sm:block" : ""
                  }`}
                >
                  <div className="h-36 animate-pulse bg-[#f0e9e2] sm:h-40" />
                  <div className="space-y-3 p-4 pt-11">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-[#f0e9e2]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#f0e9e2]" />
                    <div className="h-3 w-full animate-pulse rounded bg-[#f0e9e2]" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-[#f0e9e2]" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Came from the roadmap: keep the couple oriented */}
        {roadmapStep && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#ecd9bf] bg-[#fdf6ec] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2.5 text-sm font-medium text-[#6f5433]">
              <MapIcon size={18} className="mt-0.5 shrink-0 text-[#a47e43]" aria-hidden="true" />
              <span>
                {t("roadmap.pick.browsingFor", { category: localize(roadmapStep.categoryName) })}
                {roadmapStep.selectedVendorName && (
                  <span className="mt-0.5 block text-xs text-[#9b8367]">
                    {t("roadmap.pick.currently", { name: roadmapStep.selectedVendorName })}
                  </span>
                )}
              </span>
            </p>
            <Link
              href="/roadmap"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 text-sm font-semibold text-white transition hover:bg-[#46382f]"
            >
              {t("roadmap.pick.backToRoadmap")}
            </Link>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-600">
              {t("vendors.list.loadError")}
            </p>
            <button
              type="button"
              onClick={fetchResults}
              className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              {t("vendors.list.tryAgain")}
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-[#eee7e1] bg-white p-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f5ef]">
              <Search className="h-6 w-6 text-[#b99a62]" />
            </div>
            <p className="font-serif text-lg text-[#30251f]">{t("vendors.list.emptyTitle")}</p>
            <p className="mt-2 text-sm text-[#766d67]">
              {t("vendors.list.emptyText")}
            </p>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-5 rounded-full bg-[#30251f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#42332a]"
              >
                {t("vendors.list.clearAllFilters")}
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {!loading && !error && items.length > 0 && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#9b8f86]">
                <span className="font-semibold text-[#30251f]">
                  {result?.totalCount ?? items.length}
                </span>{" "}
                {t("vendors.list.found")}
              </p>
              {selectedCategory && (
                <span className="rounded-full border border-[#eadbce] bg-[#f9f1e9] px-3 py-1.5 text-xs font-semibold text-[#8c6a3c]">
                  {localize(selectedCategory.name)}
                </span>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  href={
                    categoryId
                      ? `/vendors/${vendor.id}?categoryId=${encodeURIComponent(categoryId)}`
                      : undefined
                  }
                  footer={
                    roadmapStep ? (
                      <RoadmapPickButton
                        picker={roadmapPicker}
                        vendor={{ id: vendor.id, name: vendor.businessName }}
                        item={roadmapStep}
                        size="sm"
                        showHelpers={false}
                      />
                    ) : undefined
                  }
                  favorited={isFavorited(FavoriteTargetType.Vendor, vendor.id)}
                  favoriteLoading={
                    actionLoading === `${FavoriteTargetType.Vendor}:${vendor.id}`
                  }
                  onToggleFavorite={toggleFavorite}
                  selected={selected.includes(vendor.id)}
                  onSelect={toggleSelected}
                />
              ))}

              {/* Invisible placeholders that fill a short last page up to a
                  full page, so the pagination below never moves up. */}
              {totalPages > 1 &&
                Array.from({ length: Math.max(0, PAGE_SIZE - items.length) }).map(
                  (_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      aria-hidden="true"
                      className="pointer-events-none invisible hidden sm:block"
                    >
                      <VendorCard vendor={items[0]} />
                    </div>
                  )
                )}
            </div>
          </>
        )}

        {/* Pagination: always at the bottom, in the same place */}
        {!error && totalPages > 1 && (
          <div className="mt-12">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} disabled={loading} />
          </div>
        )}

        {categoryPicker && (
          <CompareCategoryDialog
            vendorName={categoryPicker.vendor.businessName}
            options={categoryPicker.options}
            onPick={(id) => startCompareInCategory(categoryPicker.vendor.id, id)}
            onClose={() => setCategoryPicker(null)}
          />
        )}
      </section>
    </main>
  );
}