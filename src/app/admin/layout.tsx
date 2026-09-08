"use client";

import { useState } from "react";

import RoleGuard from "@/components/guards/RoleGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <div className="min-h-screen bg-[#faf8f6] text-[#30251f]">
        <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="lg:pl-67.5">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

          <main className="min-h-[calc(100vh-82px)] overflow-x-hidden p-3 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
