import type { Translation } from "../types";

const vendorOnboarding: Translation["vendorOnboarding"] = {
  header: {
    portal: "Vendor Portal",
    logout: "Logout",
  },

  journey: {
    eyebrow: "Your journey with us",
    step1: "Send your details",
    step2: "Team review",
    step3: "Start working",
    stepOf: "Step {current} of {total}",
  },

  form: {
    eyebrow: "Welcome to 5digea",
    title: "Let's get to know your business",
    subtitle:
      "Your account is ready. Fill in your business details and send them to our team for review — as soon as we approve them, your full dashboard opens up.",
    requiredNote: "Fields marked with * are required.",
    progress: "{done} of {total} required fields completed",
    logoTitle: "Business logo",
    logoHint: "A clear image couples will see on your page.",
    logoChoose: "Choose an image",
    logoChange: "Change image",
    logoRemove: "Remove image",
    logoInvalid: "Please choose a valid image file.",
    submit: "Send my details for review",
    submitting: "Sending...",
    submitNote:
      "Once sent, your details are locked until our team reviews them and gets back to you.",
    sentToast: "We received your details! Our team will start reviewing them now.",
    rejectedTitle: "We need a small update from you",
    rejectedReason: "Notes from the review team",
    rejectedNoReason:
      "The review team asked for a few changes. Please review your details and send them again.",
    rejectedHint:
      "Update the details they asked about and send them again — we'll review them as quickly as we can.",
    resubmit: "Update & resubmit",
    resubmitting: "Resubmitting...",
  },

  review: {
    eyebrow: "We got your request",
    title: "Your details are under review",
    subtitle:
      "Thank you, {name}! Our team is reviewing your business details right now. As soon as a decision is made, you'll see it right here.",
    statusLabel: "Current status",
    statusValue: "Under review",
    refresh: "Refresh status",
    refreshing: "Refreshing...",
    lastChecked: "Last checked: {time}",
    stillPending: "Still under review. We'll let you know as soon as there's a decision.",
    checkFailed: "We couldn't check the status right now. Please try again in a moment.",
    autoCheck:
      "We check your request automatically every so often, so there's no need to keep refreshing.",
    timelineTitle: "Your request timeline",
    timelineSubmitted: "Details submitted",
    timelineSubmittedText: "We received your business details successfully.",
    timelineSubmittedAt: "Sent on {date}",
    timelineReview: "Our team is reviewing",
    timelineReviewText:
      "We make sure everything is clear and accurate before it reaches couples.",
    timelineDecision: "Decision",
    timelineDecisionText:
      "Approval and access to your dashboard, or notes for a small update.",
    dataTitle: "The details you sent",
    dataLocked: "Your details are locked during the review and can't be edited.",
    readOnly: "Read only",
    nextTitle: "What happens after the review?",
    nextApproved:
      "If approved: you'll get a welcome message and go straight to your dashboard.",
    nextRejected:
      "If changes are needed: we'll show you why right here and reopen the form so you can update and resend.",
  },

  welcome: {
    eyebrow: "You're approved",
    title: "Congratulations! You're part of the team 🎉",
    text: "We're thrilled to have {name} join the 5digea family. You're now part of the couples' journey, and we wish you a wonderful path full of great reviews and clients who love your work.",
    wish: "We hope you'll be one of our success partners.",
    tipsTitle: "Suggested first steps",
    tip1: "Complete your profile and add a photo or logo",
    tip2: "Choose your business categories",
    tip3: "Add your services, prices and photos",
    cta: "Take me to my dashboard",
  },

  about: {
    eyebrow: "About 5digea",
    whoTitle: "Who are we?",
    whoText:
      "We're a group of young Nubians and the founders of 5digea. With love and passion, we try to make sure every love story gets a beginning worthy of it, and that a couple's big day turns out exactly the way they dream of it.",
    ideaTitle: "The idea behind the site",
    ideaText:
      "5digea is a wedding marketplace that brings couples and trusted service providers together in one place. Couples discover services, compare them and plan their wedding step by step — and you showcase your work to people who are genuinely looking for you.",
    couplesTitle: "What do couples do here?",
    couplesDiscover: "Search and discover the services that fit their wedding",
    couplesCompare: "Compare service providers side by side",
    couplesFavorites: "Save their favorites in a single list",
    couplesRoadmap: "Plan their wedding on a clear roadmap",
    couplesReviews: "Read real reviews before they decide",

    stepsEyebrow: "Your steps with us",
    stepsTitle: "How does it work?",
    step1Title: "Fill in your details",
    step1Text: "Business name, contact details, working hours and social accounts.",
    step2Title: "Our team reviews",
    step2Text: "We make sure your details are clear and accurate before couples see them.",
    step3Title: "Approval & dashboard access",
    step3Text: "As soon as we approve, you get a welcome message and go straight to your dashboard.",
    step4Title: "Start showcasing your work",
    step4Text:
      "Add your categories, services, prices and photos, and start receiving reviews from couples.",

    benefitsEyebrow: "Your perks with us",
    benefitsTitle: "Why be a 5digea partner?",
    benefitReachTitle: "Reach real couples",
    benefitReachText:
      "People who are actively planning their wedding and looking for a provider like you.",
    benefitTrustTitle: "Trust badge",
    benefitTrustText:
      "After the review, your profile shows that you're a trusted service provider.",
    benefitDashboardTitle: "A full dashboard",
    benefitDashboardText:
      "Manage your profile, categories, services and prices from one place.",
    benefitReviewsTitle: "Reviews that build your name",
    benefitReviewsText: "Every genuine review grows couples' trust in you.",
    benefitNotificationsTitle: "Instant notifications",
    benefitNotificationsText: "Know right away when something new happens on your account.",
    benefitSupportTitle: "Support by your side",
    benefitSupportText: "Our team is here to help you at every step.",

    policyEyebrow: "Our policy",
    policyTitle: "Our commitments & yours",
    policyAccurateTitle: "Honest information",
    policyAccurateText:
      "Your business details, photos and prices must be real and up to date.",
    policyReviewTitle: "Review before publishing",
    policyReviewText:
      "Any new details or changes are reviewed by our team before couples see them.",
    policyRespectTitle: "Respect for couples",
    policyRespectText:
      "Reply to inquiries quickly and politely, and keep your promises and appointments.",
    policyReviewsTitle: "Genuine reviews",
    policyReviewsText:
      "Reviews reflect real experiences, and we moderate them to keep them credible.",

    helpTitle: "Need help?",
    helpText: "Our team is ready to answer any question, any time.",
    helpCta: "Contact us",
    helpEmailLabel: "Or email us at",
  },
};

export default vendorOnboarding;
