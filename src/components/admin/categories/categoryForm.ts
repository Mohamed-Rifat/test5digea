import type { TranslationKey } from "@/locales";
import type { BilingualText } from "@/lib/bilingual";

export const EMPTY_BILINGUAL: BilingualText = { ar: "", en: "" };

export type ModalType = "create" | "edit" | "delete" | null;
export type StatusFilter = "all" | "active" | "inactive";

/** Both names are required; one description (either language) is enough. */
export function validateBilingual(
  name: BilingualText,
  description: BilingualText,
  iconUrl: string,
): TranslationKey | null {
  if (!name.ar.trim() || !name.en.trim())
    return "admin.categories.needBothNames";
  if (!description.ar.trim() && !description.en.trim())
    return "admin.categories.fillRequired";
  if (!iconUrl.trim()) return "admin.categories.fillRequired";
  return null;
}
