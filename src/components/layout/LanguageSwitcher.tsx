"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import {
  LANGUAGES,
  LANGUAGE_NATIVE_NAME,
  type Language,
} from "@/locales/config";

type LanguageSwitcherProps = {
  /**
   * default   — globe + language name + chevron (desktop navbar)
   * compact   — square button showing the language code (mobile header)
   * segmented — two side-by-side options (mobile drawer)
   */
  variant?: "default" | "compact" | "segmented";
  className?: string;
};

export default function LanguageSwitcher({
  variant = "default",
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  if (variant === "segmented") {
    return (
      <div
        role="group"
        aria-label={t("common.language")}
        className={`flex rounded-full border border-[#e4dbd0] bg-white p-1 ${className}`}
      >
        {LANGUAGES.map((code) => {
          const active = code === language;
          return (
            <button
              key={code}
              type="button"
              lang={code}
              aria-pressed={active}
              onClick={() => setLanguage(code)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[#30251f] text-white"
                  : "text-[#5f544d] hover:bg-[#f0e9e0]"
              }`}
            >
              {active && <Check size={14} aria-hidden="true" />}
              {LANGUAGE_NATIVE_NAME[code]}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <LanguageDropdown
      compact={variant === "compact"}
      className={className}
      language={language}
      onSelect={setLanguage}
      label={t("common.language")}
    />
  );
}

function LanguageDropdown({
  compact,
  className,
  language,
  onSelect,
  label,
}: {
  compact: boolean;
  className: string;
  language: Language;
  onSelect: (language: Language) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Move focus to the selected option when the menu opens.
  useEffect(() => {
    if (!open) return;
    itemRefs.current[LANGUAGES.indexOf(language)]?.focus();
  }, [open, language]);

  const focusItem = (index: number) => {
    const total = LANGUAGES.length;
    itemRefs.current[(index + total) % total]?.focus();
  };

  const closeAndRestoreFocus = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = itemRefs.current.findIndex(
      (item) => item === document.activeElement,
    );

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(current + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(current - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(LANGUAGES.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        closeAndRestoreFocus();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const handleSelect = (code: Language) => {
    onSelect(code);
    closeAndRestoreFocus();
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label}: ${LANGUAGE_NATIVE_NAME[language]}`}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleTriggerKeyDown}
        className={
          compact
            ? `flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-semibold uppercase transition ${
                open
                  ? "border-[#e4dbd0] bg-[#f0e9e0] text-[#30251f]"
                  : "border-[#e4dbd0] text-[#5f544d] hover:border-[#b99a62]"
              }`
            : `flex h-10 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition ${
                open
                  ? "border-[#b99a62] text-[#30251f]"
                  : "border-[#e4dbd0] text-[#5f544d] hover:border-[#b99a62] hover:text-[#30251f]"
              }`
        }
      >
        {compact ? (
          <span aria-hidden="true">{language}</span>
        ) : (
          <>
            <Globe size={16} aria-hidden="true" className="text-[#a47e43]" />
            {/* Short code on narrower desktops, full name once there is room. */}
            <span aria-hidden="true" className="uppercase xl:hidden">
              {language}
            </span>
            <span aria-hidden="true" className="hidden xl:inline">
              {LANGUAGE_NATIVE_NAME[language]}
            </span>
            <ChevronDown
              size={14}
              aria-hidden="true"
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          onKeyDown={handleMenuKeyDown}
          className="absolute end-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-[#eee7e1] bg-white p-1.5 shadow-[0_18px_40px_rgba(48,37,31,0.14)]"
        >
          {LANGUAGES.map((code, index) => {
            const active = code === language;
            return (
              <button
                key={code}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                lang={code}
                tabIndex={active ? 0 : -1}
                onClick={() => handleSelect(code)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm transition hover:bg-[#faf7f4] focus-visible:bg-[#faf7f4] focus-visible:outline-none ${
                  active
                    ? "font-semibold text-[#30251f]"
                    : "text-[#5f544d] hover:text-[#30251f]"
                }`}
              >
                <span className="flex w-4 shrink-0 justify-center text-[#a47e43]">
                  {active && <Check size={14} aria-hidden="true" />}
                </span>
                {LANGUAGE_NATIVE_NAME[code]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
