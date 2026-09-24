// ============================================================
// Vendor applications ("Join us" form)
// ============================================================
// Wired to the generic contact-messages endpoint: this submits as a
// ContactMessageType.VendorApplication message, with the form's fields
// (brand name, categories, governorate) JSON-encoded into `message`.

import { submitContactMessage } from "@/features/contactMessages/api";
import {
  ContactMessageType,
  encodeMessageDetails,
} from "@/features/contactMessages/types";

export interface VendorApplicationRequest {
  fullName: string;
  whatsappNumber: string;
  personalEmail: string;
  brandName: string;
  categoryIds: string[];
  categoryNames?: string[];
  governorate: string;
}

export const submitVendorApplication = async (
  data: VendorApplicationRequest
): Promise<void> => {
  await submitContactMessage({
    type: ContactMessageType.VendorApplication,
    senderName: data.fullName,
    senderEmail: data.personalEmail,
    senderPhone: data.whatsappNumber,
    message: encodeMessageDetails({
      brandName: data.brandName,
      categoryIds: data.categoryIds,
      categoryNames: data.categoryNames,
      governorate: data.governorate,
    }),
  });
};