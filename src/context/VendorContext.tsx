"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useVendor } from "@/features/vendors/hooks/useVendor";

type VendorContextValue = ReturnType<typeof useVendor>;

const VendorContext = createContext<VendorContextValue | undefined>(
  undefined
);
export function VendorProvider({ children }: { children: ReactNode }) {
  const value = useVendor();

  return (
    <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
  );
}

export function useVendorContext(): VendorContextValue {
  const context = useContext(VendorContext);

  if (!context) {
    throw new Error("useVendorContext must be used inside VendorProvider");
  }

  return context;
}
