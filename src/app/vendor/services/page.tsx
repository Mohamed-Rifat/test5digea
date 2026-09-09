"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
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
  Sparkles,
  Filter,
  Search,
  X,
  ChevronDown,
  Tag,
} from "lucide-react";

import {
  Tooltip,
  Badge,
  CircularProgress,
  Button,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

import { useVendorServices } from "@/features/services/hooks/useVendorServices";

type StatusFilter = "All" | "Approved" | "Pending" | "Rejected" | "Inactive";

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string; color: string }
> = {
  Approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    color: "emerald",
  },
  Pending: {
    label: "Pending Review",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    color: "amber",
  },
  Rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border border-red-200",
    color: "red",
  },
  Inactive: {
    label: "Inactive",
    icon: XCircle,
    className: "bg-gray-100 text-gray-700 border border-gray-200",
    color: "gray",
  },
};

const STATUS_FILTERS = [
  { value: "All", label: "All", icon: Filter },
  { value: "Approved", label: "Approved", icon: CheckCircle2 },
  { value: "Pending", label: "Pending", icon: Clock3 },
  { value: "Rejected", label: "Rejected", icon: XCircle },
  { value: "Inactive", label: "Inactive", icon: XCircle },
] as const;

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ إحصائيات سريعة
  const stats = useMemo(() => {
    const total = services.length;
    const approved = services.filter(s => s.status === "Approved").length;
    const pending = services.filter(s => s.status === "Pending").length;
    const rejected = services.filter(s => s.status === "Rejected").length;
    const inactive = services.filter(s => s.status === "Inactive").length;

    return {
      total,
      approved,
      pending,
      rejected,
      inactive,
    };
  }, [services]);

  // ✅ فلترة الخدمات
  const filteredServices = useMemo(() => {
    let filtered = services;

    // فلترة حسب الحالة
    if (statusFilter !== "All") {
      filtered = filtered.filter((service) => service.status === statusFilter);
    }

    // فلترة حسب البحث
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.categoryName?.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [services, statusFilter, searchQuery]);

  // ✅ تحديث البيانات
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  // ✅ إعادة الإرسال
  const handleResubmit = useCallback(async (id: string) => {
    await resubmit(id);
  }, [resubmit]);

  // ✅ تغيير الفلتر
  const handleStatusFilterChange = useCallback((filter: StatusFilter) => {
    setStatusFilter(filter);
  }, []);

  // ✅ مسح البحث
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

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
                  <BriefcaseBusiness size={16} className="text-[#a47e43] sm:h-5 sm:w-5" strokeWidth={1.8} />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
                  My Services
                </h1>
              </div>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
                Manage the services you offer in the marketplace. Create, edit, and track your service listings.
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] disabled:opacity-50 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin" : "sm:h-4 sm:w-4"} />
                <span className="hidden xs:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                <span className="xs:hidden">{isRefreshing ? "..." : "⟳"}</span>
              </button>

              <Link
                href="/vendor/services/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#30251f] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#463831] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                <Plus size={13} className="sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Add Service</span>
                <span className="xs:hidden">+</span>
              </Link>

              {/* Badge with count */}
              {!loading && services.length > 0 && (
                <Badge
                  badgeContent={services.length}
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
                    <BriefcaseBusiness size={14} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
                  </div>
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* =================================================
            Stats
        ================================================= */}

        {!loading && services.length > 0 && (
          <section className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-3 lg:grid-cols-5 lg:gap-4">
            <div className="rounded-2xl border border-[#e8dfd8] bg-white p-3 shadow-sm transition-all hover:shadow-md sm:p-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-[#8d8077] sm:text-[10px]">Total</p>
              <p className="mt-1 text-lg font-semibold text-[#30251f] sm:mt-1.5 sm:text-2xl">{stats.total}</p>
              <p className="text-[8px] text-[#9a8d85] sm:text-[10px]">All services</p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 shadow-sm transition-all hover:shadow-md sm:p-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-emerald-700 sm:text-[10px]">Approved</p>
              <p className="mt-1 text-lg font-semibold text-emerald-700 sm:mt-1.5 sm:text-2xl">{stats.approved}</p>
              <p className="text-[8px] text-emerald-600 sm:text-[10px]">Active</p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3 shadow-sm transition-all hover:shadow-md sm:p-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-amber-700 sm:text-[10px]">Pending</p>
              <p className="mt-1 text-lg font-semibold text-amber-700 sm:mt-1.5 sm:text-2xl">{stats.pending}</p>
              <p className="text-[8px] text-amber-600 sm:text-[10px]">Review</p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-3 shadow-sm transition-all hover:shadow-md sm:p-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-red-700 sm:text-[10px]">Rejected</p>
              <p className="mt-1 text-lg font-semibold text-red-700 sm:mt-1.5 sm:text-2xl">{stats.rejected}</p>
              <p className="text-[8px] text-red-600 sm:text-[10px]">Need fix</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-3 shadow-sm transition-all hover:shadow-md sm:p-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-gray-600 sm:text-[10px]">Inactive</p>
              <p className="mt-1 text-lg font-semibold text-gray-600 sm:mt-1.5 sm:text-2xl">{stats.inactive}</p>
              <p className="text-[8px] text-gray-500 sm:text-[10px]">Disabled</p>
            </div>
          </section>
        )}

        {/* =================================================
            Error
        ================================================= */}

        {actionError && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-700 sm:mb-6 sm:p-4 sm:text-sm">
            <AlertCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            <span className="leading-5 sm:leading-6">{actionError}</span>
          </div>
        )}

        {/* =================================================
            Filters
        ================================================= */}

        <div className="mb-4 rounded-2xl border border-[#e8dfd8] bg-white p-3 shadow-sm sm:mb-6 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5eee9] sm:h-8 sm:w-8">
                <Filter size={12} className="text-[#a47e43] sm:h-3.5 sm:w-3.5" />
              </div>
              <span className="text-xs font-medium text-[#40352f] sm:text-sm">Filter</span>
            </div>

            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              {/* Search */}
              <div className="flex-1">
                <TextField
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  size="small"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={15} className="text-[#9b8f86]" />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery ? (
                        <InputAdornment position="end">
                          <button
                            onClick={handleClearSearch}
                            className="text-[#9b8f86] hover:text-[#30251f]"
                          >
                            <X size={15} />
                          </button>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 38,
                      borderRadius: "10px",
                      backgroundColor: "#fcfaf8",
                      fontSize: "12px",
                      "& fieldset": { borderColor: "#e3d9d1" },
                      "&:hover fieldset": { borderColor: "#d5c8be" },
                      "&.Mui-focused fieldset": { borderColor: "#a47e43", borderWidth: "1px" },
                    },
                  }}
                />
              </div>

              {/* Status Filter Buttons - Desktop */}
              <div className="hidden flex-wrap gap-1 sm:flex">
                {STATUS_FILTERS.map((filter) => {
                  const Icon = filter.icon;
                  const isActive = statusFilter === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => handleStatusFilterChange(filter.value as StatusFilter)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium transition sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs ${
                        isActive
                          ? "bg-[#30251f] text-white"
                          : "border border-[#e3d9d1] bg-white text-[#514740] hover:bg-[#f7f2ef]"
                      }`}
                    >
                      <Icon size={12} className={isActive ? "text-white" : "text-[#8d8077]"} />
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              {/* Status Filter - Mobile Dropdown */}
              <div className="sm:hidden">
                <Select
                  value={statusFilter}
                  onChange={(e: SelectChangeEvent) => handleStatusFilterChange(e.target.value as StatusFilter)}
                  size="small"
                  fullWidth
                  IconComponent={ChevronDown}
                  sx={{
                    height: 38,
                    borderRadius: "10px",
                    backgroundColor: "#fcfaf8",
                    fontSize: "12px",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e3d9d1" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d5c8be" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a47e43", borderWidth: "1px" },
                  }}
                >
                  {STATUS_FILTERS.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <MenuItem key={filter.value} value={filter.value}>
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-[#8d8077]" />
                          <span>{filter.label}</span>
                        </div>
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(statusFilter !== "All" || searchQuery) && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#f1ece8] pt-3">
              <span className="text-[9px] font-medium text-[#958a83] sm:text-[10px]">Active:</span>

              {statusFilter !== "All" && (
                <Chip
                  label={statusFilter}
                  onDelete={() => handleStatusFilterChange("All")}
                  size="small"
                  sx={{
                    height: 22,
                    borderRadius: "6px",
                    backgroundColor: "#f5eee9",
                    color: "#5e5047",
                    fontSize: "9px",
                    fontWeight: 600,
                    "& .MuiChip-deleteIcon": { width: 12, height: 12, color: "#8b776a" },
                  }}
                />
              )}

              {searchQuery && (
                <Chip
                  label={`"${searchQuery}"`}
                  onDelete={handleClearSearch}
                  size="small"
                  sx={{
                    height: 22,
                    borderRadius: "6px",
                    backgroundColor: "#f5eee9",
                    color: "#5e5047",
                    fontSize: "9px",
                    fontWeight: 600,
                    maxWidth: "120px",
                    "& .MuiChip-deleteIcon": { width: 12, height: 12, color: "#8b776a" },
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* =================================================
            Results Counter
        ================================================= */}

        {!loading && !error && filteredServices.length > 0 && (
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <p className="text-[10px] text-[#9b8f86] sm:text-xs">
              Showing <span className="font-medium text-[#5e5149]">{filteredServices.length}</span>
              {filteredServices.length === 1 ? " service" : " services"}
              {services.length > 0 && filteredServices.length !== services.length && (
                <span className="text-[#bbb2ac]"> (of {services.length})</span>
              )}
            </p>
          </div>
        )}

        {/* =================================================
            Content
        ================================================= */}

        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm sm:h-32"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm text-red-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#ded3cb] bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5eee9] text-[#8d715e] sm:h-16 sm:w-16">
              <BriefcaseBusiness className="h-6 w-6 text-[#806b5e] sm:h-7 sm:w-7" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#40352f] sm:mt-5 sm:text-base">
              {searchQuery || statusFilter !== "All" ? "No matching services" : "No services yet"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#81746d] sm:text-sm sm:leading-6">
              {searchQuery || statusFilter !== "All"
                ? "Try adjusting your filters or search terms to find what you're looking for."
                : "Start adding your services so customers can discover what your business offers."}
            </p>
            {(searchQuery || statusFilter !== "All") ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:mt-5 sm:px-5 sm:py-2.5"
              >
                <X size={14} />
                Clear filters
              </button>
            ) : (
              <Link
                href="/vendor/services/new"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f] sm:mt-5 sm:px-5 sm:py-2.5"
              >
                <Plus className="h-4 w-4" />
                Add Your First Service
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredServices.map((service) => {
              const status = statusConfig[service.status] ?? statusConfig.Pending;
              const StatusIcon = status.icon;
              const isResubmitting = actionLoading === `resubmit-${service.id}`;

              return (
                <div
                  key={service.id}
                  className="group rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition-all hover:border-[#d5c8be] hover:shadow-md sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      {/* Title & Status */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="text-sm font-semibold text-[#30251f] sm:text-base">
                          {service.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[10px] ${status.className}`}
                        >
                          <StatusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {status.label}
                        </span>
                      </div>

                      {/* Category */}
                      <p className="mt-0.5 text-[11px] text-[#81746d] sm:mt-1 sm:text-sm">
                        {service.categoryName || "Uncategorized"}
                      </p>

                      {/* Description */}
                      {service.description && (
                        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#625852] sm:mt-2 sm:text-sm sm:leading-6">
                          {service.description}
                        </p>
                      )}

                      {/* Rejection Reason */}
                      {service.status === "Rejected" && service.rejectionReason && (
                        <div className="mt-2 rounded-xl bg-red-50 px-2.5 py-1.5 text-[10px] text-red-700 sm:mt-3 sm:px-3 sm:py-2 sm:text-xs">
                          <span className="font-medium">Rejection reason:</span> {service.rejectionReason}
                        </div>
                      )}

                      {/* Prices */}
                      {service.prices.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
                          <DollarSign className="h-3 w-3 text-[#9a8d85] sm:h-4 sm:w-4" />
                          {service.prices.map((price) => (
                            <span
                              key={price.id}
                              className="rounded-full bg-[#f7f1ed] px-2 py-0.5 text-[9px] font-medium text-[#66564c] sm:px-3 sm:py-1 sm:text-xs"
                            >
                              {price.label}: {price.price}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                      {service.status === "Rejected" && (
                        <Tooltip title="Resubmit for review" arrow>
                          <button
                            type="button"
                            onClick={() => handleResubmit(service.id)}
                            disabled={isResubmitting}
                            className="inline-flex h-8 items-center justify-center gap-1 rounded-xl border border-[#e3d9d1] bg-white px-2.5 text-[10px] font-medium text-[#514740] transition hover:bg-[#f7f2ef] disabled:opacity-60 sm:h-10 sm:gap-2 sm:px-3.5 sm:text-sm"
                          >
                            {isResubmitting ? (
                              <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                            ) : (
                              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            <span className="hidden xs:inline">Resubmit</span>
                          </button>
                        </Tooltip>
                      )}

                      <Link
                        href={`/vendor/services/${service.id}`}
                        className="inline-flex h-8 items-center justify-center gap-1 rounded-xl bg-[#30251f] px-2.5 text-[10px] font-medium text-white transition hover:bg-[#463831] sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
                      >
                        <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">Manage</span>
                        <span className="xs:hidden">Edit</span>
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