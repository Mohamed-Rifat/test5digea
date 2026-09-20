import api from "@/lib/axios";
import { normalizeVendor } from "@/lib/vendor-normalizer";

import type {
  Vendor,
  VendorGalleryImage,
  CreateVendorRequest,
  CreateVendorResponse,
  UpdateVendorRequest,
  RejectVendorRequest,
  UpdateVendorCategoriesRequest,
  VendorSearchParams,
  VendorSearchResponse,
  CompareVendorsRequest,
  VendorApiResponse,
} from "@/types/vendor";

// ================================
// Public
// ================================

export const getVendorDetails = async (id: string): Promise<Vendor> => {
  const response = await api.get<VendorApiResponse>(`/api/Vendors/${id}`);

  return normalizeVendor(response.data);
};

export const searchVendorList = async (
  params?: VendorSearchParams
): Promise<VendorSearchResponse> => {
  const response = await api.get<
    Omit<VendorSearchResponse, "items"> & { items: VendorApiResponse[] }
  >("/api/Vendors/search", {
    params,
  });

  return {
    ...response.data,
    items: response.data.items.map(normalizeVendor),
  };
};

export const compareVendorList = async (
  data: CompareVendorsRequest
): Promise<Vendor[]> => {
  const response = await api.post<VendorApiResponse[]>(
    "/api/Vendors/compare",
    data
  );

  return response.data.map(normalizeVendor);
};

// ================================
// Vendor (owner)
// ================================

export const getCurrentVendor = async (): Promise<Vendor> => {
  const response = await api.get<VendorApiResponse>("/api/Vendors/me");

  return normalizeVendor(response.data);
};

export const createVendor = async (
  data: CreateVendorRequest
): Promise<CreateVendorResponse> => {
  const response = await api.post<CreateVendorResponse>("/api/Vendors", data);

  return response.data;
};

export const updateVendor = async (
  id: string,
  data: UpdateVendorRequest
): Promise<void> => {
  await api.put(`/api/Vendors/${id}`, data);
};

export const resubmitVendor = async (id: string): Promise<void> => {
  await api.post(`/api/Vendors/${id}/resubmit`);
};

export const updateVendorCategories = async (
  id: string,
  data: UpdateVendorCategoriesRequest
): Promise<void> => {
  await api.put(`/api/Vendors/${id}/categories`, data);
};

// ================================
// Vendor images (owner)
// ================================

export const uploadVendorProfileImage = async (
  id: string,
  file: File
): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  // Same reasoning as uploadServiceImages: clear the shared instance's
  // default JSON Content-Type so axios leaves the FormData/File untouched
  // and lets the browser set the correct multipart boundary itself.
  await api.post(`/api/Vendors/${id}/profile-image`, formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
};

export const uploadVendorGalleryImages = async (
  id: string,
  files: File[]
): Promise<VendorGalleryImage[]> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post<VendorGalleryImage[]>(
    `/api/Vendors/${id}/gallery`,
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    }
  );

  return response.data;
};

export const deleteVendorGalleryImage = async (
  id: string,
  imageId: string
): Promise<void> => {
  await api.delete(`/api/Vendors/${id}/gallery/${imageId}`);
};

// ================================
// Admin
// ================================

// NOTE: the Swagger contract for this endpoint also accepts an optional
// numeric `status` query param (values 1-4), separate from the vendor's
// own string `status` field. Its exact 1-4 -> Pending/Approved/Rejected/
// Inactive mapping isn't confirmed anywhere in the project, so callers
// currently filter client-side using the reliable string `status` field
// instead of guessing this mapping. The param is exposed here so it can
// be wired in later once the mapping is confirmed with the backend team.
export const getAdminVendorsList = async (status?: number): Promise<Vendor[]> => {
  const response = await api.get<VendorApiResponse[]>("/api/Vendors/admin/all", {
    params: status !== undefined ? { status } : undefined,
  });

  return response.data.map(normalizeVendor);
};

export const getAdminVendorDetails = async (id: string): Promise<Vendor> => {
  // The admin payload nests the live profile under `profile` and adds
  // `pendingChanges` (profile edits waiting for approval).
  const response = await api.get<VendorApiResponse>(`/api/Vendors/admin/${id}`);

  return normalizeVendor(response.data);
};

export const approveVendor = async (id: string): Promise<void> => {
  await api.post(`/api/Vendors/${id}/approve`);
};

export const rejectVendor = async (
  id: string,
  data: RejectVendorRequest
): Promise<void> => {
  await api.post(`/api/Vendors/${id}/reject`, data);
};

export const deactivateVendor = async (id: string): Promise<void> => {
  await api.post(`/api/Vendors/${id}/deactivate`);
};

export const activateVendor = async (id: string): Promise<void> => {
  await api.post(`/api/Vendors/${id}/activate`);
};