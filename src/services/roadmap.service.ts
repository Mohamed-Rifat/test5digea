import api from "@/lib/axios";

import type {
  Roadmap,
  CreateRoadmapRequest,
  CreateRoadmapResponse,
  UpdateRoadmapRequest,
  SelectVendorRequest,
} from "@/types/roadmap";

export const getRoadmap = async (): Promise<Roadmap> => {
  const response = await api.get<Roadmap>("/api/Roadmap");

  return response.data;
};

export const createRoadmap = async (
  data: CreateRoadmapRequest
): Promise<CreateRoadmapResponse> => {
  const response = await api.post<CreateRoadmapResponse>(
    "/api/Roadmap",
    data
  );

  return response.data;
};

export const updateRoadmap = async (
  data: UpdateRoadmapRequest
): Promise<void> => {
  await api.put("/api/Roadmap", data);
};

export const selectRoadmapVendor = async (
  categoryId: string,
  data: SelectVendorRequest
): Promise<void> => {
  await api.post(
    `/api/Roadmap/categories/${categoryId}/select-vendor`,
    data
  );
};

export const removeRoadmapVendor = async (
  categoryId: string
): Promise<void> => {
  await api.delete(
    `/api/Roadmap/categories/${categoryId}/vendor`
  );
};

export const completeRoadmapCategory = async (
  categoryId: string
): Promise<void> => {
  await api.post(
    `/api/Roadmap/categories/${categoryId}/complete`
  );
};

export const uncompleteRoadmapCategory = async (
  categoryId: string
): Promise<void> => {
  await api.post(
    `/api/Roadmap/categories/${categoryId}/uncomplete`
  );
};
