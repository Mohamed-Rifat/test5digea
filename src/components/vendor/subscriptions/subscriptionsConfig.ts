import {
  BarChart3,
  Heart,
  ImageIcon,
  MapPin,
  Search,
  Sparkles,
  Star,
  Store,
  Users,
} from "lucide-react";
import type { TranslationKey } from "@/locales";

export const features: {
  icon: typeof Store;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}[] = [
  {
    icon: Store,
    titleKey: "vendor.subscriptions.features.profile.title",
    descriptionKey: "vendor.subscriptions.features.profile.description",
  },
  {
    icon: Sparkles,
    titleKey: "vendor.subscriptions.features.services.title",
    descriptionKey: "vendor.subscriptions.features.services.description",
  },
  {
    icon: ImageIcon,
    titleKey: "vendor.subscriptions.features.portfolio.title",
    descriptionKey: "vendor.subscriptions.features.portfolio.description",
  },
  {
    icon: Search,
    titleKey: "vendor.subscriptions.features.discover.title",
    descriptionKey: "vendor.subscriptions.features.discover.description",
  },
  {
    icon: Star,
    titleKey: "vendor.subscriptions.features.reviews.title",
    descriptionKey: "vendor.subscriptions.features.reviews.description",
  },
  {
    icon: Heart,
    titleKey: "vendor.subscriptions.features.favorites.title",
    descriptionKey: "vendor.subscriptions.features.favorites.description",
  },
  {
    icon: BarChart3,
    titleKey: "vendor.subscriptions.features.dashboard.title",
    descriptionKey: "vendor.subscriptions.features.dashboard.description",
  },
  {
    icon: MapPin,
    titleKey: "vendor.subscriptions.features.location.title",
    descriptionKey: "vendor.subscriptions.features.location.description",
  },
  {
    icon: Users,
    titleKey: "vendor.subscriptions.features.reach.title",
    descriptionKey: "vendor.subscriptions.features.reach.description",
  },
];

export const trialBenefits: TranslationKey[] = [
  "vendor.subscriptions.benefits.fullAccess",
  "vendor.subscriptions.benefits.profile",
  "vendor.subscriptions.benefits.services",
  "vendor.subscriptions.benefits.reviews",
  "vendor.subscriptions.benefits.discovery",
  "vendor.subscriptions.benefits.favorites",
];

export const steps: {
  number: number;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  textKey: TranslationKey;
}[] = [
  {
    number: 1,
    titleKey: "vendor.subscriptions.steps.one.title",
    subtitleKey: "vendor.subscriptions.steps.one.subtitle",
    textKey: "vendor.subscriptions.steps.one.text",
  },
  {
    number: 2,
    titleKey: "vendor.subscriptions.steps.two.title",
    subtitleKey: "vendor.subscriptions.steps.two.subtitle",
    textKey: "vendor.subscriptions.steps.two.text",
  },
  {
    number: 3,
    titleKey: "vendor.subscriptions.steps.three.title",
    subtitleKey: "vendor.subscriptions.steps.three.subtitle",
    textKey: "vendor.subscriptions.steps.three.text",
  },
];
