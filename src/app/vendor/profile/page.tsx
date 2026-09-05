"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  RotateCcw,
  Save,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

import RatingStars from "@/components/shared/RatingStars";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import type { UpdateVendorRequest, Vendor } from "@/types/vendor";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const emptyForm: UpdateVendorRequest = {
  businessName: "",
  slogan: "",
  bio: "",
  location: "",
  latitude: 0,
  longitude: 0,
  contactPhone: "",
  contactEmail: "",
  socialLinksJson: "",
  workingHoursJson: "",
};

const toForm = (vendor: Vendor): UpdateVendorRequest => ({
  businessName: vendor.businessName || "",
  slogan: vendor.slogan || "",
  bio: vendor.bio || "",
  location: vendor.location || "",
  latitude: vendor.latitude || 0,
  longitude: vendor.longitude || 0,
  contactPhone: vendor.contactPhone || "",
  contactEmail: vendor.contactEmail || "",
  socialLinksJson: vendor.socialLinksJson || "",
  workingHoursJson: vendor.workingHoursJson || "",
});

export default function VendorProfilePage() {
  const {
    vendor,
    loading,
    actionLoading,
    actionError,
    update,
    resubmit,
  } = useVendor();

  const [editOpen, setEditOpen] = useState(false);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f6] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6">
          <div className="h-6 w-40 rounded bg-[#e9e1db]" />
          <div className="h-96 rounded-3xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (!vendor) return null;

  const isProfileComplete = Boolean(
    vendor.businessName?.trim() &&
      vendor.bio?.trim() &&
      vendor.location?.trim() &&
      vendor.contactPhone?.trim() &&
      vendor.contactEmail?.trim()
  );

  if (vendor.status === "Pending" && isProfileComplete) {
    return <PendingReviewScreen vendor={vendor} />;
  }

  const needsOnboarding =
    vendor.status === "Pending" || vendor.status === "Rejected";

  // Pending (profile not filled in yet) / Rejected: full-screen "complete
  // your profile" / "fix & resubmit" experience - this is the ONLY thing a
  // non-approved vendor can see (the layout locks every other route back to
  // this page).
  if (needsOnboarding) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
              vendor.status === "Rejected" ? "bg-red-50" : "bg-[#f0e9e0]"
            }`}
          >
            {vendor.status === "Rejected" ? (
              <AlertCircle className="h-6 w-6 text-red-500" />
            ) : (
              <Clock3 className="h-6 w-6 text-[#a47e43]" />
            )}
          </div>

          <h1 className="font-serif text-2xl font-light text-[#30251f]">
            {vendor.status === "Rejected"
              ? "Your Application Needs a Few Fixes"
              : "Complete Your Business Profile"}
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#766d67]">
            {vendor.status === "Rejected"
              ? "An admin reviewed your profile and asked for changes. Fix the details below and resubmit for review."
              : "Tell us about your business. Once you submit, our team will review your profile before it goes live on 5digea."}
          </p>
        </div>

        {vendor.status === "Rejected" && vendor.rejectionReason && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <span className="font-semibold">Reason for rejection: </span>
            {vendor.rejectionReason}
          </div>
        )}

        <ProfileForm
          vendor={vendor}
          onSave={update}
          onResubmit={vendor.status === "Rejected" ? resubmit : undefined}
          saving={actionLoading === "update"}
          resubmitting={actionLoading === "resubmit"}
          error={actionError}
        />
      </main>
    );
  }

  // Approved: profile-page style view, editing happens in a settings modal.
  return (
    <main className="min-h-screen bg-[#faf8f6] pb-16">
      {/* Cover */}
      <div className="relative h-48 bg-gradient-to-br from-[#30251f] via-[#4a3a30] to-[#b99a62] sm:h-60">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <Sparkles className="absolute right-10 top-8 h-8 w-8 text-white" />
          <Sparkles className="absolute left-16 bottom-10 h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-[#faf8f6] bg-[#f4eee9] shadow-sm">
              {vendor.profileImageUrl ? (
                <img
                  src={vendor.profileImageUrl}
                  alt={vendor.businessName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 size={40} className="text-[#a47e43]" />
              )}
            </div>

            <div className="pb-2">
              <h1 className="font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
                {vendor.businessName}
              </h1>
              {vendor.slogan && (
                <p className="mt-1 italic text-[#a47e43]">{vendor.slogan}</p>
              )}
              <div className="mt-2">
                <RatingStars
                  rating={vendor.averageRating}
                  reviewsCount={vendor.reviewsCount}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-5 text-sm font-medium text-[#30251f] transition hover:border-[#b99a62]"
          >
            <Settings size={16} />
            Edit Profile
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="mb-3 font-serif text-lg text-[#30251f]">About</h2>
            <p className="whitespace-pre-line text-sm leading-7 text-[#5f544d]">
              {vendor.bio || "No description added yet."}
            </p>

            {vendor.categories && vendor.categories.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {vendor.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-[#f0e9e0] px-3 py-1.5 text-xs font-medium text-[#5f544d]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#eee7e1] bg-white p-6">
            <h2 className="mb-4 font-serif text-lg text-[#30251f]">
              Contact
            </h2>

            <div className="space-y-3 text-sm text-[#5f544d]">
              {vendor.contactPhone && (
                <div className="flex items-center gap-3 rounded-xl bg-[#faf7f4] px-4 py-3">
                  <Phone size={16} className="text-[#a47e43]" />
                  {vendor.contactPhone}
                </div>
              )}
              {vendor.contactEmail && (
                <div className="flex items-center gap-3 rounded-xl bg-[#faf7f4] px-4 py-3">
                  <Mail size={16} className="text-[#a47e43]" />
                  {vendor.contactEmail}
                </div>
              )}
              {vendor.location && (
                <div className="flex items-center gap-3 rounded-xl bg-[#faf7f4] px-4 py-3">
                  <MapPin size={16} className="text-[#a47e43]" />
                  {vendor.location}
                </div>
              )}
              {!vendor.contactPhone && !vendor.contactEmail && !vendor.location && (
                <p className="text-[#9b8f86]">
                  Add your contact details from "Edit Profile".
                </p>
              )}
            </div>

            {(() => {
              const social = parseSocialLinks(vendor.socialLinksJson);
              const hasSocial = social.facebook || social.instagram || social.tiktok;

              if (!hasSocial) return null;

              return (
                <div className="mt-4 flex items-center gap-2 border-t border-[#f0e9e0] pt-4">
                  {social.facebook && (
                    <a
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0e9e0] text-[#1877F2] transition hover:opacity-80"
                    >
                      <FaFacebookF size={14} />
                    </a>
                  )}
                  {social.instagram && (
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0e9e0] text-[#E1306C] transition hover:opacity-80"
                    >
                      <FaInstagram size={15} />
                    </a>
                  )}
                  {social.tiktok && (
                    <a
                      href={social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0e9e0] text-[#30251f] transition hover:opacity-80"
                    >
                      <FaTiktok size={14} />
                    </a>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          vendor={vendor}
          onClose={() => setEditOpen(false)}
          onSave={update}
          saving={actionLoading === "update"}
          error={actionError}
        />
      )}
    </main>
  );
}

function PendingReviewScreen({ vendor }: { vendor: Vendor }) {
  const handleRefresh = () => {
    window.location.reload();
  };

  const fields: { label: string; value: string }[] = [
    { label: "Business Name", value: vendor.businessName },
    { label: "Slogan", value: vendor.slogan || "-" },
    { label: "Bio / Service Description", value: vendor.bio },
    { label: "Location / Address", value: vendor.location },
    { label: "Contact Phone", value: vendor.contactPhone },
    { label: "Contact Email", value: vendor.contactEmail },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0e9e0]">
          <Clock3 className="h-6 w-6 text-[#a47e43]" />
        </div>

        <h1 className="font-serif text-2xl font-light text-[#30251f]">
          Your Profile Is Under Review
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#766d67]">
          Thanks for completing your profile! Our team is reviewing your
          details now. This page will unlock automatically once you're
          approved.
        </p>
      </div>

      {/* Read-only submitted data */}
      <div className="rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className={field.label.includes("Bio") || field.label.includes("Location") ? "sm:col-span-2" : ""}>
              <label className="mb-1.5 block text-xs font-medium text-[#9b8171]">
                {field.label}
              </label>
              <div className="w-full cursor-not-allowed rounded-xl border border-[#e3d9d1] bg-[#f5f1ed] px-4 py-3 text-sm text-[#766d67]">
                {field.value || "-"}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#eee7e2] pt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
            <Clock3 className="h-3.5 w-3.5" />
            Under Admin Review
          </span>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-5 text-sm font-medium text-[#30251f] transition hover:bg-[#f7f2ef]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Status
          </button>
        </div>
      </div>

      {/* About 5digea, so the vendor has something useful to read while waiting */}
      <div className="mt-6 rounded-3xl border border-[#e8dfd8] bg-[#f8f5ef] p-6 sm:p-8">
        <h2 className="font-serif text-lg text-[#30251f]">What is 5digea?</h2>
        <p className="mt-2 text-sm leading-7 text-[#5f544d]">
          5digea is a wedding marketplace that connects couples with trusted
          vendors — photographers, venues, catering, decor and more. Once
          your business is approved, your profile and services become
          visible to couples browsing the platform, and you'll be able to
          manage everything from this dashboard: publish services, track
          reviews, and grow your bookings.
        </p>
      </div>
    </main>
  );
}

function EditProfileModal({
  vendor,
  onClose,
  onSave,
  saving,
  error,
}: {
  vendor: Vendor;
  onClose: () => void;
  onSave: (data: UpdateVendorRequest) => Promise<boolean>;
  saving: boolean;
  error: string | null;
}) {
  const handleSave = async (data: UpdateVendorRequest) => {
    const ok = await onSave(data);
    if (ok) onClose();
    return ok;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl text-[#30251f]">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#9b8f86] transition hover:bg-[#f7f2ef]"
          >
            <X size={18} />
          </button>
        </div>

        <ProfileForm
          vendor={vendor}
          onSave={handleSave}
          saving={saving}
          error={error}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}

// UpdateVendorRequest only has one flat socialLinksJson string field, so we
// split it into three friendly inputs here and recombine on save/parse.
type SocialLinks = { facebook: string; instagram: string; tiktok: string };

const parseSocialLinks = (json: string | undefined): SocialLinks => {
  const empty: SocialLinks = { facebook: "", instagram: "", tiktok: "" };

  if (!json) return empty;

  try {
    const parsed = JSON.parse(json);
    return {
      facebook: parsed.facebook || "",
      instagram: parsed.instagram || "",
      tiktok: parsed.tiktok || "",
    };
  } catch {
    return empty;
  }
};

const buildSocialLinksJson = (social: SocialLinks): string => {
  const entries = Object.entries(social).filter(([, v]) => v.trim() !== "");
  if (entries.length === 0) return "";
  return JSON.stringify(Object.fromEntries(entries));
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

function validateProfileForm(
  form: UpdateVendorRequest
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.businessName.trim()) {
    errors.businessName = "Business name is required.";
  }

  if (!form.bio.trim()) {
    errors.bio = "Please describe your business and services.";
  }

  if (!form.location.trim()) {
    errors.location = "Location / address is required.";
  }

  if (!form.contactPhone.trim()) {
    errors.contactPhone = "Contact phone is required.";
  } else if (!PHONE_REGEX.test(form.contactPhone.trim())) {
    errors.contactPhone = "Enter a valid phone number.";
  }

  if (!form.contactEmail.trim()) {
    errors.contactEmail = "Contact email is required.";
  } else if (!EMAIL_REGEX.test(form.contactEmail.trim())) {
    errors.contactEmail = "Enter a valid email address.";
  }

  return errors;
}

function ProfileForm({
  vendor,
  onSave,
  onResubmit,
  saving,
  resubmitting,
  error,
  submitLabel = "Save Changes",
}: {
  vendor: Vendor;
  onSave: (data: UpdateVendorRequest) => Promise<boolean>;
  onResubmit?: () => Promise<boolean>;
  saving: boolean;
  resubmitting?: boolean;
  error: string | null;
  submitLabel?: string;
}) {
  const [form, setForm] = useState<UpdateVendorRequest>(
    vendor ? toForm(vendor) : emptyForm
  );
  const [social, setSocial] = useState<SocialLinks>(() =>
    parseSocialLinks(vendor?.socialLinksJson)
  );
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (vendor) {
      setForm(toForm(vendor));
      setSocial(parseSocialLinks(vendor.socialLinksJson));
    }
  }, [vendor]);

  const errors = validateProfileForm(form);
  const isValid = Object.keys(errors).length === 0;

  const showError = (field: string) =>
    (touched[field] || submitAttempted) && errors[field];

  const handleChange = (field: keyof UpdateVendorRequest, value: string) => {
    setSuccess(false);
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "latitude" || field === "longitude"
          ? Number(value) || 0
          : value,
    }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSocialChange = (field: keyof SocialLinks, value: string) => {
    setSuccess(false);
    setSocial((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setSuccess(false);

    if (!isValid) return;

    const payload: UpdateVendorRequest = {
      ...form,
      socialLinksJson: buildSocialLinksJson(social),
    };

    const ok = await onSave(payload);
    setSuccess(ok);

    if (ok && onResubmit) {
      await onResubmit();
    }
  };

  const fieldClass = (field: string) =>
    `w-full rounded-xl border bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f] ${
      showError(field) ? "border-red-300 focus:border-red-400" : "border-[#e3d9d1]"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-sm sm:p-8"
    >
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#40352f]">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            onBlur={() => handleBlur("businessName")}
            className={fieldClass("businessName")}
          />
          {showError("businessName") && (
            <p className="mt-1.5 text-xs text-red-600">{errors.businessName}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#40352f]">
            Slogan
          </label>
          <input
            type="text"
            value={form.slogan}
            onChange={(e) => handleChange("slogan", e.target.value)}
            placeholder="A short tagline for your business"
            className={fieldClass("slogan")}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#40352f]">
            Bio / Service Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            onBlur={() => handleBlur("bio")}
            rows={4}
            placeholder="Describe your business and the services you offer..."
            className={`resize-none ${fieldClass("bio")}`}
          />
          {showError("bio") && (
            <p className="mt-1.5 text-xs text-red-600">{errors.bio}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#40352f]">
            Location / Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            onBlur={() => handleBlur("location")}
            placeholder="e.g. 12 Nile Street, Cairo"
            className={fieldClass("location")}
          />
          {showError("location") && (
            <p className="mt-1.5 text-xs text-red-600">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#40352f]">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={form.latitude}
            onChange={(e) => handleChange("latitude", e.target.value)}
            className={fieldClass("latitude")}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#40352f]">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={form.longitude}
            onChange={(e) => handleChange("longitude", e.target.value)}
            className={fieldClass("longitude")}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#40352f]">
            Contact Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.contactPhone}
            onChange={(e) => handleChange("contactPhone", e.target.value)}
            onBlur={() => handleBlur("contactPhone")}
            placeholder="e.g. +20 100 123 4567"
            className={fieldClass("contactPhone")}
          />
          {showError("contactPhone") && (
            <p className="mt-1.5 text-xs text-red-600">{errors.contactPhone}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#40352f]">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.contactEmail}
            onChange={(e) => handleChange("contactEmail", e.target.value)}
            onBlur={() => handleBlur("contactEmail")}
            className={fieldClass("contactEmail")}
          />
          {showError("contactEmail") && (
            <p className="mt-1.5 text-xs text-red-600">{errors.contactEmail}</p>
          )}
        </div>

        {/* Social links - one input per platform, combined into JSON on save */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#40352f]">
            Social Media
          </label>

          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1877F2]">
                <FaFacebookF size={15} />
              </span>
              <input
                type="url"
                value={social.facebook}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
                placeholder="https://facebook.com/yourbusiness"
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] py-3 pl-11 pr-4 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E1306C]">
                <FaInstagram size={16} />
              </span>
              <input
                type="url"
                value={social.instagram}
                onChange={(e) => handleSocialChange("instagram", e.target.value)}
                placeholder="https://instagram.com/yourbusiness"
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] py-3 pl-11 pr-4 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#30251f]">
                <FaTiktok size={15} />
              </span>
              <input
                type="url"
                value={social.tiktok}
                onChange={(e) => handleSocialChange("tiktok", e.target.value)}
                placeholder="https://tiktok.com/@yourbusiness"
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] py-3 pl-11 pr-4 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#40352f]">
            Working Hours (JSON)
          </label>
          <input
            type="text"
            value={form.workingHoursJson}
            onChange={(e) => handleChange("workingHoursJson", e.target.value)}
            placeholder='{"sat-thu":"9:00-18:00"}'
            className={fieldClass("workingHoursJson")}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[#eee7e2] pt-6">
        <button
          type="submit"
          disabled={saving || resubmitting || (submitAttempted && !isValid)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-6 text-sm font-medium text-white transition hover:bg-[#463831] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving || resubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : onResubmit ? (
            <RotateCcw className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {onResubmit ? "Save & Resubmit for Review" : submitLabel}
        </button>

        {submitAttempted && !isValid && (
          <span className="text-sm font-medium text-red-600">
            Please fill in all required fields correctly.
          </span>
        )}

        {success && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
            <CheckCircle className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
