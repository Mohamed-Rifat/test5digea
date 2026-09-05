import api from "@/lib/axios";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/api/Categories");

  return response.data;
};

export const getCategory = async (
  id: string
): Promise<Category> => {
  const response = await api.get<Category>(
    `/api/Categories/${id}`
  );

  return response.data;
};

export const getAdminCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>(
    "/api/Categories/admin/all"
  );

  return response.data;
};

export const createCategory = async (
  data: CreateCategoryRequest
): Promise<string> => {
  const response = await api.post<string>(
    "/api/Categories",
    data
  );

  return response.data;
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryRequest
): Promise<void> => {
  await api.put(`/api/Categories/${id}`, data);
};

export const toggleCategoryActive = async (
  id: string,
  isActive: boolean
): Promise<void> => {
  await api.patch(
    `/api/Categories/${id}/toggle-active`,
    isActive
  );
};

export const deleteCategory = async (
  id: string
): Promise<void> => {
  await api.delete(`/api/Categories/${id}`);
};