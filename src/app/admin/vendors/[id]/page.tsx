"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Star,
  Store,
  User,
  X,
} from "lucide-react";

import {
  approveVendor,
  getAdminVendorDetails,
  rejectVendor,
  updateVendorCategories,
} from "@/features/vendors/api";
import { getAdminCategories } from "@/features/categories/api";
import { getApiErrorMessage } from "@/lib/error";
import { formatDateTime } from "@/lib/format";
import {
  getDiffRows,
  RejectReasonDialog,
  VendorChangesDiff,
} from "@/components/admin/VendorChangesReview";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import type { TranslationKey } from "@/locales";
import type { Vendor } from "@/types/vendor";
import type { Category } from "@/types/category";

// ================================
// Status
// ================================

const STATUS_STYLES: Record<Vendor["status"], string> = {
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Inactive: "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_KEYS: Record<Vendor["status"], TranslationKey> = {
  Approved: "admin.vendorDetails.status.approved",
  Pending: "admin.vendorDetails.status.pending",
  Rejected: "admin.vendorDetails.status.rejected",
  Inactive: "admin.vendorDetails.status.inactive",
};

// ================================
// Loading Skeleton
// ================================

function DetailsSkeleton() {
  return (
    <main className="min-h-screen bg-[#faf8f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto animate-pulse space-y-5">
        <div className="h-5 w-28 rounded bg-[#e7dfda]" />

        <div className="rounded-2xl border border-[#e9e1dc] bg-white p-6">
          <div className="flex gap-4">
            <div className="h-20 w-20 rounded-2xl bg-[#eee9e5]" />

            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 rounded bg-[#eee9e5]" />
              <div className="h-4 w-72 rounded bg-[#eee9e5]" />
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-64 rounded-2xl bg-[#eee9e5]" />
          <div className="h-64 rounded-2xl bg-[#eee9e5]" />
        </div>
      </div>
    </main>
  );
}

// ================================
// Info Row
// ================================

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#eee8e4] bg-[#fdfcfb] p-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3efec] text-[#8b7464]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide rtl:tracking-normal text-[#a09791]">
          {label}
        </p>

        <p className="mt-1 wrap-break-word text-sm font-medium text-[#403630]">
          {value}
        </p>
      </div>
    </div>
  );
}

// ================================
// Page
// ================================

