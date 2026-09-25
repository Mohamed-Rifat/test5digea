import type { Translation } from "../types";

const errors: Translation["errors"] = {
  loadRoadmap: "Failed to load your wedding roadmap.",
  createRoadmap: "Failed to create your roadmap.",
  updateRoadmap: "Failed to update your roadmap.",
  selectVendor: "Failed to select this vendor.",
  removeVendor: "Failed to remove this vendor.",
  updateCategory: "Failed to update this category.",
  loadPartners: "Failed to load partners.",
  loadAccount: "Failed to load account details.",
  loadServices: "Failed to load services.",
  loadDashboard: "Failed to load the dashboard summary.",
  loadModeration: "Failed to load the moderation queue.",
  loadReviews: "Failed to load reviews.",
  loadReviewable: "Failed to load reviewable services.",
  submitReview: "Failed to submit your review.",
  loadPendingReviews: "Failed to load pending reviews.",
  loadCategories: "Failed to load admin categories.",
  loadFavorites: "Failed to load your favorites.",
  loadMessages: "Failed to load contact messages.",
  generic: "Something went wrong. Please try again.",
  network: "Can't reach the server. Check your internet connection and try again.",
  sessionExpired: "Your session has expired. Please sign in again.",
};

export default errors;
