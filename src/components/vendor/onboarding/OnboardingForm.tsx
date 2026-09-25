"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  Calendar,
  CalendarOff,
  Camera,
  CheckCircle2,
  Clock3,
  Globe2,
  ImageIcon,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Send,
  Trash2,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import { useToast } from "@/components/providers/ToastProvider";
import { useVendorContext } from "@/context/VendorContext";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";
import { normalizeExternalUrl } from "@/lib/safe-url";
import type { UpdateVendorRequest, Vendor } from "@/types/vendor";

import JourneyStepper from "./JourneyStepper";
import { AboutSidebar } from "./OnboardingAbout";
import { delay } from "./motion";

// ================================================================
// CONSTANTS & TYPES
// ================================================================

const DAYS_OF_WEEK = [
  { labelKey: "vendor.profile.days.sat", key: "sat" },
  { labelKey: "vendor.profile.days.sun", key: "sun" },
  { labelKey: "vendor.profile.days.mon", key: "mon" },
  { labelKey: "vendor.profile.days.tue", key: "tue" },
  { labelKey: "vendor.profile.days.wed", key: "wed" },
  { labelKey: "vendor.profile.days.thu", key: "thu" },
  { labelKey: "vendor.profile.days.fri", key: "fri" },
] as const satisfies readonly { labelKey: TranslationKey; key: string }[];

type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
};

type WorkingHours = Record<string, string>;
type ValidationErrors = Record<string, TranslationKey | "">;

const REQUIRED_FIELDS = [
  "businessName",
  "location",
  "contactPhone",
  "contactEmail",
] as const;

const CARD =
  "rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8";

const INPUT_BASE =
  "w-full rounded-2xl border px-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#aaa09a] focus:ring-4";

const INPUT_NEUTRAL =
  "border-[#e3d9d1] bg-[#fcfaf8] focus:border-[#8c7363] focus:bg-white focus:ring-[#8c7363]/5";

// ================================================================
// VALIDATION (same rules as the company-profile page)
// ================================================================

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string): boolean =>
  /^[+\d\s\-()]{6,20}$/.test(phone);

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

const parseJson = <T extends object>(json: string): T => {
  try {
    return json ? (JSON.parse(json) as T) : ({} as T);
  } catch {
    return {} as T;
  }
};

