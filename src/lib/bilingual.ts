/**
 * Bilingual text stored in a single API field.
 *
 * The API keeps one `name` / `description` per category. To support Arabic
 * and English without a backend change, the admin enters both and we store
 * them together in that one field:
 *
 *     "قاعات أفراح ‖ Wedding Halls"
 *
 * Every entity that copies the category name (services, vendors, roadmap
 * items) gets the same combined string, so `localize()` shows the right half
 * everywhere. Comparisons by name keep working because the stored string is
 * identical across entities.
 *
 * Older, single-language values are still supported: they are shown as-is,
 * or translated through LEGACY_TRANSLATIONS when we know the other language.
 *
 * When the backend adds real `nameEn` / `descriptionEn` fields, only this
 * file (and the admin form) needs to change.
 */
import type { Language } from "@/locales";

/** Separator between the Arabic and English parts ("double vertical line"). */
export const BILINGUAL_SEPARATOR = " ‖ ";
const SPLIT_RE = /\s*‖\s*/;
const ARABIC_RE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

export type BilingualText = { ar: string; en: string };

const isArabicText = (value: string) => ARABIC_RE.test(value);

/**
 * Known translations for categories created before bilingual names existed
 * (either language maps to the other). Keys are compared case-insensitively.
 */
const LEGACY_PAIRS: [ar: string, en: string][] = [
  ["قاعات أفراح", "Wedding Halls"],
  ["قاعات الأفراح", "Wedding Venues"],
  ["فنادق ومنتجعات", "Hotels & Resorts"],
  ["أماكن مفتوحة", "Outdoor Venues"],
  ["أفراح على البحر", "Beach Weddings"],
  ["منظمي أفراح", "Wedding Planners"],
  ["مصورين", "Photographers"],
  ["تصوير فوتوغرافي", "Photography"],
  ["تصوير فيديو", "Videography"],
  ["ميكب آرتست", "Makeup Artists"],
  ["شعر وتجميل", "Hair & Beauty"],
  ["فساتين زفاف", "Bridal Dresses"],
  ["فساتين زفاف", "Wedding Dresses"],
  ["بدل عرسان", "Groom Suits"],
  ["دبل وشبكة", "Engagement Rings"],
  ["مجوهرات", "Jewelry"],
  ["ديكور وتنسيق", "Event Decoration"],
  ["ورد وتنسيق زهور", "Flowers"],
  ["دي جي وفرق موسيقية", "DJs & Bands"],
  ["زفة", "Zaffa"],
  ["عروض ورقص", "Dance & Entertainment"],
  ["بوفيه وتجهيز أكل", "Catering"],
  ["تورتة الفرح", "Wedding Cakes"],
  ["عربيات الزفاف", "Luxury Car Rentals"],
  ["عربيات الزفاف", "Wedding Cars"],
  ["دعوات الفرح", "Invitations"],
  ["هدايا وتوزيعات", "Gifts & Giveaways"],
  ["إكسسوارات", "Accessories"],
  ["أحذية", "Shoes"],
  ["حنة", "Henna"],
  ["شهر العسل", "Honeymoon"],
  // descriptions of the seeded categories
  ["مصورين أفراح محترفين", "Professional wedding photographers"],
  ["ميكب عرايس احترافي", "Professional bridal makeup"],
  ["فساتين زفاف أنيقة", "Elegant bridal dresses"],
  ["قاعات وأماكن للأفراح", "Wedding halls and venues"],
  ["موسيقى وترفيه", "Music and entertainment"],
  ["خدمات الديكور", "Decoration services"],
  ["عربيات فخمة للأفراح", "Luxury cars for weddings"],
  ["تنظيم كامل للفرح", "Full wedding planning"],
];

const LEGACY = new Map<string, BilingualText>();
LEGACY_PAIRS.forEach(([ar, en]) => {
  const pair = { ar, en };
  if (!LEGACY.has(ar.toLowerCase())) LEGACY.set(ar.toLowerCase(), pair);
  LEGACY.set(en.toLowerCase(), pair);
});

/** True when the value already holds both languages. */
export const isBilingual = (value: string | null | undefined) =>
  !!value && SPLIT_RE.test(value);

/**
 * Splits a stored value into its Arabic and English parts. A missing part is
 * filled from the legacy dictionary, or left empty.
 */
export function decodeBilingual(value: string | null | undefined): BilingualText {
  const raw = (value ?? "").trim();
  if (!raw) return { ar: "", en: "" };

  const parts = raw.split(SPLIT_RE).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const [first, second] = parts;
    // Normally "ar ‖ en", but accept either order.
    return isArabicText(first) || !isArabicText(second)
      ? { ar: first, en: second }
      : { ar: second, en: first };
  }

  const known = LEGACY.get(raw.toLowerCase());
  if (known) return known;
  return isArabicText(raw) ? { ar: raw, en: "" } : { ar: "", en: raw };
}

/** Builds the stored value. With only one language, stores it alone. */
export function encodeBilingual(ar: string, en: string): string {
  const a = ar.trim();
  const e = en.trim();
  if (a && e) return `${a}${BILINGUAL_SEPARATOR}${e}`;
  return a || e;
}

/** The part for `language`, falling back to the other language. */
export function localizeText(
  value: string | null | undefined,
  language: Language,
): string {
  if (!value) return "";
  const { ar, en } = decodeBilingual(value);
  return (language === "en" ? en || ar : ar || en) || value;
}

/** Both languages (for SEO keywords / search), without duplicates. */
export function bothLanguages(value: string | null | undefined): string[] {
  const { ar, en } = decodeBilingual(value);
  return Array.from(new Set([ar, en].filter(Boolean)));
}
