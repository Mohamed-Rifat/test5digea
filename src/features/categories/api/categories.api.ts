import api from "@/lib/axios";
import type { Category } from "../types/categories.types";

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/api/Categories");

  return response.data;
};