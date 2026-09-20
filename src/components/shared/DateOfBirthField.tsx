"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";

interface DateOfBirthFieldProps {
  id: string;
  label: string;
  /** ISO calendar date ("YYYY-MM-DD") or "" while incomplete. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  /** Youngest selectable age. Years newer than (this year - minAge) are hidden. */
  minAge?: number;
  /** Oldest selectable age. */
  maxAge?: number;
}

interface Parts {
  day: string;
  month: string;
  year: string;
}

const EMPTY: Parts = { day: "", month: "", year: "" };

const pad = (value: number | string) => String(value).padStart(2, "0");

const parse = (value: string): Parts => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  return match
    ? { year: match[1], month: String(Number(match[2])), day: String(Number(match[3])) }
    : EMPTY;
};

const compose = ({ day, month, year }: Parts): string =>
  day && month && year ? `${year}-${pad(month)}-${pad(day)}` : "";

// A leap year is used while no year is chosen yet so 29 Feb stays selectable.
const daysInMonth = (month: string, year: string): number =>
  month ? new Date(Number(year) || 2000, Number(month), 0).getDate() : 31;

/**
 * Day / month / year pickers for a date of birth.
 *
 * Three native <select>s beat a calendar popup here: nobody scrolls a
 * calendar back thirty years, native pickers are best on phones, they are
 * fully accessible, and month names follow the site language. The visual
 * style matches the underlined floating-label inputs on the auth pages.
 */
export default function DateOfBirthField({
  id,
  label,
  value,
  onChange,
  onBlur,
  disabled = false,
  invalid = false,
  minAge = 18,
  maxAge = 100,
}: DateOfBirthFieldProps) {
  const { t, language } = useLanguage();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  const [parts, setParts] = useState<Parts>(() => parse(value));

  // Follow external changes (e.g. the form being reset) without clobbering a
  // half-finished selection.
  useEffect(() => {
    if (value && value !== compose(parts)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setParts(parse(value));
    } else if (!value && compose(parts)) {
      setParts(EMPTY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const monthNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(dateLocale, { month: "long" });

    return Array.from({ length: 12 }, (_, index) =>
      formatter.format(new Date(2000, index, 1))
    );
  }, [dateLocale]);

  const years = useMemo(() => {
    const newest = new Date().getFullYear() - minAge;

    return Array.from({ length: maxAge - minAge + 1 }, (_, index) => newest - index);
  }, [minAge, maxAge]);

  const dayCount = daysInMonth(parts.month, parts.year);

  const update = (patch: Partial<Parts>) => {
    const next = { ...parts, ...patch };

    // Switching to a shorter month (or a non-leap year) must not leave an
    // impossible date such as 31 Feb behind.
    const limit = daysInMonth(next.month, next.year);
    if (next.day && Number(next.day) > limit) {
      next.day = String(limit);
    }

    setParts(next);
    onChange(compose(next));
  };

  const selectClass = (selected: string) =>
    `peer block w-full appearance-none border-0 border-b-2 bg-transparent py-3 ps-0 pe-6 text-[15px] outline-none transition-all duration-300 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 ltr:text-left rtl:text-right ${
      invalid
        ? "border-red-300 focus:border-red-500"
        : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
    } ${selected ? "text-[#30251f]" : "text-[#a59a92]"}`;

  const chevron = (
    <ChevronDown
      size={15}
      className="pointer-events-none absolute end-0 top-1/2 -translate-y-1/2 text-[#a59a92]"
    />
  );

  return (
    <div
      role="group"
      aria-labelledby={`${id}-label`}
      className="w-full text-start"
      onBlur={(event) => {
        // Only report a blur when focus leaves the whole group.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onBlur?.();
        }
      }}
    >
      <p
        id={`${id}-label`}
        className={`mb-0.5 text-xs transition-colors ${
          invalid ? "text-red-500" : "text-[#a59a92]"
        }`}
      >
        {label}
      </p>

      <div className="grid grid-cols-[0.8fr_1.6fr_1fr] gap-4">
        <div className="relative">
          <select
            id={`${id}-day`}
            aria-label={t("auth.dob.day")}
            value={parts.day}
            disabled={disabled}
            onChange={(event) => update({ day: event.target.value })}
            className={selectClass(parts.day)}
          >
            <option value="">{t("auth.dob.day")}</option>
            {Array.from({ length: dayCount }, (_, index) => index + 1).map(
              (day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              )
            )}
          </select>
          {chevron}
        </div>

        <div className="relative">
          <select
            id={`${id}-month`}
            aria-label={t("auth.dob.month")}
            value={parts.month}
            disabled={disabled}
            onChange={(event) => update({ month: event.target.value })}
            className={selectClass(parts.month)}
          >
            <option value="">{t("auth.dob.month")}</option>
            {monthNames.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
          {chevron}
        </div>

        <div className="relative">
          <select
            id={`${id}-year`}
            aria-label={t("auth.dob.year")}
            value={parts.year}
            disabled={disabled}
            onChange={(event) => update({ year: event.target.value })}
            className={selectClass(parts.year)}
          >
            <option value="">{t("auth.dob.year")}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {chevron}
        </div>
      </div>
    </div>
  );
}
