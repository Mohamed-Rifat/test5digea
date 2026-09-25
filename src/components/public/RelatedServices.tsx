"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Compass, Layers, Map as MapIcon, SearchX, Store } from "lucide-react";

import ServiceCard from "@/components/public/ServiceCard";
import { useLanguage } from "@/context/LanguageContext";
import { useRelatedServices } from "@/features/services/hooks/useRelatedServices";
import type { Roadmap } from "@/types/roadmap";
import type { Service } from "@/types/service";

function Rail({
  icon,
  eyebrow,
  title,
  subtitle,
  services,
  viewAllHref,
  viewAllLabel,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  services: Service[];
  viewAllHref: string;
  viewAllLabel: string;
}) {
  const { t, dir } = useLanguage();
  const track = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    // In RTL, "next" means scrolling towards the left.
    el.scrollBy({ left: direction * el.clientWidth * 0.85 * (dir === "rtl" ? -1 : 1), behavior: "smooth" });
  };

  return (
    <section className="py-7 first:pt-0">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6ede2] text-[#a47e43]">
            {icon}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#a47e43] rtl:tracking-normal">
              {eyebrow}
            </p>
            <h2 className="mt-0.5 font-serif text-xl text-[#30251f] sm:text-2xl">{title}</h2>
            <p className="mt-1 text-sm text-[#8b7e76]">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition hover:border-[#b99a62]"
          >
            {viewAllLabel}
            <ArrowRight size={13} className="rtl:rotate-180" />
          </Link>
          {services.length > 3 && (
            <div className="hidden gap-1.5 md:flex">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label={t("services.detail.related.prev")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4dbd0] bg-white text-[#6f635b] transition hover:border-[#b99a62] hover:text-[#30251f]"
              >
                <ChevronLeft size={16} className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label={t("services.detail.related.next")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4dbd0] bg-white text-[#6f635b] transition hover:border-[#b99a62] hover:text-[#30251f]"
              >
                <ChevronRight size={16} className="rtl:rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-3 [scrollbar-width:thin] sm:-mx-0 sm:px-0"
      >
        {services.map((service, i) => (
          <div
            key={service.id}
            className="w-[62%] shrink-0 snap-start motion-safe:animate-[catIn_.6s_cubic-bezier(.2,.8,.2,1)_both] sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-3rem)/4)] xl:w-[calc((100%-4rem)/5)]"
            style={{ animationDelay: `${Math.min(i, 5) * 60}ms` }}
          >
            <ServiceCard service={service} compact />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Below-the-fold suggestions on the service page, so a couple always has a
 * next step: similar services (same category, other vendors), more from this
 * vendor, and other categories to explore (their unfinished roadmap steps
 * first). Each rail says clearly what it is; empty ones explain why.
 */
export default function RelatedServices({
  service,
  roadmap,
}: {
  service: Service;
  roadmap: Roadmap | null;
}) {
  const { t, localize } = useLanguage();
  const { loading, data } = useRelatedServices(service, roadmap);
  const category = localize(service.categoryName);

  if (loading || !data) {
    return (
      <div className="mt-16 space-y-10 border-t border-[#eee7e1] pt-12" aria-busy="true">
        {[0, 1].map((k) => (
          <div key={k}>
            <div className="h-6 w-56 animate-pulse rounded bg-[#f0e8dd]" />
            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-[#f4eee9]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { sameCategory, sameVendor, explore, exploreFromRoadmap } = data;
  if (!sameCategory.length && !sameVendor.length && !explore.length) return null;

  return (
    <div className="mt-12 divide-y divide-[#eee7e1] border-t border-[#eee7e1] pt-8">
      {sameCategory.length > 0 ? (
        <Rail
          icon={<Layers size={18} />}
          eyebrow={t("services.detail.related.similarEyebrow")}
          title={t("services.detail.related.similarTitle", { category })}
          subtitle={t("services.detail.related.similarSub")}
          services={sameCategory}
          viewAllHref={`/services?categoryId=${service.categoryId}`}
          viewAllLabel={t("services.detail.similar.viewMore", { category })}
        />
      ) : (
        <section className="py-8 first:pt-0">
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-[#e3d6c8] bg-[#fcfaf7] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6ede2] text-[#a47e43]">
                <SearchX size={18} />
              </span>
              <div>
                <p className="font-semibold text-[#30251f]">
                  {t("services.detail.related.noSimilarTitle", { category })}
                </p>
                <p className="mt-0.5 text-sm text-[#8b7e76]">
                  {t("services.detail.related.noSimilarBody")}
                </p>
              </div>
            </div>
            <Link
              href="/services"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#30251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#46382f]"
            >
              {t("services.detail.related.browseAll")}
              <ArrowRight size={13} className="rtl:rotate-180" />
            </Link>
          </div>
        </section>
      )}

      {sameVendor.length > 0 && (
        <Rail
          icon={<Store size={18} />}
          eyebrow={t("services.detail.related.vendorEyebrow")}
          title={t("services.detail.related.vendorTitle", { vendor: service.vendorBusinessName })}
          subtitle={t("services.detail.related.vendorSub", { vendor: service.vendorBusinessName })}
          services={sameVendor}
          viewAllHref={`/vendors/${service.vendorId}`}
          viewAllLabel={t("services.detail.related.vendorProfile")}
        />
      )}

      {explore.length > 0 && (
        <Rail
          icon={exploreFromRoadmap ? <MapIcon size={18} /> : <Compass size={18} />}
          eyebrow={
            exploreFromRoadmap
              ? t("services.detail.related.roadmapEyebrow")
              : t("services.detail.related.exploreEyebrow")
          }
          title={
            exploreFromRoadmap
              ? t("services.detail.related.roadmapTitle")
              : t("services.detail.related.exploreTitle")
          }
          subtitle={
            exploreFromRoadmap
              ? t("services.detail.related.roadmapSub")
              : t("services.detail.related.exploreSub")
          }
          services={explore}
          viewAllHref={exploreFromRoadmap ? "/roadmap" : "/services"}
          viewAllLabel={
            exploreFromRoadmap
              ? t("services.detail.related.openRoadmap")
              : t("services.detail.related.browseAll")
          }
        />
      )}
    </div>
  );
}
