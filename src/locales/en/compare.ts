import type { Translation } from "../types";

const compare: Translation["compare"] = {
  clearAll: "Clear all",
  eyebrow: "Decision tools",
  titleServices: "Compare Services",
  titleVendors: "Compare Vendors",
  description:
    "Compare your shortlisted options side by side and choose what fits your wedding best.",
  backToMarketplace: "Back to marketplace",
  sameCategoryNotice: "All selected services belong to the same category.",
  comparison: "Comparison",
  viewDetails: "View details →",
  removeItem: "Remove {title} from comparison",
  rows: {
    vendor: "Vendor",
    category: "Category",
    description: "Description",
    rating: "Rating",
    reviews: "Reviews",
    location: "Location",
  },
  packages: "Packages",
  gallery: "Gallery",
  contactVendor: "Contact vendor",
  noImages: "No images",
  errors: {
    selectTwo: "Select at least two items to compare.",
    maxItems: "You can compare up to {max} items at once.",
    maxServices: "You can compare up to {max} services at once.",
    sameCategory: "You can only compare services from the same category.",
    mixedCategories: "The comparison contains services from different categories.",
    selectCategory: "Select a category before comparing vendors.",
    invalid: "Invalid comparison.",
    generic: "Unable to compare items.",
  },
};

export default compare;
