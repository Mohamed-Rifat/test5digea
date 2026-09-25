"use client";

import type { Vendor } from "@/types/vendor";

import JourneyStepper from "./JourneyStepper";
import { AboutContent } from "./OnboardingAbout";
import { ReviewNextSteps } from "./under-review/ReviewNextSteps";
import { ReviewTimeline } from "./under-review/ReviewTimeline";
import { SubmittedDetails } from "./under-review/SubmittedDetails";
import { UnderReviewHero } from "./under-review/UnderReviewHero";
import { useUnderReview } from "./under-review/useUnderReview";

/**
 * Stage 2 of onboarding: "your details are under review".
 * Read-only on purpose — no edit button, the vendor just sees what they sent,
 * where the request stands, and everything about us while they wait.
 */
export default function UnderReview({ vendor }: { vendor: Vendor }) {
  const review = useUnderReview(vendor);

  return (
    <main className="mx-auto w-full lg:max-w-10/12 px-4 py-8 sm:px-6 lg:py-10">
      <JourneyStepper current={2} />

      <UnderReviewHero review={review} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-start">
        <div className="space-y-6">
          <ReviewTimeline review={review} />
          <ReviewNextSteps />
        </div>

        <SubmittedDetails review={review} />
      </div>

      {/* About us · the idea · steps · perks · policy */}
      <div className="mt-10">
        <AboutContent />
      </div>
    </main>
  );
}
