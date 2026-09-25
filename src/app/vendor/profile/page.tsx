"use client";

import { ProfileAlerts } from "@/components/vendor/profile/ProfileAlerts";
import { ProfileDetailsView } from "@/components/vendor/profile/ProfileDetailsView";
import { ProfileEditForm } from "@/components/vendor/profile/ProfileEditForm";
import { ProfileHero } from "@/components/vendor/profile/ProfileHero";
import { ProfileTopBar } from "@/components/vendor/profile/ProfileTopBar";
import { useVendorProfileForm } from "@/components/vendor/profile/useVendorProfileForm";

/** Vendor profile: read-only view + edit form. State: `useVendorProfileForm`. */
export default function VendorProfilePage() {
  const profile = useVendorProfileForm();
  const { vendor, form } = profile;

  if (profile.loading) {
    return (
      <div className="min-h-screen bg-[#faf8f6] px-4 py-8">
        <div className="mx-auto max-w-full animate-pulse space-y-6">
          <div className="h-72 rounded-4xl bg-white" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-64 rounded-4xl bg-white" />
            <div className="h-64 rounded-4xl bg-white lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        <ProfileTopBar
          businessName={form.businessName}
          isRejected={vendor?.status === "Rejected"}
          isResubmitting={profile.isResubmitting}
          isLocked={profile.isLocked}
          isEditing={profile.isEditing}
          onResubmit={profile.handleResubmit}
          onEdit={() => profile.setIsEditing(true)}
          onCancel={profile.handleCancel}
        />

        <ProfileAlerts
          vendor={vendor}
          isLocked={profile.isLocked}
          actionError={profile.actionError}
          isEditingActive={profile.isEditingActive}
        />

        {profile.isEditingActive ? (
          <ProfileEditForm profile={profile} />
        ) : (
          <div className="space-y-6">
            <ProfileHero profile={profile} />
            <ProfileDetailsView profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
}
