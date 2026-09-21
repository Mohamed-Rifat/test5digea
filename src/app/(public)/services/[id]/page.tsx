"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ImageOff,
  CheckCircle2,
  Store,
  Loader2,
  GitCompare,
  Maximize2,
  Images as ImagesIcon,
} from "lucide-react";

import FavoriteButton from "@/components/shared/FavoriteButton";
import ImageLightbox from "@/components/shared/ImageLightbox";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import SimilarServices from "@/components/public/SimilarServices";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useCompare } from "@/context/CompareContext";
import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import { useAuth } from "@/context/AuthContext";
import { getService } from "@/features/services/api";
import { formatPrice } from "@/lib/format";
import { FavoriteTargetType } from "@/types/favorite";
import type { Service } from "@/types/service";

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { isAuthenticated, isUser } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();
  const { isSelected, toggleService } = useCompare();
  const {
    roadmap,
    selectVendor,
    actionLoading: roadmapActionLoading,
  } = useRoadmap();
  const [addedToRoadmap, setAddedToRoadmap] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(false);
        setActiveImage(0);
        setLightboxOpen(false);
        setAddedToRoadmap(false);

        const data = await getService(params.id);

        setService(data);
      } catch (err) {
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

  const roadmapItem = roadmap?.items.find(
    (item) => item.categoryId === service.categoryId
  );

  const handleAddToRoadmap = async () => {
    if (!roadmapItem) return;

    const ok = await selectVendor(service.categoryId, service.vendorId);

    if (ok) setAddedToRoadmap(true);
  };

  return (
    <main className="min-h-screen bg-[#faf8f6]">

      <div className="mx-auto lg:max-w-10/12 px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#766d67] hover:text-[#30251f]"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t("services.detail.backToServices")}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: gallery + description */}
          <div>
            <div
              className={`group relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-[#eee7e1] bg-[#f4eee9] ${
                service.images && service.images.length > 0 ? "cursor-zoom-in" : ""
              }`}
              onClick={() => {
                if (service.images && service.images.length > 0) setLightboxOpen(true);
              }}
            >
              {service.images && service.images.length > 0 ? (
                <>
                  <img
                    src={service.images[activeImage]?.url}
                    alt={service.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />

                  {/* Zoom hint overlay */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/10">
                    <span className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                      <Maximize2 size={13} />
                      {t("services.detail.viewFullSize")}
                    </span>
                  </div>

                  {/* Image counter */}
                  {service.images.length > 1 && (
                    <span className="absolute bottom-4 end-4 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                      {activeImage + 1} / {service.images.length}
                    </span>
                  )}
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#c9bcae]">
                  <ImageOff size={40} />
                </div>
              )}

              <FavoriteButton
                targetType={FavoriteTargetType.Service}
                targetId={service.id}
                isFavorited={isFavorited(
                  FavoriteTargetType.Service,
                  service.id
                )}
                loading={
                  actionLoading ===
                  `${FavoriteTargetType.Service}:${service.id}`
                }
                onToggle={toggleFavorite}
                size="lg"
                className="absolute end-4 top-4 shadow-sm"
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
                className={`absolute start-4 top-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur ${
                  isSelected(service.id)
                    ? "bg-[#30251f] text-white"
                    : "bg-white/90 text-[#514740]"
                }`}
              >
                <GitCompare size={14} />
                {isSelected(service.id)
                  ? t("services.detail.addedToCompare")
                  : t("services.detail.compare")}
              </button>
            </div>

            {service.images && service.images.length > 1 && (
              <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                {service.images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    onDoubleClick={() => setLightboxOpen(true)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-20 ${
                      index === activeImage
                        ? "border-[#b99a62]"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {service.images && service.images.length > 0 && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#a47e43] hover:underline"
              >
                <ImagesIcon size={13} />
                {service.images.length > 1
                  ? t("services.detail.viewAllPhotosMany", {
                      count: service.images.length,
                    })
                  : t("services.detail.viewAllPhotosOne", {
                      count: service.images.length,
                    })}
              </button>
            )}

            <ImageLightbox
              images={service.images || []}
              initialIndex={activeImage}
              open={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              title={service.name}
            />

            <div className="mt-8">
              {service.categoryName && (
                <span className="inline-block rounded-full bg-[#f0e9e0] px-3 py-1 text-xs font-medium text-[#a47e43]">
                  {service.categoryName}
                </span>
              )}

              <h1 className="mt-3 font-serif text-3xl font-light text-[#30251f]">
                {service.name}
              </h1>

              <Link
                href={`/vendors/${service.vendorId}`}
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#a47e43] hover:underline"
              >
                <Store size={14} />
                {service.vendorBusinessName}
              </Link>

              <p className="mt-6 whitespace-pre-line text-sm leading-7 text-[#5f544d]">
                {service.description}
              </p>
            </div>

            <ReviewsSection serviceId={service.id} />
          </div>

          {/* Right: pricing + actions */}
          <div>
            {/* The whole column sticks together; if it is taller than the
                screen it scrolls on its own so nothing gets cut off. */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <div className="rounded-2xl border border-[#eee7e1] bg-white p-6">
                <h2 className="mb-4 font-serif text-lg text-[#30251f]">
                  {t("services.detail.pricing")}
                </h2>

                {service.prices && service.prices.length > 0 ? (
                  <div className="space-y-3">
                    {service.prices.map((price) => (
                      <div
                        key={price.id}
                        className="flex items-center justify-between rounded-xl bg-[#faf7f4] px-4 py-3"
                      >
                        <span className="text-sm text-[#5f544d]">
                          {price.label}
                        </span>
                        <span className="font-serif text-base text-[#a47e43]">
                          {formatPrice(price.price)} {t("common.currency")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#9b8f86]">
                    {t("services.detail.contactForPricing")}
                  </p>
                )}

                <div className="mt-6 space-y-3 border-t border-[#f0e9e0] pt-6">
                  <Link
                    href={`/vendors/${service.vendorId}`}
                    className="flex w-full items-center justify-center rounded-full border border-[#e4dbd0] px-5 py-3 text-sm font-medium text-[#30251f] transition hover:border-[#b99a62]"
                  >
                    {t("services.detail.viewVendorProfile")}
                  </Link>

                  {isAuthenticated && isUser && roadmapItem && (
                    <button
                      type="button"
                      onClick={handleAddToRoadmap}
                      disabled={
                        roadmapActionLoading ===
                          `select-${service.categoryId}` ||
                        roadmapItem.selectedVendorId === service.vendorId
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#42332a] disabled:opacity-60"
                    >
                      {roadmapItem.selectedVendorId === service.vendorId ? (
                        <>
                          <CheckCircle2 size={16} />
                          {t("services.detail.selectedInRoadmap")}
                        </>
                      ) : addedToRoadmap ? (
                        <>
                          <CheckCircle2 size={16} />
                          {t("services.detail.addedToRoadmap")}
                        </>
                      ) : (
                        t("services.detail.selectForRoadmap")
                      )}
                    </button>
                  )}

                  {isAuthenticated && isUser && !roadmapItem && (
                    <p className="rounded-xl bg-[#f8f1e4] px-4 py-3 text-center text-xs text-[#9b8367]">
                      {t("services.detail.startRoadmapPrefix")}{" "}
                      <Link href="/roadmap" className="underline">
                        {t("services.detail.startRoadmapLink")}
                      </Link>{" "}
                      {t("services.detail.startRoadmapSuffix")}
                    </p>
                  )}
                </div>
              </div>

              <SimilarServices service={service} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
