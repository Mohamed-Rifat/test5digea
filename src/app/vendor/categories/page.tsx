"use client";

import { Info, Tags } from "lucide-react";

import { useVendor } from "@/features/vendors/hooks/useVendor";

// Vendors no longer self-select categories - an admin assigns them from the
// admin dashboard (Vendors > vendor detail > Categories). This page is a
// read-only view so a vendor can see what they're currently approved for.
export default function VendorCategoriesPage() {
  const { vendor, loading } = useVendor();

  const categories = vendor?.categories ?? [];

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-medium text-[#9b8171]">
          Vendor Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#30251f]">
          My Categories
        </h1>
        <p className="mt-2 text-sm text-[#756b65]">
          These are the categories our team has approved for your account.
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#e3d9d1] bg-[#f8f1e4] p-4 text-sm text-[#8a6a3d]">
          <Info className="h-5 w-5 shrink-0" />
          Categories are managed by 5digea admins. If you'd like to be added
          to a new category, please contact support.
        </div>

        <div className="mt-8 rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-sm sm:p-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-2xl bg-[#f3ebe6]"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-10 text-center">
              <Tags className="mx-auto h-8 w-8 text-[#9a8d85]" />
              <p className="mt-3 text-sm text-[#756b65]">
                No categories have been assigned to your account yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-3 rounded-2xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3.5 text-sm font-medium text-[#40352f]"
                >
                  <Tags size={16} className="shrink-0 text-[#a47e43]" />
                  <span className="min-w-0 truncate">{category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
