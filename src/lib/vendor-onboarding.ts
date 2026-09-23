import type { UpdateVendorRequest, Vendor } from "@/types/vendor";

/**
 * Helpers for the vendor onboarding flow (everything a vendor sees before the
 * admin approves the account).
 *
 * The backend has one "Pending" status for both "just created by the admin,
 * hasn't filled anything in yet" and "sent the details, waiting for a
 * decision". This file tells the two apart.
 */

export type OnboardingStage = "form" | "review";

const WELCOME_KEY_PREFIX = "5digea_vendor_welcomed:";

const hasText = (value: string | null | undefined): boolean =>
  typeof value === "string" && value.trim().length > 0;

interface ContactDetails {
  location?: string | null;
  contactPhone?: string | null;
}

// Location and phone are required by the details form, so a profile that has
// both was really filled in and sent. (An account the admin just created only
// has a business name — the fields the vendor is about to fill are empty.)
const hasContact = (details: ContactDetails | null | undefined): boolean =>
  !!details && hasText(details.location) && hasText(details.contactPhone);

/**
 * Has the vendor already sent the details form?
 *
 * True when the details show up anywhere the app can see them: in the live
 * profile, in the edit the server is holding for review (`pendingChanges`),
 * or in the copy remembered in this browser right after submitting
 * (`pendingSubmitted`, for when the server doesn't echo it back yet).
 */
export const hasSubmittedProfile = (
  vendor: Vendor,
  pendingSubmitted: UpdateVendorRequest | null
): boolean =>
  hasContact(vendor) ||
  hasContact(vendor.pendingChanges) ||
  hasContact(pendingSubmitted);

/**
 * Which screen a non-approved vendor should see:
 * - form   -> nothing sent yet, or the admin rejected it and wants changes
 * - review -> details sent, waiting for the admin's decision
 */
export const getOnboardingStage = (
  vendor: Vendor,
  pendingSubmitted: UpdateVendorRequest | null
): OnboardingStage => {
  if (vendor.status === "Rejected") return "form";

  return hasSubmittedProfile(vendor, pendingSubmitted) ? "review" : "form";
};

// ---------------------------------------------------------------
// "Welcome aboard" screen — shown once, right after approval
// ---------------------------------------------------------------

export const hasSeenWelcome = (vendorId: string): boolean => {
  if (typeof window === "undefined") return true;

  try {
    return window.localStorage.getItem(WELCOME_KEY_PREFIX + vendorId) === "1";
  } catch {
    // Storage unavailable (private mode): never trap the vendor on the
    // welcome screen.
    return true;
  }
};

export const markWelcomeSeen = (vendorId: string): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(WELCOME_KEY_PREFIX + vendorId, "1");
  } catch {
    // ignore
  }
};
