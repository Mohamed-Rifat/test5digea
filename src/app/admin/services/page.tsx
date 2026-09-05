"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  Loader2,
  Power,
  Search,
  X,
  XCircle,
} from "lucide-react";

import { useAdminServices } from "@/features/services/hooks/useAdminServices";
import { useAdminCategories } from "@/features/categories/hooks/useAdminCategories";

import type { Service } from "@/types/service";

/* =========================
   Helpers
========================= */

const formatDate = (date: string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(price);
};

const getStatusLabel = (status: string) => {
  if (!status) return "Unknown";

  return status
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getStatusStyles = (status: string) => {
  const normalized = status.toLowerCase().replace(/[_-\s]/g, "");

  if (
    normalized.includes("approved") ||
    normalized.includes("active")
  ) {
    return {
      wrapper:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    };
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("review")
  ) {
    return {
      wrapper:
        "bg-amber-50 text-amber-700 border-amber-200",
      icon: AlertCircle,
    };
  }

  if (
    normalized.includes("reject") ||
    normalized.includes("inactive") ||
    normalized.includes("deactiv")
  ) {
    return {
      wrapper:
        "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    };
  }

  return {
    wrapper:
      "bg-gray-50 text-gray-700 border-gray-200",
    icon: AlertCircle,
  };
};

const getStartingPrice = (service: Service) => {
  if (!service.prices?.length) return null;

  return Math.min(
    ...service.prices.map((item) => item.price)
  );
};

/* =========================
   Page
========================= */

export default function AdminServicesPage() {
  const {
    services,
    loading,
    error,
    actionLoading,
    refetch,
    approve,
    reject,
    activate,
    deactivate,
  } = useAdminServices();

  const {
    categories,
    loading: categoriesLoading,
  } = useAdminCategories();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [rejectModalOpen, setRejectModalOpen] =
    useState(false);

  const [selectedService, setSelectedService] =
    useState<Service | null>(null);

  const [rejectReason, setRejectReason] = useState("");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  /* =========================
     Status Options
     ========================= */

  const statusOptions = useMemo(() => {
    const uniqueStatuses = Array.from(
      new Set(
        services
          .map((service) => service.status)
          .filter(Boolean)
      )
    );

    return uniqueStatuses;
  }, [services]);

  /* =========================
     Filtered Services
     ========================= */

  const filteredServices = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        service.vendorBusinessName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        service.categoryName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        service.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        !categoryFilter ||
        service.categoryId === categoryFilter;

      const matchesStatus =
        !statusFilter ||
        service.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    services,
    search,
    categoryFilter,
    statusFilter,
  ]);

  /* =========================
     Stats
     ========================= */

  const stats = useMemo(() => {
    const normalized = services.map((service) => ({
      ...service,
      normalizedStatus: service.status
        ?.toLowerCase()
        .replace(/[_-\s]/g, ""),
    }));

    return {
      total: services.length,

      approved: normalized.filter((service) =>
        service.normalizedStatus?.includes("approved")
      ).length,

      pending: normalized.filter((service) =>
        service.normalizedStatus?.includes("pending")
      ).length,

      rejected: normalized.filter((service) =>
        service.normalizedStatus?.includes("reject")
      ).length,
    };
  }, [services]);

  /* =========================
     Messages
     ========================= */

  const showMessage = (
    type: "success" | "error",
    text: string
  ) => {
    setMessage({
      type,
      text,
    });

    window.setTimeout(() => {
      setMessage(null);
    }, 3500);
  };

  /* =========================
     Approve
     ========================= */

  const handleApprove = async (
    service: Service
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to approve "${service.name}"?`
    );

    if (!confirmed) return;

    const success = await approve(service.id);

    if (success) {
      showMessage(
        "success",
        "Service approved successfully."
      );
    } else {
      showMessage(
        "error",
        "Failed to approve service."
      );
    }
  };

  /* =========================
     Reject
     ========================= */

  const openRejectModal = (service: Service) => {
    setSelectedService(service);
    setRejectReason(
      service.rejectionReason || ""
    );
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    if (actionLoading) return;

    setRejectModalOpen(false);
    setSelectedService(null);
    setRejectReason("");
  };

  const handleReject = async () => {
    if (!selectedService) return;

    const reason = rejectReason.trim();

    if (!reason) {
      showMessage(
        "error",
        "Please enter a rejection reason."
      );
      return;
    }

    const success = await reject(
      selectedService.id,
      {
        reason,
      }
    );

    if (success) {
      closeRejectModal();

      showMessage(
        "success",
        "Service rejected successfully."
      );
    } else {
      showMessage(
        "error",
        "Failed to reject service."
      );
    }
  };

  /* =========================
     Activate
     ========================= */

  const handleActivate = async (
    service: Service
  ) => {
    const confirmed = window.confirm(
      `Activate "${service.name}"?`
    );

    if (!confirmed) return;

    const success = await activate(service.id);

    if (success) {
      showMessage(
        "success",
        "Service activated successfully."
      );
    } else {
      showMessage(
        "error",
        "Failed to activate service."
      );
    }
  };

  /* =========================
     Deactivate
     ========================= */

  const handleDeactivate = async (
    service: Service
  ) => {
    const confirmed = window.confirm(
      `Deactivate "${service.name}"?`
    );

    if (!confirmed) return;

    const success = await deactivate(
      service.id
    );

    if (success) {
      showMessage(
        "success",
        "Service deactivated successfully."
      );
    } else {
      showMessage(
        "error",
        "Failed to deactivate service."
      );
    }
  };

  /* =========================
     Loading
     ========================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-[#c59b6d]"
          />

          <p className="text-sm text-gray-500">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     Error
     ========================= */

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="text-red-600 mt-0.5"
              size={22}
            />

            <div>
              <h2 className="font-semibold text-red-800">
                Failed to load services
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={refetch}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* =========================
          Header
      ========================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/admin"
              className="transition hover:text-gray-900"
            >
              Dashboard
            </Link>

            <ChevronRight size={15} />

            <span className="text-gray-900">
              Services
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
            Services Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review and manage services submitted by vendors.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          <Loader2
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* =========================
          Message
      ========================= */}

      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <span>{message.text}</span>
        </div>
      )}

      {/* =========================
          Stats
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Services"
          value={stats.total}
        />

        <StatCard
          label="Approved"
          value={stats.approved}
        />

        <StatCard
          label="Pending"
          value={stats.pending}
        />

        <StatCard
          label="Rejected"
          value={stats.rejected}
        />
      </div>

      {/* =========================
          Filters
      ========================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px]">
          {/* Search */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by service, vendor, category..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#c59b6d] focus:bg-white focus:ring-2 focus:ring-[#c59b6d]/10"
            />
          </div>

          {/* Category */}

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            disabled={categoriesLoading}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#c59b6d] focus:bg-white focus:ring-2 focus:ring-[#c59b6d]/10"
          >
            <option value="">
              All Categories
            </option>

            {categories?.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-[#c59b6d] focus:bg-white focus:ring-2 focus:ring-[#c59b6d]/10"
          >
            <option value="">
              All Statuses
            </option>

            {statusOptions.map((status) => (
              <option
                key={status}
                value={status}
              >
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {(search ||
          categoryFilter ||
          statusFilter) && (
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-800">
                {filteredServices.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-800">
                {services.length}
              </span>{" "}
              services
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryFilter("");
                setStatusFilter("");
              }}
              className="text-xs font-medium text-gray-600 transition hover:text-gray-900"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* =========================
          Table
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Service
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Vendor
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Created
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredServices.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Search
                          size={22}
                          className="text-gray-400"
                        />
                      </div>

                      <h3 className="font-medium text-gray-900">
                        No services found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const statusStyles =
                    getStatusStyles(
                      service.status
                    );

                  const StatusIcon =
                    statusStyles.icon;

                  const startingPrice =
                    getStartingPrice(service);

                  const isApproving =
                    actionLoading ===
                    `approve-${service.id}`;

                  const isRejecting =
                    actionLoading ===
                    `reject-${service.id}`;

                  const isActivating =
                    actionLoading ===
                    `activate-${service.id}`;

                  const isDeactivating =
                    actionLoading ===
                    `deactivate-${service.id}`;

                  const busy =
                    isApproving ||
                    isRejecting ||
                    isActivating ||
                    isDeactivating;

                  const normalizedStatus =
                    service.status
                      ?.toLowerCase()
                      .replace(/[_-\s]/g, "");

                  const canApprove =
                    normalizedStatus?.includes(
                      "pending"
                    );

                  const canReject =
                    normalizedStatus?.includes(
                      "pending"
                    );

                  const canActivate =
                    normalizedStatus?.includes(
                      "inactive"
                    ) ||
                    normalizedStatus?.includes(
                      "deactiv"
                    );

                  const canDeactivate =
                    normalizedStatus?.includes(
                      "approved"
                    ) ||
                    normalizedStatus?.includes(
                      "active"
                    );

                  return (
                    <tr
                      key={service.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      {/* Service */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                            {service.images?.[0]?.url ? (
                              <img
                                src={
                                  service.images[0]
                                    .url
                                }
                                alt={service.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-gray-400">
                                {service.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "S"}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate text-sm font-semibold text-gray-900">
                              {service.name}
                            </p>

                            <p className="mt-0.5 max-w-[220px] truncate text-xs text-gray-500">
                              {service.description ||
                                "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Vendor */}

                      <td className="px-5 py-4">
                        <p className="max-w-[180px] truncate text-sm font-medium text-gray-800">
                          {service.vendorBusinessName ||
                            "-"}
                        </p>
                      </td>

                      {/* Category */}

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {service.categoryName ||
                            "-"}
                        </span>
                      </td>

                      {/* Price */}

                      <td className="px-5 py-4">
                        {startingPrice !== null ? (
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatPrice(
                                startingPrice
                              )}
                            </p>

                            {service.prices
                              ?.length > 1 && (
                              <p className="mt-0.5 text-xs text-gray-500">
                                {
                                  service.prices
                                    .length
                                }{" "}
                                price options
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No price
                          </span>
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles.wrapper}`}
                        >
                          <StatusIcon size={13} />

                          {getStatusLabel(
                            service.status
                          )}
                        </span>
                      </td>

                      {/* Created */}

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(
                            service.createdAt
                          )}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View */}

                          <Link
                            href={`/admin/services/${service.id}`}
                            title="View service"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                          >
                            <Eye size={16} />
                          </Link>

                          {/* Approve */}

                          {canApprove && (
                            <button
                              type="button"
                              title="Approve service"
                              disabled={busy}
                              onClick={() =>
                                handleApprove(
                                  service
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isApproving ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Check size={16} />
                              )}
                            </button>
                          )}

                          {/* Reject */}

                          {canReject && (
                            <button
                              type="button"
                              title="Reject service"
                              disabled={busy}
                              onClick={() =>
                                openRejectModal(
                                  service
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isRejecting ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <X size={16} />
                              )}
                            </button>
                          )}

                          {/* Activate */}

                          {canActivate && (
                            <button
                              type="button"
                              title="Activate service"
                              disabled={busy}
                              onClick={() =>
                                handleActivate(
                                  service
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isActivating ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Power size={16} />
                              )}
                            </button>
                          )}

                          {/* Deactivate */}

                          {canDeactivate && (
                            <button
                              type="button"
                              title="Deactivate service"
                              disabled={busy}
                              onClick={() =>
                                handleDeactivate(
                                  service
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isDeactivating ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Power size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}

        {filteredServices.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-800">
                {filteredServices.length}
              </span>{" "}
              services
            </p>
          </div>
        )}
      </div>

      {/* =========================
          Reject Modal
      ========================= */}

      {rejectModalOpen &&
        selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
              {/* Modal Header */}

              <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Reject Service
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Please provide a reason for rejecting this service.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeRejectModal}
                  disabled={Boolean(actionLoading)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}

              <div className="space-y-4 px-6 py-5">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Service
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {selectedService.name}
                  </p>

                  <p className="mt-0.5 text-sm text-gray-500">
                    {selectedService.vendorBusinessName}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="rejectionReason"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Rejection Reason
                  </label>

                  <textarea
                    id="rejectionReason"
                    value={rejectReason}
                    onChange={(event) =>
                      setRejectReason(
                        event.target.value
                      )
                    }
                    placeholder="Enter the reason..."
                    rows={5}
                    disabled={Boolean(
                      actionLoading
                    )}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#c59b6d] focus:bg-white focus:ring-2 focus:ring-[#c59b6d]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Modal Footer */}

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                <button
                  type="button"
                  onClick={closeRejectModal}
                  disabled={Boolean(
                    actionLoading
                  )}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  disabled={
                    Boolean(actionLoading) ||
                    !rejectReason.trim()
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                      Rejecting...
                    </>
                  ) : (
                    <>
                      <X size={16} />

                      Reject Service
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

/* =========================
   Stat Card
========================= */

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}
