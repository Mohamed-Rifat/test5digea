"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ContactUsCard } from "@/components/account/profile/ContactUsCard";
import { ProfileHeroCard } from "@/components/account/profile/ProfileHeroCard";
import { ProfileOverviewSection } from "@/components/account/profile/ProfileOverviewSection";
import { QuickAccessSection } from "@/components/account/profile/QuickAccessSection";
import { SignedOutState } from "@/components/account/profile/SignedOutProfile";
import { useProfileOverview } from "@/components/account/profile/useProfileOverview";

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <SignedOutState />;

  return <ProfileContent />;
}

function ProfileContent() {
  const { t } = useLanguage();
  const profile = useProfileOverview();

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto w-full lg:max-w-10/12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] rtl:tracking-normal text-[#a47e43]">
              {t("profile.header.eyebrow")}
            </p>

            <h1 className="mt-2 font-serif text-3xl font-light tracking-tight rtl:tracking-normal text-[#30251f] sm:text-4xl lg:text-[44px]">
              {t("profile.header.title")}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#81746d]">
              {t("profile.header.description")}
            </p>
          </div>
        </div>

        <ProfileHeroCard profile={profile} />
        <ProfileOverviewSection profile={profile} />
        <QuickAccessSection />
        <ContactUsCard />

        <div className="mt-10 border-t border-[#e9dfd8] pt-6 text-center">
          <p className="text-[11px] leading-5 text-[#a3958c]">
            {t("profile.footerNote")}
          </p>
        </div>
      </div>
    </main>
  );
}
