"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ImageOff,
  CheckCircle2,
  Store,
  Loader2,
  GitCompare,
} from "lucide-react";

import FavoriteButton from "@/components/shared/FavoriteButton";
import ReviewsSection from "@/components/reviews/ReviewsSection";
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
  const { isAuthenticated, isUser } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

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
        setError(null);

        const data = await getService(params.id);

        setService(data);
      } catch (err) {
        setError("This service could not be found.");
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
          <p className="text-[#766d67]">{error || "Service not found."}</p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#30251f] px-6 py-3 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} />
            Back to Services
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

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#766d67] hover:text-[#30251f]"
        >
          <ArrowLeft size={16} />
          Back to Services
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: gallery + description */}
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#eee7e1] bg-[#f4eee9]">
              {service.images && service.images.length > 0 ? (
                <img
                  src={service.images[activeImage]?.url}
                  alt={service.name}
                  className="h-full w-full object-cover"
                />
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
                className="absolute right-4 top-4 shadow-sm"
              />

              <button
                type="button"
                onClick={() =>
                  toggleService({
                    id: service.id,
                    categoryId: service.categoryId,
                    categoryName: service.categoryName,
                    name: service.name,
                  })
                }
                className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur ${
                  isSelected(service.id)
                    ? "bg-[#30251f] text-white"
                    : "bg-white/90 text-[#514740]"
                }`}
              >
                <GitCompare size={14} />
                {isSelected(service.id) ? "Added to compare" : "Compare"}
              </button>
            </div>

            {service.images && service.images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {service.images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      index === activeImage
                        ? "border-[#b99a62]"
                        : "border-transparent"
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
            <div className="sticky top-24 rounded-2xl border border-[#eee7e1] bg-white p-6">
              <h2 className="mb-4 font-serif text-lg text-[#30251f]">
                Pricing
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
                        {formatPrice(price.price)} EGP
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#9b8f86]">
                  Contact the vendor for pricing.
                </p>
              )}

              <div className="mt-6 space-y-3 border-t border-[#f0e9e0] pt-6">
                <Link
                  href={`/vendors/${service.vendorId}`}
                  className="flex w-full items-center justify-center rounded-full border border-[#e4dbd0] px-5 py-3 text-sm font-medium text-[#30251f] transition hover:border-[#b99a62]"
                >
                  View Vendor Profile
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
                        Selected in Your Roadmap
                      </>
                    ) : addedToRoadmap ? (
                      <>
                        <CheckCircle2 size={16} />
                        Added to Roadmap
                      </>
                    ) : (
                      "Select for My Wedding Roadmap"
                    )}
                  </button>
                )}

                {isAuthenticated && isUser && !roadmapItem && (
                  <p className="rounded-xl bg-[#f8f1e4] px-4 py-3 text-center text-xs text-[#9b8367]">
                    Start your{" "}
                    <Link href="/roadmap" className="underline">
                      wedding roadmap
                    </Link>{" "}
                    to book vendors by category.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
