"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock3,
  Edit3,
  Globe2,
  Loader2,
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
import { useVendorContext } from "@/context/VendorContext";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";
import { normalizeExternalUrl } from "@/lib/safe-url";
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
  { labelKey: "vendor.profile.days.sat", key: "sat" },
  { labelKey: "vendor.profile.days.sun", key: "sun" },
  { labelKey: "vendor.profile.days.mon", key: "mon" },
  { labelKey: "vendor.profile.days.tue", key: "tue" },
  { labelKey: "vendor.profile.days.wed", key: "wed" },
  { labelKey: "vendor.profile.days.thu", key: "thu" },
  { labelKey: "vendor.profile.days.fri", key: "fri" },
] as const;

// Backend status -> translation key.
const STATUS_KEYS: Record<string, TranslationKey> = {
  Approved: "vendor.status.approved",
  Pending: "vendor.status.pending",
  Rejected: "vendor.status.rejected",
  Inactive: "vendor.status.inactive",
};

// Badge colours per vendor status (the badge used to be green for everything).
const STATUS_BADGE_CLASSES: Record<string, string> = {
  Approved: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Rejected: "bg-red-50 text-red-700",
  Inactive: "bg-gray-100 text-gray-700",
};

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
type ValidationErrors = Record<string, TranslationKey | "">;

// ================================================================
// MAIN COMPONENT
// ================================================================

// Pure validators (module level so callbacks don't need them as deps).
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  // يسمح بالأرقام فقط مع مسافات و + و - و ()
  const phoneRegex = /^[+\d\s\-()]{6,20}$/;
  return phoneRegex.test(phone);
};

const validateField = (field: string, value: string): TranslationKey | "" => {
  switch (field) {
    case "businessName":
      if (!value.trim()) return "vendor.profile.errors.nameRequired";
      if (value.trim().length < 2) return "vendor.profile.errors.nameShort";
      return "";

    case "location":
      if (!value.trim()) return "vendor.profile.errors.locationRequired";
      return "";

    case "contactPhone":
      if (!value.trim()) return "vendor.profile.errors.phoneRequired";
      if (!validatePhone(value)) return "vendor.profile.errors.phoneInvalid";
      return "";

    case "contactEmail":
      if (!value.trim()) return "vendor.profile.errors.emailRequired";
      if (!validateEmail(value)) return "vendor.profile.errors.emailInvalid";
      return "";

    case "slogan":
      if (value.length > 100) return "vendor.profile.errors.sloganLong";
      return "";

    case "bio":
      if (value.length > 2000) return "vendor.profile.errors.bioLong";
      return "";

    default:
      return "";
  }
};

