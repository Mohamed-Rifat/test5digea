"use client";

import { Mail, MessageCircle, User } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import GovernorateSelect from "@/components/shared/GovernorateSelect";
import { FieldMessage, RequiredLabel, TextField } from "@/components/ui";
import type { TranslationKey } from "@/locales";
import { ApplicationSubmit } from "./ApplicationSubmit";
import { CategoryPicker } from "./CategoryPicker";
import type { BecomeVendorForm, FormState } from "./useBecomeVendorForm";

type TextKey = Exclude<keyof FormState, "governorate">;

const FIELDS: {
  name: TextKey;
  type: string;
  labelKey: TranslationKey;
  placeholderKey: TranslationKey;
  autoComplete: string;
  icon?: typeof User;
}[] = [
  {
    name: "fullName",
    type: "text",
    labelKey: "becomeVendor.fields.fullName.label",
    placeholderKey: "becomeVendor.fields.fullName.placeholder",
    autoComplete: "name",
    icon: User,
  },
  {
    name: "brandName",
    type: "text",
    labelKey: "becomeVendor.fields.brandName.label",
    placeholderKey: "becomeVendor.fields.brandName.placeholder",
    autoComplete: "organization",
  },
  {
    name: "whatsappNumber",
    type: "tel",
    labelKey: "becomeVendor.fields.whatsapp.label",
    placeholderKey: "becomeVendor.fields.whatsapp.placeholder",
    autoComplete: "tel",
    icon: MessageCircle,
  },
  {
    name: "personalEmail",
    type: "email",
    labelKey: "becomeVendor.fields.email.label",
    placeholderKey: "becomeVendor.fields.email.placeholder",
    autoComplete: "email",
    icon: Mail,
  },
];

/** The vendor application form: contact fields, governorate and categories. */
export function VendorApplicationForm({
  form: state,
}: {
  form: BecomeVendorForm;
}) {
  const { t } = useLanguage();
  const { form, touched, fieldErrors } = state;

  return (
    <form onSubmit={state.handleSubmit} noValidate className="space-y-7">
      <div className="grid gap-7 sm:grid-cols-2">
        {FIELDS.map(
          ({
            name,
            type,
            labelKey,
            placeholderKey,
            autoComplete,
            icon: Icon,
          }) => (
            <TextField
              key={name}
              id={name}
              name={name}
              type={type}
              label={<RequiredLabel text={t(labelKey)} />}
              value={form[name]}
              onChange={state.handleChange}
              onBlur={() => state.handleBlur(name)}
              placeholder={t(placeholderKey)}
              autoComplete={autoComplete}
              startIcon={
                Icon ? <Icon size={16} strokeWidth={1.7} /> : undefined
              }
              error={touched[name] ? fieldErrors[name] || undefined : undefined}
            />
          ),
        )}
      </div>

      <div>
        <GovernorateSelect
          id="governorate"
          label={
            <RequiredLabel text={t("becomeVendor.fields.governorate.label")} />
          }
          value={form.governorate}
          onChange={state.selectGovernorate}
          onBlur={() => state.handleBlur("governorate")}
          invalid={!!touched.governorate && !!fieldErrors.governorate}
        />
        {touched.governorate && fieldErrors.governorate && (
          <FieldMessage>{fieldErrors.governorate}</FieldMessage>
        )}
      </div>

      <CategoryPicker
        categories={state.activeCategories}
        loading={state.categoriesLoading}
        selectedIds={state.selectedCategoryIds}
        onToggle={state.toggleCategory}
        showError={!!touched.categories}
      />

      <ApplicationSubmit
        isFormValid={state.isFormValid}
        loading={state.loading}
      />
    </form>
  );
}
