import { HeartHandshake, Store, Tags } from "lucide-react";
import { ContactMessageType } from "@/features/contactMessages/types";
import type { TranslationKey } from "@/locales";

export const PAGE_SIZE = 10;

export const typeMeta: Record<
  ContactMessageType,
  { labelKey: TranslationKey; icon: typeof Store; className: string }
> = {
  [ContactMessageType.ExternalVendorReferral]: {
    labelKey: "admin.messages.types.externalVendor",
    icon: HeartHandshake,
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },
  [ContactMessageType.VendorApplication]: {
    labelKey: "admin.messages.types.vendorApplication",
    icon: Store,
    className: "bg-[#eef2f7] text-[#4d6b8f]",
  },
  [ContactMessageType.VendorCategoryRequest]: {
    labelKey: "admin.messages.types.categoryRequest",
    icon: Tags,
    className: "bg-[#f7f0e8] text-[#b99a62]",
  },
};
