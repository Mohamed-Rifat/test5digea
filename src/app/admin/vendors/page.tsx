"use client";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Eye,
  Loader2,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Store,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import {
  approveVendor,
  createVendor,
  deactivateVendor,
  activateVendor,
  rejectVendor,
} from "@/services/vendors.service";

import { useAdminVendors } from "@/features/vendors/hooks/useAdminVendors";

import type { Vendor } from "@/types/vendor";


// ========================================
// Helpers
// ========================================

const getStatusLabel = (
  status: Vendor["status"]
): string => {
  return status;
};

const getStatusClasses = (
  status: Vendor["status"]
): string => {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";

    case "Inactive":
      return "bg-gray-100 text-gray-600 border-gray-200";

    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};


// ========================================
// Skeleton
// ========================================

function VendorsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-24 rounded-2xl bg-[#eee9e5]"
            />
          )
        )}
      </div>

      <div className="h-16 rounded-2xl bg-[#eee9e5]" />

      <div className="overflow-hidden rounded-2xl border border-[#e9e1dc] bg-white">
        <div className="h-14 bg-[#f3efec]" />

        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-20 border-t border-[#eee8e4] bg-white"
            />
          )
        )}
      </div>

    </div>
  );
}


// ========================================
// Page
// ========================================

export default function AdminVendorsPage() {

  const {
    vendors,
    loading,
    error,
    refetch,
  } = useAdminVendors();
  const router = useRouter();
  // Search
  const [search, setSearch] = useState("");

  // Status filter
  const [statusFilter, setStatusFilter] =
    useState("all");

  // Action loading
  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  // Feedback
  const [success, setSuccess] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  // Menu
  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  // Reject modal
  const [rejectVendorId, setRejectVendorId] =
    useState<string | null>(null);

  const [rejectReason, setRejectReason] =
    useState("");

  // Create modal
  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [createForm, setCreateForm] =
    useState({
      email: "",
      password: "",
      fullName: "",
      businessName: "",
    });

  const [createLoading, setCreateLoading] =
    useState(false);

  // ========================================
  // Stats
  // ========================================

  const stats = useMemo(() => {
    const total = vendors.length;

    const pending = vendors.filter(
      (vendor) => vendor.status === "Pending"
    ).length;

    const approved = vendors.filter(
      (vendor) => vendor.status === "Approved"
    ).length;

    const rejected = vendors.filter(
      (vendor) => vendor.status === "Rejected"
    ).length;

    const inactive = vendors.filter(
      (vendor) => vendor.status === "Inactive"
    ).length;

    return {
      total,
      pending,
      approved,
      rejected,
      inactive,
    };
  }, [vendors]);

  // ========================================
  // Filter
  // ========================================

  const filteredVendors = useMemo(() => {

    const searchValue =
      search.toLowerCase().trim();

    return vendors.filter((vendor) => {

      const matchesSearch =
        !searchValue ||
        vendor.businessName
          ?.toLowerCase()
          .includes(searchValue) ||
        vendor.contactEmail
          ?.toLowerCase()
          .includes(searchValue) ||
        vendor.location
          ?.toLowerCase()
          .includes(searchValue) ||
        vendor.contactPhone
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        vendor.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  }, [
    vendors,
    search,
    statusFilter,
  ]);


  // ========================================
  // Actions
  // ========================================

  const runAction = async (
    id: string,
    action: () => Promise<void>,
    successMessage: string
  ) => {

    try {

      setActionLoading(id);
      setActionError("");
      setSuccess("");

      await action();

      setSuccess(successMessage);

      setOpenMenu(null);

      await refetch();

    } catch (error: any) {
const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.response?.data ||
        "Something went wrong.";

      setActionError(
        typeof message === "string"
          ? message
          : "Something went wrong."
      );

    } finally {

      setActionLoading(null);

    }
  };


  // ========================================
  // Reject
  // ========================================

  const handleReject = async () => {

    if (!rejectVendorId) {
      return;
    }

    if (!rejectReason.trim()) {
      setActionError(
        "Please enter a rejection reason."
      );

      return;
    }

    await runAction(
      rejectVendorId,
      () =>
        rejectVendor(
          rejectVendorId,
          {
            reason:
              rejectReason.trim(),
          }
        ),
      "Vendor rejected successfully."
    );

    setRejectVendorId(null);
    setRejectReason("");
  };


  // ========================================
  // Create Vendor
  // ========================================

  const handleCreateVendor = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setActionError("");
    setSuccess("");

    if (
      !createForm.email ||
      !createForm.password ||
      !createForm.fullName ||
      !createForm.businessName
    ) {
      setActionError(
        "Please fill in all fields."
      );

      return;
    }

    try {

      setCreateLoading(true);

      const vendorId =
        await createVendor(
          createForm
        );

      setSuccess(
        `Vendor created successfully. ID: ${vendorId}`
      );

      setCreateForm({
        email: "",
        password: "",
        fullName: "",
        businessName: "",
      });

      setShowCreateModal(false);

      await refetch();

    } catch (error: any) {
const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.response?.data ||
        "Failed to create vendor.";

      setActionError(
        typeof message === "string"
          ? message
          : "Failed to create vendor."
      );

    } finally {

      setCreateLoading(false);

    }
  };


  // ========================================
  // Create Form Change
  // ========================================

  const handleCreateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value,
    } = event.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f6] px-4 py-6 sm:px-6 lg:px-0">
        <div className="mx-auto">

          <div className="mb-7 animate-pulse">
            <div className="h-3 w-28 rounded bg-[#e7dfda]" />
            <div className="mt-3 h-9 w-64 rounded bg-[#e7dfda]" />
            <div className="mt-3 h-4 w-80 rounded bg-[#e7dfda]" />
          </div>

          <VendorsSkeleton />

        </div>
      </main>
    );
  }


  // ========================================
  // Render
  // ========================================

  return (
    <main
      className="min-h-screen bg-[#faf8f6] px-4 py-6 sm:px-6 lg:px-0"
      onClick={() => setOpenMenu(null)}
    >
      <div className="mx-auto ">

        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9b7b67]">
              Admin Dashboard
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
              Vendors Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766b65]">
              Manage vendor accounts, review applications,
              and control vendor status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowCreateModal(true);
              setActionError("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#45362e]"
          >
            <Plus size={17} />
            Add Vendor
          </button>

        </div>


        {/* ================================= */}
        {/* Feedback */}
        {/* ================================= */}

        {(success || actionError || error) && (
          <div className="mb-6 space-y-3">

            {(actionError || error) && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p>
                  {actionError || error}
                </p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <CheckCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p className="break-all">
                  {success}
                </p>
              </div>
            )}

          </div>
        )}


        {/* ================================= */}
        {/* Stats */}
        {/* ================================= */}

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">

          <StatCard
            icon={<Store size={18} />}
            label="Total Vendors"
            value={stats.total}
          />

          <StatCard
            icon={<Loader2 size={18} />}
            label="Pending"
            value={stats.pending}
          />

          <StatCard
            icon={<UserCheck size={18} />}
            label="Approved"
            value={stats.approved}
          />

          <StatCard
            icon={<UserX size={18} />}
            label="Rejected"
            value={stats.rejected}
          />

          <StatCard
            icon={<UserX size={18} />}
            label="Inactive"
            value={stats.inactive}
          />

        </div>


        {/* ================================= */}
        {/* Toolbar */}
        {/* ================================= */}

        <div
          className="mb-5 rounded-2xl border border-[#e9e1dc] bg-white p-4"
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9b918b]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search vendors..."
                className="h-11 w-full rounded-xl border border-[#ddd4ce] bg-[#fdfcfb] pl-10 pr-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#aaa09a] focus:border-[#9b7b67] focus:ring-2 focus:ring-[#9b7b67]/10"
              />

            </div>


            {/* Filter */}

            <div className="relative lg:w-52">

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="h-11 w-full appearance-none rounded-xl border border-[#ddd4ce] bg-[#fdfcfb] px-4 pr-10 text-sm text-[#4b403a] outline-none focus:border-[#9b7b67]"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Rejected">
                  Rejected
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8f857f]"
              />

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* Results */}
        {/* ================================= */}

        <div className="mb-3 flex items-center justify-between">

          <p className="text-sm text-[#766b65]">
            Showing{" "}
            <span className="font-semibold text-[#30251f]">
              {filteredVendors.length}
            </span>{" "}
            vendor
            {filteredVendors.length !== 1
              ? "s"
              : ""}
          </p>

        </div>


        {/* ================================= */}
        {/* Empty */}
        {/* ================================= */}

        {filteredVendors.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-[#ddd4ce] bg-white px-6 py-16 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3efec] text-[#8e7868]">
              <Store size={22} />
            </div>

            <h3 className="text-base font-semibold text-[#30251f]">
              No vendors found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#766b65]">
              Try changing your search or status filter,
              or create a new vendor.
            </p>

          </div>

        ) : (

          /* ================================= */
          /* Desktop Table */
          /* ================================= */

          <div className="hidden overflow-visible rounded-2xl border border-[#e9e1dc] bg-white shadow-[0_8px_30px_rgba(48,37,31,0.04)] md:block">

            <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_60px] items-center border-b border-[#eee8e4] bg-[#fbfaf9] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#8c817b]">

              <span>Vendor</span>
              <span>Location</span>
              <span>Status</span>
              <span>Rating</span>
              <span />

            </div>


            {filteredVendors.map(
              (vendor) => {

                const isActionLoading =
                  actionLoading ===
                  vendor.id;

                return (
                  <div
                    key={vendor.id}
                    className="grid min-h-22 grid-cols-[2fr_1.2fr_1fr_1fr_60px] items-center border-b border-[#eee8e4] px-5 py-3 last:border-b-0 hover:bg-[#fdfcfb]"
                  >

                    {/* Vendor */}

                    <div className="flex min-w-0 items-center gap-3">

                      {vendor.profileImageUrl ? (
                        <img
                          src={
                            vendor.profileImageUrl
                          }
                          alt={
                            vendor.businessName
                          }
                          className="h-11 w-11 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1ebe7] text-sm font-semibold text-[#806d60]">
                          {vendor.businessName
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "V"}
                        </div>
                      )}

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-[#30251f]">
                          {vendor.businessName ||
                            "Unnamed Vendor"}
                        </p>

                        <p className="mt-1 truncate text-xs text-[#8b817b]">
                          {vendor.contactEmail ||
                            "No email"}
                        </p>

                      </div>

                    </div>


                    {/* Location */}

                    <div className="flex min-w-0 items-center gap-1.5 text-sm text-[#665b55]">

                      <MapPin
                        size={15}
                        className="shrink-0 text-[#9b7b67]"
                      />

                      <span className="truncate">
                        {vendor.location ||
                          "Not specified"}
                      </span>

                    </div>


                    {/* Status */}

                    <div>

                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                          vendor.status
                        )}`}
                      >
                        {getStatusLabel(
                          vendor.status
                        )}
                      </span>

                    </div>


                    {/* Rating */}

                    <div className="flex items-center gap-1.5">

                      <Star
                        size={15}
                        className="fill-current text-[#b08b55]"
                      />

                      <span className="text-sm font-medium text-[#403630]">
                        {Number(
                          vendor.averageRating || 0
                        ).toFixed(1)}
                      </span>

                      <span className="text-xs text-[#9b918b]">
                        ({vendor.reviewsCount || 0})
                      </span>

                    </div>


                    {/* Actions */}

                    <div className="relative flex justify-end">

                      <button
                        type="button"
                        disabled={
                          isActionLoading
                        }
                        onClick={(event) => {
                          event.stopPropagation();

                          setOpenMenu(
                            openMenu ===
                              vendor.id
                              ? null
                              : vendor.id
                          );
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#746a64] transition hover:bg-[#f3efec] hover:text-[#30251f] disabled:opacity-50"
                      >
                        {isActionLoading ? (
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <MoreHorizontal
                            size={18}
                          />
                        )}
                      </button>


                      {openMenu ===
                        vendor.id && (
                          <VendorActionsMenu
                            vendor={vendor}
                            onClose={() =>
                              setOpenMenu(null)
                            }
                            onViewDetails={() => {
                              setOpenMenu(null);
                              router.push(`/admin/vendors/${vendor.id}`);
                            }}
                            onApprove={() =>
                              runAction(
                                vendor.id,
                                () =>
                                  approveVendor(
                                    vendor.id
                                  ),
                                "Vendor approved successfully."
                              )
                            }
                            onReject={() => {
                              setOpenMenu(null);
                              setRejectVendorId(
                                vendor.id
                              );
                              setRejectReason("");
                              setActionError("");
                            }}
                            onActivate={() =>
                              runAction(
                                vendor.id,
                                () =>
                                  activateVendor(
                                    vendor.id
                                  ),
                                "Vendor activated successfully."
                              )
                            }
                            onDeactivate={() =>
                              runAction(
                                vendor.id,
                                () =>
                                  deactivateVendor(
                                    vendor.id
                                  ),
                                "Vendor deactivated successfully."
                              )
                            }
                          />
                        )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}


        {/* ================================= */}
        {/* Mobile Cards */}
        {/* ================================= */}

        {filteredVendors.length > 0 && (
          <div className="space-y-3 md:hidden">

            {filteredVendors.map(
              (vendor) => {

                const isActionLoading =
                  actionLoading ===
                  vendor.id;

                return (
                  <div
                    key={vendor.id}
                    className="relative rounded-2xl border border-[#e9e1dc] bg-white p-4 shadow-[0_6px_22px_rgba(48,37,31,0.035)]"
                  >

                    <div className="flex items-start gap-3">

                      {vendor.profileImageUrl ? (
                        <img
                          src={
                            vendor.profileImageUrl
                          }
                          alt={
                            vendor.businessName
                          }
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f1ebe7] text-sm font-semibold text-[#806d60]">
                          {vendor.businessName
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "V"}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <h3 className="truncate text-sm font-semibold text-[#30251f]">
                              {vendor.businessName ||
                                "Unnamed Vendor"}
                            </h3>

                            <p className="mt-1 truncate text-xs text-[#8b817b]">
                              {vendor.contactEmail ||
                                "No email"}
                            </p>

                          </div>

                          <div className="relative">

                            <button
                              type="button"
                              disabled={
                                isActionLoading
                              }
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    vendor.id
                                    ? null
                                    : vendor.id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#746a64] hover:bg-[#f3efec]"
                            >
                              {isActionLoading ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <MoreHorizontal
                                  size={17}
                                />
                              )}
                            </button>

                            {openMenu ===
                              vendor.id && (
                                <VendorActionsMenu
                                  vendor={vendor}
                                  onClose={() =>
                                    setOpenMenu(
                                      null
                                    )
                                  }
                                  onViewDetails={() => {
                                    setOpenMenu(null);
                                    router.push(`/admin/vendors/${vendor.id}`);
                                  }}
                                  onApprove={() =>
                                    runAction(
                                      vendor.id,
                                      () =>
                                        approveVendor(
                                          vendor.id
                                        ),
                                      "Vendor approved successfully."
                                    )
                                  }
                                  onReject={() => {
                                    setOpenMenu(
                                      null
                                    );
                                    setRejectVendorId(
                                      vendor.id
                                    );
                                    setRejectReason(
                                      ""
                                    );
                                    setActionError(
                                      ""
                                    );
                                  }}
                                  onActivate={() =>
                                    runAction(
                                      vendor.id,
                                      () =>
                                        activateVendor(
                                          vendor.id
                                        ),
                                      "Vendor activated successfully."
                                    )
                                  }
                                  onDeactivate={() =>
                                    runAction(
                                      vendor.id,
                                      () =>
                                        deactivateVendor(
                                          vendor.id
                                        ),
                                      "Vendor deactivated successfully."
                                    )
                                  }
                                />
                              )}

                          </div>

                        </div>

                      </div>

                    </div>


                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-[#a09791]">
                          Status
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            vendor.status
                          )}`}
                        >
                          {getStatusLabel(
                            vendor.status
                          )}
                        </span>
                      </div>


                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-[#a09791]">
                          Rating
                        </p>

                        <div className="mt-1 flex items-center gap-1.5">

                          <Star
                            size={14}
                            className="fill-current text-[#b08b55]"
                          />

                          <span className="text-sm font-medium text-[#403630]">
                            {Number(
                              vendor.averageRating ||
                              0
                            ).toFixed(1)}
                          </span>

                          <span className="text-xs text-[#9b918b]">
                            (
                            {vendor.reviewsCount ||
                              0}
                            )
                          </span>

                        </div>
                      </div>

                    </div>


                    <div className="mt-3 flex items-center gap-1.5 border-t border-[#f0ebe8] pt-3 text-xs text-[#766b65]">

                      <MapPin
                        size={14}
                        className="text-[#9b7b67]"
                      />

                      <span className="truncate">
                        {vendor.location ||
                          "Location not specified"}
                      </span>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>


      {/* ===================================== */}
      {/* Create Vendor Modal */}
      {/* ===================================== */}

      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#30251f]/30 p-4 backdrop-blur-[2px]"
          onClick={() =>
            !createLoading &&
            setShowCreateModal(false)
          }
        >

          <div
            className="w-full max-w-lg rounded-2xl border border-[#e9e1dc] bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-start justify-between border-b border-[#eee8e4] px-5 py-4 sm:px-6">

              <div>
                <h2 className="text-lg font-semibold text-[#30251f]">
                  Add Vendor
                </h2>

                <p className="mt-1 text-xs text-[#766b65]">
                  Create a new vendor account.
                </p>
              </div>

              <button
                type="button"
                disabled={createLoading}
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#766b65] hover:bg-[#f3efec]"
              >
                <X size={18} />
              </button>

            </div>


            <form
              onSubmit={
                handleCreateVendor
              }
              className="space-y-4 p-5 sm:p-6"
            >

              <InputField
                label="Full Name"
                name="fullName"
                value={
                  createForm.fullName
                }
                onChange={
                  handleCreateChange
                }
                placeholder="Enter vendor full name"
                disabled={
                  createLoading
                }
              />

              <InputField
                label="Business Name"
                name="businessName"
                value={
                  createForm.businessName
                }
                onChange={
                  handleCreateChange
                }
                placeholder="Enter business name"
                disabled={
                  createLoading
                }
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                value={
                  createForm.email
                }
                onChange={
                  handleCreateChange
                }
                placeholder="vendor@example.com"
                disabled={
                  createLoading
                }
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                value={
                  createForm.password
                }
                onChange={
                  handleCreateChange
                }
                placeholder="Enter temporary password"
                disabled={
                  createLoading
                }
              />


              <button
                type="submit"
                disabled={
                  createLoading
                }
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#45362e] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {createLoading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Creating Vendor...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Create Vendor
                  </>
                )}

              </button>

            </form>

          </div>

        </div>
      )}


      {/* ===================================== */}
      {/* Reject Modal */}
      {/* ===================================== */}

      {rejectVendorId && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-[#30251f]/30 p-4 backdrop-blur-[2px]"
          onClick={() => {
            setRejectVendorId(null);
            setRejectReason("");
          }}
        >

          <div
            className="w-full max-w-md rounded-2xl border border-[#e9e1dc] bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-start justify-between border-b border-[#eee8e4] px-5 py-4">

              <div>
                <h2 className="text-lg font-semibold text-[#30251f]">
                  Reject Vendor
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#766b65]">
                  Provide a reason for rejecting this vendor.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRejectVendorId(
                    null
                  );
                  setRejectReason("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#766b65] hover:bg-[#f3efec]"
              >
                <X size={18} />
              </button>

            </div>


            <div className="p-5">

              <textarea
                value={rejectReason}
                onChange={(event) =>
                  setRejectReason(
                    event.target.value
                  )
                }
                placeholder="Enter rejection reason..."
                rows={5}
                className="w-full resize-none rounded-xl border border-[#ddd4ce] bg-[#fdfcfb] px-4 py-3 text-sm text-[#30251f] outline-none placeholder:text-[#aaa09a] focus:border-[#9b7b67] focus:ring-2 focus:ring-[#9b7b67]/10"
              />

              {actionError && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0"
                  />
                  <span>
                    {actionError}
                  </span>
                </div>
              )}

              <div className="mt-4 flex gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setRejectVendorId(
                      null
                    );
                    setRejectReason("");
                    setActionError("");
                  }}
                  className="flex-1 rounded-xl border border-[#ddd4ce] px-4 py-3 text-sm font-medium text-[#5f544e] hover:bg-[#f8f5f3]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleReject
                  }
                  disabled={
                    actionLoading ===
                    rejectVendorId
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#8b3d3d] px-4 py-3 text-sm font-medium text-white hover:bg-[#773535] disabled:opacity-60"
                >

                  {actionLoading ===
                    rejectVendorId ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Rejecting...
                    </>
                  ) : (
                    "Reject Vendor"
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}


// ========================================
// Stat Card
// ========================================

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[#e9e1dc] bg-white p-4 shadow-[0_5px_20px_rgba(48,37,31,0.03)]">

      <div className="flex items-center justify-between gap-2">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3efec] text-[#8b7464]">
          {icon}
        </div>

      </div>

      <p className="mt-3 text-xl font-semibold text-[#30251f]">
        {value}
      </p>

      <p className="mt-0.5 text-xs text-[#766b65]">
        {label}
      </p>

    </div>
  );
}


