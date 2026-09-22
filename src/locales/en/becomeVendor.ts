import type { Translation } from "../types";

const becomeVendor: Translation["becomeVendor"] = {
  hero: {
    titleLine1: "Turn your wedding business",
    titleLine2: "into something unforgettable.",
    subtitle:
      "Connect with couples who are actively planning their special day, showcase your work, and grow your business with 5digea.",
  },
  success: {
    eyebrow: "Application received",
    heading: "Thank you for reaching out.",
    body: "We've received your information. Our team will reach out via WhatsApp or email soon to set up your vendor account and guide you through the next steps.",
    backHome: "Back to home",
  },
  formCard: {
    heading: "Tell us about your business",
    subheading: "It only takes about a minute.",
    step: "Step 1 of 1",
  },
  error: {
    heading: "Something went wrong",
    dismiss: "Dismiss error",
  },
  fields: {
    fullName: {
      label: "Full name",
      placeholder: "Your Name",
    },
    brandName: {
      label: "Brand / business name",
      placeholder: "Rexos",
    },
    whatsapp: {
      label: "WhatsApp number",
      placeholder: "+20 123 456 7890",
    },
    email: {
      label: "Email address",
      placeholder: "you@example.com",
    },
    governorate: {
      label: "Governorate",
      placeholder: "Select your governorate",
      searchPlaceholder: "Search governorate...",
      empty: "No governorate found.",
    },
    categories: {
      label: "What do you offer?",
      helper: "Select all categories that match your wedding services.",
      selectedCount: "{count} selected",
      empty: "No categories are available yet.",
      error: "Please select at least one category.",
    },
  },
  validation: {
    fullNameRequired: "Please enter your full name.",
    fullNameMin: "Your name should be at least 3 characters.",
    whatsappRequired: "Please enter your WhatsApp number.",
    whatsappInvalid: "Please enter a valid WhatsApp number.",
    emailRequired: "Please enter your email address.",
    emailInvalid: "Please enter a valid email address.",
    brandNameRequired: "Please enter your business name.",
    brandNameMin: "Your business name should be at least 2 characters.",
    governorateRequired: "Please select your governorate.",
    submitError: "Couldn't submit your info. Please try again.",
  },
  submit: {
    sending: "Sending your application...",
    button: "Send my information",
    note: "Your information is reviewed by our team before your vendor account is created.",
  },
  perks: {
    eyebrow: "Why join us",
    heading: "Built for wedding businesses.",
    reach: {
      title: "Reach real couples",
      description:
        "Get discovered by couples actively planning their wedding and looking for trusted vendors.",
    },
    verified: {
      title: "A verified badge",
      description:
        "Once approved, your profile carries the 5digea seal of trust — reviewed and vetted.",
    },
    grow: {
      title: "Grow with us",
      description:
        "Showcase your services, collect real reviews, and build your reputation on the platform.",
    },
  },
  alreadyVendor: {
    eyebrow: "Already a vendor?",
    body: "If your account is already set up, head straight to your vendor dashboard.",
    cta: "Log in to your account",
  },
};

export default becomeVendor;
