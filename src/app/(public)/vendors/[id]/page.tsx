"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  ImageOff,
  Loader2,
} from "lucide-react";

import FavoriteButton from "@/components/shared/FavoriteButton";
import RatingStars from "@/components/shared/RatingStars";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useServices } from "@/features/services/hooks/useServices";
import { getVendorDetails } from "@/features/vendors/api";
import { formatPrice, startingPrice } from "@/lib/format";
import { FavoriteTargetType } from "@/types/favorite";
import type { Vendor } from "@/types/vendor";

export default function VendorDetailPage() {
  const params = useParams<{ id: string }>();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isFavorited, toggleFavorite, actionLoading } = useFavorites();
  const { services, loading: servicesLoading } = useServices(
    params.id ? { vendorId: params.id } : undefined
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getVendorDetails(params.id);

        setVendor(data);
      } catch (err) {
        setError("This vendor could not be found.");
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

  if (error || !vendor) {
    return (
      <main className="min-h-screen bg-[#faf8f6]">
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="text-[#766d67]">{error || "Vendor not found."}</p>
          <Link
            href="/vendors"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#30251f] px-6 py-3 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} />
            Back to Vendors
          </Link>
        </div>
      </main>
    );
  }

  const approvedServices = services.filter(
    (service) => service.status === "Approved" || service.status === "approved"
  );
  const visibleServices = approvedServices.length > 0 ? approvedServices : services;

  return (
    <main className="min-h-screen bg-[#faf8f6]">

      {/* Cover */}
      <section className="relative h-36 overflow-hidden bg-gradient-to-br from-[#f0e9e0] via-[#eee4d8] to-[#e4d8c8] sm:h-48">
        <div className="mx-auto h-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/vendors"
            className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3.5 py-2 text-xs font-semibold text-[#30251f] shadow-sm backdrop-blur transition hover:bg-white sm:left-6 sm:top-6 lg:left-8"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-10 rounded-3xl border border-[#eee7e1] bg-white/95 p-4 shadow-[0_18px_50px_rgba(48,37,31,0.08)] backdrop-blur sm:-mt-14 sm:p-5">
          <div className="grid grid-cols-[76px_minmax(0,1fr)_auto] items-center gap-4 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:gap-6">
          <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#f4eee9] shadow-md sm:h-28 sm:w-28 sm:rounded-3xl">
            {vendor.profileImageUrl ? (
              <img
                src={vendor.profileImageUrl}
                alt={vendor.businessName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 size={40} className="text-[#a47e43]" />
            )}
          </div>

          <div className="min-w-0">
            <h1 className="break-words font-serif text-xl font-light leading-tight text-[#30251f] sm:text-3xl">
              {vendor.businessName}
            </h1>

            {vendor.slogan && (
              <p className="mt-1 line-clamp-2 text-xs italic leading-5 text-[#a47e43] sm:text-sm">{vendor.slogan}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <RatingStars
                rating={vendor.averageRating}
                reviewsCount={vendor.reviewsCount}
              />

              {vendor.location && (
                <span className="flex min-w-0 items-center gap-1.5 text-xs text-[#9b8f86] sm:text-sm">
                  <MapPin size={14} />
                  {vendor.location}
                </span>
              )}
            </div>
          </div>

          <div className="self-start">
            <FavoriteButton
              targetType={FavoriteTargetType.Vendor}
              targetId={vendor.id}
              isFavorited={isFavorited(FavoriteTargetType.Vendor, vendor.id)}
              loading={actionLoading === `${FavoriteTargetType.Vendor}:${vendor.id}`}
              onToggle={toggleFavorite}
              size="lg"
            />
          </div>
        </div>

        <div className="mt-7 grid gap-6 pb-12 sm:mt-10 sm:gap-8 sm:pb-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          {/* Main */}
          <div>
            {vendor.bio && (
              <div className="mb-8">
                <h2 className="mb-3 font-serif text-lg text-[#30251f]">
                  About
                </h2>
                <p className="whitespace-pre-line text-sm leading-7 text-[#5f544d]">
                  {vendor.bio}
                </p>
              </div>
            )}

            {vendor.categories && vendor.categories.length > 0 && (
              <div className="mb-8 rounded-2xl border border-[#eee7e1] bg-white p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="font-serif text-lg text-[#30251f]">Categories</h2>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a09289]">Assigned</span>
                </div>
                <div className="flex flex-wrap gap-2">
                {vendor.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-[#f0e9e0] px-3 py-1.5 text-xs font-medium text-[#5f544d]"
                  >
                    {cat}
                  </span>
                ))}
                </div>
              </div>
            )}

            <h2 className="mb-4 font-serif text-lg text-[#30251f]">
              Services
            </h2>

            {servicesLoading && (
              <p className="text-sm text-[#9b8f86]">Loading services...</p>
            )}

            {!servicesLoading && visibleServices.length === 0 && (
              <p className="rounded-2xl border border-[#eee7e1] bg-white p-8 text-center text-sm text-[#9b8f86]">
                This partner hasn't published any services yet.
              </p>
            )}

            {!servicesLoading && visibleServices.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
                {visibleServices.map((service) => {
                  const price = startingPrice(service.prices);
                  const image = service.images?.[0]?.url;

                  return (
                    <Link
                      key={service.id}
                      href={`/services/${service.id}`}
                      className="group flex min-w-0 gap-3 rounded-2xl border border-[#eee7e1] bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-[#e1d4c7] hover:shadow-[0_12px_30px_rgba(48,37,31,0.08)] sm:gap-4 sm:p-4"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f4eee9] sm:h-20 sm:w-20">
                        {image ? (
                          <img
                            src={image}
                            alt={service.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#c9bcae]">
                            <ImageOff size={18} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#30251f]">
                          {service.name}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-[#9b8f86]">
                          {service.description}
                        </p>
                        <p className="mt-1.5 text-sm font-medium text-[#a47e43]">
                          {price !== null
                            ? `From ${formatPrice(price)} EGP`
                            : "Contact for pricing"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="rounded-2xl border border-[#eee7e1] bg-white p-6">
              <h2 className="mb-4 font-serif text-lg text-[#30251f]">
                Contact
              </h2>

              <div className="space-y-3 text-sm text-[#5f544d]">
                {vendor.contactPhone && (
                  <a
                    href={`tel:${vendor.contactPhone}`}
                    className="flex items-center gap-3 rounded-xl bg-[#faf7f4] px-4 py-3 transition hover:bg-[#f0e9e0]"
                  >
                    <Phone size={16} className="text-[#a47e43]" />
                    {vendor.contactPhone}
                  </a>
                )}

                {vendor.contactEmail && (
                  <a
                    href={`mailto:${vendor.contactEmail}`}
                    className="flex items-center gap-3 rounded-xl bg-[#faf7f4] px-4 py-3 transition hover:bg-[#f0e9e0]"
                  >
                    <Mail size={16} className="text-[#a47e43]" />
                    {vendor.contactEmail}
                  </a>
                )}

                {vendor.location && (
                  <div className="flex items-center gap-3 rounded-xl bg-[#faf7f4] px-4 py-3">
                    <MapPin size={16} className="text-[#a47e43]" />
                    {vendor.location}
                  </div>
                )}

                {!vendor.contactPhone &&
                  !vendor.contactEmail &&
                  !vendor.location && (
                    <p className="text-[#9b8f86]">
                      No contact details provided yet.
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}
