import type { Translation } from "../types";

const profile: Translation["profile"] = {
  roles: {
    admin: "Administrator",
    vendor: "Vendor",
    couple: "Couple",
  },
  signedOut:
  {
    eyebrow:
      "Your place is waiting",
    title: "We’ve missed you 🤍",
    description: "At Digea, we don’t just help you plan your wedding… we’re here for every step of the journey. Sign in and let’s continue together, from your first choice to the smallest detail of the day you’ve been dreaming about.",
    benefits: {
      favorites: "Save your favorites",
      roadmap: "Track your journey",
      planning:
        "Keep it organized",
    },
    signIn: "Let’s continue",
    createAccount: "Join Digea",
    footer: "Every beautiful beginning deserves someone by your side",
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
  contactUs: {
    eyebrow: "Get in touch",
    title: "Your feedback shapes what we do",
    description:
      "We're proud to be part of organizing the best day of your life — your wedding and every moment around it. Thank you for trusting us; we're working hard to deliver the very best for your very best day. Reach out and tell us what we can improve, what you loved, or any idea that would make your journey even better.",
    cta: "Share your feedback",
    emailLabel: "Or email us at",
    note: "Your feedback helps us grow and improve with you.",
  },
  footerNote:
    "Your Digea account keeps your wedding planning journey organized, personal, and easy to revisit.",
};

export default profile;
