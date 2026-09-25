"use client";

import { FavoriteTargetType } from "@/types/favorite";
import { AboutCard } from "@/components/public/vendor-detail/AboutCard";
import { ContactCard } from "@/components/public/vendor-detail/ContactCard";
import { MobileContactBar } from "@/components/public/vendor-detail/MobileContactBar";
import { VendorDetailHero } from "@/components/public/vendor-detail/VendorDetailHero";
import { PageSkeleton } from "@/components/public/vendor-detail/VendorDetailSkeleton";
import { VendorIdentity } from "@/components/public/vendor-detail/VendorIdentity";
import { VendorNotFound } from "@/components/public/vendor-detail/VendorNotFound";
import { VendorReviewsSection } from "@/components/public/vendor-detail/VendorReviewsSection";
import { VendorServicesSection } from "@/components/public/vendor-detail/VendorServicesSection";
import { WorkingHoursCard } from "@/components/public/vendor-detail/WorkingHoursCard";
import { useVendorDetail } from "@/components/public/vendor-detail/useVendorDetail";

/**
 * Public vendor profile. Data + derived state come from `useVendorDetail`;
 * every block is a component in `src/components/public/vendor-detail/`.
 */
export default function VendorDetailPage() {
  const page = useVendorDetail();
  const { vendor } = page;

  if (page.loading) return <PageSkeleton />;
  if (page.error || !vendor) return <VendorNotFound failed={page.error} />;

  const favorite = {
    vendorId: vendor.id,
    isFavorited: page.isFavorited(FavoriteTargetType.Vendor, vendor.id),
    loading: page.favoriteActionLoading === `${FavoriteTargetType.Vendor}:${vendor.id}`,
    onToggle: page.toggleFavorite,
  };

  const hasWorkingHours = Object.keys(page.workingHours).length > 0;

  return (
    <main className="min-h-screen bg-[#faf8f6] pb-24 lg:pb-16">
      <VendorDetailHero {...favorite} shareCopied={page.shareCopied} onShare={page.handleShare} />

      <div className="mx-auto lg:max-w-10/12 px-4 sm:px-6 lg:px-8">
        <VendorIdentity
          vendor={vendor}
          roadmapPicker={page.roadmapPicker}
          roadmapTargets={page.roadmapTargets}
          socialLinks={page.socialLinks}
          hasSocialLinks={page.hasSocialLinks}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-12">
          <div className="min-w-0">
            <VendorServicesSection
              servicesLoading={page.servicesLoading}
              availableServices={page.availableServices}
              categoryOptions={page.categoryOptions}
              hasMultipleCategories={page.hasMultipleCategories}
              activeCategoryId={page.activeCategoryId}
              setActiveCategoryId={page.setActiveCategoryId}
              sortMode={page.sortMode}
              setSortMode={page.setSortMode}
              sortOptions={page.sortOptions}
              orderedServices={page.orderedServices}
              displayedServices={page.displayedServices}
            />

            <VendorReviewsSection
              vendor={vendor}
              reviews={page.vendorReviews}
              loading={page.reviewsLoading}
            />

            {/* Sidebar content, shown under the main column on phones */}
            <div className="mt-10 space-y-6 lg:hidden">
              <div id="contact">
                <ContactCard vendor={vendor} />
              </div>

              {hasWorkingHours && (
                <WorkingHoursCard workingHours={page.workingHours} todayJsDay={page.todayJsDay} />
              )}
            </div>
          </div>

          <aside className="hidden space-y-6 lg:sticky lg:top-6 lg:block lg:self-start">
            {vendor.bio && <AboutCard vendor={vendor} />}

            <div id="contact">
              <ContactCard vendor={vendor} />
            </div>

            {hasWorkingHours && (
              <WorkingHoursCard workingHours={page.workingHours} todayJsDay={page.todayJsDay} />
            )}
          </aside>
        </div>
      </div>

      <MobileContactBar {...favorite} shareCopied={page.shareCopied} onShare={page.handleShare} />
    </main>
  );
}
