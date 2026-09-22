import type { Translation } from "../types";

const roadmap: Translation["roadmap"] = {
  loading: {
    title: "Preparing your journey...",
    subtitle: "A little magic is loading.",
  },
  errorState: {
    title: "Something went wrong",
  },
  create: {
    heading: "Let's start your story.",
    weddingDateLabel: "Wedding Date",
    optional: "(optional)",
    submit: {
      creating: "Creating your journey...",
      button: "Begin Our Journey",
    },
    groom: {
      eyebrow: "Planning Her Big Day",
      subheading:
        "Tell us about her, and when you'll make it official — every detail helps us plan around your day.",
      noDateReassurance:
        "Haven't picked the date yet? No pressure at all — we'll be right here with you on the journey, helping you plan every detail and make her day unforgettable.",
      partnerLabel: "Bride's Name",
      partnerPlaceholder: "Your bride-to-be's name",
      partnerFallback: "Your Bride",
      partnerHeaderFallback: "Planning her big day",
    },
    bride: {
      eyebrow: "Planning Your Dream Day",
      subheading:
        "Tell us about him, and when your story begins — we'll take it from there.",
      noDateReassurance:
        "Haven't set a date yet? Don't worry — we're with you every step, so your day comes out exactly the way you've always dreamed it.",
      partnerLabel: "Groom's Name",
      partnerPlaceholder: "Your groom-to-be's name",
      partnerFallback: "Your Groom",
      partnerHeaderFallback: "Planning your dream day",
    },
    neutral: {
      eyebrow: "Your Wedding Journey",
      subheading:
        "Tell us who you are celebrating with and when your beautiful day will begin.",
      noDateReassurance:
        "Haven't picked a date yet? That's perfectly fine — we'll be with you every step of the way, whenever you're ready.",
      partnerLabel: "Partner's Name",
      partnerPlaceholder: "Your partner's name",
      partnerFallback: "Your Love",
      partnerHeaderFallback: "Your wedding journey",
    },
  },
  hero: {
    tagline: "Two hearts · One journey · Forever",
    stepsCloser: "Every step brings you closer",
    countdownUntil: "Until the big day",
    countdownYourBigDay: "Your big day",
    progressLabel: "Our journey",
    footerTagline: "Forever starts here",
  },
  card: {
    status: {
      completed: "Completed",
      vendorSelected: "Vendor Selected",
      step: "Step {number}",
    },
    noVendorHint:
      "Choose a vendor here, or mark this step complete if you booked it outside Wedistry.",
    tooltip: {
      reopen: "Reopen category",
      markComplete: "Mark as complete",
      markCompleteExternal: "Mark as complete (booked outside Wedistry?)",
      writeReview: "Write a review",
      removeVendor: "Remove vendor",
    },
    action: {
      change: "Change",
      explore: "Explore",
    },
  },
  progressRing: {
    complete: "Complete",
  },
  externalModal: {
    title: "Booked outside Wedistry?",
    bodyBefore: "No problem at all — you can still mark",
    bodyAfter:
      "as complete. If your experience was good, share a few details about who you worked with and we may reach out to invite them to join Wedistry.",
    fields: {
      vendorName: {
        label: "Vendor name or location",
        placeholder: "e.g. Golden Rose Studio, Cairo",
      },
      phone: {
        label: "Phone number (optional)",
        placeholder: "+20 1xx xxx xxxx",
      },
      link: {
        label: "Website or page link (optional)",
        placeholder: "https://instagram.com/...",
      },
    },
    buttons: {
      skip: "Skip & Mark Complete",
      send: "Send & Mark Complete",
    },
  },
  reviewPrompt: {
    heading: "{category} completed!",
    body:
      "Want to share your experience while it's fresh? You can always do this anytime later from your roadmap.",
    reviewNow: "Write a Review Now",
    later: "Maybe Later",
  },
  summary: {
    label: "Wedding Details",
    planningWith: "Planning with {name}",
    dateComingSoon: "Date coming soon — we're with you either way.",
    editButton: "Edit Details",
    editEyebrow: "Edit Your Story",
    cancel: "Cancel",
    saving: "Saving...",
    saveChanges: "Save Changes",
    toast: {
      updated: "Wedding details updated.",
      updateFailed: "We couldn't update your plan.",
    },
  },
  main: {
    eyebrow: "Our Roadmap",
    heading: "One beautiful step at a time",
    subheading:
      "From the first decision to the final touch, every little detail brings you closer to your day.",
    journeyLabel: "The Journey",
    journeyHeading: "Your wedding roadmap",
    completedLabel: "completed",
  },
  toast: {
    categoryCompleted: "Category completed!",
    categoryCompleteFailed: "We couldn't complete this category.",
    categoryReopened: "Category reopened.",
    categoryReopenFailed: "We couldn't reopen this category.",
    vendorRemoved: "Vendor removed from your journey.",
    vendorRemoveFailed: "We couldn't remove the vendor.",
  },
  progress: {
    label: "Journey Progress",
    heading: "You're making it happen.",
    subheading:
      "{completed} of {total} categories are complete. Every small decision brings your celebration closer.",
    completedCount: "{count} completed",
    remainingCount: "{count} remaining",
    enjoyHeading: "Enjoy the journey.",
    enjoyBody:
      "This is not just a checklist. It's the beginning of your story together.",
    oneStepCloser: "One step closer",
  },
  footer: {
    flexibleNote:
      "Your roadmap is flexible. You can change a vendor at any time without losing the category or your progress.",
  },
};

export default roadmap;
