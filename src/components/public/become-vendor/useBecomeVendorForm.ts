"use client";

import { FormEvent, useState } from "react";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { submitVendorApplication } from "@/features/vendorApplications/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";

export type FormState = {
  fullName: string;
  whatsappNumber: string;
  personalEmail: string;
  brandName: string;
  governorate: string;
};

type TouchedState = Partial<Record<keyof FormState | "categories", boolean>>;

/** State, validation and submit of the "become a vendor" application. */
export function useBecomeVendorForm() {
  const { t } = useLanguage();
  const { categories, loading: categoriesLoading } = useCategories();
  const activeCategories = categories.filter((category) => category.isActive);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    whatsappNumber: "",
    personalEmail: "",
    brandName: "",
    governorate: "",
  });
  const [touched, setTouched] = useState<TouchedState>({});
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const validateField = (name: keyof FormState, value: string): string => {
    const trimmed = value.trim();

    if (!trimmed) {
      switch (name) {
        case "fullName":
          return t("becomeVendor.validation.fullNameRequired");
        case "whatsappNumber":
          return t("becomeVendor.validation.whatsappRequired");
        case "personalEmail":
          return t("becomeVendor.validation.emailRequired");
        case "brandName":
          return t("becomeVendor.validation.brandNameRequired");
        case "governorate":
          return t("becomeVendor.validation.governorateRequired");
      }
    }

    if (name === "fullName" && trimmed.length < 3) {
      return t("becomeVendor.validation.fullNameMin");
    }

    if (name === "brandName" && trimmed.length < 2) {
      return t("becomeVendor.validation.brandNameMin");
    }

    if (name === "personalEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmed)) {
        return t("becomeVendor.validation.emailInvalid");
      }
    }

    if (name === "whatsappNumber") {
      const digits = value.replace(/\D/g, "");

      if (digits.length < 8) {
        return t("becomeVendor.validation.whatsappInvalid");
      }
    }

    return "";
  };

  const fieldErrors = {
    fullName: validateField("fullName", form.fullName),
    whatsappNumber: validateField("whatsappNumber", form.whatsappNumber),
    personalEmail: validateField("personalEmail", form.personalEmail),
    brandName: validateField("brandName", form.brandName),
    governorate: validateField("governorate", form.governorate),
  };

  const isFormValid =
    Object.values(fieldErrors).every((value) => !value) &&
    selectedCategoryIds.length > 0 &&
    !categoriesLoading &&
    activeCategories.length > 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleBlur = (name: keyof FormState) => {
    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((previous) =>
      previous.includes(categoryId)
        ? previous.filter((id) => id !== categoryId)
        : [...previous, categoryId],
    );

    setTouched((previous) => ({
      ...previous,
      categories: true,
    }));

    setError("");
  };

  const selectGovernorate = (governorate: string) => {
    setForm((previous) => ({ ...previous, governorate }));
    setTouched((previous) => ({ ...previous, governorate: true }));
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    setTouched({
      fullName: true,
      whatsappNumber: true,
      personalEmail: true,
      brandName: true,
      governorate: true,
      categories: true,
    });

    if (!isFormValid) {
      return;
    }

    try {
      setLoading(true);

      await submitVendorApplication({
        fullName: form.fullName.trim(),
        whatsappNumber: form.whatsappNumber.trim(),
        personalEmail: form.personalEmail.trim(),
        brandName: form.brandName.trim(),
        categoryIds: selectedCategoryIds,
        categoryNames: activeCategories
          .filter((category) => selectedCategoryIds.includes(category.id))
          .map((category) => category.name),
        governorate: form.governorate,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(err, t("becomeVendor.validation.submitError")),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    categoriesLoading,
    activeCategories,
    loading,
    error,
    setError,
    submitted,
    form,
    touched,
    fieldErrors,
    isFormValid,
    selectedCategoryIds,
    handleChange,
    handleBlur,
    toggleCategory,
    selectGovernorate,
    handleSubmit,
  };
}

export type BecomeVendorForm = ReturnType<typeof useBecomeVendorForm>;
