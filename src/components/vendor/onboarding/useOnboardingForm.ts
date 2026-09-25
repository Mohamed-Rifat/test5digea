"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { useVendorContext } from "@/context/VendorContext";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";
import { normalizeExternalUrl } from "@/lib/safe-url";
import type { UpdateVendorRequest, Vendor } from "@/types/vendor";

import {
  validateField,
  type SocialLinks,
  type ValidationErrors,
  type WorkingHours,
} from "@/components/vendor/profile/profileUtils";

const REQUIRED_FIELDS = [
  "businessName",
  "location",
  "contactPhone",
  "contactEmail",
] as const;

const parseJson = <T extends object>(json: string): T => {
  try {
    return json ? (JSON.parse(json) as T) : ({} as T);
  } catch {
    return {} as T;
  }
};

const initialForm = (
  source: Vendor | UpdateVendorRequest,
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

/** State + submit logic of the vendor onboarding (first details) form. */
export function useOnboardingForm(vendor: Vendor) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const {
    pendingSubmitted,
    update,
    resubmit,
    uploadProfileImage,
    actionError,
  } = useVendorContext();

  const isRejected = vendor.status === "Rejected";

  // The component only mounts once the vendor is loaded, so the form can be
  // seeded straight from it (no effect / flash of empty fields).
  const [form, setForm] = useState<UpdateVendorRequest>(() =>
    initialForm(vendor.pendingChanges ?? pendingSubmitted ?? vendor),
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<TranslationKey | "">("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
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
    [logoPreview],
  );

  const socialLinks = useMemo(
    () => parseJson<SocialLinks>(form.socialLinksJson),
    [form.socialLinksJson],
  );
  const workingHours = useMemo(
    () => parseJson<WorkingHours>(form.workingHoursJson),
    [form.workingHoursJson],
  );

  const requiredDone = REQUIRED_FIELDS.filter(
    (field) => validateField(field, form[field]) === "",
  ).length;
  const requiredPercent = Math.round(
    (requiredDone / REQUIRED_FIELDS.length) * 100,
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
    [touched],
  );

  const handleBlur = useCallback(
    (field: keyof UpdateVendorRequest) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setValidationErrors((prev) => ({
        ...prev,
        [field]: validateField(field, String(form[field] ?? "")),
      }));
    },
    [form],
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

  return {
    isRejected,
    actionError,
    form,
    submitting,
    formError,
    touched,
    errorText,
    socialLinks,
    workingHours,
    requiredDone,
    requiredTotal: REQUIRED_FIELDS.length,
    requiredPercent,
    handleChange,
    handleBlur,
    updateSocialLink,
    updateWorkingHour,
    toggleDayOff,
    logoInputRef,
    logoFile,
    logoSrc,
    logoInvalid,
    handleLogoSelected,
    clearLogo,
    handleSubmit,
  };
}

export type OnboardingFormState = ReturnType<typeof useOnboardingForm>;
