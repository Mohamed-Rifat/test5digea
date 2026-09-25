"use client";

import { useAuth } from "@/context/AuthContext";
import { topVendors } from "@/lib/ranking";
import PartnersMarquee from "@/components/home/PartnersMarquee";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { FeaturedVendors } from "@/components/home/FeaturedVendors";
import { FinalCta } from "@/components/home/FinalCta";
import { HomeCategories } from "@/components/home/HomeCategories";
import { HomeHero } from "@/components/home/HomeHero";
import { JoinAsVendor } from "@/components/home/JoinAsVendor";
import { MobileAppTeaser } from "@/components/home/MobileAppTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { useHomeData } from "@/components/home/useHomeData";

/**
 * Home page. Each block lives in `src/components/home/`; re-order or remove
 * sections here. Data loading is in `useHomeData`.
 */
export default function Home() {
  const { isAuthenticated, isUser } = useAuth();
  const home = useHomeData();

  // Only pitch "join us" to guests and couples — vendors are already in,
  // and admins manage the platform.
  const canJoinAsVendor = !isAuthenticated || isUser;

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <HomeHero />

      <HomeCategories
        categories={home.categories}
        categoriesLoading={home.categoriesLoading}
        categoriesError={home.categoriesError}
      />

      <FeaturedVendors
        featuredVendors={home.featuredVendors}
        vendorsLoading={home.vendorsLoading}
        vendorsError={home.vendorsError}
      />

      {!home.vendorsLoading && !home.vendorsError && (
        <PartnersMarquee vendors={topVendors(home.vendors, 24)} />
      )}

      <FeaturedServices
        featuredServices={home.featuredServices}
        servicesLoading={home.servicesLoading}
        servicesError={home.servicesError}
      />

      <Testimonials
        reviews={home.reviews}
        reviewsLoading={home.reviewsLoading}
        vendors={home.vendors}
      />

      <AboutTeaser />

      {canJoinAsVendor && <JoinAsVendor />}

      <MobileAppTeaser />

      <FinalCta />
    </main>
  );
}
