"use client";

import { Suspense } from "react";

import { VendorReviewsContent } from "@/components/vendor/reviews/VendorReviewsContent";

export default function VendorReviewsPage() {
  // useSearchParams() must be inside a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <VendorReviewsContent />
    </Suspense>
  );
}
