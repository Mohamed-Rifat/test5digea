"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLanguage } from "@/context/LanguageContext";
import { useVendorContext } from "@/context/VendorContext";
import { normalizeExternalUrl } from "@/lib/safe-url";
import type { TranslationKey } from "@/locales";
import type { UpdateVendorRequest } from "@/types/vendor";

import {
  emptyForm,
  validateField,
  type SocialLinks,
  type ValidationErrors,
  type WorkingHours,
} from "./profileUtils";

/** State + handlers of the vendor profile page (view + edit form). */
export function useVendorProfileForm() {
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  );
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
      return form.socialLinksJson ? JSON.parse(form.socialLinksJson) : {};
    } catch {
      return {};
    }
  }, [form.socialLinksJson]);

  const workingHours = useMemo<WorkingHours>(() => {
    try {
      return form.workingHoursJson ? JSON.parse(form.workingHoursJson) : {};
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
    [touchedFields],
  );

  const handleBlur = useCallback(
    (field: string) => {
      setTouchedFields((prev) => ({
        ...prev,
        [field]: true,
      }));

      const value = (form[field as keyof UpdateVendorRequest] as string) || "";
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
    [form],
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
    [socialLinks],
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
    [workingHours],
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
    [workingHours],
  );

  const isDayOff = useCallback(
    (key: string) => {
      return workingHours[key] === "OFF";
    },
    [workingHours],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      setFormError("");
      setSuccess(false);

      // Validate all fields
      const errors: ValidationErrors = {};
      const requiredFields = [
        "businessName",
        "location",
        "contactPhone",
        "contactEmail",
      ];

      requiredFields.forEach((field) => {
        const value =
          (form[field as keyof UpdateVendorRequest] as string) || "";
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
    [form, update, socialLinks],
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
    [uploadProfileImage],
  );

  const isUploadingProfileImage = actionLoading === "profile-image";
  const errorText = (field: string): string => {
    const key = validationErrors[field];
    return key ? t(key) : "";
  };

  // ==============================================================
  // RENDER: LOADING
  // ==============================================================

  return {
    vendor,
    loading,
    actionError,
    form,
    isEditing,
    setIsEditing,
    isEditingActive,
    isLocked,
    isSaving,
    isResubmitting,
    isUploadingProfileImage,
    success,
    formError,
    validationErrors,
    touchedFields,
    errorText,
    socialLinks,
    workingHours,
    profileImageInputRef,
    handleChange,
    handleBlur,
    updateSocialLink,
    updateWorkingHour,
    toggleDayOff,
    isDayOff,
    handleSubmit,
    handleCancel,
    handleResubmit,
    handleProfileImageSelected,
  };
}

export type VendorProfileForm = ReturnType<typeof useVendorProfileForm>;
