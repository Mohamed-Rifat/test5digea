"use client";

import { Suspense } from "react";
import { AlertCircle } from "lucide-react";

import { ServicesFilterBar } from "@/components/vendor/services/list/ServicesFilterBar";
import { ServicesListBody } from "@/components/vendor/services/list/ServicesListBody";
import { ServicesListHeader } from "@/components/vendor/services/list/ServicesListHeader";
import { ServicesStats } from "@/components/vendor/services/list/ServicesStats";
import { useVendorServicesList } from "@/components/vendor/services/list/useVendorServicesList";

function VendorServicesContent() {
  const list = useVendorServicesList();
  const { actionError } = list;

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        <ServicesListHeader list={list} />
        <ServicesStats list={list} />

        {actionError && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-700 sm:mb-6 sm:p-4 sm:text-sm">
            <AlertCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            <span className="leading-5 sm:leading-6">{actionError}</span>
          </div>
        )}

        <ServicesFilterBar list={list} />
        <ServicesListBody list={list} />
      </div>
    </div>
  );
}

export default function VendorServicesPage() {
  // useSearchParams() must be inside a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <VendorServicesContent />
    </Suspense>
  );
}
