"use client";

import { Info, Tags } from "lucide-react";

import { useVendor } from "@/features/vendors/hooks/useVendor";

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
          Categories
        </h1>
        <p className="mt-2 text-sm text-[#756b65]">
          The categories below represent your business on 5digea.
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#e8dfd8] bg-[#fbf6f1] p-4 text-sm text-[#6f625a]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#a47e43]" />
          <p>
            Categories are assigned by the 5digea team and shown here for
            reference only. If you&apos;d like a category added or changed,
            please contact support.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-sm sm:p-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-11 animate-pulse rounded-xl bg-[#f3ebe6]"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-10 text-center">
              <Tags className="mx-auto h-8 w-8 text-[#9a8d85]" />
              <p className="mt-3 text-sm text-[#756b65]">
                No categories have been assigned to your business yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {categories.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-2 text-sm font-medium text-[#40352f]"
                >
                  <Tags className="h-3.5 w-3.5 text-[#a47e43]" />
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
