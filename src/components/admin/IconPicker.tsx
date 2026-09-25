"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ImageIcon, Link2, Loader2, Search, Sparkles, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import {
  CURATED_ICONS,
  iconNameFromUrl,
  iconifyUrl,
  searchIcons,
  styledIconName,
  suggestIcons,
} from "@/lib/category-icons";

type Props = {
  value: string;
  onChange: (url: string) => void;
  /** Category name(s) typed so far - used to suggest matching icons. */
  hints: string[];
  disabled?: boolean;
};

/**
 * Pick a category icon from a curated, consistent set (Phosphor light, brand
 * gold) with search - or paste any image link. Stores a plain image URL.
 */
export default function IconPicker({ value, onChange, hints, disabled }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [showLink, setShowLink] = useState(() => !!value && !iconNameFromUrl(value));
  const [broken, setBroken] = useState<Set<string>>(() => new Set());

  const selected = iconNameFromUrl(value);
  const suggested = useMemo(() => suggestIcons(...hints), [hints]);

  // Debounced search against the icon set (English keywords).
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      setSearchError(false);
      try {
        setResults(await searchIcons(q, controller.signal));
      } catch (err) {
        if ((err as Error).name !== "AbortError") setSearchError(true);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 350);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const grid = results
    ? results
    : [...suggested, ...CURATED_ICONS.filter((i) => !suggested.includes(i))];
  const visible = grid.filter((name) => !broken.has(name)).slice(0, 64);

  const pick = (name: string) => onChange(iconifyUrl(styledIconName(name)));

  return (
    <div className="space-y-3">
      {/* current */}
      <div className="flex items-center gap-3 rounded-xl border border-[#eee7e2] bg-[#faf8f6] p-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-[#efe6dd]">
          {value ? (
            <img src={value} alt={t("admin.categories.iconPreviewAlt")} className="h-9 w-9 object-contain" />
          ) : (
            <ImageIcon size={22} className="text-[#c4b6ab]" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#55483f]">
            {value ? t("admin.categories.iconPicker.selected") : t("admin.categories.iconPicker.none")}
          </p>
          <p className="mt-0.5 truncate text-[10px] text-[#9d9087]" dir="ltr">
            {selected ?? value ?? ""}
          </p>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={disabled}
            aria-label={t("admin.categories.iconPicker.clear")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9d9087] transition hover:bg-white hover:text-[#a34f49]"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* search */}
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-[#afa19a]" />
        <input
          type="search"
          dir="ltr"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length < 2) {
              setResults(null);
              setSearchError(false);
            }
          }}
          disabled={disabled}
          placeholder={t("admin.categories.iconPicker.searchPlaceholder")}
          aria-label={t("admin.categories.iconPicker.searchPlaceholder")}
          className="h-11 w-full rounded-xl border border-[#e7ded8] bg-[#fcfaf8] ps-10 pe-10 text-sm text-[#30251f] outline-none transition placeholder:text-[#afa19a] focus:border-[#bba99d] focus:bg-white focus:ring-4 focus:ring-[#f3ece7] rtl:text-right"
        />
        {searching && (
          <Loader2 size={15} className="absolute end-3.5 top-1/2 -translate-y-1/2 animate-spin text-[#a47e43]" />
        )}
      </div>

      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8a7a6e]">
        <Sparkles size={12} className="text-[#a47e43]" />
        {results
          ? t("admin.categories.iconPicker.results", { count: results.length })
          : suggested.length
            ? t("admin.categories.iconPicker.suggested")
            : t("admin.categories.iconPicker.popular")}
      </p>

      {searchError ? (
        <p className="rounded-xl bg-[#fff7f6] px-3 py-2.5 text-xs text-[#a34f49]">
          {t("admin.categories.iconPicker.searchFailed")}
        </p>
      ) : visible.length === 0 && results ? (
        <p className="rounded-xl bg-[#faf8f6] px-3 py-2.5 text-xs text-[#8a7a6e]">
          {t("admin.categories.iconPicker.noResults")}
        </p>
      ) : (
        <div
          role="listbox"
          aria-label={t("admin.categories.iconUrl")}
          className="grid max-h-56 grid-cols-6 gap-2 overflow-y-auto rounded-xl border border-[#f0e9e3] bg-white p-2 sm:grid-cols-8"
        >
          {visible.map((name, i) => {
            const active = selected === name;
            const isSuggested = !results && i < suggested.length;
            return (
              <button
                key={name}
                type="button"
                role="option"
                aria-selected={active}
                title={name}
                disabled={disabled}
                onClick={() => pick(name)}
                className={`group relative flex aspect-square items-center justify-center rounded-xl transition ${
                  active
                    ? "bg-[#f9f1e9] ring-2 ring-[#a47e43]"
                    : isSuggested
                      ? "bg-[#fdf8f1] ring-1 ring-[#ecd9bf] hover:ring-[#a47e43]"
                      : "hover:bg-[#faf6f1] hover:ring-1 hover:ring-[#e3d3bf]"
                }`}
              >
                <img
                  src={iconifyUrl(styledIconName(name))}
                  alt={name}
                  loading="lazy"
                  onError={() => setBroken((b) => new Set(b).add(name))}
                  className="h-7 w-7 transition-transform duration-200 group-hover:scale-110"
                />
                {active && (
                  <span className="absolute -end-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#a47e43] text-white">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* custom link */}
      {showLink ? (
        <div className="relative">
          <Link2 size={15} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-[#afa19a]" />
          <input
            type="url"
            dir="ltr"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={t("admin.categories.iconPlaceholder")}
            aria-label={t("admin.categories.iconPicker.orLink")}
            className="h-11 w-full rounded-xl border border-[#e7ded8] bg-[#fcfaf8] ps-10 pe-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#afa19a] focus:border-[#bba99d] focus:bg-white focus:ring-4 focus:ring-[#f3ece7]"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowLink(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e685e] underline-offset-4 hover:underline"
        >
          <Link2 size={13} />
          {t("admin.categories.iconPicker.orLink")}
        </button>
      )}

      <p className="text-[10px] text-[#b0a39b]">{t("admin.categories.iconPicker.credit")}</p>
    </div>
  );
}
