"use client";

import type { ReactNode } from "react";
import {
  Calendar,
  CalendarOff,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import { useLanguage } from "@/context/LanguageContext";
import {
  OptionalLabel,
  RequiredLabel,
  TextAreaField,
  TextField,
} from "@/components/ui";
import type { UpdateVendorRequest } from "@/types/vendor";
import {
  DAYS_OF_WEEK,
  type SocialLinks,
  type WorkingHours,
} from "@/components/vendor/profile/profileUtils";

/**
 * Field groups shared by the vendor onboarding form and the vendor
 * profile edit form, so both look and validate the same.
 */

export interface VendorFieldsProps {
  form: UpdateVendorRequest;
  touched: Record<string, boolean>;
  errorText: (field: string) => string;
  onChange: (field: keyof UpdateVendorRequest, value: string) => void;
  onBlur: (field: keyof UpdateVendorRequest) => void;
  /** Prefix for the input ids (keeps them unique per form). */
  idPrefix?: string;
  className?: string;
}

type TextKey =
  "businessName" | "slogan" | "location" | "contactPhone" | "contactEmail";

/** One validated vendor input: turns green once valid, red on error. */
function VendorTextField({
  props,
  field,
  label,
  placeholder,
  type = "text",
  icon,
  required = false,
  className,
}: {
  props: VendorFieldsProps;
  field: TextKey;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
  required?: boolean;
  className?: string;
}) {
  const value = String(props.form[field] ?? "");
  const touched = !!props.touched[field];
  const error = touched ? props.errorText(field) : "";

  return (
    <TextField
      id={`${props.idPrefix ?? "vendor"}-${field}`}
      type={type}
      label={required ? <RequiredLabel text={label} /> : label}
      value={value}
      onChange={(e) => props.onChange(field, e.target.value)}
      onBlur={() => props.onBlur(field)}
      placeholder={placeholder}
      startIcon={icon}
      error={error || undefined}
      tone={touched && !error && value ? "success" : "default"}
      containerClassName={className}
    />
  );
}

/** Business name, slogan and "about" text. */
export function IdentityFields(props: VendorFieldsProps) {
  const { t } = useLanguage();
  const bioError = props.touched.bio ? props.errorText("bio") : "";

  return (
    <div className={props.className ?? "grid gap-7 sm:grid-cols-2"}>
      <VendorTextField
        props={props}
        field="businessName"
        label={t("vendor.profile.fields.businessName")}
        required
      />
      <VendorTextField
        props={props}
        field="slogan"
        label={t("vendor.profile.fields.slogan")}
        placeholder={t("vendor.profile.fields.sloganPlaceholder")}
      />
      <TextAreaField
        id={`${props.idPrefix ?? "vendor"}-bio`}
        label={
          <OptionalLabel
            text={t("vendor.profile.fields.about")}
            optional={t("vendor.profile.optional")}
          />
        }
        value={props.form.bio}
        onChange={(e) => props.onChange("bio", e.target.value)}
        onBlur={() => props.onBlur("bio")}
        rows={5}
        placeholder={t("vendor.profile.fields.bioPlaceholder")}
        error={bioError || undefined}
        containerClassName="sm:col-span-2"
      />
    </div>
  );
}

/** Location, phone and email. */
export function ContactFields(
  props: VendorFieldsProps & { emailFullWidth?: boolean },
) {
  const { t } = useLanguage();

  return (
    <div className={props.className ?? "grid gap-7 sm:grid-cols-2"}>
      <VendorTextField
        props={props}
        field="location"
        label={t("vendor.profile.fields.location")}
        icon={<MapPin className="h-4 w-4" />}
        placeholder={t("vendor.profile.fields.locationPlaceholder")}
        required
      />
      <VendorTextField
        props={props}
        field="contactPhone"
        type="tel"
        label={t("vendor.profile.fields.phone")}
        icon={<Phone className="h-4 w-4" />}
        placeholder="+20 100 000 0000"
        required
      />
      <VendorTextField
        props={props}
        field="contactEmail"
        type="email"
        label={t("vendor.profile.fields.email")}
        icon={<Mail className="h-4 w-4" />}
        placeholder="business@example.com"
        required
        className={props.emailFullWidth ? "sm:col-span-2" : undefined}
      />
    </div>
  );
}

const SOCIAL_FIELDS: {
  name: keyof SocialLinks;
  label?: string;
  icon: ReactNode;
  placeholder: string;
}[] = [
  {
    name: "instagram",
    label: "Instagram",
    icon: <FaInstagram className="h-4 w-4" />,
    placeholder: "https://instagram.com/...",
  },
  {
    name: "facebook",
    label: "Facebook",
    icon: <FaFacebookF className="h-4 w-4" />,
    placeholder: "https://facebook.com/...",
  },
  {
    name: "tiktok",
    label: "TikTok",
    icon: <FaTiktok className="h-4 w-4" />,
    placeholder: "https://tiktok.com/...",
  },
  {
    name: "website",
    icon: <Globe2 className="h-4 w-4" />,
    placeholder: "https://...",
  },
];

/** Instagram / Facebook / TikTok / website links. */
export function SocialLinksFields({
  links,
  onChange,
  idPrefix = "vendor",
  className = "grid gap-7 md:grid-cols-2 lg:grid-cols-4",
}: {
  links: SocialLinks;
  onChange: (key: keyof SocialLinks, value: string) => void;
  idPrefix?: string;
  className?: string;
}) {
  const { t } = useLanguage();

  return (
    <div className={className}>
      {SOCIAL_FIELDS.map(({ name, label, icon, placeholder }) => (
        <TextField
          key={name}
          id={`${idPrefix}-social-${name}`}
          type="url"
          inputMode="url"
          spellCheck={false}
          label={
            <OptionalLabel
              text={label ?? t("vendor.profile.fields.website")}
              optional={t("vendor.profile.optional")}
            />
          }
          value={links[name] || ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          startIcon={icon}
        />
      ))}
    </div>
  );
}

/** One input per weekday, each with a "day off" switch. */
export function WorkingHoursFields({
  hours,
  onChange,
  onToggleDayOff,
  className = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
}: {
  hours: WorkingHours;
  onChange: (day: string, value: string) => void;
  onToggleDayOff: (day: string) => void;
  className?: string;
}) {
  const { t } = useLanguage();

  return (
    <div className={className}>
      {DAYS_OF_WEEK.map(({ labelKey, key }) => {
        const isOff = hours[key] === "OFF";

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-[#40352f]">
                <Clock3 className="h-4 w-4" />
                {t(labelKey)}
              </span>

              <button
                type="button"
                onClick={() => onToggleDayOff(key)}
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
              <div className="flex h-12 items-center border-b-2 border-dashed border-rose-200 text-sm font-medium text-rose-500">
                <CalendarOff className="me-2 h-4 w-4" />
                {t("vendor.profile.dayOff")}
              </div>
            ) : (
              <TextField
                value={hours[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder="09:00 - 18:00"
                aria-label={t(labelKey)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
