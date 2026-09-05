import { useCallback, useEffect, useState } from "react";
import { getAdminCategories } from "@/services/categories.service";
import type { Category } from "@/types/category";

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
      } catch (error) {
setError("Failed to load admin categories.");
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
