// ============================================================
// Contact messages
// ============================================================
// Three different "talk to us" forms across the site funnel into
// one generic backend endpoint (POST /api/contact-messages):
//   1. Roadmap — couple marks a step done with a vendor they
//      booked outside 5digea, and optionally tells us about them.
//   2. Public "become a vendor" (Join us) form.
//   3. A registered vendor asking admin to add a category to
//      their account.
//
// The endpoint tells the three apart with a numeric `type`, but
// which number means which form isn't documented anywhere yet.
// The mapping below is our best guess — confirm it against real
// admin data once the backend is live. If it's wrong, only this
// enum needs to change; nothing else references the raw numbers.
export enum ContactMessageType {
  ExternalVendorReferral = 1,
  VendorCategoryRequest = 2,
  VendorApplication = 3,
}

export interface ContactMessageRequest {
  type: ContactMessageType;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
}

export interface ContactMessageAdminItem {
  id: string;
  type: ContactMessageType;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
  vendorId: string | null;
  isHandled: boolean;
  createdAt: string;
}

export interface GetContactMessagesParams {
  type?: ContactMessageType;
  isHandled?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PagedContactMessages {
  items: ContactMessageAdminItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ---- Per-type structured payloads ----
// The endpoint only has one free-text `message` field, but each form
// collects different structured details. Those are JSON-encoded into
// `message` on submit and decoded again in the admin inbox (keyed by
// `type`) so each kind renders with its own layout instead of raw text.

export interface ExternalVendorReferralDetails {
  categoryId?: string;
  categoryName?: string;
  vendorName: string;
  vendorPhone?: string;
  vendorLink?: string;
}

export interface VendorApplicationDetails {
  brandName: string;
  categoryIds: string[];
  categoryNames?: string[];
  governorate: string;
}

export interface VendorCategoryRequestDetails {
  categoryId: string;
  categoryName: string;
  note: string;
}

export function encodeMessageDetails(
  details:
    | ExternalVendorReferralDetails
    | VendorApplicationDetails
    | VendorCategoryRequestDetails
): string {
  return JSON.stringify(details);
}

export function parseMessageDetails<T>(message: string): T | null {
  try {
    const parsed = JSON.parse(message);
    return parsed && typeof parsed === "object" ? (parsed as T) : null;
  } catch {
    return null;
  }
}
