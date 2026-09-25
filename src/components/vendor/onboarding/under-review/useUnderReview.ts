"use client";

import type { Vendor } from "@/types/vendor";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { useVendorContext } from "@/context/VendorContext";
import { getCurrentVendor } from "@/features/vendors/api";
import { readMarker } from "@/lib/vendor-pending-edit";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import {
  AUTO_CHECK_MS,
  type SocialLinks,
  parseJson,
} from "@/components/vendor/onboarding/under-review/underReviewParts";

/** Under-review state: submitted data, status polling and "check now". */
export function useUnderReview(vendor: Vendor) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { pendingSubmitted, refreshSilently } = useVendorContext();

  const locale = LANGUAGE_DATE_LOCALE[language];

  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // What the vendor sent (the pending copy when the server keeps one).
  const data = vendor.pendingChanges ?? pendingSubmitted ?? vendor;

  const socialLinks = useMemo(
    () => parseJson<SocialLinks>(data.socialLinksJson),
    [data.socialLinksJson],
  );
  const workingHours = useMemo(
    () => parseJson<Record<string, string>>(data.workingHoursJson),
    [data.workingHoursJson],
  );

  const submittedAt = readMarker(vendor.id)?.submittedAt || vendor.updatedAt;

  /**
   * Asks the server for the current status.
   *
   * It talks to the API directly instead of going through the shared vendor
   * hook: a failed background check must never replace this page with the
   * "couldn't load your account" screen. Only when the status really moved
   * (approved / rejected / …) do we hand over to the shared state, which makes
   * the layout swap this page for the welcome screen or the form.
   */
  const checkStatus = useCallback(
    async (manual: boolean) => {
      try {
        if (manual) setRefreshing(true);

        const fresh = await getCurrentVendor();

        setLastChecked(new Date());

        if (fresh.status !== vendor.status) {
          await refreshSilently();
        } else if (manual) {
          toast(t("vendorOnboarding.review.stillPending"), "info");
        }
      } catch {
        if (manual) toast(t("vendorOnboarding.review.checkFailed"), "error");
      } finally {
        if (manual) setRefreshing(false);
      }
    },
    [vendor.status, refreshSilently, toast, t],
  );

  // Quiet background check while the tab is open.
  useEffect(() => {
    const check = () => {
      if (document.visibilityState === "visible") void checkStatus(false);
    };

    const timer = window.setInterval(check, AUTO_CHECK_MS);
    document.addEventListener("visibilitychange", check);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [checkStatus]);

  const lastCheckedLabel = lastChecked
    ? new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
      }).format(lastChecked)
    : "";

  const hasSocial = Boolean(
    socialLinks.instagram ||
    socialLinks.facebook ||
    socialLinks.tiktok ||
    socialLinks.website,
  );

  return {
    vendor,
    locale,
    refreshing,
    setRefreshing,
    lastChecked,
    setLastChecked,
    data,
    socialLinks,
    workingHours,
    submittedAt,
    checkStatus,
    lastCheckedLabel,
    hasSocial,
    toast,
    pendingSubmitted,
    refreshSilently,
  };
}

export type UnderReviewState = ReturnType<typeof useUnderReview>;
