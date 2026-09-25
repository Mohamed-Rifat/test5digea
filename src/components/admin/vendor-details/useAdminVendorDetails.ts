"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  approveVendor,
  getAdminVendorDetails,
  rejectVendor,
  updateVendorCategories,
} from "@/features/vendors/api";
import { getAdminCategories } from "@/features/categories/api";
import { getApiErrorMessage } from "@/lib/error";
import { getDiffRows } from "@/components/admin/VendorChangesReview";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import type { Vendor } from "@/types/vendor";
import type { Category } from "@/types/category";

/** Loads one vendor for the admin, with review (approve/reject) and category actions. */
export function useAdminVendorDetails(id: string) {
  const { t, language } = useLanguage();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  // Deep link from the admin messages inbox: /admin/vendors/{id}?highlightCategory={categoryId}
  // pre-selects and highlights the category a vendor requested, so approving it
  // is a single "Save" click instead of hunting for it in the full list.
  const searchParams = useSearchParams();
  const highlightCategoryId = searchParams.get("highlightCategory");
  const [hasAppliedHighlight, setHasAppliedHighlight] = useState(false);
  const categoriesSectionRef = useRef<HTMLDivElement | null>(null);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // Categories State
  // ================================

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [savingCategories, setSavingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [categoriesSuccess, setCategoriesSuccess] = useState("");

  // ================================
  // Review (approve / reject) State
  // ================================

  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );
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
                  vendorCategory.toLowerCase() === category.name.toLowerCase(),
              ),
            )
            .map((category) => category.id),
        );
      } catch (err: unknown) {
        if (isMounted()) {
          setError(
            getApiErrorMessage(err, t("admin.vendorDetails.loadFailed")),
          );
        }
      } finally {
        if (isMounted()) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
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

  // Once categories are loaded, auto-select + scroll to the one requested
  // via ?highlightCategory=, so the admin lands ready to hit Save.
  useEffect(() => {
    if (
      hasAppliedHighlight ||
      !highlightCategoryId ||
      categories.length === 0
    ) {
      return;
    }

    const exists = categories.some(
      (category) => category.id === highlightCategoryId,
    );
    if (!exists) return;

    setSelectedCategoryIds((prev) =>
      prev.includes(highlightCategoryId)
        ? prev
        : [...prev, highlightCategoryId],
    );
    setHasAppliedHighlight(true);

    categoriesSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [categories, highlightCategoryId, hasAppliedHighlight]);

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
          : t("admin.vendorDetails.review.approvedOk"),
      );
    } catch (err: unknown) {
      showReviewMessage(
        "error",
        getApiErrorMessage(err, t("admin.vendorDetails.review.actionFailed")),
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
        t("admin.vendorDetails.review.modal.reasonRequired"),
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
        getApiErrorMessage(err, t("admin.vendorDetails.review.actionFailed")),
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
        : [...prev, categoryId],
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
        prev ? { ...prev, categories: selectedNames } : prev,
      );

      setCategoriesSuccess(t("admin.vendorDetails.categories.updated"));
    } catch (err: unknown) {
      setCategoriesError(
        getApiErrorMessage(err, t("admin.vendorDetails.categories.failed")),
      );
    } finally {
      setSavingCategories(false);
    }
  };

  // ================================
  // Loading
  // ================================

  const notProvided = t("admin.vendorDetails.notProvided");
  const isBusy = reviewAction !== null;

  return {
    notProvided,
    isBusy,
    dateLocale,
    searchParams,
    highlightCategoryId,
    hasAppliedHighlight,
    setHasAppliedHighlight,
    categoriesSectionRef,
    vendor,
    setVendor,
    loading,
    setLoading,
    error,
    setError,
    categories,
    setCategories,
    selectedCategoryIds,
    setSelectedCategoryIds,
    savingCategories,
    setSavingCategories,
    categoriesError,
    setCategoriesError,
    categoriesSuccess,
    setCategoriesSuccess,
    reviewAction,
    setReviewAction,
    rejectOpen,
    setRejectOpen,
    rejectReason,
    setRejectReason,
    reviewMessage,
    setReviewMessage,
    loadVendor,
    diffRows,
    hasPendingChanges,
    isNewVendorReview,
    needsReview,
    showReviewMessage,
    handleApprove,
    handleReject,
    toggleCategory,
    handleSaveCategories,
  };
}

export type AdminVendorDetails = ReturnType<typeof useAdminVendorDetails>;