const initialForm = (
  source: Vendor | UpdateVendorRequest
): UpdateVendorRequest => ({
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

// ================================================================
// MAIN COMPONENT
// ================================================================

/**
 * Stage 1 of onboarding: the details form with the "about us" column beside
 * it. Also shown again (with the admin's reason on top) when the details were
 * rejected — in that case submitting re-sends the application in one go.
 */
export default function OnboardingForm({ vendor }: { vendor: Vendor }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { pendingSubmitted, update, resubmit, uploadProfileImage, actionError } =
    useVendorContext();

  const isRejected = vendor.status === "Rejected";

  // The component only mounts once the vendor is loaded, so the form can be
  // seeded straight from it (no effect / flash of empty fields).
  const [form, setForm] = useState<UpdateVendorRequest>(() =>
    initialForm(vendor.pendingChanges ?? pendingSubmitted ?? vendor)
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<TranslationKey | "">("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Optional logo (uploaded together with the form).
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoInvalid, setLogoInvalid] = useState(false);

  useEffect(
    () => () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    },
    [logoPreview]
  );

  const socialLinks = useMemo(
    () => parseJson<SocialLinks>(form.socialLinksJson),
    [form.socialLinksJson]
  );
  const workingHours = useMemo(
    () => parseJson<WorkingHours>(form.workingHoursJson),
    [form.workingHoursJson]
  );

  const requiredDone = REQUIRED_FIELDS.filter(
    (field) => validateField(field, form[field]) === ""
  ).length;
  const requiredPercent = Math.round(
    (requiredDone / REQUIRED_FIELDS.length) * 100
  );

  const errorText = (field: string): string => {
    const key = validationErrors[field];
    return key ? t(key) : "";
  };

  // ==============================================================
  // HANDLERS
  // ==============================================================

  const handleChange = useCallback(
    (field: keyof UpdateVendorRequest, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));

      // Re-validate live once the field has been visited.
      setValidationErrors((prev) => ({
        ...prev,
        [field]: touched[field] ? validateField(field, value) : "",
      }));
    },
    [touched]
  );

  const handleBlur = useCallback(
    (field: keyof UpdateVendorRequest) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setValidationErrors((prev) => ({
        ...prev,
        [field]: validateField(field, String(form[field] ?? "")),
      }));
    },
    [form]
  );

  const updateSocialLink = (key: keyof SocialLinks, value: string) =>
    setForm((prev) => ({
      ...prev,
      socialLinksJson: JSON.stringify({
        ...parseJson<SocialLinks>(prev.socialLinksJson),
        [key]: value,
      }),
    }));

  const updateWorkingHour = (key: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      workingHoursJson: JSON.stringify({
        ...parseJson<WorkingHours>(prev.workingHoursJson),
        [key]: value,
      }),
    }));

  const toggleDayOff = (key: string) =>
    updateWorkingHour(key, workingHours[key] === "OFF" ? "" : "OFF");

  const handleLogoSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLogoInvalid(true);
      return;
    }

    setLogoInvalid(false);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoInvalid(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (submitting) return;

    setFormError("");

    // 1. Required fields
    const errors: ValidationErrors = {};

    REQUIRED_FIELDS.forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) errors[field] = error;
    });

    (["slogan", "bio"] as const).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setTouched((prev) => ({
        ...prev,
        ...Object.fromEntries(Object.keys(errors).map((key) => [key, true])),
      }));
      setFormError("vendor.profile.errors.fixAll");
      return;
    }

    // 2. Social links must be real http(s) links ("instagram.com/x" is
    //    completed with https://).
    const cleanedLinks: SocialLinks = {};
    let hasInvalidLink = false;

    (Object.keys(socialLinks) as (keyof SocialLinks)[]).forEach((key) => {
      const raw = (socialLinks[key] ?? "").trim();
      if (!raw) return;

      const normalized = normalizeExternalUrl(raw);

      if (normalized === null) hasInvalidLink = true;
      else cleanedLinks[key] = normalized;
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

    // 3. Send
    try {
      setSubmitting(true);

      // The logo is a nice-to-have: if it fails we still send the details.
      if (logoFile) {
        const logoOk = await uploadProfileImage(logoFile);

        if (!logoOk) {
          toast(t("vendor.errors.uploadProfilePhoto"), "error");
        }
      }

      const saved = await update({ ...form, socialLinksJson });

      if (!saved) return;

      // A rejected application has to be re-opened for the admin as well.
      if (isRejected) {
        const resent = await resubmit();

        if (!resent) return;
      }

      toast(t("vendorOnboarding.form.sentToast"), "success");
      // The gate now sees the vendor as "details sent" and swaps this form
      // for the under-review page by itself.
    } finally {
      setSubmitting(false);
    }
  };

  const logoSrc = logoPreview || vendor.profileImageUrl || "";

  // ==============================================================
  // RENDER
  // ==============================================================

  return (
    <main className="mx-auto w-full lg:max-w-10/12 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <JourneyStepper current={1} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
        {/* ============================================================
            FORM COLUMN
        ============================================================ */}
        <div className="min-w-0">
          <div className="onb-rise" style={delay(60)}>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47e43] rtl:tracking-normal">
              {t("vendorOnboarding.form.eyebrow")}
            </p>

            <h1 className="mt-2 font-serif text-3xl font-light tracking-tight text-[#30251f] rtl:leading-snug sm:text-4xl">
              {isRejected
                ? t("vendorOnboarding.form.rejectedTitle")
                : t("vendorOnboarding.form.title")}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#81746d]">
              {isRejected
                ? t("vendorOnboarding.form.rejectedHint")
                : t("vendorOnboarding.form.subtitle")}
            </p>
          </div>

          {/* Admin's reason (rejected only) */}
          {isRejected && (
            <div
              className="onb-rise mt-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
              style={delay(120)}
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="min-w-0">
                <p className="font-semibold">
                  {t("vendorOnboarding.form.rejectedReason")}
                </p>
                <p className="mt-1 whitespace-pre-line leading-6">
                  {vendor.rejectionReason ||
                    t("vendorOnboarding.form.rejectedNoReason")}
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 space-y-6"
          >
            {(formError || actionError) && (
              <div
                className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
                role="alert"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                {formError ? t(formError) : actionError}
              </div>
            )}

            {/* Logo */}
            <section className={`onb-rise ${CARD}`} style={delay(160)}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#faf5ee] shadow-lg ring-1 ring-[#eadfce]">
                  {logoSrc ? (
                    // Local preview / remote URL: a plain <img> avoids
                    // next/image domain configuration.
                    <img
                      src={logoSrc}
                      alt={t("vendorOnboarding.form.logoTitle")}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#c9ad78]">
                      <ImageIcon size={30} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-[#30251f]">
                    {t("vendorOnboarding.form.logoTitle")}
                    <span className="ms-2 text-xs font-normal text-[#756b65]">
                      {t("vendor.profile.optional")}
                    </span>
                  </h2>

                  <p className="mt-1 text-xs leading-6 text-[#756b65]">
                    {t("vendorOnboarding.form.logoHint")}
                  </p>

                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoSelected}
                    className="hidden"
                  />

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-sm font-semibold text-[#514740] transition hover:bg-[#f7f2ef]"
                    >
                      <Camera className="h-4 w-4" />
                      {logoFile
                        ? t("vendorOnboarding.form.logoChange")
                        : t("vendorOnboarding.form.logoChoose")}
                    </button>

                    {logoFile && (
                      <button
                        type="button"
                        onClick={clearLogo}
                        className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#9b6d52] transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("vendorOnboarding.form.logoRemove")}
                      </button>
                    )}
                  </div>

                  {logoInvalid && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {t("vendorOnboarding.form.logoInvalid")}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Identity */}
            <section className={`onb-rise ${CARD}`} style={delay(220)}>
              <SectionHeader
                eyebrow={t("vendor.profile.identity.eyebrow")}
                title={t("vendor.profile.identity.title")}
                subtitle={t("vendor.profile.identity.subtitle")}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <TextField
                  name="businessName"
                  label={t("vendor.profile.fields.businessName")}
                  value={form.businessName}
                  onChange={(value) => handleChange("businessName", value)}
                  onBlur={() => handleBlur("businessName")}
                  required
                  error={errorText("businessName")}
                  touched={touched.businessName}
                />

                <TextField
                  name="slogan"
                  label={t("vendor.profile.fields.slogan")}
                  value={form.slogan}
                  onChange={(value) => handleChange("slogan", value)}
                  onBlur={() => handleBlur("slogan")}
                  placeholder={t("vendor.profile.fields.sloganPlaceholder")}
                  error={errorText("slogan")}
                  touched={touched.slogan}
                />

                <div className="sm:col-span-2">
                  <label
                    htmlFor="onb-bio"
                    className="mb-2 block text-sm font-semibold text-[#40352f]"
                  >
                    {t("vendor.profile.fields.about")}
                    <span className="ms-1 text-xs font-normal text-[#756b65]">
                      {t("vendor.profile.optional")}
                    </span>
                  </label>

                  <textarea
                    id="onb-bio"
                    value={form.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    onBlur={() => handleBlur("bio")}
                    rows={5}
                    placeholder={t("vendor.profile.fields.bioPlaceholder")}
                    className={`${INPUT_BASE} ${INPUT_NEUTRAL} resize-none py-3.5`}
                  />

                  {validationErrors.bio && touched.bio && (
                    <p className="mt-1 text-xs text-red-500">
                      {errorText("bio")}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className={`onb-rise ${CARD}`} style={delay(280)}>
              <SectionHeader
                eyebrow={t("vendor.profile.contact.eyebrow")}
                title={t("vendor.profile.contact.editTitle")}
                subtitle={t("vendor.profile.contact.editSubtitle")}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <TextField
                  name="location"
                  label={t("vendor.profile.fields.location")}
                  value={form.location}
                  onChange={(value) => handleChange("location", value)}
                  onBlur={() => handleBlur("location")}
                  icon={<MapPin className="h-4 w-4" />}
                  required
                  error={errorText("location")}
                  touched={touched.location}
                  placeholder={t("vendor.profile.fields.locationPlaceholder")}
                />

                <TextField
                  name="contactPhone"
                  label={t("vendor.profile.fields.phone")}
                  value={form.contactPhone}
                  onChange={(value) => handleChange("contactPhone", value)}
                  onBlur={() => handleBlur("contactPhone")}
                  icon={<Phone className="h-4 w-4" />}
                  required
                  error={errorText("contactPhone")}
                  touched={touched.contactPhone}
                  placeholder="+20 100 000 0000"
                  ltr
                />

                <div className="sm:col-span-2">
                  <TextField
                    name="contactEmail"
                    label={t("vendor.profile.fields.email")}
                    value={form.contactEmail}
                    onChange={(value) => handleChange("contactEmail", value)}
                    onBlur={() => handleBlur("contactEmail")}
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    required
                    error={errorText("contactEmail")}
                    touched={touched.contactEmail}
                    placeholder="business@example.com"
                    ltr
                  />
                </div>
              </div>
            </section>

            {/* Social */}
            <section className={`onb-rise ${CARD}`} style={delay(340)}>
              <SectionHeader
                eyebrow={t("vendor.profile.social.eyebrow")}
                title={t("vendor.profile.social.title")}
                subtitle={t("vendor.profile.social.subtitle")}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <SocialField
                  name="instagram"
                  icon={<FaInstagram className="h-5 w-5" />}
                  label="Instagram"
                  value={socialLinks.instagram || ""}
                  onChange={(value) => updateSocialLink("instagram", value)}
                  placeholder="https://instagram.com/..."
                />

                <SocialField
                  name="facebook"
                  icon={<FaFacebookF className="h-5 w-5" />}
                  label="Facebook"
                  value={socialLinks.facebook || ""}
                  onChange={(value) => updateSocialLink("facebook", value)}
                  placeholder="https://facebook.com/..."
                />

                <SocialField
                  name="tiktok"
                  icon={<FaTiktok className="h-5 w-5" />}
                  label="TikTok"
                  value={socialLinks.tiktok || ""}
                  onChange={(value) => updateSocialLink("tiktok", value)}
                  placeholder="https://tiktok.com/..."
                />

                <SocialField
                  name="website"
                  icon={<Globe2 className="h-5 w-5" />}
                  label={t("vendor.profile.fields.website")}
                  value={socialLinks.website || ""}
                  onChange={(value) => updateSocialLink("website", value)}
                  placeholder="https://..."
                />
              </div>
            </section>

            {/* Working hours */}
            <section className={`onb-rise ${CARD}`} style={delay(400)}>
              <SectionHeader
                eyebrow={t("vendor.profile.hours.eyebrow")}
                title={t("vendor.profile.hours.title")}
                subtitle={t("vendor.profile.hours.subtitle")}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                {DAYS_OF_WEEK.map(({ labelKey, key }) => {
                  const isOff = workingHours[key] === "OFF";

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-[#40352f]">
                          <Clock3 className="h-4 w-4" />
                          {t(labelKey)}
                        </span>

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
                          dir="ltr"
                          aria-label={t(labelKey)}
                          value={workingHours[key] || ""}
                          onChange={(e) => updateWorkingHour(key, e.target.value)}
                          placeholder="09:00 - 18:00"
                          className={`${INPUT_BASE} ${INPUT_NEUTRAL} h-12`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Submit */}
            <section
              className="onb-rise rounded-4xl border border-[#e8dfd8] bg-white p-5 shadow-[0_10px_40px_rgba(48,37,31,0.05)] sm:p-6"
              style={delay(460)}
            >
              <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[#756b65]">
                <span>
                  {t("vendorOnboarding.form.progress", {
                    done: requiredDone,
                    total: REQUIRED_FIELDS.length,
                  })}
                </span>
                <span dir="ltr" className="tabular-nums text-[#a47e43]">
                  {requiredPercent}%
                </span>
              </div>

              <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-[#f1ebe6]">
                <div
                  className="h-full rounded-full bg-[#30251f] transition-all duration-700"
                  style={{ width: `${requiredPercent}%` }}
                />
                <div className="onb-sweep absolute inset-y-0 start-0 w-1/5 bg-linear-to-r from-transparent via-white/50 to-transparent" />
              </div>

              <p className="mt-2 text-[11px] text-[#9b8f86]">
                {t("vendorOnboarding.form.requiredNote")}
              </p>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-xs leading-6 text-[#756b65] sm:max-w-md">
                  <Lock className="mt-1 h-3.5 w-3.5 shrink-0 text-[#a47e43]" />
                  {t("vendorOnboarding.form.submitNote")}
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#30251f] px-7 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(48,37,31,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#45362d] disabled:translate-y-0 disabled:opacity-60"
                >
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {submitting ? (
                    <Loader2 className="relative h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="relative h-4 w-4 rtl:-scale-x-100" />
                  )}

                  <span className="relative">
                    {submitting
                      ? isRejected
                        ? t("vendorOnboarding.form.resubmitting")
                        : t("vendorOnboarding.form.submitting")
                      : isRejected
                        ? t("vendorOnboarding.form.resubmit")
                        : t("vendorOnboarding.form.submit")}
                  </span>
                </button>
              </div>
            </section>
          </form>
        </div>

        {/* ============================================================
            ABOUT US COLUMN
        ============================================================ */}
        <AboutSidebar />
      </div>
    </main>
  );
}

// ================================================================
// SUB-COMPONENTS
// ================================================================

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b8171] rtl:tracking-normal">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-semibold text-[#30251f]">{title}</h2>

      <p className="mt-1 text-sm text-[#756b65]">{subtitle}</p>
    </div>
  );
}

function TextField({
  name,
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
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
  required?: boolean;
  error?: string;
  touched?: boolean;
  ltr?: boolean;
}) {
  const reactId = useId();
  const fieldId = `onb-${name}-${reactId}`;
  const hasError = !!touched && !!error;
  const isValid = !!touched && !error && !!value;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#40352f]"
      >
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
        aria-invalid={hasError}
        className={`${INPUT_BASE} h-12 ${
          hasError
            ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-500/10"
            : isValid
              ? "border-emerald-300 bg-emerald-50/50 focus:border-emerald-400 focus:ring-emerald-500/10"
              : INPUT_NEUTRAL
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

function SocialField({
  name,
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const { t } = useLanguage();
  const fieldId = `onb-social-${name}`;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#40352f]"
      >
        {icon}
        {label}
        <span className="text-xs font-normal text-[#756b65]">
          {t("vendor.profile.optional")}
        </span>
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
        className={`${INPUT_BASE} ${INPUT_NEUTRAL} h-12`}
      />
    </div>
  );
}
