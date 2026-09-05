"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  DollarSign,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { useVendorServices } from "@/features/services/hooks/useVendorServices";

type StatusFilter = "All" | "Approved" | "Pending" | "Rejected" | "Inactive";

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  Approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  Pending: {
    label: "Pending Review",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  Rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border border-red-200",
  },
  Inactive: {
    label: "Inactive",
    icon: XCircle,
    className: "bg-gray-100 text-gray-700 border border-gray-200",
  },
};

export default function VendorServicesPage() {
  const {
    services,
    loading,
    error,
    actionLoading,
    actionError,
    refetch,
    resubmit,
  } = useVendorServices();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filteredServices =
    statusFilter === "All"
      ? services
      : services.filter((service) => service.status === statusFilter);

  const handleResubmit = async (id: string) => {
    await resubmit(id);
  };

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-[#9b8171]">
              Vendor Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#30251f] sm:text-4xl">
              My Services
            </h1>
            <p className="mt-2 text-sm text-[#756b65]">
              Manage the services you offer in the marketplace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-sm font-medium text-[#514740] transition hover:bg-[#f7f2ef]"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/vendor/services/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-5 text-sm font-medium text-white transition hover:bg-[#463831]"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </Link>
          </div>
        </div>

        {actionError && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {actionError}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {(
            ["All", "Approved", "Pending", "Rejected", "Inactive"] as StatusFilter[]
          ).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                statusFilter === filter
                  ? "bg-[#30251f] text-white"
                  : "border border-[#e3d9d1] bg-white text-[#514740] hover:bg-[#f7f2ef]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#ded3cb] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3ebe6]">
              <BriefcaseBusiness className="h-6 w-6 text-[#806b5e]" />
            </div>
            <h3 className="mt-4 font-semibold text-[#40352f]">
              No services found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#81746d]">
              Start adding your services so customers can discover what your
              business offers.
            </p>
            <Link
              href="/vendor/services/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#463831]"
            >
              <Plus className="h-4 w-4" />
              Add Your First Service
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => {
              const status =
                statusConfig[service.status] ?? statusConfig.Pending;
              const StatusIcon = status.icon;
              const isResubmitting = actionLoading === `resubmit-${service.id}`;

              return (
                <div
                  key={service.id}
                  className="rounded-2xl border border-[#e8dfd8] bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-[#30251f]">
                          {service.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-[#81746d]">
                        {service.categoryName}
                      </p>

                      {service.description && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#625852]">
                          {service.description}
                        </p>
                      )}

                      {service.status === "Rejected" &&
                        service.rejectionReason && (
                          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
                            Rejection reason: {service.rejectionReason}
                          </p>
                        )}

                      {service.prices.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <DollarSign className="h-4 w-4 text-[#9a8d85]" />
                          {service.prices.map((price) => (
                            <span
                              key={price.id}
                              className="rounded-full bg-[#f7f1ed] px-3 py-1 text-xs font-medium text-[#66564c]"
                            >
                              {price.label}: {price.price}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {service.status === "Rejected" && (
                        <button
                          type="button"
                          onClick={() => handleResubmit(service.id)}
                          disabled={isResubmitting}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-sm font-medium text-[#514740] transition hover:bg-[#f7f2ef] disabled:opacity-60"
                        >
                          {isResubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          Resubmit
                        </button>
                      )}

                      <Link
                        href={`/vendor/services/${service.id}`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 text-sm font-medium text-white transition hover:bg-[#463831]"
                      >
                        <Edit3 className="h-4 w-4" />
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
