import { PROFILE_FIELDS } from "@/lib/vendor-normalizer";
import type { UpdateVendorRequest, Vendor } from "@/types/vendor";

/**
 * Remembers, in this browser, that the vendor submitted a profile edit that
 * is still waiting for an admin decision.
 *
 * The server is the real source of truth (`pendingChanges` on
 * GET /api/Vendors/me). This marker is the fallback for when that response
 * doesn't say — it keeps the edit form locked so a second submit can't
 * silently replace the first. It releases itself as soon as any sign of an
 * admin decision shows up (see `hasDecisionSignal`), and after a hard expiry
 * so it can never trap a vendor forever.
 */

const KEY_PREFIX = "5digea_vendor_pending_edit:";

// Safety net: an edit older than this is no longer treated as pending.
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

interface Snapshot {
  updatedAt: string;
  status: string;
  rejectionReason: string;
  profile: string;
}

export interface PendingEditMarker {
  submittedAt: string;
  /** How the vendor record looked right after submitting. */
  snapshot: Snapshot;
  /** What the vendor submitted, so the page can keep showing it. */
  submitted: UpdateVendorRequest;
}

export const takeSnapshot = (vendor: Vendor): Snapshot => ({
  updatedAt: vendor.updatedAt ?? "",
  status: vendor.status,
  rejectionReason: vendor.rejectionReason ?? "",
  profile: JSON.stringify(PROFILE_FIELDS.map((field) => vendor[field])),
});

export const readMarker = (vendorId: string): PendingEditMarker | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + vendorId);

    return raw ? (JSON.parse(raw) as PendingEditMarker) : null;
  } catch {
    return null;
  }
};

export const writeMarker = (vendorId: string, marker: PendingEditMarker) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(KEY_PREFIX + vendorId, JSON.stringify(marker));
  } catch {
    // storage unavailable (private mode / quota) — the lock just won't persist
  }
};

export const clearMarker = (vendorId: string) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(KEY_PREFIX + vendorId);
  } catch {
    // ignore
  }
};

export const isMarkerExpired = (marker: PendingEditMarker): boolean =>
  Date.now() - new Date(marker.submittedAt).getTime() > EXPIRY_MS;

/**
 * Has anything about the vendor record moved since the edit was submitted?
 * An approval changes the live profile / updatedAt; a rejection changes the
 * status or rejection reason.
 */
export const hasVendorChangedSince = (
  marker: PendingEditMarker,
  fresh: Vendor
): boolean => {
  const now = takeSnapshot(fresh);
  const before = marker.snapshot;

  return (
    now.updatedAt !== before.updatedAt ||
    now.status !== before.status ||
    now.rejectionReason !== before.rejectionReason ||
    now.profile !== before.profile
  );
};
