import type { Translation } from "../types";

const services: Translation["services"] = {
  list: {
    eyebrow: "Browse",
    titlePrefix: "Find the Perfect",
    titleHighlight: "Wedding Services",
    description:
      "Compare packages and pricing from trusted vendors across every category, all in one place.",
    searchPlaceholder: "Search services, e.g. photography, catering...",
    filters: "Filters",
    search: "Search",
    category: "Category",
    allCategories: "All categories",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    anyPrice: "Any",
    sortBy: "Sort By",
    sort: {
      relevant: "Most Relevant",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
    },
    loadError: "We couldn't load services right now. Please try again.",
    empty: "No services match your search yet. Try different filters.",
    selectedOne: "{count} {category} service selected",
    selectedMany: "{count} {category} services selected",
    compareButton: "Compare ({count})",
    found: "{count} services found",
    pageOf: "Page {page} of {total}",
  },
  detail: {
    notFound: "This service could not be found.",
    notFoundFallback: "Service not found.",
    backToServices: "Back to Services",
    viewFullSize: "View full size",
    compare: "Compare",
    addedToCompare: "Added to compare",
    viewAllPhotosOne: "View all {count} photo",
    viewAllPhotosMany: "View all {count} photos",
    pricing: "Pricing",
    contactForPricing: "Contact the vendor for pricing.",
    viewVendorProfile: "View Vendor Profile",
    selectedInRoadmap: "Selected in Your Roadmap",
    addedToRoadmap: "Added to Roadmap",
    selectForRoadmap: "Select for My Wedding Roadmap",
    startRoadmapPrefix: "Start your",
    startRoadmapLink: "wedding roadmap",
    startRoadmapSuffix: "to book vendors by category.",
  },
};

export default services;
