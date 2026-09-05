"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import RoleGuard from "@/components/guards/RoleGuard";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorHeader from "@/components/vendor/VendorHeader";
import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/features/vendors/hooks/useVendor";

const ONBOARDING_PATH = "/vendor/profile";

function VendorGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { vendor, loading, error } = useVendor();

  const isLocked = vendor?.status === "Pending" || vendor?.status === "Rejected";

  useEffect(() => {
    if (!loading && isLocked && pathname !== ONBOARDING_PATH) {
      router.replace(ONBOARDING_PATH);
    }
  }, [loading, isLocked, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f6]">
        <Loader2 className="h-6 w-6 animate-spin text-[#b99a62]" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-6">
        <p className="text-sm text-[#766d67]">
          {error || "Unable to load your vendor account."}
        </p>
      </div>
    );
  }

  if (vendor.status === "Inactive") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#e8dfd8] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <ShieldAlert className="h-7 w-7 text-gray-500" />
          </div>
          <h1 className="text-xl font-semibold text-[#30251f]">
            Account Deactivated
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#756b65]">
            Your vendor account has been deactivated by our team. Please
            contact support if you believe this is a mistake.
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-[#e3d9d1] bg-white px-5 py-3 text-sm font-medium text-[#514740] transition hover:bg-[#f7f2ef]"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#faf8f6]">
        <div className="flex h-[82px] items-center justify-between border-b border-[#eee7e1] bg-white px-6">
          <img src="/Logo.png" alt="5digea" className="h-auto w-[112px] object-contain" />
          <button
            type="button"
            onClick={logout}
            className="text-sm font-medium text-[#756860] transition hover:text-red-600"
          >
            Logout
          </button>
        </div>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    );
  }

  return <VendorShell>{children}</VendorShell>;
}

function VendorShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="flex min-h-screen">
        <VendorSidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <VendorHeader onMenuClick={() => setMobileSidebarOpen(true)} />

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["Vendor"]}>
      <VendorGate>{children}</VendorGate>
    </RoleGuard>
  );
}
