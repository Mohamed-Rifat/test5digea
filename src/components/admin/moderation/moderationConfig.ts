import { BriefcaseBusiness, ImageIcon, Star, Store } from "lucide-react";
import type { TranslationKey } from "@/locales";
import { ModerationEntityType, ModerationStatus } from "@/types/moderation";
import type { ModerationQueueItem } from "@/types/moderation";

export const entityMeta: Record<
  ModerationEntityType,
  { labelKey: TranslationKey; icon: typeof Store; className: string }
> = {
  [ModerationEntityType.Vendor]: {
    labelKey: "admin.moderation.entity.vendor",
    icon: Store,
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },
  [ModerationEntityType.Service]: {
    labelKey: "admin.moderation.entity.service",
    icon: BriefcaseBusiness,
    className: "bg-[#eef2f7] text-[#4d6b8f]",
  },
  [ModerationEntityType.Review]: {
    labelKey: "admin.moderation.entity.review",
    icon: Star,
    className: "bg-[#f7f0e8] text-[#b99a62]",
  },
  [ModerationEntityType.ServiceImage]: {
    labelKey: "admin.moderation.entity.image",
    icon: ImageIcon,
    className: "bg-[#eaf2ee] text-[#4d8f6b]",
  },
};

export const statusStyles: Record<ModerationStatus, string> = {
  [ModerationStatus.Pending]: "bg-amber-50 text-amber-700",
  [ModerationStatus.Approved]: "bg-emerald-50 text-emerald-700",
  [ModerationStatus.Rejected]: "bg-red-50 text-red-600",
};

export const statusLabelKeys: Record<ModerationStatus, TranslationKey> = {
  [ModerationStatus.Pending]: "admin.moderation.statuses.pending",
  [ModerationStatus.Approved]: "admin.moderation.statuses.approved",
  [ModerationStatus.Rejected]: "admin.moderation.statuses.rejected",
};

// Where "Review" should send the admin — for entity types without their
// own approve/reject action in this queue, it links out to the page that
// already has the real actions for that entity type. Reviews don't have
// an individual admin page yet, only the list at /admin/reviews. Images
// are handled inline (see the approve/reject buttons below) rather than
// through this link, but it still points at the parent service as a
// fallback / "view in context" option.
export function reviewHref(item: ModerationQueueItem): string {
  switch (item.entityType) {
    case ModerationEntityType.Vendor:
      return `/admin/vendors/${item.entityId}`;
    case ModerationEntityType.Service:
      return `/admin/services/${item.entityId}`;
    case ModerationEntityType.ServiceImage:
      return `/admin/services/${item.serviceId ?? item.entityId}`;
    case ModerationEntityType.Review:
    default:
      return "/admin/reviews";
  }
}
