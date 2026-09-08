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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
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
      setSelected((prev) => {
        const alreadySelected = prev.some((s) => s.id === service.id);

        if (alreadySelected) {
          return prev.filter((s) => s.id !== service.id);
        }

        if (prev.length > 0 && prev[0].categoryId !== service.categoryId) {
          toast(
            "You can only compare services from the same category.",
            "error"
          );
          return prev;
        }

        if (prev.length >= MAX_COMPARE_SERVICES) {
          toast(
            `You can compare up to ${MAX_COMPARE_SERVICES} services at once.`,
            "error"
          );
          return prev;
        }

        return [...prev, service];
      });
    },
    [toast]
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
