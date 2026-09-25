"use client";

import { useLanguage } from "@/context/LanguageContext";

/** Keyboard "skip to content" link - hidden until focused. */
export default function SkipLink() {
  const { t } = useLanguage();

  return (
    <a href="#main-content" className="skip-link">
      {t("common.skipToContent")}
    </a>
  );
}