export default function AdminVendorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, language } = useLanguage();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // Categories State
  // ================================

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    []
  );
  const [savingCategories, setSavingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [categoriesSuccess, setCategoriesSuccess] = useState("");

  // ================================
  // Review (approve / reject) State
  // ================================

  const [reviewAction, setReviewAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [reviewMessage, setReviewMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ================================
  // Load Vendor + Categories
  // ================================

  const loadVendor = useCallback(
    async (isMounted: () => boolean) => {
      try {
        const [data, allCategories] = await Promise.all([
          getAdminVendorDetails(id),
          getAdminCategories(),
        ]);

        if (!isMounted()) return;

        setError("");
        setVendor(data);
        setCategories(allCategories);

        // Convert vendor category names -> category IDs
        setSelectedCategoryIds(
          allCategories
            .filter((category) =>
              data.categories?.some(
                (vendorCategory) =>
                  vendorCategory.toLowerCase() ===
                  category.name.toLowerCase()
              )
            )
            .map((category) => category.id)
        );
      } catch (err: unknown) {
        

        if (isMounted()) {
          setError(
            getApiErrorMessage(err, t("admin.vendorDetails.loadFailed"))
          );
        }
      } finally {
        if (isMounted()) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  useEffect(() => {
    let mounted = true;

    // Data fetch on mount; state is only set after the awaited requests.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVendor(() => mounted);

    return () => {
      mounted = false;
    };
  }, [loadVendor]);

  // ================================
  // Pending changes (diff)
  // ================================

  const diffRows = useMemo(() => getDiffRows(vendor), [vendor]);

  const hasPendingChanges = diffRows.length > 0;
  const isNewVendorReview = !hasPendingChanges && vendor?.status === "Pending";
  const needsReview = hasPendingChanges || isNewVendorReview;

  const showReviewMessage = (type: "success" | "error", text: string) => {
    setReviewMessage({ type, text });
    window.setTimeout(() => setReviewMessage(null), 5000);
  };

  const handleApprove = async () => {
    if (!vendor) return;

    try {
      setReviewAction("approve");

      await approveVendor(vendor.id);
      await loadVendor(() => true);

      showReviewMessage(
        "success",
        hasPendingChanges
          ? t("admin.vendorDetails.review.approvedChangesOk")
          : t("admin.vendorDetails.review.approvedOk")
      );
    } catch (err: unknown) {
      showReviewMessage(
        "error",
        getApiErrorMessage(err, t("admin.vendorDetails.review.actionFailed"))
      );
    } finally {
      setReviewAction(null);
    }
  };

  const handleReject = async () => {
    if (!vendor) return;

    const reason = rejectReason.trim();

    if (!reason) {
      showReviewMessage(
        "error",
        t("admin.vendorDetails.review.modal.reasonRequired")
      );
      return;
    }

    try {
      setReviewAction("reject");

      await rejectVendor(vendor.id, { reason });
      await loadVendor(() => true);

      setRejectOpen(false);
      setRejectReason("");
      showReviewMessage("success", t("admin.vendorDetails.review.rejectedOk"));
    } catch (err: unknown) {
      showReviewMessage(
        "error",
        getApiErrorMessage(err, t("admin.vendorDetails.review.actionFailed"))
      );
    } finally {
      setReviewAction(null);
    }
  };

  // ================================
  // Toggle Category
  // ================================

  const toggleCategory = (categoryId: string) => {
    setCategoriesSuccess("");
    setCategoriesError("");

    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((existing) => existing !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ================================
  // Save Categories
  // ================================

  const handleSaveCategories = async () => {
    if (!vendor) return;

    try {
      setSavingCategories(true);
      setCategoriesError("");
      setCategoriesSuccess("");

      await updateVendorCategories(vendor.id, {
        categoryIds: selectedCategoryIds,
      });

      // Update local vendor state immediately
      const selectedNames = categories
        .filter((category) => selectedCategoryIds.includes(category.id))
        .map((category) => category.name);

      setVendor((prev) =>
        prev ? { ...prev, categories: selectedNames } : prev
      );

      setCategoriesSuccess(t("admin.vendorDetails.categories.updated"));
    } catch (err: unknown) {
      

      setCategoriesError(
        getApiErrorMessage(err, t("admin.vendorDetails.categories.failed"))
      );
    } finally {
      setSavingCategories(false);
    }
  };

  // ================================
  // Loading
  // ================================

  if (loading) {
    return <DetailsSkeleton />;
  }

  const notProvided = t("admin.vendorDetails.notProvided");
  const isBusy = reviewAction !== null;

  // ================================
  // Render
  // ================================

  return (
    <main className="min-h-screen bg-[#faf8f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Back */}
        <Link
          href="/admin/vendors"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#766b65] transition hover:text-[#30251f]"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t("admin.vendorDetails.back")}
        </Link>

        {/* Error */}
        {error || !vendor ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="text-sm font-semibold">
                  {t("admin.vendorDetails.unableTitle")}
                </p>

                <p className="mt-1 text-sm">
                  {error || t("admin.vendorDetails.notFound")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Review feedback */}
            {reviewMessage && (
              <div
                role="status"
                className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
                  reviewMessage.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {reviewMessage.type === "success" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {reviewMessage.text}
              </div>
            )}

            {/* ================================
                Review panel: pending profile edits / new vendor
            ================================= */}
            {needsReview && (
              <section className="mb-5 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-[0_8px_30px_rgba(180,120,20,0.08)]">
                <div className="flex flex-col gap-4 border-b border-amber-100 bg-amber-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <Clock3 size={18} />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-[#30251f]">
                        {hasPendingChanges
                          ? t("admin.vendorDetails.review.pendingTitle")
                          : t("admin.vendorDetails.review.newVendorTitle")}
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-[#7a6b5f]">
                        {hasPendingChanges
                          ? t("admin.vendorDetails.review.pendingText", {
                              name:
                                vendor.businessName ||
                                t("admin.vendorDetails.unnamed"),
                            })
                          : t("admin.vendorDetails.review.newVendorText")}
                      </p>

                      {hasPendingChanges && (
                        <p className="mt-1.5 text-xs font-semibold text-amber-700">
                          {diffRows.length === 1
                            ? t("admin.vendorDetails.review.changedOne")
                            : t("admin.vendorDetails.review.changedCount", {
                                count: diffRows.length,
                              })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRejectReason("");
                        setRejectOpen(true);
                      }}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <X size={16} />
                      {hasPendingChanges
                        ? t("admin.vendorDetails.review.rejectChanges")
                        : t("admin.vendorDetails.review.reject")}
                    </button>

                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {reviewAction === "approve" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      {reviewAction === "approve"
                        ? t("admin.vendorDetails.review.working")
                        : hasPendingChanges
                          ? t("admin.vendorDetails.review.approveChanges")
                          : t("admin.vendorDetails.review.approve")}
                    </button>
                  </div>
                </div>

                {/* Field-by-field diff */}
                {hasPendingChanges && (
                  <VendorChangesDiff vendor={vendor} rows={diffRows} />
                )}
              </section>
            )}

            {/* ================================
                Vendor Header
            ================================= */}
            <section className="rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.04)] sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  {vendor.profileImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={vendor.profileImageUrl}
                      alt={vendor.businessName || t("admin.vendorDetails.unnamed")}
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#f1ebe7] text-xl font-semibold text-[#806d60]">
                      {vendor.businessName?.charAt(0)?.toUpperCase() || "V"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="truncate text-xl font-semibold tracking-tight rtl:tracking-normal text-[#30251f] sm:text-2xl">
                        {vendor.businessName || t("admin.vendorDetails.unnamed")}
                      </h1>

                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[vendor.status]}`}
                      >
                        {t(STATUS_KEYS[vendor.status])}
                      </span>

                      {hasPendingChanges && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          <Clock3 size={12} />
                          {t("admin.vendorDetails.review.pendingTitle")}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-[#766b65]">
                      {vendor.slogan || t("admin.vendorDetails.noSlogan")}
                    </p>

                    <p className="mt-2 text-xs text-[#9b918b]">
                      {t("admin.vendorDetails.vendorId", { id: vendor.id })}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[#f8f5f3] px-4 py-3">
                  <Star
                    size={17}
                    className="fill-current text-[#b08b55]"
                  />

                  <span className="text-sm font-semibold text-[#403630]">
                    {Number(vendor.averageRating || 0).toFixed(1)}
                  </span>

                  <span className="text-xs text-[#9b918b]">
                    {t("admin.vendorDetails.reviewsCount", {
                      count: vendor.reviewsCount || 0,
                    })}
                  </span>
                </div>
              </div>
            </section>

            {/* ================================
                Business + Profile
            ================================= */}
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {/* Business Information */}
              <section className="rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)]">
                <div className="mb-4 flex items-center gap-2">
                  <Store size={18} className="text-[#8b7464]" />

                  <h2 className="text-base font-semibold text-[#30251f]">
                    {t("admin.vendorDetails.sections.business")}
                  </h2>
                </div>

                <div className="space-y-3">
                  <InfoRow
                    icon={<Store size={16} />}
                    label={t("admin.vendorDetails.fields.businessName")}
                    value={vendor.businessName || notProvided}
                  />

                  <InfoRow
                    icon={<MapPin size={16} />}
                    label={t("admin.vendorDetails.fields.location")}
                    value={vendor.location || notProvided}
                  />

                  <InfoRow
                    icon={<Mail size={16} />}
                    label={t("admin.vendorDetails.fields.businessEmail")}
                    value={vendor.contactEmail || notProvided}
                  />

                  <InfoRow
                    icon={<Phone size={16} />}
                    label={t("admin.vendorDetails.fields.contactPhone")}
                    value={vendor.contactPhone || notProvided}
                  />
                </div>
              </section>

              {/* Vendor Profile */}
              <section className="rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)]">
                <div className="mb-4 flex items-center gap-2">
                  <User size={18} className="text-[#8b7464]" />

                  <h2 className="text-base font-semibold text-[#30251f]">
                    {t("admin.vendorDetails.sections.profile")}
                  </h2>
                </div>

                <div className="space-y-3">
                  <InfoRow
                    icon={<User size={16} />}
                    label={t("admin.vendorDetails.fields.userId")}
                    value={vendor.userId || notProvided}
                  />

                  <InfoRow
                    icon={<CheckCircle2 size={16} />}
                    label={t("admin.vendorDetails.fields.createdAt")}
                    value={formatDateTime(vendor.createdAt, dateLocale) || notProvided}
                  />

                  <InfoRow
                    icon={<Clock3 size={16} />}
                    label={t("admin.vendorDetails.fields.updatedAt")}
                    value={formatDateTime(vendor.updatedAt, dateLocale) || notProvided}
                  />

                  {vendor.rejectionReason && (
                    <InfoRow
                      icon={<AlertCircle size={16} />}
                      label={t("admin.vendorDetails.fields.rejectionReason")}
                      value={vendor.rejectionReason}
                    />
                  )}
                </div>
              </section>
            </div>

            {/* ================================
                About Business
            ================================= */}
            <section className="mt-5 rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)]">
              <h2 className="text-base font-semibold text-[#30251f]">
                {t("admin.vendorDetails.sections.about")}
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#665b55]">
                {vendor.bio || t("admin.vendorDetails.sections.noDescription")}
              </p>
            </section>

            {/* ================================
                Categories
            ================================= */}
            <section className="mt-5 rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#30251f]">
                    {t("admin.vendorDetails.categories.title")}
                  </h2>

                  <p className="mt-1 text-sm text-[#9b918b]">
                    {t("admin.vendorDetails.categories.subtitle")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveCategories}
                  disabled={savingCategories || categories.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#40332c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingCategories ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t("admin.vendorDetails.categories.saving")}
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {t("admin.vendorDetails.categories.save")}
                    </>
                  )}
                </button>
              </div>

              {/* Error */}
              {categoriesError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle size={16} />
                  {categoriesError}
                </div>
              )}

              {/* Success */}
              {categoriesSuccess && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  <CheckCircle2 size={16} />
                  {categoriesSuccess}
                </div>
              )}

              {/* Categories */}
              {categories.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => {
                    const selected = selectedCategoryIds.includes(
                      category.id
                    );

                    return (
                      <label
                        key={category.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                          selected
                            ? "border-[#8b7464] bg-[#faf7f5]"
                            : "border-[#eee8e4] bg-[#fdfcfb] hover:border-[#d8ccc4]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleCategory(category.id)}
                          className="h-4 w-4 accent-[#8b7464]"
                        />

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#403630]">
                            {category.name}
                          </p>

                          {category.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-[#9b918b]">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-[#e3d9d2] p-6 text-center">
                  <p className="text-sm text-[#9b918b]">
                    {t("admin.vendorDetails.categories.none")}
                  </p>
                </div>
              )}
            </section>

            <RejectReasonDialog
              open={rejectOpen}
              title={
                hasPendingChanges
                  ? t("admin.vendorDetails.review.modal.title")
                  : t("admin.vendorDetails.review.modal.titleNew")
              }
              reason={rejectReason}
              onReasonChange={setRejectReason}
              loading={reviewAction === "reject"}
              onCancel={() => setRejectOpen(false)}
              onConfirm={handleReject}
            />
          </>
        )}
      </div>
    </main>
  );
}
