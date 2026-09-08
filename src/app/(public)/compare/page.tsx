"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  GitCompare,
  ImageOff,
  Trash2,
} from "lucide-react";

import { compareServices, getService } from "@/features/services/api";
import { compareVendorList } from "@/features/vendors/api";
import { useCompare } from "@/context/CompareContext";
import { useToast } from "@/components/providers/ToastProvider";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";

const MAX_COMPARE = 4;

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { selected, hydrated, removeService, clearAll } = useCompare();

  const type = searchParams.get("type") || "";
  const urlIds = useMemo(
    () => (searchParams.get("ids") || "").split(",").filter(Boolean),
    [searchParams]
  );
  const categoryId = searchParams.get("categoryId") || "";

  const [services, setServices] = useState<Service[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!hydrated) return;

      setLoading(true);
      setError("");

      try {
        const ids = Array.from(new Set(urlIds));
        if (ids.length < 2) throw new Error("Select at least two items to compare.");
        if (ids.length > MAX_COMPARE) throw new Error(`You can compare up to ${MAX_COMPARE} items at once.`);

        if (type === "service") {
          // Normal navigation comes from CompareContext, so no extra GETs are needed.
          // For a manually opened/bookmarked URL, fetch the selected services first and
          // validate categoryId before sending anything to the compare endpoint.
          const contextIds = selected.map((item) => item.id);
          const hasTrustedSelection = ids.every((id) => contextIds.includes(id));

          let categoryIds: string[];
          if (hasTrustedSelection && selected.length >= ids.length) {
            categoryIds = ids.map(
              (id) => selected.find((item) => item.id === id)?.categoryId || ""
            );
          } else {
            const details = await Promise.all(ids.map((id) => getService(id)));
            categoryIds = details.map((item) => item.categoryId);
          }

          const firstCategoryId = categoryIds[0];
          if (!firstCategoryId || categoryIds.some((id) => id !== firstCategoryId)) {
            throw new Error("You can only compare services from the same category.");
          }

          const result = await compareServices({ serviceIds: ids });
          const returnedCategoryIds = result.map((item) => item.categoryId);
          if (returnedCategoryIds.some((id) => id !== firstCategoryId)) {
            throw new Error("The comparison contains services from different categories.");
          }

          if (!cancelled) setServices(result);
          return;
        }

        if (type === "vendor") {
          if (!categoryId) {
            throw new Error("Select a category before comparing vendors.");
          }

          const result = await compareVendorList({
            vendorIds: ids,
            categoryId,
          });
          if (!cancelled) setVendors(result);
          return;
        }

        throw new Error("Invalid comparison.");
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unable to compare items.";
          setError(message);
          toast(message, "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [type, urlIds.join(","), categoryId, selected, hydrated, toast]);

  const isServiceComparison = type === "service";
  const items = isServiceComparison ? services : vendors;

  const serviceImages = (service: Service) =>
    [...(service.images ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  const serviceRows = [
    { label: "Vendor", value: (item: Service) => item.vendorBusinessName || "—" },
    { label: "Category", value: (item: Service) => item.categoryName || "—" },
    { label: "Description", value: (item: Service) => item.description || "—" },
  ];

  const vendorRows = [
    { label: "Rating", value: (item: Vendor) => `${Number(item.averageRating || 0).toFixed(1)} / 5` },
    { label: "Reviews", value: (item: Vendor) => String(item.reviewsCount ?? 0) },
    { label: "Category", value: (item: Vendor) => item.categories?.join(", ") || "—" },
    { label: "Location", value: (item: Vendor) => item.location || "—" },
    { label: "Description", value: (item: Vendor) => item.bio || "—" },
  ];

  const rows = isServiceComparison ? serviceRows : vendorRows;

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#756960] transition hover:text-[#30251f]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {isServiceComparison && selected.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearAll();
                router.replace("/services");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#665951] transition hover:border-[#b99a62]"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          )}
        </div>

        <header className="mt-6 sm:mt-7">
          <div className="flex items-center gap-2 text-[#a47e43]">
            <GitCompare size={16} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
              Decision tools
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-light text-[#30251f] sm:text-4xl">
            Compare {isServiceComparison ? "Services" : "Vendors"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#81746d]">
            Compare your shortlisted options side by side and choose what fits your wedding best.
          </p>
        </header>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: Math.max(2, Math.min(MAX_COMPARE, urlIds.length || 2)) }).map((_, index) => (
              <div key={index} className="h-96 animate-pulse rounded-3xl border border-[#eee5df] bg-white" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <GitCompare size={20} />
            </div>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-red-700">{error}</p>
            <Link
              href={isServiceComparison ? "/services" : "/vendors"}
              className="mt-6 inline-flex rounded-full bg-[#30251f] px-6 py-3 text-sm font-medium text-white"
            >
              Back to marketplace
            </Link>
          </div>
        ) : items.length < 2 ? (
          <div className="mt-8 rounded-3xl border border-[#eee5df] bg-white p-10 text-center">
            <p className="text-sm text-[#756960]">Select at least two items to compare.</p>
          </div>
        ) : (
          <>
            {isServiceComparison && (
              <div className="mt-7 flex flex-wrap items-center gap-2 rounded-2xl border border-[#eadfce] bg-[#fcf7ef] px-4 py-3 text-xs text-[#806b54]">
                <CheckCircle2 size={15} />
                <span>All selected services belong to the same category.</span>
              </div>
            )}

            <div className="compare-scroll mt-5 overflow-x-auto rounded-2xl border border-[#eee5df] bg-white shadow-[0_12px_45px_rgba(48,37,31,0.06)] sm:mt-6 sm:rounded-3xl">
              <div
                className="grid min-w-[680px]"
                style={{ gridTemplateColumns: `150px repeat(${items.length}, minmax(180px, 1fr))` }}
              >
                <div className="border-b border-r border-[#eee5df] bg-[#faf8f6] p-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a09289] sm:p-5">
                  Comparison
                </div>

                {items.map((item) => {
                  const service = item as Service;
                  const vendor = item as Vendor;
                  const image = isServiceComparison ? serviceImages(service)[0]?.url : vendor.profileImageUrl;
                  const title = isServiceComparison ? service.name : vendor.businessName;
                  const href = isServiceComparison ? `/services/${item.id}` : `/vendors/${item.id}`;

                  return (
                    <div key={item.id} className="border-b border-[#eee5df] p-4 sm:p-5">
                      <div className="mb-3 flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-[#f4eee9]">
                        {image ? (
                          <img src={image} alt={title} className="h-full w-full object-cover" />
                        ) : (
                          <ImageOff size={26} className="text-[#c8bbb0]" />
                        )}
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-[#30251f]">{title}</h2>
                        {isServiceComparison && (
                          <button
                            type="button"
                            onClick={() => {
                              removeService(item.id);
                              const nextIds = urlIds.filter((id) => id !== item.id);
                              if (nextIds.length > 0) {
                                const next = new URLSearchParams(searchParams.toString());
                                next.set("ids", nextIds.join(","));
                                if (nextIds.length < 2) next.delete("categoryId");
                                router.replace(`/compare?${next.toString()}`);
                              } else {
                                router.replace("/services");
                              }
                            }}
                            aria-label={`Remove ${title} from comparison`}
                            className="shrink-0 rounded-full p-1.5 text-[#9b8f86] transition hover:bg-[#f7f0eb] hover:text-[#30251f]"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <Link href={href} className="mt-2 inline-flex text-xs font-semibold text-[#a47e43] hover:underline">
                        View details →
                      </Link>
                    </div>
                  );
                })}

                {rows.map((row) => (
                  <div key={row.label} className="contents">
                    <div className="border-b border-r border-[#eee5df] bg-[#faf8f6] p-4 text-xs font-semibold text-[#665951] sm:p-5">
                      {row.label}
                    </div>
                    {items.map((item) => (
                      <div key={`${row.label}-${item.id}`} className="border-b border-[#eee5df] p-4 text-xs leading-6 text-[#756960] sm:p-5">
                        {row.value(item as never)}
                      </div>
                    ))}
                  </div>
                ))}

                {isServiceComparison && (
                  <div className="contents">
                    <div className="border-b border-r border-[#eee5df] bg-[#faf8f6] p-4 text-xs font-semibold text-[#665951] sm:p-5">Packages</div>
                    {services.map((service) => (
                      <div key={`packages-${service.id}`} className="border-b border-[#eee5df] p-4 sm:p-5">
                        {service.prices?.length ? (
                          <div className="space-y-2">
                            {service.prices.map((price) => (
                              <div key={price.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#faf7f4] px-3 py-2">
                                <span className="min-w-0 truncate text-xs text-[#5f544d]">{price.label}</span>
                                <span className="shrink-0 text-xs font-semibold text-[#a47e43]">{formatPrice(price.price)} EGP</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-[#9b8f86]">Contact vendor</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {isServiceComparison && (
                  <div className="contents">
                    <div className="border-r border-[#eee5df] bg-[#faf8f6] p-4 text-xs font-semibold text-[#665951] sm:p-5">Gallery</div>
                    {services.map((service) => {
                      const images = serviceImages(service);
                      return (
                        <div key={`gallery-${service.id}`} className="p-4 sm:p-5">
                          {images.length ? (
                            <div className="grid grid-cols-2 gap-2">
                              {images.slice(0, 4).map((image) => (
                                <img key={image.id} src={image.url} alt="" className="aspect-square w-full rounded-xl object-cover" />
                              ))}
                            </div>
                          ) : (
                            <div className="flex h-24 items-center justify-center rounded-xl bg-[#f7f2ee] text-xs text-[#9b8f86]">No images</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
