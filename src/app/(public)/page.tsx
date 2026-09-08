"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Search, Sparkles, Store } from "lucide-react";

import ServiceCard from "@/components/public/ServiceCard";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { getServices } from "@/features/services/api";
import type { Service } from "@/types/service";

const FEATURED_SERVICES_COUNT = 6;

export default function Home() {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadFeaturedServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError(null);

        const data = await getServices();

        if (!cancelled) {
          setServices(data.slice(0, FEATURED_SERVICES_COUNT));
        }
      } catch {
        if (!cancelled) {
          setServicesError("Failed to load services.");
        }
      } finally {
        if (!cancelled) {
          setServicesLoading(false);
        }
      }
    };

    loadFeaturedServices();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      {/* Hero */}
      <section className="border-b border-[#eee7e1] bg-[#f8f5ef] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#9b8367]">
              5digea
            </span>
          </div>

          <h1 className="font-serif text-4xl font-light leading-tight text-[#30251f] sm:text-5xl">
            Plan your perfect day with{" "}
            <span className="italic text-[#a47e43]">trusted vendors</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#766d67]">
            Discover approved wedding professionals and curated services,
            compare your options, and build your wedding roadmap in one
            place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#30251f] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#42332a]"
            >
              <Search size={16} />
              Explore services
            </Link>

            <Link
              href="/vendors"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-7 py-3.5 text-sm font-medium text-[#5f544d] transition hover:border-[#b99a62]"
            >
              <Store size={16} />
              Browse vendors
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171]">
              Categories
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
              Wedding services for every need
            </h2>
          </div>
        </div>

        {categoriesLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-[#eee5df] bg-white"
              />
            ))}
          </div>
        )}

        {!categoriesLoading && categoriesError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-600">{categoriesError}</p>
          </div>
        )}

        {!categoriesLoading && !categoriesError && categories.length === 0 && (
          <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
            <p className="text-[#756960]">No categories available yet.</p>
          </div>
        )}

        {!categoriesLoading && !categoriesError && categories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/vendors?categoryId=${category.id}`}
                className="group rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {category.iconUrl ? (
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-[#faf7f4]">
                    <img
                      src={category.iconUrl}
                      alt={category.name}
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                ) : (
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-[#faf7f4]">
                    <span className="text-2xl text-[#c9b8a8]">✦</span>
                  </div>
                )}

                <h3 className="mb-2 text-xl font-semibold text-[#30251f]">
                  {category.name}
                </h3>

                <p className="line-clamp-3 text-sm leading-6 text-[#81746d]">
                  {category.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e685e]">
                  Browse vendors <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured services */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171]">
              Featured
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
              Popular services
            </h2>
          </div>

          <Link
            href="/services"
            className="hidden items-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:inline-flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {servicesLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-[#eee5df] bg-white"
              />
            ))}
          </div>
        )}

        {!servicesLoading && servicesError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-600">{servicesError}</p>
          </div>
        )}

        {!servicesLoading && !servicesError && services.length === 0 && (
          <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
            <p className="text-[#756960]">No services available yet.</p>
          </div>
        )}

        {!servicesLoading && !servicesError && services.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
