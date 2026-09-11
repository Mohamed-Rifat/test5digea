"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, Clock3, LogOut, Sparkles } from "lucide-react";

import RoleGuard from "@/components/guards/RoleGuard";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorHeader from "@/components/vendor/VendorHeader";
import { VendorProvider, useVendorContext } from "@/context/VendorContext";
import { useAuth } from "@/context/AuthContext";

const PROFILE_PATH = "/vendor/profile";

export default function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["Vendor"]}>
      <VendorProvider>
        <VendorStatusGate>{children}</VendorStatusGate>
      </VendorProvider>
    </RoleGuard>
  );
}

function VendorStatusGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { vendor, loading, error } = useVendorContext();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isApproved = vendor?.status === "Approved";
  const onProfilePage = pathname === PROFILE_PATH;

  useEffect(() => {
    if (loading || !vendor) return;

    if (!isApproved && !onProfilePage) {
      router.replace(PROFILE_PATH);
    }
  }, [loading, vendor, isApproved, onProfilePage, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ded5ce] border-t-[#30251f]" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-4">
        <div className="max-w-sm rounded-3xl border border-[#e8dfd8] bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
          <p className="mt-3 text-sm font-medium text-[#40352f]">
            {error || "We couldn't load your vendor account."}
          </p>
        </div>
      </div>
    );
  }

  if (!isApproved) {

    if (!onProfilePage) return null;

    return (
      <div className="min-h-screen bg-[#faf8f6]">
        <PendingReviewHeader status={vendor.status} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    );
  }


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

function PendingReviewHeader({
  status,
}: {
  status: "Pending" | "Approved" | "Rejected" | "Inactive";
}) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const copy =
    status === "Rejected"
      ? {
          label: "Changes requested",
          message:
            "An admin reviewed your application and asked for changes. Update your details below and resubmit.",
        }
      : status === "Inactive"
      ? {
          label: "Account deactivated",
          message:
            "Your vendor account is currently deactivated. You can still update your details below.",
        }
      : {
          label: "Under review",
          message:
            "Thanks for signing up! An admin is reviewing your details. You'll get full dashboard access as soon as you're approved.",
        };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#eee7e1] bg-white/95 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9]">
            <Sparkles size={15} className="text-[#a47e43]" />
          </div>
          <span className="text-sm font-bold text-[#30251f] sm:text-base">
            5digea<span className="text-[#a47e43]">.</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#756860] transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">{copy.label}</p>
            <p className="mt-1">{copy.message}</p>
          </div>
        </div>
      </div>
    </>
  );
}
