import type { Language } from "@/locales/config";

export interface Governorate {
  /** English name — also the stable key used in state. */
  en: string;
  ar: string;
}

// Same list (and order) as the "become a vendor" form.
export const GOVERNORATES: Governorate[] = [
  { en: "Cairo", ar: "القاهرة" },
  { en: "Giza", ar: "الجيزة" },
  { en: "Alexandria", ar: "الإسكندرية" },
  { en: "Qalyubia", ar: "القليوبية" },
  { en: "Port Said", ar: "بورسعيد" },
  { en: "Suez", ar: "السويس" },
  { en: "Dakahlia", ar: "الدقهلية" },
  { en: "Sharqia", ar: "الشرقية" },
  { en: "Gharbia", ar: "الغربية" },
  { en: "Monufia", ar: "المنوفية" },
  { en: "Beheira", ar: "البحيرة" },
  { en: "Kafr El Sheikh", ar: "كفر الشيخ" },
  { en: "Damietta", ar: "دمياط" },
  { en: "Ismailia", ar: "الإسماعيلية" },
  { en: "North Sinai", ar: "شمال سيناء" },
  { en: "South Sinai", ar: "جنوب سيناء" },
  { en: "Faiyum", ar: "الفيوم" },
  { en: "Beni Suef", ar: "بني سويف" },
  { en: "Minya", ar: "المنيا" },
  { en: "Asyut", ar: "أسيوط" },
  { en: "Sohag", ar: "سوهاج" },
  { en: "Qena", ar: "قنا" },
  { en: "Luxor", ar: "الأقصر" },
  { en: "Aswan", ar: "أسوان" },
  { en: "Red Sea", ar: "البحر الأحمر" },
  { en: "New Valley", ar: "الوادي الجديد" },
  { en: "Matrouh", ar: "مطروح" },
];

export const governorateLabel = (
  governorate: Governorate,
  language: Language
): string => (language === "ar" ? governorate.ar : governorate.en);

export const findGovernorate = (en: string): Governorate | undefined =>
  GOVERNORATES.find((governorate) => governorate.en === en);

/**
 * Lower-cases and unifies Arabic spelling variants, so "قاهره" finds
 * "القاهرة" and "اسكندريه" finds "الإسكندرية".
 */
const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // tashkeel + tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .trim();

// "الاسكندريه" -> "اسكندريه" (drop the leading "ال" of every word).
const stripArticle = (value: string): string =>
  value
    .split(" ")
    .map((word) => (word.startsWith("ال") && word.length > 2 ? word.slice(2) : word))
    .join(" ");

const searchable = (value: string): string => stripArticle(normalize(value));

/** True when the query matches the start of the name or of any word in it. */
const startsWithWord = (name: string, query: string): boolean => {
  const words = name.split(" ");

  return words.some((_, index) => words.slice(index).join(" ").startsWith(query));
};

/**
 * Governorates matching what the user typed (Arabic or English, whatever the
 * page language is). Matches the beginning of the name / of a word first
 * ("ق" -> القاهرة, القليوبية, قنا); if nothing starts with it, falls back to
 * "contains" so a half-remembered name still finds something.
 */
export const searchGovernorates = (query: string): Governorate[] => {
  const q = searchable(query);

  // Empty, or just the Arabic article "ال" typed so far: show everything.
  if (!q || q === "ال") return GOVERNORATES;

  const names = (governorate: Governorate) => [
    searchable(governorate.ar),
    searchable(governorate.en),
  ];

  const byPrefix = GOVERNORATES.filter((governorate) =>
    names(governorate).some((name) => startsWithWord(name, q))
  );

  if (byPrefix.length > 0 || q.length < 2) return byPrefix;

  return GOVERNORATES.filter((governorate) =>
    names(governorate).some((name) => name.includes(q))
  );
};
