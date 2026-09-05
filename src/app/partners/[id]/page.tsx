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

import SiteNavbar from "@/components/site/SiteNavbar";
import FavoriteButton from "@/components/shared/FavoriteButton";
import RatingStars from "@/components/shared/RatingStars";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useServices } from "@/features/services/hooks/useServices";
import { getVendorDetails } from "@/services/vendors.service";
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
        setError("This partner could not be found.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) load();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f6]">
        <SiteNavbar />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#b99a62]" />
        </div>
      </main>
    );
  }

  if (error || !vendor) {
    return (
      <main className="min-h-screen bg-[#faf8f6]">
        <SiteNavbar />
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="text-[#766d67]">{error || "Partner not found."}</p>
          <Link
            href="/partners"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#30251f] px-6 py-3 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} />
            Back to Partners
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
      <SiteNavbar />

      {/* Cover */}
      <section className="relative h-48 bg-gradient-to-br from-[#f0e9e0] to-[#e4d8c8] sm:h-56">
        <div className="mx-auto h-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/partners"
            className="absolute left-4 top-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#30251f] backdrop-blur transition hover:bg-white sm:left-6 lg:left-8"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-14 flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-[#faf8f6] bg-[#f4eee9] shadow-sm">
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

          <div className="flex flex-1 flex-wrap items-start justify-between gap-4 pb-2">
            <div>
              <h1 className="font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
                {vendor.businessName}
              </h1>

              {vendor.slogan && (
                <p className="mt-1 italic text-[#a47e43]">{vendor.slogan}</p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-4">
                <RatingStars
                  rating={vendor.averageRating}
                  reviewsCount={vendor.reviewsCount}
                />

                {vendor.location && (
                  <span className="flex items-center gap-1.5 text-sm text-[#9b8f86]">
                    <MapPin size={14} />
                    {vendor.location}
                  </span>
                )}
              </div>
            </div>

            <FavoriteButton
              targetType={FavoriteTargetType.Vendor}
              targetId={vendor.id}
              isFavorited={isFavorited(FavoriteTargetType.Vendor, vendor.id)}
              loading={
                actionLoading === `${FavoriteTargetType.Vendor}:${vendor.id}`
              }
              onToggle={toggleFavorite}
              size="lg"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-10 pb-16 lg:grid-cols-[1.2fr_0.8fr]">
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
              <div className="mb-8 flex flex-wrap gap-2">
                {vendor.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-[#f0e9e0] px-3 py-1.5 text-xs font-medium text-[#5f544d]"
                  >
                    {cat}
                  </span>
                ))}
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
              <div className="grid gap-4 sm:grid-cols-2">
                {visibleServices.map((service) => {
                  const price = startingPrice(service.prices);
                  const image = service.images?.[0]?.url;

                  return (
                    <Link
                      key={service.id}
                      href={`/services/${service.id}`}
                      className="flex gap-4 rounded-2xl border border-[#eee7e1] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(48,37,31,0.08)]"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f4eee9]">
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
    </main>
  );
}
