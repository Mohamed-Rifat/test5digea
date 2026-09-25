import * as XLSX from "xlsx";
import { formatDate } from "@/lib/format";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import type { Language, TranslationKey } from "@/locales";
import { ReviewStatus } from "@/types/review";
import type { Review } from "@/types/review";

import { type TFn, getStatusMeta } from "@/components/vendor/reviews/reviewUtils";

// Excel sheet names: max 31 chars, must be unique (case-insensitive) and may
// not contain \ / ? * [ ] :  - a service called "Photo/Video" would otherwise
// make the whole export throw.
function makeSheetName(raw: string | null | undefined, used: Set<string>): string {
  const base =
    String(raw ?? "")
      .replace(/[\\/?*[\]:]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^'+|'+$/g, "")
      .slice(0, 27) || "Sheet";

  let name = base;
  let counter = 2;

  while (used.has(name.toLowerCase())) {
    const suffix = ` (${counter++})`;
    name = base.slice(0, 31 - suffix.length) + suffix;
  }

  used.add(name.toLowerCase());
  return name;
}

export function exportReviewsToExcel(
  reviews: Review[],
  t: TFn,
  language: Language,
  vendorName?: string
) {
  const x = (key: string, params?: Record<string, string | number>) =>
    t(`vendor.reviews.excel.${key}` as TranslationKey, params);
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  if (reviews.length === 0) {
    return false;
  }

  const reviewsByService = reviews.reduce<Record<string, { serviceName: string; reviews: Review[] }>>((acc, review) => {
    const key = review.serviceId;
    if (!acc[key]) {
      acc[key] = { serviceName: review.serviceName, reviews: [] };
    }
    acc[key].reviews.push(review);
    return acc;
  }, {});

  const workbook = XLSX.utils.book_new();
  const usedSheetNames = new Set<string>(
    [x("sheetSummary"), x("sheetAll")].map((name) => name.toLowerCase())
  );

  const totalApproved = reviews.filter(r => r.status === ReviewStatus.Approved).length;
  const totalPending = reviews.filter(r => r.status === ReviewStatus.Pending).length;
  const totalRejected = reviews.filter(r => r.status === ReviewStatus.Rejected).length;
  const totalVisible = reviews.filter(r => r.status === ReviewStatus.Approved && r.isDisplayed).length;
  const totalHidden = reviews.filter(r => r.status === ReviewStatus.Approved && !r.isDisplayed).length;
  const avgRating = reviews
    .filter(r => r.status === ReviewStatus.Approved)
    .reduce((acc, r) => acc + r.rating, 0) / (totalApproved || 1);

  const summaryData: (string | number)[][] = [
    [x("summaryTitle")],
    [''],
    [x("vendor"), vendorName || x("na")],
    [x("reportDate"), new Date().toLocaleString(dateLocale, { dateStyle: 'full', timeStyle: 'medium' })],
    [''],
    [x("statistics")],
    [x("metric"), x("value")],
    [x("totalReviews"), reviews.length],
    [x("approvedReviews"), totalApproved],
    [x("pendingReviews"), totalPending],
    [x("rejectedReviews"), totalRejected],
    [x("visibleReviews"), totalVisible],
    [x("hiddenReviews"), totalHidden],
    [x("averageRating"), String(avgRating.toFixed(1)) + ' ⭐'],
    [x("approvalRate"), String(((totalApproved / reviews.length) * 100).toFixed(1)) + '%'],
    [''],
    [x("servicesOverview")],
    [x("serviceName"), x("reviewsCount"), x("avgRating")],
  ];

  Object.values(reviewsByService).forEach(({ serviceName, reviews: r }) => {
    const avg = r.filter(rev => rev.status === ReviewStatus.Approved)
      .reduce((acc, rev) => acc + rev.rating, 0) / (r.filter(rev => rev.status === ReviewStatus.Approved).length || 1);
    summaryData.push([serviceName, r.length, String(avg.toFixed(1)) + ' ⭐']);
  });

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
  summaryWS['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 20 }];
  summaryWS['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
  XLSX.utils.book_append_sheet(workbook, summaryWS, x("sheetSummary"));

  const visibilityLabel = (review: Review) =>
    review.status === ReviewStatus.Approved
      ? (review.isDisplayed ? x("visible") : x("hidden"))
      : "—";

  Object.values(reviewsByService).forEach(({ serviceName, reviews: serviceReviews }) => {
    const rows: (string | number)[][] = [
      [x("serviceReportTitle", { service: serviceName })],
      [""],
      [x("no"), x("customer"), x("rating"), x("status"), x("visibility"), x("comment"), x("date")],
    ];

    serviceReviews.forEach((review, index) => {
      const stars = '⭐'.repeat(Math.round(review.rating));

      rows.push([
        index + 1,
        review.userFullName || t("vendor.reviews.card.anonymous"),
        `${review.rating} ${stars}`,
        t(getStatusMeta(review.status).labelKey),
        visibilityLabel(review),
        review.comment || x("noComment"),
        formatDate(review.createdAt, dateLocale),
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 6 }, { wch: 28 }, { wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 50 }, { wch: 22 }];
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
    XLSX.utils.book_append_sheet(workbook, ws, makeSheetName(serviceName, usedSheetNames));
  });

  const allReviewsData: (string | number)[][] = [
    [x("allTitle")],
    [''],
    [x("no"), x("customer"), x("service"), x("rating"), x("status"), x("visibility"), x("comment"), x("date")],
  ];

  reviews.forEach((review, index) => {
    const stars = '⭐'.repeat(Math.round(review.rating));

    allReviewsData.push([
      index + 1,
      review.userFullName || t("vendor.reviews.card.anonymous"),
      review.serviceName,
      `${review.rating} ${stars}`,
      t(getStatusMeta(review.status).labelKey),
      visibilityLabel(review),
      review.comment || x("noComment"),
      formatDate(review.createdAt, dateLocale),
    ]);
  });

  const allWS = XLSX.utils.aoa_to_sheet(allReviewsData);
  allWS['!cols'] = [{ wch: 6 }, { wch: 28 }, { wch: 32 }, { wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 50 }, { wch: 22 }];
  allWS['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];
  XLSX.utils.book_append_sheet(workbook, allWS, x("sheetAll"));

  XLSX.writeFile(workbook, `${x("fileName")}_${new Date().toISOString().split('T')[0]}.xlsx`);
  return true;
}
