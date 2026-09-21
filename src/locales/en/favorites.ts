import type { Translation } from "../types";

const favorites: Translation["favorites"] = {
  eyebrow: "Saved for You",
  title: "Your",
  titleHighlight: "Favorites",
  description:
    "A curated collection of everything you've saved while planning. Revisit, compare, and book in one tap.",
  totalSaved: "Total Saved",
  tabs: {
    all: "All",
    vendors: "Partners",
    services: "Services",
  },
  badge: {
    vendor: "Partner",
    service: "Service",
  },
  detailsUnavailable: "Details are not available right now.",
  savedOn: "Saved on {date}",
  viewDetails: "View details",
  remove: "Remove",
  removing: "Removing...",
  removeFromFavorites: "Remove from favorites",
  addToFavorites: "Add to favorites",
  loadError: "Failed to load your favorites.",
  removeError: "Failed to remove favorite.",
  updateError: "Failed to update favorites.",
  compare: {
    hint: "Tap the compare icon on a card to compare your picks from the same category.",
    selectedServices: "{count} {category} services selected",
    selectedVendors: "{count} {category} partners selected",
    button: "Compare ({count})",
    modalSubtitle: "Compare your picks side by side without leaving your favorites.",
    openFullPage: "Open full comparison page",
    lowestPrice: "Lowest price",
    topRated: "Top rated",
    removeFromCompare: "Remove {title} from comparison",
    errors: {
      mixedTypes:
        "You can compare services with services, or partners with partners only.",
      noCommonCategory:
        "These partners don't share a category, so they can't be compared.",
    },
  },
  empty: {
    title: "Your collection is empty",
    filteredTitle: "Nothing here yet",
    description:
      "Start curating your perfect plan. Save partners and services as you browse, and they'll all live here.",
    filteredDescription:
      "You haven't saved anything in this category yet. Explore and start building your list.",
    browseVendors: "Browse Partners",
    exploreServices: "Explore Services",
  },
};

export default favorites;
