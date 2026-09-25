import type { Translation } from "../types";

const reviews: Translation["reviews"] = {
  title: "Reviews",
  empty: "No reviews yet. Be the first to share your experience.",
  anonymous: "Anonymous",
  pageOf: "Page {page} of {total}",
  write: {
    title: "Write a review",
    chooseService: "Which service are you reviewing?",
    selectService: "Select a service",
    yourRating: "Your rating",
    yourComment: "Your comment (optional)",
    commentPlaceholder: "Share how it went...",
    nothingToReview: "There's nothing available to review for this category yet.",
    submit: "Submit review",
    errorChooseService: "Please choose a service to review.",
    errorRating: "Please select a star rating.",
    success: "Thanks! Your review has been submitted for approval.",
    failed: "We couldn't submit your review.",
    stars: "{count} of 5 stars",
  },
  mine: {
    alreadyToast: "You've already reviewed this service — each service can only be reviewed once.",
    checking: "Checking your reviews…",
    seeYours: "See your review",
    alreadyTooltip: "You've already reviewed this — tap to see your review",
    title: "Your review",
    reviewedOn: "Reviewed on {date}",
    onceNote: "Each service can be reviewed once. Thanks for sharing your experience!",
    viewService: "View service",
    statusPending: "Under review",
    statusApproved: "Published",
    statusRejected: "Not approved",
    reason: "Reason: {reason}",
    reviewed: "Reviewed",
    noComment: "No written comment.",
    alreadyAll: "You've already reviewed the services for this step.",
  },
};

export default reviews;
