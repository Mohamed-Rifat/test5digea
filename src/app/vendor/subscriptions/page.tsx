"use client";

import { SubscriptionAccessBar } from "@/components/vendor/subscriptions/SubscriptionAccessBar";
import { SubscriptionAfterTrial } from "@/components/vendor/subscriptions/SubscriptionAfterTrial";
import { SubscriptionClosing } from "@/components/vendor/subscriptions/SubscriptionClosing";
import { SubscriptionFeatures } from "@/components/vendor/subscriptions/SubscriptionFeatures";
import { SubscriptionHero } from "@/components/vendor/subscriptions/SubscriptionHero";
import { SubscriptionPartners } from "@/components/vendor/subscriptions/SubscriptionPartners";
import { SubscriptionSteps } from "@/components/vendor/subscriptions/SubscriptionSteps";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#faf8f6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-full">
        <SubscriptionAccessBar />
        <SubscriptionHero />
        <SubscriptionPartners />
        <SubscriptionFeatures />
        <SubscriptionSteps />
        <SubscriptionAfterTrial />
        <SubscriptionClosing />
      </div>
    </div>
  );
}
