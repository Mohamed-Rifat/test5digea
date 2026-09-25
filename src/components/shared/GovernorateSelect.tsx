"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, MapPin, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import {
  findGovernorate,
  governorateLabel,
  searchGovernorates,
} from "@/lib/governorates";
import { fieldClass } from "@/components/ui/fieldStyles";

interface GovernorateSelectProps {
  /** English name of the selected governorate, or "" for none. */
  value: string;
  onChange: (value: string) => void;
  /** Small label above the field. */
  label?: React.ReactNode;
  /** Red underline (validation error). */
  invalid?: boolean;
  /** Called when the list closes after the field was used. */
  onBlur?: () => void;
  id?: string;
}

/**
 * Searchable governorate picker: the list is always visible on focus, typing
 * narrows it down, and the user can only pick one of the listed governorates.
 */
export default function GovernorateSelect({
  value,
  onChange,
  label,
  invalid = false,
  onBlur,
  id,
}: GovernorateSelectProps) {
  const { t, language } = useLanguage();

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const selected = findGovernorate(value);
  const selectedLabel = selected ? governorateLabel(selected, language) : "";

  const options = useMemo(() => searchGovernorates(query), [query]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onBlur]);

  // Keep the highlighted option visible while moving with the arrow keys.
  useEffect(() => {
    if (!open) return;

    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const openList = () => {
    setOpen(true);
    setActiveIndex(0);
  };

  const pick = (en: string) => {
    onChange(en);
    setOpen(false);
    setQuery("");
    onBlur?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) return openList();
      setActiveIndex((index) => Math.min(options.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter") {
      if (open) {
        event.preventDefault();
        const option = options[activeIndex];
        if (option) pick(option.en);
      }
    } else if (event.key === "Escape") {
      if (open) {
        event.stopPropagation();
        setOpen(false);
        setQuery("");
      }
    } else if (event.key === "Tab") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={rootRef} className="relative">
      {label && (
        <label
          htmlFor={id}
          className={`mb-0.5 block text-xs ${invalid ? "text-red-500" : "text-[#a59a92]"}`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <MapPin className="pointer-events-none absolute start-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#b0a69c]" />

        <input
          id={id}
          type="text"
          role="combobox"
          aria-invalid={invalid || undefined}
          aria-expanded={open}
          aria-controls="governorate-listbox"
          aria-autocomplete="list"
          autoComplete="off"
          value={open ? query : selectedLabel}
          onFocus={openList}
          onClick={() => {
            if (!open) openList();
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            open && selectedLabel
              ? selectedLabel
              : open
                ? t("common.governorate.searchHint")
                : t("common.governorate.placeholder")
          }
          className={`${fieldClass({ size: "sm", tone: invalid ? "error" : "default" })} ps-6 pe-16 placeholder:text-[#b0a69c]`}
        />

        <div className="absolute inset-y-0 end-0 flex items-center gap-0.5">
          {selected && (
            <button
              type="button"
              onClick={() => pick("")}
              aria-label={t("common.governorate.clear")}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[#9b8f86] transition hover:bg-[#f0e9e0] hover:text-[#30251f]"
            >
              <X size={13} />
            </button>
          )}
          <ChevronDown
            size={15}
            className={`pointer-events-none text-[#b0a69c] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {open && (
        <ul
          ref={listRef}
          id="governorate-listbox"
          role="listbox"
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-[#eee7e1] bg-white p-1.5 shadow-[0_18px_40px_rgba(48,37,31,0.14)]"
        >
          {options.length === 0 ? (
            <li className="px-3 py-3 text-center text-xs text-[#9b8f86]">
              {t("common.governorate.noResults")}
            </li>
          ) : (
            options.map((governorate, index) => {
              const isSelected = governorate.en === value;
              const isActive = index === activeIndex;

              return (
                <li
                  key={governorate.en}
                  role="option"
                  aria-selected={isSelected}
                  data-index={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    // Keep focus in the input; pick before it can blur.
                    event.preventDefault();
                    pick(governorate.en);
                  }}
                  className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    isSelected
                      ? "bg-[#f9f1e9] font-semibold text-[#8c6a3c]"
                      : isActive
                        ? "bg-[#faf7f4] text-[#30251f]"
                        : "text-[#5f544d]"
                  }`}
                >
                  <span className="truncate">
                    {governorateLabel(governorate, language)}
                  </span>
                  {isSelected && <Check size={14} className="shrink-0" />}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