// ========================================
// Input
// ========================================

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-[#30251f]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-[#ddd4ce] bg-[#fdfcfb] px-4 py-3 text-sm text-[#30251f] outline-none transition placeholder:text-[#aaa09a] focus:border-[#9b7b67] focus:ring-2 focus:ring-[#9b7b67]/10 disabled:opacity-60"
      />

    </div>
  );
}


// ========================================
// Actions Menu
// ========================================

function VendorActionsMenu({
  vendor,
  onClose,
  onViewDetails,
  onApprove,
  onReject,
  onActivate,
  onDeactivate,
}: {
  vendor: Vendor;
  onClose: () => void;
  onViewDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {

  const isPending = vendor.status === "Pending";
  const isApproved = vendor.status === "Approved";
  const isInactive = vendor.status === "Inactive";

  return (
    <div
      className="absolute right-0 top-full z-30 mt-1 w-48 overflow-hidden rounded-xl border border-[#e5ddd8] bg-white p-1.5 shadow-xl"
      onClick={(event) =>
        event.stopPropagation()
      }
    >

      <button
        type="button"
        onClick={onViewDetails}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#4f4540] hover:bg-[#f5f1ee]"
      >
        <Eye size={15} />
        View Details
      </button>


      {isPending && (
        <>
          <button
            type="button"
            onClick={onApprove}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <ShieldCheck size={15} />
            Approve Vendor
          </button>

          <button
            type="button"
            onClick={onReject}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-700 hover:bg-red-50"
          >
            <UserX size={15} />
            Reject Vendor
          </button>
        </>
      )}


      {isInactive && (
        <button
          type="button"
          onClick={onActivate}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-emerald-700 hover:bg-emerald-50"
        >
          <UserCheck size={15} />
          Activate Vendor
        </button>
      )}


      {isApproved && (
        <button
          type="button"
          onClick={onDeactivate}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-700 hover:bg-red-50"
        >
          <UserX size={15} />
          Deactivate Vendor
        </button>
      )}

    </div>
  );
}