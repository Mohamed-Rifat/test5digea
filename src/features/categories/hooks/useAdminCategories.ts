import { useCallback, useEffect, useState } from "react";
import { getAdminCategories } from "@/features/categories/api";
import type { Category } from "@/types/category";
import { translateNow } from "@/lib/translate-now";

interface UseAdminCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAdminCategories =
  (): UseAdminCategoriesReturn => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAdminCategories = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAdminCategories();

        setCategories(data);
      } catch {

        setError(translateNow("errors.loadCategories"));
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchAdminCategories();
    }, [fetchAdminCategories]);

    return {
      categories,
      loading,
      error,
      refetch: fetchAdminCategories,
    };
  };
