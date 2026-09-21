/**
 * Tiny in-browser event bus that keeps the independent vendor hooks in sync.
 *
 * useVendor / useVendorServices are called from several components at once
 * (layout, sidebar, header, the page itself), and each call owns its own
 * state. When one of them changes data on the server, the others announce
 * themselves here so they can quietly refetch instead of showing stale
 * counts, photos or status until the next full reload.
 */
export type VendorDataScope = "vendor" | "services";

const EVENT_NAME = "5digea:vendor-data-changed";

interface VendorDataChange {
  scope: VendorDataScope;
  source: string;
}

export const announceVendorDataChange = (
  scope: VendorDataScope,
  source: string
): void => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<VendorDataChange>(EVENT_NAME, { detail: { scope, source } })
  );
};

/** Returns an unsubscribe function. Changes made by `source` itself are skipped. */
export const subscribeToVendorDataChange = (
  scope: VendorDataScope,
  source: string,
  onChange: () => void
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const listener = (event: Event) => {
    const detail = (event as CustomEvent<VendorDataChange>).detail;

    if (detail?.scope === scope && detail.source !== source) onChange();
  };

  window.addEventListener(EVENT_NAME, listener);

  return () => window.removeEventListener(EVENT_NAME, listener);
};
