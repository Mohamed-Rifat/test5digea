"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { compareServices } from "@/services/services.service";
import { compareVendors } from "@/features/vendors/api/vendors.api";

import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";

export default function ComparePage() {
  const router = useRouter();

  const [query, setQuery] = useState({
    type: "",
    ids: [] as string[],
    categoryId: "",
  });

  const { type, ids, categoryId } = query;

  const [services, setServices] = useState<Service[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Read comparison parameters from URL
  useEffect(() => {
    const url = new URL(window.location.href);

    setQuery({
      type: url.searchParams.get("type") || "",
      ids: (url.searchParams.get("ids") || "")
        .split(",")
        .filter(Boolean),
      categoryId: url.searchParams.get("categoryId") || "",
    });
  }, []);

  // Fetch comparison data
  useEffect(() => {
    let cancelled = false;

    async function loadComparison() {
      try {
        setLoading(true);
        setError("");

        if (!ids.length) {
          throw new Error("No items selected");
        }

        if (type === "service") {
          const result = await compareServices({
            serviceIds: ids,
          });

          if (!cancelled) {
            setServices(result);
          }
        } else if (type === "vendor") {
          if (!categoryId) {
            throw new Error(
              "Select a category before comparing vendors."
            );
          }

          const result = await compareVendors({
            vendorIds: ids,
            categoryId,
          });

          if (!cancelled) {
            setVendors(result);
          }
        } else {
          throw new Error("Invalid comparison");
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Unable to compare items"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadComparison();

    return () => {
      cancelled = true;
    };
  }, [type, ids.join(","), categoryId]);

  const items: Array<Vendor | Service> =
    type === "vendor" ? vendors : services;

  const comparisonRows: Array<{
    label: string;
    getValue: (item: Vendor | Service) => string;
  }> = [
    {
      label: "Rating",
      getValue: (item) =>
        type === "vendor"
          ? `${Number((item as Vendor).averageRating || 0).toFixed(
              1
            )} / 5`
          : "—",
    },
    {
      label: "Category",
      getValue: (item) =>
        type === "vendor"
          ? (item as Vendor).categories?.join(", ") || "—"
          : (item as Service).categoryName || "—",
    },
    {
      label: "Location",
      getValue: (item) =>
        type === "vendor"
          ? (item as Vendor).location || "—"
          : (item as Service).vendorBusinessName || "—",
    },
    {
      label: "Description",
      getValue: (item) =>
        type === "vendor"
          ? (item as Vendor).bio || "—"
          : (item as Service).description || "—",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-[#756960] transition hover:text-[#30251f]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Header */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171]">
            Decision tools
          </p>

          <h1 className="mt-2 text-4xl font-semibold text-[#30251f]">
            Compare {type === "vendor" ? "vendors" : "services"}
          </h1>

          <p className="mt-2 text-sm text-[#81746d]">
            Put your shortlisted options side by side.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-8 h-80 animate-pulse rounded-2xl bg-white" />
        ) : error ? (
          /* Error */
          <div className="mt-8 rounded-2xl border border-red-100 bg-white p-10 text-center text-sm text-red-700">
            <p>{error}</p>

            <div>
              <Link
                href={type === "vendor" ? "/vendors" : "/services"}
                className="mt-4 inline-block rounded-xl bg-[#30251f] px-5 py-3 text-white transition hover:bg-[#45362e]"
              >
                Back to marketplace
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty */
          <div className="mt-8 rounded-2xl border border-[#eee5df] bg-white p-10 text-center">
            <p className="text-sm text-[#756960]">
              No items found to compare.
            </p>

            <Link
              href={type === "vendor" ? "/vendors" : "/services"}
              className="mt-4 inline-block rounded-xl bg-[#30251f] px-5 py-3 text-sm text-white transition hover:bg-[#45362e]"
            >
              Back to marketplace
            </Link>
          </div>
        ) : (
          /* Comparison Table */
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[#eee5df] bg-white shadow-sm">
            <div className="min-w-[760px]">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `180px repeat(${items.length}, minmax(190px, 1fr))`,
                }}
              >
                {/* First Header Cell */}
                <div className="border-b border-r border-[#eee5df] p-5 text-xs font-semibold uppercase tracking-widest text-[#a09289]">
                  Comparison
                </div>

                {/* Item Headers */}
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-[#eee5df] p-5"
                  >
                    <div className="font-semibold text-[#30251f]">
                      {type === "vendor"
                        ? (item as Vendor).businessName
                        : (item as Service).name}
                    </div>

                    <button
                      onClick={() =>
                        router.push(
                          type === "vendor"
                            ? `/vendors/${item.id}`
                            : `/services/${item.id}`
                        )
                      }
                      className="mt-2 text-xs font-semibold text-[#8e685e] transition hover:text-[#30251f]"
                    >
                      View details →
                    </button>
                  </div>
                ))}

                {/* Comparison Rows */}
                {comparisonRows.map(({ label, getValue }) => (
                  <div key={label} className="contents">
                    {/* Row Label */}
                    <div className="border-b border-r border-[#eee5df] bg-[#faf8f6] p-5 text-sm font-medium text-[#665951]">
                      {label}
                    </div>

                    {/* Row Values */}
                    {items.map((item) => (
                      <div
                        key={`${label}-${item.id}`}
                        className="border-b border-[#eee5df] p-5 text-sm leading-6 text-[#756960]"
                      >
                        {getValue(item)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
