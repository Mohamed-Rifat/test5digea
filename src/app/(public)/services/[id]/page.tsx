"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ImageOff,
  Store,
  Loader2,
  GitCompare,
  Maximize2,
  Images as ImagesIcon,
} from "lucide-react";

import FavoriteButton from "@/components/shared/FavoriteButton";
import ImageLightbox from "@/components/shared/ImageLightbox";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import RelatedServices from "@/components/public/RelatedServices";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useCompare } from "@/context/CompareContext";
import { useRoadmapPicker } from "@/features/roadmap/hooks/useRoadmapPicker";
import RoadmapPickButton from "@/components/roadmap/RoadmapPickButton";
import { getService } from "@/features/services/api";
import { formatPrice, startingPrice } from "@/lib/format";
import { FavoriteTargetType } from "@/types/favorite";
import type { Service } from "@/types/service";

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const { t, localize } = useLanguage();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();
  const { isSelected, toggleService } = useCompare();
  const roadmapPicker = useRoadmapPicker();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(false);
        setActiveImage(0);
        setLightboxOpen(false);

        const data = await getService(params.id);

        setService(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) load();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f6]">
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#b99a62]" />
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="min-h-screen bg-[#faf8f6]">
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="text-[#766d67]">{error
              ? t("services.detail.notFound")
              : t("services.detail.notFoundFallback")}</p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#30251f] px-6 py-3 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {t("services.detail.backToServices")}
          </Link>
        </div>
      </main>
    );
  }

  const images = service.images ?? [];
  const hasImages = images.length > 0;
  const fromPrice = startingPrice(service.prices);
  const longDescription = (service.description ?? "").length > 280;

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto px-4 pb-14 pt-5 sm:px-6 lg:max-w-10/12 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label={t("services.detail.breadcrumb")}
          className="mb-5 flex min-w-0 items-center gap-1.5 text-xs text-[#8b7e76]"
        >
          <Link href="/services" className="shrink-0 hover:text-[#30251f]">
            {t("navbar.services")}
          </Link>
          {service.categoryName && (
            <>
              <ChevronLeft size={13} className="shrink-0 ltr:rotate-180" aria-hidden="true" />
              <Link
                href={`/services?categoryId=${service.categoryId}`}
                className="shrink-0 hover:text-[#30251f]"
              >
                {localize(service.categoryName)}
              </Link>
            </>
          )}
          <ChevronLeft size={13} className="shrink-0 ltr:rotate-180" aria-hidden="true" />
          <span className="truncate font-medium text-[#5f544d]">{service.name}</span>
        </nav>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
          {/* Gallery */}
          <div>
            <div
              className={`group relative aspect-[16/11] max-h-[440px] w-full overflow-hidden rounded-2xl border border-[#eee7e1] bg-[#f4eee9] ${
                hasImages ? "cursor-zoom-in" : ""
              }`}
              onClick={() => {
                if (hasImages) setLightboxOpen(true);
              }}
            >
              {hasImages ? (
                <>
                  <img
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    src={images[activeImage]?.url}
                    alt={service.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setLightboxOpen(true);
                    }}
                    className="absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur transition hover:bg-black/70"
                  >
                    {images.length > 1 ? <ImagesIcon size={13} /> : <Maximize2 size={13} />}
                    {images.length > 1
                      ? `${activeImage + 1} / ${images.length}`
                      : t("services.detail.viewFullSize")}
                  </button>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#c9bcae]">
                  <ImageOff size={36} />
                </div>
              )}

              <FavoriteButton
                targetType={FavoriteTargetType.Service}
                targetId={service.id}
                isFavorited={isFavorited(FavoriteTargetType.Service, service.id)}
                loading={actionLoading === `${FavoriteTargetType.Service}:${service.id}`}
                onToggle={toggleFavorite}
                size="lg"
                className="absolute end-3 top-3 shadow-sm"
              />

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleService({
                    id: service.id,
                    categoryId: service.categoryId,
                    categoryName: service.categoryName,
                    name: service.name,
                  });
                }}
                className={`absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur ${
                  isSelected(service.id) ? "bg-[#30251f] text-white" : "bg-white/90 text-[#514740]"
                }`}
              >
                <GitCompare size={13} />
                {isSelected(service.id)
                  ? t("services.detail.addedToCompare")
                  : t("services.detail.compare")}
              </button>
            </div>

            {images.length > 1 && (
              <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    onDoubleClick={() => setLightboxOpen(true)}
                    aria-label={t("common.imageNumber", { number: index + 1 })}
                    aria-pressed={index === activeImage}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-16 ${
                      index === activeImage
                        ? "border-[#b99a62]"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img loading="lazy" decoding="async" src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <ImageLightbox
              images={images}
              initialIndex={activeImage}
              open={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              title={service.name}
            />
          </div>

          {/* Details + booking */}
          <div className="lg:sticky lg:top-24">
            {service.categoryName && (
              <Link
                href={`/services?categoryId=${service.categoryId}`}
                className="inline-block rounded-full bg-[#f0e9e0] px-3 py-1 text-xs font-medium text-[#a47e43] transition hover:bg-[#e9dfd2]"
              >
                {localize(service.categoryName)}
              </Link>
            )}

            <h1 className="mt-3 font-serif text-2xl leading-snug text-[#30251f] sm:text-3xl">
              {service.name}
            </h1>

            <Link
              href={`/vendors/${service.vendorId}`}
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#a47e43] hover:underline"
            >
              <Store size={14} />
              {service.vendorBusinessName}
            </Link>

            {service.description && (
              <div className="mt-4">
                <p
                  className={`whitespace-pre-line text-sm leading-7 text-[#5f544d] ${
                    longDescription && !descriptionOpen ? "line-clamp-4" : ""
                  }`}
                >
                  {service.description}
                </p>
                {longDescription && (
                  <button
                    type="button"
                    onClick={() => setDescriptionOpen((open) => !open)}
                    className="mt-1 text-xs font-semibold text-[#a47e43] hover:underline"
                  >
                    {descriptionOpen ? t("services.detail.readLess") : t("services.detail.readMore")}
                  </button>
                )}
              </div>
            )}

            {/* Price + actions */}
            <div className="mt-5 rounded-2xl border border-[#eee7e1] bg-white p-4 sm:p-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs text-[#9b8f86]">{t("common.startingAt")}</span>
                <span className="font-serif text-2xl text-[#a47e43]">
                  {fromPrice !== null
                    ? `${formatPrice(fromPrice)} ${t("common.currency")}`
                    : t("common.priceOnRequest")}
                </span>
              </div>

              {service.prices && service.prices.length > 0 ? (
                <div className="mt-3 divide-y divide-[#f3ede6] rounded-xl bg-[#faf7f4] px-3.5">
                  {service.prices.map((price) => (
                    <div key={price.id} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="text-sm text-[#5f544d]">{price.label}</span>
                      <span className="shrink-0 text-sm font-semibold text-[#30251f]">
                        {formatPrice(price.price)} {t("common.currency")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-[#9b8f86]">{t("services.detail.contactForPricing")}</p>
              )}

              <div className="mt-4 space-y-2.5">
                <RoadmapPickButton
                  picker={roadmapPicker}
                  vendor={{ id: service.vendorId, name: service.vendorBusinessName }}
                  item={roadmapPicker.findItem(service.categoryId, service.categoryName)}
                  size="sm"
                />
                <Link
                  href={`/vendors/${service.vendorId}`}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#e4dbd0] px-4 text-sm font-medium text-[#30251f] transition hover:border-[#b99a62]"
                >
                  <Store size={15} />
                  {t("services.detail.viewVendorProfile")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <ReviewsSection serviceId={service.id} />

        <RelatedServices service={service} roadmap={roadmapPicker.roadmap} />
      </div>
    </main>
  );
}
