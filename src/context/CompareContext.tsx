"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";

export interface CompareServiceItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
}

const STORAGE_KEY = "5digea:service-compare";
const MAX_COMPARE_SERVICES = 4;

interface CompareContextValue {
  selected: CompareServiceItem[];
  hydrated: boolean;
  isSelected: (serviceId: string) => boolean;
  toggleService: (service: CompareServiceItem) => void;
  removeService: (serviceId: string) => void;
  clearAll: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<CompareServiceItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSelected(
            parsed.filter(
              (item): item is CompareServiceItem =>
                !!item &&
                typeof item === "object" &&
                typeof (item as CompareServiceItem).id === "string" &&
                typeof (item as CompareServiceItem).categoryId === "string" &&
                typeof (item as CompareServiceItem).categoryName === "string" &&
                typeof (item as CompareServiceItem).name === "string"
            ).slice(0, MAX_COMPARE_SERVICES)
          );
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      // Ignore storage failures; comparison remains available in memory.
    }
  }, [selected, hydrated]);

  const isSelected = useCallback(
    (serviceId: string) => selected.some((s) => s.id === serviceId),
    [selected]
  );

  const removeService = useCallback((serviceId: string) => {
    setSelected((prev) => prev.filter((s) => s.id !== serviceId));
  }, []);

  const clearAll = useCallback(() => setSelected([]), []);

  const toggleService = useCallback(
    (service: CompareServiceItem) => {
      const alreadySelected = selected.some((item) => item.id === service.id);

      if (alreadySelected) {
        setSelected((prev) => prev.filter((item) => item.id !== service.id));
        return;
      }

      if (selected.length > 0 && selected[0].categoryId !== service.categoryId) {
        toast(t("compare.errors.sameCategory"), "error");
        return;
      }

      if (selected.length >= MAX_COMPARE_SERVICES) {
        toast(
          t("compare.errors.maxServices", { max: MAX_COMPARE_SERVICES }),
          "error"
        );
        return;
      }

      setSelected((prev) => [...prev, service].slice(0, MAX_COMPARE_SERVICES));
    },
    [selected, toast, t]
  );

  const value = useMemo(
    () => ({ selected, hydrated, isSelected, toggleService, removeService, clearAll }),
    [selected, hydrated, isSelected, toggleService, removeService, clearAll]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
