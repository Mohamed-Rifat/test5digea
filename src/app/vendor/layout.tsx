"use client";

import { useState } from "react";

import RoleGuard from "@/components/guards/RoleGuard";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorHeader from "@/components/vendor/VendorHeader";

export default function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={["Vendor"]}>
      <div className="min-h-screen bg-[#faf8f6]">
        <div className="flex min-h-screen">
          <VendorSidebar
            mobileOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <VendorHeader
              onMenuClick={() => setMobileSidebarOpen(true)}
            />

            <main className="min-w-0 flex-1">
              {children}
            </main>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
