"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Star,
  Store,
  User,
} from "lucide-react";

import {
  getAdminVendorDetails,
  updateVendorCategories,
} from "@/features/vendors/api";

import { getAdminCategories } from "@/features/categories/api";
import { getApiErrorMessage } from "@/lib/error";

import type { Vendor } from "@/types/vendor";
import type { Category } from "@/types/category";

// ================================
// Status
// ================================

const getStatusClasses = (status: Vendor["status"]) => {
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
        <p className="text-[11px] uppercase tracking-wide text-[#a09791]">
          {label}
        </p>

        <p className="mt-1 wrap-break-words text-sm font-medium text-[#403630]">
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
  // Load Vendor + Categories
  // ================================

  useEffect(() => {
    let mounted = true;

    const loadVendor = async () => {
      try {
        setLoading(true);
        setError("");

        const { id } = await params;

        // Load vendor
        const data = await getAdminVendorDetails(id);

        // Load all categories
        const allCategories = await getAdminCategories();

        if (mounted) {
          setVendor(data);
          setCategories(allCategories);

          // Convert vendor category names -> category IDs
          const currentCategoryIds = allCategories
            .filter((category) =>
              data.categories?.some(
                (vendorCategory) =>
                  vendorCategory.toLowerCase() ===
                  category.name.toLowerCase()
              )
            )
            .map((category) => category.id);

          setSelectedCategoryIds(currentCategoryIds);
        }
      } catch (err: unknown) {
        console.error("Failed to load vendor details:", err);

        if (mounted) {
          setError(getApiErrorMessage(err, "Failed to load vendor details."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadVendor();

    return () => {
      mounted = false;
    };
  }, [params]);

  // ================================
  // Toggle Category
  // ================================

  const toggleCategory = (categoryId: string) => {
    setCategoriesSuccess("");
    setCategoriesError("");

    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
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
        prev
          ? {
              ...prev,
              categories: selectedNames,
            }
          : prev
      );

      setCategoriesSuccess("Categories updated successfully.");
    } catch (err: unknown) {
      console.error("Failed to update vendor categories:", err);

      setCategoriesError(getApiErrorMessage(err, "Failed to update categories."));
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
          <ArrowLeft size={16} />
          Back to Vendors
        </Link>

        {/* Error */}
        {error || !vendor ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="text-sm font-semibold">
                  Unable to load vendor
                </p>

                <p className="mt-1 text-sm">
                  {error || "Vendor not found."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ================================
                Vendor Header
            ================================= */}

            <section className="rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.04)] sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  {vendor.profileImageUrl ? (
                    <img
                      src={vendor.profileImageUrl}
                      alt={vendor.businessName || "Vendor"}
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#f1ebe7] text-xl font-semibold text-[#806d60]">
                      {vendor.businessName?.charAt(0)?.toUpperCase() || "V"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="truncate text-xl font-semibold tracking-tight text-[#30251f] sm:text-2xl">
                        {vendor.businessName || "Unnamed Vendor"}
                      </h1>

                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                          vendor.status
                        )}`}
                      >
                        {vendor.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[#766b65]">
                      {vendor.slogan || "No slogan provided"}
                    </p>

                    <p className="mt-2 text-xs text-[#9b918b]">
                      Vendor ID: {vendor.id}
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
                    ({vendor.reviewsCount || 0} reviews)
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
                    Business Information
                  </h2>
                </div>

                <div className="space-y-3">
                  <InfoRow
                    icon={<Store size={16} />}
                    label="Business Name"
                    value={vendor.businessName || "Not provided"}
                  />

                  <InfoRow
                    icon={<MapPin size={16} />}
                    label="Location"
                    value={vendor.location || "Not provided"}
                  />

                  <InfoRow
                    icon={<Mail size={16} />}
                    label="Business Email"
                    value={vendor.contactEmail || "Not provided"}
                  />

                  <InfoRow
                    icon={<Phone size={16} />}
                    label="Contact Phone"
                    value={vendor.contactPhone || "Not provided"}
                  />
                </div>
              </section>

              {/* Vendor Profile */}

              <section className="rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)]">
                <div className="mb-4 flex items-center gap-2">
                  <User size={18} className="text-[#8b7464]" />

                  <h2 className="text-base font-semibold text-[#30251f]">
                    Vendor Profile
                  </h2>
                </div>

                <div className="space-y-3">
                  <InfoRow
                    icon={<User size={16} />}
                    label="User ID"
                    value={vendor.userId || "Not provided"}
                  />

                  <InfoRow
                    icon={<CheckCircle2 size={16} />}
                    label="Created At"
                    value={
                      vendor.createdAt
                        ? new Date(vendor.createdAt).toLocaleString()
                        : "Not provided"
                    }
                  />

                  <InfoRow
                    icon={<Loader2 size={16} />}
                    label="Updated At"
                    value={
                      vendor.updatedAt
                        ? new Date(vendor.updatedAt).toLocaleString()
                        : "Not provided"
                    }
                  />

                  {vendor.rejectionReason && (
                    <InfoRow
                      icon={<AlertCircle size={16} />}
                      label="Rejection Reason"
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
                About Business
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#665b55]">
                {vendor.bio || "No business description provided."}
              </p>
            </section>

            {/* ================================
                Categories
            ================================= */}

            <section className="mt-5 rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#30251f]">
                    Categories
                  </h2>

                  <p className="mt-1 text-sm text-[#9b918b]">
                    Select the categories assigned to this vendor.
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Categories
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
                          onChange={() =>
                            toggleCategory(category.id)
                          }
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
                    No categories available.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
