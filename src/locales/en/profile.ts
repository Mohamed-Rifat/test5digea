import type { Translation } from "../types";

const profile: Translation["profile"] = {
  roles: {
    admin: "Administrator",
    vendor: "Vendor",
    couple: "Couple",
  },
  signedOut: {
    eyebrow: "Digea Account",
    title: "Your account",
    description:
      "Sign in to manage your wedding journey, saved vendors, and planning progress.",
    signIn: "Sign in",
    createAccount: "Create an account",
  },
  header: {
    eyebrow: "My Account",
    title: "Your personal space",
    description:
      "Everything you need to manage your Digea account and wedding journey in one place.",
  },
  hero: {
    welcomeBack: "Welcome back",
    accountType: "Account type",
    weddingPlan: "Wedding plan",
    activePlanning: "Active planning",
    notStarted: "Not started",
    savedCollection: "Saved collection",
    savedCount: "{count} saved",
    personal: {
      title: "Personal details",
      phone: "Phone number",
      dateOfBirth: "Date of birth",
      age: "{age} years old",
      gender: "Gender",
      male: "Male",
      female: "Female",
    },
  },
  overview: {
    eyebrow: "Overview",
    title: "Your journey at a glance",
    weddingProgress: "Wedding progress",
    completed: "completed",
    notStartedYet: "Your planning journey has not started yet.",
    viewRoadmap: "View roadmap",
    categoriesCompleted: "{completed} of {total} categories completed",
    startRoadmap: "Start your roadmap",
    savedFavorites: "Saved favorites",
    savedFavoritesDescription: "Vendors and services you've saved.",
  },
  quickAccess: {
    eyebrow: "Quick access",
    title: "Manage your account",
    roadmap: {
      eyebrow: "Planning",
      title: "Wedding roadmap",
      description:
        "Manage your wedding date, categories, progress, and selected vendors.",
    },
    favorites: {
      eyebrow: "Collection",
      title: "Saved favorites",
      description:
        "Revisit the vendors and services you've saved while planning.",
    },
    vendors: {
      eyebrow: "Discover",
      title: "Browse vendors",
      description:
        "Explore approved wedding professionals and find the right match.",
    },
    compare: {
      eyebrow: "Decide",
      title: "Compare options",
      description:
        "Compare vendors or services side by side before making your choice.",
    },
    security: {
      eyebrow: "Security",
      title: "Change password",
      description:
        "Keep your account secure by updating your password whenever needed.",
    },
    keepPlanning: {
      eyebrow: "Keep planning",
      title: "Your perfect day starts here.",
      cta: "Continue your journey",
    },
  },
  footerNote:
    "Your Digea account keeps your wedding planning journey organized, personal, and easy to revisit.",
};

export default profile;