export default function VendorProfilePage() {
  const { t } = useLanguage();
  const {
    vendor,
    loading,
    actionLoading,
    actionError,
    isPendingReview,
    pendingSubmitted,
    refreshSilently,
    update,
    resubmit,
    uploadProfileImage,
  } = useVendorContext();

  const [form, setForm] = useState<UpdateVendorRequest>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<TranslationKey | "">("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // ==============================================================
  // EFFECTS
  // ==============================================================

  useEffect(() => {
    if (!vendor) return;

    // Edits now wait for admin approval, so show the vendor what they last
    // submitted (if anything is pending) rather than the older live copy.
    const source = vendor.pendingChanges ?? pendingSubmitted ?? vendor;

    setForm({
      businessName: source.businessName || "",
      slogan: source.slogan || "",
      bio: source.bio || "",
      location: source.location || "",
      latitude: source.latitude || 0,
      longitude: source.longitude || 0,
      contactPhone: source.contactPhone || "",
      contactEmail: source.contactEmail || "",
      socialLinksJson: source.socialLinksJson || "",
      workingHoursJson: source.workingHoursJson || "",
    });
  }, [vendor, pendingSubmitted]);

  // ==============================================================
  // COMPUTED
  // ==============================================================

  // A submitted edit waits for an admin decision. Until then the vendor can't
  // edit again: a second submit would silently replace the first one.
  const isLocked = isPendingReview;

  // While an edit is awaiting review, quietly re-check so the form unlocks
  // by itself once the admin approves or rejects (no manual reload needed).
  useEffect(() => {
    if (!isLocked) return;

    const check = () => {
      if (document.visibilityState === "visible") refreshSilently();
    };

    const timer = window.setInterval(check, 45_000);
    document.addEventListener("visibilitychange", check);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [isLocked, refreshSilently]);
  const isEditingActive = isEditing && !isLocked;

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
        setFormError("vendor.profile.errors.fixAll");
        return;
      }

      // Social links must be real http(s) links (no "javascript:" etc.).
      // A missing scheme ("instagram.com/x") is completed with https://.
      const cleanedLinks: SocialLinks = {};
      let hasInvalidLink = false;

      (Object.keys(socialLinks) as (keyof SocialLinks)[]).forEach((key) => {
        const raw = (socialLinks[key] ?? "").trim();

        if (!raw) return;

        const normalized = normalizeExternalUrl(raw);

        if (normalized === null) {
          hasInvalidLink = true;
        } else {
          cleanedLinks[key] = normalized;
        }
      });

      if (hasInvalidLink) {
        setFormError("vendor.profile.errors.urlInvalid");
        return;
      }

      const socialLinksJson = Object.keys(cleanedLinks).length
        ? JSON.stringify(cleanedLinks)
        : form.socialLinksJson
          ? JSON.stringify({})
          : "";

      const ok = await update({ ...form, socialLinksJson });

      if (ok) {
        setSuccess(true);
        setIsEditing(false);
      }
    },
    [form, update, socialLinks]
  );

  const handleCancel = useCallback(() => {
    if (!vendor) return;

    const source = vendor.pendingChanges ?? pendingSubmitted ?? vendor;

    setForm({
      businessName: source.businessName || "",
      slogan: source.slogan || "",
      bio: source.bio || "",
      location: source.location || "",
      latitude: source.latitude || 0,
      longitude: source.longitude || 0,
      contactPhone: source.contactPhone || "",
      contactEmail: source.contactEmail || "",
      socialLinksJson: source.socialLinksJson || "",
      workingHoursJson: source.workingHoursJson || "",
    });

    setFormError("");
    setSuccess(false);
    setValidationErrors({});
    setTouchedFields({});
    setIsEditing(false);
  }, [vendor, pendingSubmitted]);

  const handleResubmit = useCallback(async () => {
    await resubmit();
  }, [resubmit]);

  const handleProfileImageSelected = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      await uploadProfileImage(file);
    },
    [uploadProfileImage]
  );

  const isUploadingProfileImage = actionLoading === "profile-image";
  const errorText = (field: string): string => {
    const key = validationErrors[field];
    return key ? t(key) : "";
  };

  // ==============================================================
  // RENDER: LOADING
  // ==============================================================

  if (loading) {
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

  // ==============================================================
  // RENDER: MAIN
  // ==============================================================

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* =========================================================
            TOP BAR
        ========================================================== */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] rtl:tracking-normal text-[#9b8171]">
              {t("vendor.profile.eyebrow")}
            </p>
 
            <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
             {form.businessName || t("vendor.profile.defaultName")}
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
                  className={`h-4 w-4 ${isResubmitting ? "animate-spin" : ""
                    }`}
                />
                {t("vendor.profile.resubmit")}
              </button>
            )}

            {isLocked ? (
              <button
                type="button"
                disabled
                title={t("vendor.profile.pending.buttonHint")}
                className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 text-sm font-semibold text-amber-700 opacity-90"
              >
                <Clock3 className="h-4 w-4" />
                {t("vendor.profile.pending.button")}
              </button>
            ) : !isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#30251f] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#463831]"
              >
                <Settings2 className="h-4 w-4" />
                {t("vendor.profile.profileSettings")}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-5 text-sm font-semibold text-[#514740] transition hover:bg-[#f7f2ef]"
              >
                <X className="h-4 w-4" />
                {t("vendor.profile.cancel")}
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            PENDING REVIEW BANNER
        ========================================================== */}
        {isLocked && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">{t("vendor.profile.pending.title")}</p>
              <p className="mt-1 leading-6">{t("vendor.profile.pending.text")}</p>
            </div>
          </div>
        )}

        {/* =========================================================
            REJECTED ALERT
        ========================================================== */}
        {vendor?.status === "Rejected" && vendor.rejectionReason && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">{t("vendor.profile.needsAttention")}</p>
              <p className="mt-1">{vendor.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* =========================================================
            IMAGE ACTION ERROR (shown outside the edit form)
        ========================================================== */}
        {!isEditingActive && actionError && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {actionError}
          </div>
        )}

        {/* =========================================================
            EDIT MODE
        ========================================================== */}
        {isEditingActive ? (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {(formError || actionError) && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {formError ? t(formError) : actionError}
              </div>
            )}

            {/* Basic Information */}
            <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
                  {t("vendor.profile.identity.eyebrow")}
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#30251f]">
                  {t("vendor.profile.identity.title")}
                </h2>

                <p className="mt-1 text-sm text-[#756b65]">
                  {t("vendor.profile.identity.subtitle")}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label={t("vendor.profile.fields.businessName")}
                  value={form.businessName}
                  onChange={(value) => handleChange("businessName", value)}
                  onBlur={() => handleBlur("businessName")}
                  required
                  error={errorText("businessName")}
                  touched={touchedFields.businessName}
                />

                <Field
                  label={t("vendor.profile.fields.slogan")}
                  value={form.slogan}
                  onChange={(value) => handleChange("slogan", value)}
                  onBlur={() => handleBlur("slogan")}
                  placeholder={t("vendor.profile.fields.sloganPlaceholder")}
                  error={errorText("slogan")}
                  touched={touchedFields.slogan}
                />

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="mb-2 block text-sm font-semibold text-[#40352f]">
                    {t("vendor.profile.fields.about")}
                    <span className="ms-1 text-xs font-normal text-[#756b65]">
                      {t("vendor.profile.optional")}
                    </span>
                  </label>

                  <textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    onBlur={() => handleBlur("bio")}
                    rows={5}
                    placeholder={t("vendor.profile.fields.bioPlaceholder")}
                    className="w-full resize-none rounded-2xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3.5 text-sm text-[#30251f] outline-none transition placeholder:text-[#aaa09a] focus:border-[#8c7363] focus:bg-white focus:ring-4 focus:ring-[#8c7363]/5"
                  />
                  {validationErrors.bio && touchedFields.bio && (
                    <p className="mt-1 text-xs text-red-500">{errorText("bio")}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
                  {t("vendor.profile.contact.eyebrow")}
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#30251f]">
                  {t("vendor.profile.contact.editTitle")}
                </h2>

                <p className="mt-1 text-sm text-[#756b65]">
                  {t("vendor.profile.contact.editSubtitle")}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label={t("vendor.profile.fields.location")}
                  value={form.location}
                  onChange={(value) => handleChange("location", value)}
                  onBlur={() => handleBlur("location")}
                  icon={<MapPin className="h-4 w-4" />}
                  required
                  error={errorText("location")}
                  touched={touchedFields.location}
                  placeholder={t("vendor.profile.fields.locationPlaceholder")}
                />

                <Field
                  label={t("vendor.profile.fields.phone")}
                  value={form.contactPhone}
                  onChange={(value) => handleChange("contactPhone", value)}
                  onBlur={() => handleBlur("contactPhone")}
                  icon={<Phone className="h-4 w-4" />}
                  required
                  error={errorText("contactPhone")}
                  touched={touchedFields.contactPhone}
                  placeholder="+1234567890"
                  ltr
                />

                <Field
                  label={t("vendor.profile.fields.email")}
                  value={form.contactEmail}
                  onChange={(value) => handleChange("contactEmail", value)}
                  onBlur={() => handleBlur("contactEmail")}
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  required
                  error={errorText("contactEmail")}
                  touched={touchedFields.contactEmail}
                  placeholder="business@example.com"
                  ltr
                />
              </div>
            </section>

            {/* Social */}
            <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
                  {t("vendor.profile.social.eyebrow")}
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#30251f]">
                  {t("vendor.profile.social.title")}
                </h2>

                <p className="mt-1 text-sm text-[#756b65]">
                  {t("vendor.profile.social.subtitle")}
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
                  label={t("vendor.profile.fields.website")}
                  value={socialLinks.website || ""}
                  onChange={(value) => updateSocialLink("website", value)}
                  placeholder="https://..."
                />
              </div>
            </section>

            {/* Working Hours */}
            <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
                  {t("vendor.profile.hours.eyebrow")}
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#30251f]">
                  {t("vendor.profile.hours.title")}
                </h2>

                <p className="mt-1 text-sm text-[#756b65]">
                  {t("vendor.profile.hours.subtitle")}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {DAYS_OF_WEEK.map(({ labelKey, key }) => {
                  const isOff = isDayOff(key);
                  const value = workingHours[key] || "";

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#40352f]">
                          <Clock3 className="h-4 w-4" />
                          {t(labelKey)}
                        </label>

                        <button
                          type="button"
                          onClick={() => toggleDayOff(key)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${isOff
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                              : "bg-[#f7f2ef] text-[#514740] hover:bg-[#eee7e2]"
                            }`}
                        >
                          {isOff ? (
                            <>
                              <Calendar className="h-3.5 w-3.5" />
                              {t("vendor.profile.restore")}
                            </>
                          ) : (
                            <>
                              <CalendarOff className="h-3.5 w-3.5" />
                              {t("vendor.profile.dayOff")}
                            </>
                          )}
                        </button>
                      </div>

                      {isOff ? (
                        <div className="flex h-12 items-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 px-4 text-sm font-medium text-rose-500">
                          <CalendarOff className="me-2 h-4 w-4" />
                          {t("vendor.profile.dayOff")}
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
                  {t("vendor.profile.save.readyTitle")}
                </p>

                <p className="mt-1 text-xs text-[#756b65]">
                  {t("vendor.profile.save.readyText")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-11 rounded-xl px-5 text-sm font-semibold text-[#514740] transition hover:bg-[#f7f2ef]"
                >
                  {t("vendor.profile.cancel")}
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#30251f] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#463831] disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? t("vendor.profile.save.saving") : t("vendor.profile.save.save")}
                </button>

                {success && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    {t("vendor.profile.save.saved")}
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
                    <div className="relative h-24 w-24 shrink-0">
                      <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-[#30251f] shadow-lg">
                        {vendor?.profileImageUrl ? (
                          <img
                            loading="lazy"
                            decoding="async"
                            src={vendor.profileImageUrl}
                            alt={form.businessName || t("vendor.header.vendor")}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white">
                            {form.businessName?.charAt(0)?.toUpperCase() || "V"}
                          </div>
                        )}
                      </div>

                      <input
                        ref={profileImageInputRef}
                        type="file"
                        accept="image/*"
                        disabled={isUploadingProfileImage}
                        onChange={handleProfileImageSelected}
                        className="hidden"
                      />

                      {/* Always-visible edit badge — not hidden behind
                          hover, so it's discoverable on touch devices too. */}
                      <button
                        type="button"
                        onClick={() => profileImageInputRef.current?.click()}
                        disabled={isUploadingProfileImage || isLocked}
                        title={isLocked ? t("vendor.profile.pending.buttonHint") : undefined}
                        aria-label={t("vendor.profile.view.changePhoto")}
                        className="absolute -bottom-1 -end-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#30251f] text-white shadow-md transition hover:bg-[#463831] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isUploadingProfileImage ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Camera className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
                          {form.businessName || t("vendor.profile.defaultName")}
                        </h2>

                        {vendor?.status && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              STATUS_BADGE_CLASSES[vendor.status] ?? "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {STATUS_KEYS[vendor.status] ? t(STATUS_KEYS[vendor.status]) : vendor.status}
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
                    {t("vendor.profile.view.editProfile")}
                  </button>
                </div>
              </div>
            </section>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* About */}
              <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] lg:col-span-2">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
                    {t("vendor.profile.view.aboutEyebrow")}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
                    {t("vendor.profile.view.aboutTitle")}
                  </h3>
                </div>

                <p className="whitespace-pre-line text-sm leading-7 text-[#756b65]">
                  {form.bio || t("vendor.profile.view.bioEmpty")}
                </p>
              </section>

              {/* Contact */}
              <section className="rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)]">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
                    {t("vendor.profile.contact.eyebrow")}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
                    {t("vendor.profile.contact.viewTitle")}
                  </h3>
                </div>

                <div className="space-y-4">
                  <InfoRow
                    icon={<MapPin className="h-4 w-4" />}
                    label={t("vendor.profile.fields.location")}
                    value={form.location}
                  />

                  <InfoRow
                    icon={<Phone className="h-4 w-4" />}
                    label={t("vendor.profile.fields.phone")}
                    value={form.contactPhone}
                    ltr
                  />

                  <InfoRow
                    icon={<Mail className="h-4 w-4" />}
                    label={t("vendor.profile.fields.email")}
                    value={form.contactEmail}
                    ltr
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
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
                    {t("vendor.profile.social.connectEyebrow")}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
                    {t("vendor.profile.social.followTitle")}
                  </h3>

                  <p className="mt-1 text-sm text-[#756b65]">
                    {t("vendor.profile.social.followText")}
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
                    label={t("vendor.profile.fields.website")}
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
                        {t("vendor.profile.social.none")}
                      </p>

                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="mt-3 text-sm font-semibold text-[#9b6d52] hover:underline"
                      >
                        {t("vendor.profile.social.add")}
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
                <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
                  {t("vendor.profile.hours.eyebrow")}
                </p>

                <h3 className="mt-2 text-xl font-semibold text-[#30251f]">
                  {t("vendor.profile.hours.title")}
                </h3>
              </div>

              {Object.keys(workingHours).length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(workingHours).map(([day, hours]) => {
                    const dayKey = DAYS_OF_WEEK.find((d) => d.key === day)?.labelKey;
                    const dayLabel = dayKey ? t(dayKey) : day;
                    const isOff = hours === "OFF";

                    return (
                      <div
                        key={day}
                        className={`flex items-center justify-between rounded-2xl px-4 py-4 ${isOff
                            ? "bg-rose-50/50 border border-dashed border-rose-200"
                            : "bg-[#fcfaf8]"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ${isOff ? "text-rose-400" : "text-[#806a5b]"
                            }`}>
                            <Clock3 className="h-4 w-4" />
                          </div>

                          <span className={`text-sm font-semibold capitalize ${isOff ? "text-rose-500" : "text-[#40352f]"
                            }`}>
                            {dayLabel}
                          </span>
                        </div>

                        <span className={`text-xs font-medium ${isOff ? "text-rose-500" : "text-[#756b65]"
                          }`}>
                          {isOff ? t("vendor.profile.dayOff") : hours}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#ded4cc] bg-[#fcfaf8] p-8 text-center">
                  <Clock3 className="mx-auto h-7 w-7 text-[#9b8171]" />

                  <p className="mt-3 text-sm font-medium text-[#514740]">
                    {t("vendor.profile.hours.none")}
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
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
  ltr = false,
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
  ltr?: boolean;
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
        dir={ltr ? "ltr" : undefined}
        className={`h-12 w-full rounded-2xl border px-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#aaa09a] focus:ring-4 ${hasError
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
  const { t } = useLanguage();
  const fieldId = `social-${label.toLowerCase()}`;

  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#40352f]">
        {icon}
        {label}
        <span className="text-xs font-normal text-[#756b65]">{t("vendor.profile.optional")}</span>
      </label>

      <input
        id={fieldId}
        type="url"
        inputMode="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        dir="ltr"
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
  ltr = false,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  ltr?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f2ef] text-[#806a5b]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#9b8171]">{label}</p>
        <p className="mt-1 wrap-break-word text-sm font-medium text-[#40352f]">
          {value ? (ltr ? <span dir="ltr" className="inline-block">{value}</span> : value) : t("vendor.profile.notProvided")}
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
  // Only ever link to http(s) addresses.
  const safeHref = normalizeExternalUrl(href);

  if (!safeHref) return null;

  return (
    <a
      href={safeHref}
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
          <p dir="ltr" className="mt-1 max-w-45 truncate text-xs text-[#756b65] text-start">
            {handle}
          </p>
        </div>
      </div>

      <span className="text-lg text-[#b09a8c] transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
        →
      </span>
    </a>
  );
}