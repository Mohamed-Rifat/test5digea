"use client";

import { useEffect } from "react";

import { useVendorContext } from "@/context/VendorContext";
import { getOnboardingStage } from "@/lib/vendor-onboarding";
import type { Vendor } from "@/types/vendor";

import OnboardingForm from "./OnboardingForm";
import OnboardingShell from "./OnboardingShell";
import UnderReview from "./UnderReview";

/**
 * Everything a vendor sees until an admin approves the account.
 *
 *   nothing sent yet ............ details form  + "about us" beside it
 *   rejected (changes wanted) ... the same form, with the admin's reason
 *   details sent, waiting ....... read-only "under review" page
 *
 * Approval is handled by the layout (welcome screen, then the dashboard).
 */
export default function VendorOnboarding({ vendor }: { vendor: Vendor }) {
  const { pendingSubmitted } = useVendorContext();

  const stage = getOnboardingStage(vendor, pendingSubmitted);

  // Each stage is a fresh page: start it from the top.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stage]);

  return (
    <OnboardingShell>
      {stage === "review" ? (
        <UnderReview vendor={vendor} />
      ) : (
        <OnboardingForm key={vendor.status} vendor={vendor} />
      )}
    </OnboardingShell>
  );
}
