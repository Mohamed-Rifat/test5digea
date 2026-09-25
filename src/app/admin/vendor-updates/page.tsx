"use client";

import { VendorUpdatesHeader } from "@/components/admin/vendor-updates/VendorUpdatesHeader";
import { VendorUpdatesList } from "@/components/admin/vendor-updates/VendorUpdatesList";
import { VendorUpdatesRejectDialog } from "@/components/admin/vendor-updates/VendorUpdatesRejectDialog";
import { VendorUpdatesStates } from "@/components/admin/vendor-updates/VendorUpdatesStates";
import { VendorUpdatesStatus } from "@/components/admin/vendor-updates/VendorUpdatesStatus";
import { useVendorUpdates } from "@/components/admin/vendor-updates/useVendorUpdates";

export default function AdminVendorUpdatesPage() {
  const updates = useVendorUpdates();

  return (
    <div className="mx-auto">
      <VendorUpdatesHeader updates={updates} />
      <VendorUpdatesStatus updates={updates} />
      <VendorUpdatesStates updates={updates} />
      <VendorUpdatesList updates={updates} />
      <VendorUpdatesRejectDialog updates={updates} />
    </div>
  );
}
