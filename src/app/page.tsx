"use client";

import Link from "next/link";
import { ArrowRight, Heart, Map, Search, Sparkles, Store } from "lucide-react";

import SiteNavbar from "@/components/site/SiteNavbar";
import Footer from "@/shared/layouts/footer/footer";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/features/categories/hooks/useCategories";

export default function Home() {
  const { isAuthenticated, isUser, user } = useAuth();
  const { categories, loading: categoriesLoading, error: categoriesError } =
    useCategories();

  return (
    <>
    <main className="min-h-screen bg-[#faf8f6]">
      <SiteNavbar />

      <section className="border-b border-[#eee7e1] bg-[#f8f5ef] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#b99a62]/50" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#9b8367]">
                {isAuthenticated && isUser && user?.fullName
                  ? `Welcome back, ${user.fullName.split(" ")[0]}`
                  : "5digea"}
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
            </div>
            <span className="h-px w-10 bg-[#b99a62]/50" />
          </div>

          <h1 className="font-serif text-4xl font-light leading-tight text-[#30251f] sm:text-6xl">
            Plan Your Wedding,
            <br />
            <span className="italic text-[#a47e43]">Beautifully.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#766d67] sm:text-base">
            Discover trusted vendors, compare services and pricing, and keep
            your entire wedding plan organized in one elegant place.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-[#c6a66f] bg-[#30251f] px-7 py-3.5 text-sm font-medium text-white shadow-[0_8px_30px_rgba(48,37,31,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#42332a]"
            >
              <Search className="h-4 w-4" />
              Explore Services
            </Link>

            <Link
              href="/partners"
              className="inline-flex items-center gap-2 rounded-full border border-[#b99a62]/40 bg-white/60 px-7 py-3.5 text-sm font-medium text-[#493b32] backdrop-blur-sm transition-all duration-300 hover:border-[#b99a62] hover:bg-white"
            >
              <Store className="h-4 w-4" />
              Browse Partners
            </Link>

            {isAuthenticated && isUser && (
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-[#766d67] transition hover:text-[#30251f]"
              >
                <Map className="h-4 w-4" />
                My Roadmap
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#9b8367]">
              Categories
            </p>
            <h2 className="mt-2 font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
              Wedding Services
            </h2>
          </div>

          <Link
            href="/services"
            className="hidden items-center gap-1.5 text-sm font-medium text-[#a47e43] hover:underline sm:flex"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {categoriesLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
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
          <div className="rounded-2xl border border-[#eee7e1] bg-white p-10 text-center">
            <p className="text-[#766d67]">No categories available yet.</p>
          </div>
        )}

        {!categoriesLoading && !categoriesError && categories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/services?categoryId=${category.id}`}
                className="group rounded-2xl border border-[#eee7e1] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(48,37,31,0.1)]"
              >
                {category.iconUrl ? (
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#f4eee9]">
                    <img
                      src={category.iconUrl}
                      alt={category.name}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                ) : (
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#f4eee9]">
                    <Sparkles className="h-6 w-6 text-[#b99a62]" />
                  </div>
                )}

                <h3 className="mb-2 text-lg font-semibold text-[#30251f]">
                  {category.name}
                </h3>

                <p className="line-clamp-2 text-sm leading-6 text-[#766d67]">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {!isAuthenticated && (
        <section className="border-t border-[#eee7e1] bg-[#30251f] px-4 py-16 text-center sm:px-6 lg:px-8">
          <Heart className="mx-auto mb-4 h-7 w-7 text-[#c6a66f]" />

          <h2 className="font-serif text-2xl font-light text-white sm:text-3xl">
            Ready to start planning?
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#cdb9aa]">
            Create your free account to save favorites and build your own
            wedding roadmap.
          </p>

          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#30251f] transition hover:bg-[#f0e9e0]"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </main>
    <Footer />
    </>
  );
}