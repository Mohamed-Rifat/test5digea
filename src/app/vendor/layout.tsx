"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, Clock3, LogOut, Sparkles } from "lucide-react";

import RoleGuard from "@/components/guards/RoleGuard";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorHeader from "@/components/vendor/VendorHeader";
import { VendorProvider, useVendorContext } from "@/context/VendorContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import SessionCountdownBadge from "@/components/shared/SessionCountdownBadge";
import VendorOnboarding from "@/components/vendor/onboarding/VendorOnboarding";
import WelcomeAboard from "@/components/vendor/onboarding/WelcomeAboard";
import { hasSeenWelcome, markWelcomeSeen } from "@/lib/vendor-onboarding";

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
  const { t } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  const isApproved = vendor?.status === "Approved";
  const onProfilePage = pathname === PROFILE_PATH;

  // Pending / Rejected vendors get the onboarding flow (form -> under review)
  // instead of the profile page. Only a deactivated account is still sent to
  // the profile page, where it can update its details as before.
  const inOnboarding =
    vendor?.status === "Pending" || vendor?.status === "Rejected";

  useEffect(() => {
    if (loading || !vendor) return;

    if (!isApproved && !inOnboarding && !onProfilePage) {
      router.replace(PROFILE_PATH);
    }
  }, [loading, vendor, isApproved, inOnboarding, onProfilePage, router]);

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
            {error || t("vendor.gate.loadError")}
          </p>
        </div>
      </div>
    );
  }

  // Waiting for (or asked to change) the details: the onboarding flow.
  if (inOnboarding) {
    return <VendorOnboarding vendor={vendor} />;
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


  // Approved for the first time: congratulate them once, then the dashboard.
  if (!welcomeDismissed && !hasSeenWelcome(vendor.id)) {
    return (
      <WelcomeAboard
        vendor={vendor}
        onContinue={() => {
          markWelcomeSeen(vendor.id);
          setWelcomeDismissed(true);
          router.replace("/vendor");
        }}
      />
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
  const { t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const copy =
    status === "Rejected"
      ? {
          label: t("vendor.gate.rejectedLabel"),
          message: t("vendor.gate.rejectedMessage"),
        }
      : status === "Inactive"
      ? {
          label: t("vendor.gate.inactiveLabel"),
          message: t("vendor.gate.inactiveMessage"),
        }
      : {
          label: t("vendor.gate.pendingLabel"),
          message: t("vendor.gate.pendingMessage"),
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

        <div className="flex items-center gap-2">
          <SessionCountdownBadge compact />

          <LanguageSwitcher variant="compact" className="sm:hidden" />
          <LanguageSwitcher className="hidden sm:block" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#756860] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            {t("vendor.gate.logout")}
          </button>
        </div>
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
