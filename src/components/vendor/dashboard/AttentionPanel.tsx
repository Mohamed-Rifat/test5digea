"use client";

import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Plus,
  XCircle,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Service } from "@/types/service";

const MAX_REJECTED_SHOWN = 3;
const MAX_NAMES_SHOWN = 2;

/**
 * "Needs your attention" card on the vendor dashboard. Built only from the
 * vendor's own services: rejected ones (with the admin's reason), live or
 * pending ones that have no photos, and the empty "no services yet" state.
 */
export default function AttentionPanel({ services }: { services: Service[] }) {
  const { t } = useLanguage();

  const rejected = services.filter((service) => service.status === "Rejected");

  const withoutImages = services.filter(
    (service) =>
      (service.status === "Approved" || service.status === "Pending") &&
      (!service.images || service.images.length === 0),
  );

  const hasNoServices = services.length === 0;
  const isAllGood =
    !hasNoServices && rejected.length === 0 && withoutImages.length === 0;

  const hiddenRejected = Math.max(0, rejected.length - MAX_REJECTED_SHOWN);
  const hiddenNames = Math.max(0, withoutImages.length - MAX_NAMES_SHOWN);

  return (
    <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm lg:col-span-2">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#30251f]">
            {t("vendor.dashboard.attention.title")}
          </h3>
          <p className="text-xs text-[#9b8f86]">
            {t("vendor.dashboard.attention.subtitle")}
          </p>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5eee9]">
          <AlertCircle size={16} className="text-[#a47e43]" />
        </div>
      </div>

      {isAllGood && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-800">
              {t("vendor.dashboard.attention.allGoodTitle")}
            </p>
            <p className="mt-0.5 text-xs text-emerald-700">
              {t("vendor.dashboard.attention.allGoodText")}
            </p>
          </div>
        </div>
      )}

      {hasNoServices && (
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[#ded3cb] bg-[#fcfaf8] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#40352f]">
              {t("vendor.dashboard.attention.noServicesTitle")}
            </p>
            <p className="mt-0.5 text-xs text-[#81746d]">
              {t("vendor.dashboard.attention.noServicesText")}
            </p>
          </div>

          <Link
            href="/vendor/services/new"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#30251f] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#463831]"
          >
            <Plus size={14} />
            {t("vendor.dashboard.attention.addService")}
          </Link>
        </div>
      )}

      {(rejected.length > 0 || withoutImages.length > 0) && (
        <div className="space-y-3">
          {rejected.slice(0, MAX_REJECTED_SHOWN).map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50/50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <XCircle size={15} className="text-red-600" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      dir="auto"
                      className="truncate text-sm font-semibold text-[#30251f]"
                    >
                      {service.name}
                    </p>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                      {t("vendor.dashboard.attention.rejectedBadge")}
                    </span>
                  </div>

                  <p
                    dir="auto"
                    className="mt-0.5 line-clamp-2 text-xs leading-5 text-red-700"
                  >
                    <span className="font-medium">
                      {t("vendor.dashboard.attention.reason")}
                    </span>{" "}
                    {service.rejectionReason ||
                      t("vendor.dashboard.attention.noReason")}
                  </p>
                </div>
              </div>

              <Link
                href={`/vendor/services/${service.id}`}
                className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
              >
                {t("vendor.dashboard.attention.fixAndResubmit")}
                <ChevronRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>
          ))}

          {hiddenRejected > 0 && (
            <Link
              href="/vendor/services"
              className="inline-block text-xs font-medium text-[#a47e43] hover:text-[#8b6d55]"
            >
              {t("vendor.dashboard.attention.more", { count: hiddenRejected })}
            </Link>
          )}

          {withoutImages.length > 0 && (
            <div className="flex flex-col gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                  <AlertCircle size={15} className="text-amber-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#30251f]">
                    {t("vendor.dashboard.attention.noImagesTitle", {
                      count: withoutImages.length,
                    })}
                  </p>

                  <p
                    dir="auto"
                    className="mt-0.5 line-clamp-2 text-xs leading-5 text-amber-800"
                  >
                    {withoutImages
                      .slice(0, MAX_NAMES_SHOWN)
                      .map((service) => service.name)
                      .join(" • ")}
                    {hiddenNames > 0 &&
                      ` ${t("vendor.dashboard.attention.more", { count: hiddenNames })}`}
                  </p>

                  <p className="mt-0.5 text-xs text-[#81746d]">
                    {t("vendor.dashboard.attention.noImagesText")}
                  </p>
                </div>
              </div>

              <Link
                href={
                  withoutImages.length === 1
                    ? `/vendor/services/${withoutImages[0].id}`
                    : "/vendor/services"
                }
                className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-50"
              >
                {t("vendor.dashboard.attention.addImages")}
                <ChevronRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
