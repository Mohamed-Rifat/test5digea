"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Edit3,
  Globe2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  Settings2,
  X,
  CalendarOff,
  Calendar,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import type { UpdateVendorRequest } from "@/types/vendor";

// ================================================================
// CONSTANTS
// ================================================================

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

const DAYS_OF_WEEK = [
  { label: "Saturday", key: "sat" },
  { label: "Sunday", key: "sun" },
  { label: "Monday", key: "mon" },
  { label: "Tuesday", key: "tue" },
  { label: "Wednesday", key: "wed" },
  { label: "Thursday", key: "thu" },
  { label: "Friday", key: "fri" },
] as const;

// ================================================================
// TYPES
// ================================================================

type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
};

type WorkingHours = Record<string, string>;
type ValidationErrors = Record<string, string>;

// ================================================================
// MAIN COMPONENT
// ================================================================

export default function VendorProfilePage() {
  const {
    vendor,
    loading,
    actionLoading,
    actionError,
    update,
    resubmit,
  } = useVendor();

  const [form, setForm] = useState<UpdateVendorRequest>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // ==============================================================
  // EFFECTS
  // ==============================================================

  useEffect(() => {
    if (!vendor) return;

    setForm({
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
  }, [vendor]);

  // ==============================================================
  // COMPUTED
  // ==============================================================

  const isSaving = actionLoading === "update";
  const isResubmitting = actionLoading === "resubmit";

  const socialLinks = useMemo<SocialLinks>(() => {
    try {
      return form.socialLinksJson
        ? JSON.parse(form.socialLinksJson)
        : {};
    } catch {
      return {};
    }
  }, [form.socialLinksJson]);

  const workingHours = useMemo<WorkingHours>(() => {
    try {
      return form.workingHoursJson
        ? JSON.parse(form.workingHoursJson)
        : {};
    } catch {
      return {};
    }
  }, [form.workingHoursJson]);

  // ==============================================================
  // VALIDATION FUNCTIONS
  // ==============================================================

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // يسمح بالأرقام فقط مع مسافات و + و - و ()
    const phoneRegex = /^[+\d\s\-()]{6,20}$/;
    return phoneRegex.test(phone);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "businessName":
        if (!value.trim()) return "Business name is required";
        if (value.trim().length < 2) return "Business name must be at least 2 characters";
        return "";

      case "location":
        if (!value.trim()) return "Location is required";
        return "";

      case "contactPhone":
        if (!value.trim()) return "Phone number is required";
        if (!validatePhone(value)) return "Invalid phone number format";
        return "";

      case "contactEmail":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Please enter a valid email address";
        return "";

      case "slogan":
        if (value.length > 100) return "Slogan must be less than 100 characters";
        return "";

      case "bio":
        if (value.length > 2000) return "Bio must be less than 2000 characters";
        return "";

      default:
        return "";
    }
  };

  // ==============================================================
  // HANDLERS
  // ==============================================================

  const handleChange = useCallback(
    (field: keyof UpdateVendorRequest, value: string) => {
      setSuccess(false);
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));

      setForm((prev) => ({
        ...prev,
        [field]:
          field === "latitude" || field === "longitude"
            ? Number(value) || 0
            : value,
      }));

      // Validate on change if field was touched
      if (touchedFields[field]) {
        const error = validateField(field, value);
        if (error) {
          setValidationErrors((prev) => ({
            ...prev,
            [field]: error,
          }));
        }
      }
    },
    [touchedFields]
  );

  const handleBlur = useCallback(
    (field: string) => {
      setTouchedFields((prev) => ({
        ...prev,
        [field]: true,
      }));

      const value = form[field as keyof UpdateVendorRequest] as string || "";
      const error = validateField(field, value);
      if (error) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    },
    [form]
  );

  const updateSocialLink = useCallback(
    (key: keyof SocialLinks, value: string) => {
      setForm((prev) => ({
        ...prev,
        socialLinksJson: JSON.stringify({
          ...socialLinks,
          [key]: value,
        }),
      }));
    },
    [socialLinks]
  );

  const updateWorkingHour = useCallback(
    (key: string, value: string) => {
      setForm((prev) => ({
        ...prev,
        workingHoursJson: JSON.stringify({
          ...workingHours,
          [key]: value,
        }),
      }));
    },
    [workingHours]
  );

  const toggleDayOff = useCallback(
    (key: string) => {
      const currentValue = workingHours[key] || "";
      const isDayOff = currentValue === "OFF";

      setForm((prev) => ({
        ...prev,
        workingHoursJson: JSON.stringify({
          ...workingHours,
          [key]: isDayOff ? "" : "OFF",
        }),
      }));
    },
    [workingHours]
  );

  const isDayOff = useCallback(
    (key: string) => {
      return workingHours[key] === "OFF";
    },
    [workingHours]
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      setFormError("");
      setSuccess(false);

      // Validate all fields
      const errors: ValidationErrors = {};
      const requiredFields = ["businessName", "location", "contactPhone", "contactEmail"];

      requiredFields.forEach((field) => {
        const value = form[field as keyof UpdateVendorRequest] as string || "";
        const error = validateField(field, value);
        if (error) {
          errors[field] = error;
        }
      });

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setFormError("Please fix all validation errors before saving.");
        return;
      }

      const ok = await update(form);

      if (ok) {
        setSuccess(true);
        setIsEditing(false);
      }
    },
    [form, update]
  );

  const handleCancel = useCallback(() => {
    if (!vendor) return;

    setForm({
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

    setFormError("");
    setSuccess(false);
    setValidationErrors({});
    setTouchedFields({});
    setIsEditing(false);
  }, [vendor]);

  const handleResubmit = useCallback(async () => {
    await resubmit();
  }, [resubmit]);

  // ==============================================================
  // RENDER: LOADING
  // ==============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f6] px-4 py-8">
        <div className="mx-auto max-w-full animate-pulse space-y-6">
          <div className="h-72 rounded-4xl bg-white" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-64 rounded-4xl bg-white" />
            <div className="h-64 rounded-4xl bg-white lg:col-span-2" />
          </div>
        </div>
      </main>
    );
  }

  // ==============================================================
  // RENDER: MAIN
  // ==============================================================

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* =========================================================
            TOP BAR
        ========================================================== */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#9b8171]">
              Vendor Dashboard
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-[#30251f]">
              Company Profile
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {vendor?.status === "Rejected" && (
              <button
                type="button"
                onClick={handleResubmit}
                disabled={isResubmitting}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-sm font-medium text-[#514740] transition hover:bg-[#f7f2ef] disabled:opacity-60"
              >
                <RotateCcw
                  className={`h-4 w-4 ${
                    isResubmitting ? "animate-spin" : ""
                  }`}
                />
                Resubmit
              </button>
            )}

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#30251f] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#463831]"
              >
                <Settings2 className="h-4 w-4" />
                Profile Settings
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-5 text-sm font-semibold text-[#514740] transition hover:bg-[#f7f2ef]"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            REJECTED ALERT
        ========================================================== */}
        {vendor?.status === "Rejected" && vendor.rejectionReason && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">Profile needs attention</p>
              <p className="mt-1">{vendor.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* =========================================================
            EDIT MODE
        ========================================================== */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {(formError || actionError) && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {formError || actionError}
              </div>
            )}

            {/* Basic Information */}
            <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171]">
                  Identity
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#30251f]">
                  Business Information
                </h2>

                <p className="mt-1 text-sm text-[#756b65]">
                  Tell customers who you are and what makes your business special.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="Business Name"
                  value={form.businessName}
                  onChange={(value) => handleChange("businessName", value)}
                  onBlur={() => handleBlur("businessName")}
                  required
                  error={validationErrors.businessName}
                  touched={touchedFields.businessName}
                />

                <Field
                  label="Slogan"
                  value={form.slogan}
                  onChange={(value) => handleChange("slogan", value)}
                  onBlur={() => handleBlur("slogan")}
                  placeholder="Your memorable tagline"
                  error={validationErrors.slogan}
                  touched={touchedFields.slogan}
                />

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="mb-2 block text-sm font-semibold text-[#40352f]">
                    About Your Business
                    <span className="ml-1 text-xs font-normal text-[#756b65]">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    onBlur={() => handleBlur("bio")}
                    rows={5}
                    placeholder="Describe your business, experience and what you offer..."
                    className="w-full resize-none rounded-2xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3.5 text-sm text-[#30251f] outline-none transition placeholder:text-[#aaa09a] focus:border-[#8c7363] focus:bg-white focus:ring-4 focus:ring-[#8c7363]/5"
                  />
                  {validationErrors.bio && touchedFields.bio && (
                    <p className="mt-1 text-xs text-red-500">{validationErrors.bio}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171]">
                  Contact
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#30251f]">
                  Contact Information
                </h2>

                <p className="mt-1 text-sm text-[#756b65]">
                  All contact fields are required for customer communication.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="Location"
                  value={form.location}
                  onChange={(value) => handleChange("location", value)}
                  onBlur={() => handleBlur("location")}
                  icon={<MapPin className="h-4 w-4" />}
                  required
                  error={validationErrors.location}
                  touched={touchedFields.location}
                  placeholder="City, Country"
                />

                <Field
                  label="Phone"
                  value={form.contactPhone}
                  onChange={(value) => handleChange("contactPhone", value)}
                  onBlur={() => handleBlur("contactPhone")}
                  icon={<Phone className="h-4 w-4" />}
                  required
                  error={validationErrors.contactPhone}
                  touched={touchedFields.contactPhone}
                  placeholder="+1234567890"
                />

                <Field
                  label="Email"
                  value={form.contactEmail}
                  onChange={(value) => handleChange("contactEmail", value)}
                  onBlur={() => handleBlur("contactEmail")}
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  required
                  error={validationErrors.contactEmail}
                  touched={touchedFields.contactEmail}
                  placeholder="business@example.com"
                />
              </div>
            </section>

            {/* Social */}
            <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171]">
                  Social Presence
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#30251f]">
                  Social Media
                </h2>

                <p className="mt-1 text-sm text-[#756b65]">
                  Add your social profiles so customers can discover your business.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <SocialField
                  icon={<FaInstagram className="h-6 w-6" />}
                  label="Instagram"
                  value={socialLinks.instagram || ""}
                  onChange={(value) => updateSocialLink("instagram", value)}
                  placeholder="https://instagram.com/..."
                />

                <SocialField
                  icon={<FaFacebookF className="h-6 w-6" />}
                  label="Facebook"
                  value={socialLinks.facebook || ""}
                  onChange={(value) => updateSocialLink("facebook", value)}
                  placeholder="https://facebook.com/..."
                />

                <SocialField
                  icon={<FaTiktok className="h-6 w-6" />}
                  label="TikTok"
                  value={socialLinks.tiktok || ""}
                  onChange={(value) => updateSocialLink("tiktok", value)}
                  placeholder="https://tiktok.com/..."
                />

                <SocialField
                  icon={<Globe2 className="h-5 w-5" />}
                  label="Website"
                  value={socialLinks.website || ""}
                  onChange={(value) => updateSocialLink("website", value)}
                  placeholder="https://..."
                />
              </div>
            </section>

            {/* Working Hours */}
            <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171]">
                  Availability
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#30251f]">
                  Working Hours
                </h2>

                <p className="mt-1 text-sm text-[#756b65]">
                  Set your working hours or mark a day as &quot;Day Off&quot;.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {DAYS_OF_WEEK.map(({ label, key }) => {
                  const isOff = isDayOff(key);
                  const value = workingHours[key] || "";

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#40352f]">
                          <Clock3 className="h-4 w-4" />
                          {label}
                        </label>

                        <button
                          type="button"
                          onClick={() => toggleDayOff(key)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                            isOff
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                              : "bg-[#f7f2ef] text-[#514740] hover:bg-[#eee7e2]"
                          }`}
                        >
                          {isOff ? (
                            <>
                              <Calendar className="h-3.5 w-3.5" />
                              Restore
                            </>
                          ) : (
                            <>
                              <CalendarOff className="h-3.5 w-3.5" />
                              Day Off
                            </>
                          )}
                        </button>
                      </div>

                      {isOff ? (
                        <div className="flex h-12 items-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 px-4 text-sm font-medium text-rose-500">
                          <CalendarOff className="mr-2 h-4 w-4" />
                          Day Off
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateWorkingHour(key, e.target.value)}
                          placeholder="09:00 - 18:00"
                          className="h-12 w-full rounded-2xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#aaa09a] focus:border-[#8c7363] focus:bg-white focus:ring-4 focus:ring-[#8c7363]/5"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Save */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-4xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-[#30251f]">
                  Ready to save?
                </p>

                <p className="mt-1 text-xs text-[#756b65]">
                  Your profile will be updated immediately.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-11 rounded-xl px-5 text-sm font-semibold text-[#514740] transition hover:bg-[#f7f2ef]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#30251f] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#463831] disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>

                {success && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Saved
                  </span>
                )}
              </div>
            </div>
          </form>
        ) : (
          /* ========================================================
             PROFILE VIEW
          ======================================================== */
          <div className="space-y-6">
            {/* Hero Profile */}
            <section className="relative overflow-hidden rounded-4xl border border-[#e8dfd8] bg-white shadow-[0_20px_60px_rgba(48,37,31,0.06)]">
              <div className="h-36 bg-linear-to-br from-[#d9c5b7] via-[#eaded5] to-[#f7f1ed]" />

              <div className="relative px-6 pb-7 sm:px-8">
                <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-5">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-[#30251f] text-3xl font-semibold text-white shadow-lg">
                      {form.businessName?.charAt(0)?.toUpperCase() || "V"}
                    </div>

                    <div className="pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
                          {form.businessName || "Your Business"}
                        </h2>

                        {vendor?.status && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {vendor.status}
                          </span>
                        )}
                      </div>

                      {form.slogan && (
                        <p className="mt-1 text-sm text-[#756b65]">
                          {form.slogan}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-sm font-semibold text-[#514740] transition hover:bg-[#f7f2ef]"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </section>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* About */}
              <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] lg:col-span-2">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171]">
                    About
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
                    About the Business
                  </h3>
                </div>

                <p className="whitespace-pre-line text-sm leading-7 text-[#756b65]">
                  {form.bio ||
                    "Add a short description about your business to help customers understand what makes you special."}
                </p>
              </section>

              {/* Contact */}
              <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)]">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171]">
                    Contact
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
                    Get in Touch
                  </h3>
                </div>

                <div className="space-y-4">
                  <InfoRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Location"
                    value={form.location}
                  />

                  <InfoRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={form.contactPhone}
                  />

                  <InfoRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={form.contactEmail}
                  />
                </div>
              </section>
            </div>

            {/* ======================================================
                SOCIAL MEDIA
            ====================================================== */}
            <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171]">
                    Connect
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
                    Follow Our Socials
                  </h3>

                  <p className="mt-1 text-sm text-[#756b65]">
                    Stay connected and discover more from our business.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {socialLinks.instagram && (
                  <SocialCard
                    icon={<FaInstagram className="h-6 w-6" />}
                    label="Instagram"
                    handle={socialLinks.instagram}
                    href={socialLinks.instagram}
                  />
                )}

                {socialLinks.facebook && (
                  <SocialCard
                    icon={<FaFacebookF className="h-6 w-6" />}
                    label="Facebook"
                    handle={socialLinks.facebook}
                    href={socialLinks.facebook}
                  />
                )}

                {socialLinks.tiktok && (
                  <SocialCard
                    icon={<FaTiktok className="h-6 w-6" />}
                    label="TikTok"
                    handle={socialLinks.tiktok}
                    href={socialLinks.tiktok}
                  />
                )}

                {socialLinks.website && (
                  <SocialCard
                    icon={<Globe2 className="h-6 w-6" />}
                    label="Website"
                    handle={socialLinks.website}
                    href={socialLinks.website}
                  />
                )}

                {!socialLinks.instagram &&
                  !socialLinks.facebook &&
                  !socialLinks.tiktok &&
                  !socialLinks.website && (
                    <div className="sm:col-span-2 lg:col-span-4 rounded-2xl border border-dashed border-[#ded4cc] bg-[#fcfaf8] p-8 text-center">
                      <p className="text-sm font-medium text-[#514740]">
                        No social profiles added yet.
                      </p>

                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="mt-3 text-sm font-semibold text-[#9b6d52] hover:underline"
                      >
                        Add social profiles
                      </button>
                    </div>
                  )}
              </div>
            </section>

            {/* ======================================================
                WORKING HOURS
            ====================================================== */}
            <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171]">
                  Availability
                </p>

                <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
                  Working Hours
                </h3>
              </div>

              {Object.keys(workingHours).length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(workingHours).map(([day, hours]) => {
                    const dayLabel = DAYS_OF_WEEK.find((d) => d.key === day)?.label || day;
                    const isOff = hours === "OFF";

                    return (
                      <div
                        key={day}
                        className={`flex items-center justify-between rounded-2xl px-4 py-4 ${
                          isOff
                            ? "bg-rose-50/50 border border-dashed border-rose-200"
                            : "bg-[#fcfaf8]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ${
                            isOff ? "text-rose-400" : "text-[#806a5b]"
                          }`}>
                            <Clock3 className="h-4 w-4" />
                          </div>

                          <span className={`text-sm font-semibold capitalize ${
                            isOff ? "text-rose-500" : "text-[#40352f]"
                          }`}>
                            {dayLabel}
                          </span>
                        </div>

                        <span className={`text-xs font-medium ${
                          isOff ? "text-rose-500" : "text-[#756b65]"
                        }`}>
                          {isOff ? "Day Off" : hours}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#ded4cc] bg-[#fcfaf8] p-8 text-center">
                  <Clock3 className="mx-auto h-7 w-7 text-[#9b8171]" />

                  <p className="mt-3 text-sm font-medium text-[#514740]">
                    Working hours haven't been added yet.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

// ================================================================
// SUB-COMPONENTS
// ================================================================

/**
 * Reusable input field component with validation
 */
function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  icon,
  required = false,
  error,
  touched,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  required?: boolean;
  error?: string;
  touched?: boolean;
}) {
  const fieldId = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#40352f]">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
        {isValid && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      </label>

      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`h-12 w-full rounded-2xl border px-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#aaa09a] focus:ring-4 ${
          hasError
            ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-500/10"
            : isValid
            ? "border-emerald-300 bg-emerald-50/50 focus:border-emerald-400 focus:ring-emerald-500/10"
            : "border-[#e3d9d1] bg-[#fcfaf8] focus:border-[#8c7363] focus:ring-[#8c7363]/5 focus:bg-white"
        }`}
      />

      {hasError && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Social media input field component
 */
function SocialField({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const fieldId = `social-${label.toLowerCase()}`;

  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#40352f]">
        {icon}
        {label}
        <span className="text-xs font-normal text-[#756b65]">(Optional)</span>
      </label>

      <input
        id={fieldId}
        type="url"
        inputMode="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="h-12 w-full rounded-2xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#aaa09a] focus:border-[#8c7363] focus:bg-white focus:ring-4 focus:ring-[#8c7363]/5"
      />
    </div>
  );
}

/**
 * Information row component for displaying contact details
 */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f2ef] text-[#806a5b]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#9b8171]">{label}</p>
        <p className="mt-1 wrap-break-word text-sm font-medium text-[#40352f]">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

/**
 * Social media card component
 */
function SocialCard({
  icon,
  label,
  handle,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  handle: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-2xl border border-[#eee7e2] bg-[#fcfaf8] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d9c9be] hover:bg-white hover:shadow-[0_12px_30px_rgba(48,37,31,0.07)]"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#40352f] shadow-sm transition group-hover:scale-105">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#30251f]">{label}</p>
          <p className="mt-1 max-w-45 truncate text-xs text-[#756b65]">
            {handle}
          </p>
        </div>
      </div>

      <span className="text-lg text-[#b09a8c] transition group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}