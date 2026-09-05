import api from "@/lib/axios";

import type {
  Vendor,
  CreateVendorRequest,
  CreateVendorResponse,
  UpdateVendorRequest,
  RejectVendorRequest,
  UpdateVendorCategoriesRequest,
  VendorSearchParams,
  VendorSearchResponse,
  CompareVendorsRequest,
} from "@/types/vendor";

export const getVendor = async (
  id: string
): Promise<Vendor> => {
  const response = await api.get<Vendor>(
    `/api/Vendors/${id}`
  );

  return response.data;
};

export const searchVendors = async (
  params?: VendorSearchParams
): Promise<VendorSearchResponse> => {
  const response = await api.get<VendorSearchResponse>(
    "/api/Vendors/search",
    {
      params,
    }
  );

  return response.data;
};

export const compareVendors = async (
  data: CompareVendorsRequest
): Promise<Vendor[]> => {
  const response = await api.post<Vendor[]>(
    "/api/Vendors/compare",
    data
  );

  return response.data;
};

export const getMyVendor = async (): Promise<Vendor> => {
  const response = await api.get<Vendor>(
    "/api/Vendors/me"
  );

  return response.data;
};

export const createVendor = async (
  data: CreateVendorRequest
): Promise<CreateVendorResponse> => {
  const response = await api.post<CreateVendorResponse>(
    "/api/Vendors",
    data
  );

  return response.data;
};

export const updateVendor = async (
  id: string,
  data: UpdateVendorRequest
): Promise<void> => {
  await api.put(
    `/api/Vendors/${id}`,
    data
  );
};

export const resubmitVendor = async (
  id: string
): Promise<void> => {
  await api.post(
    `/api/Vendors/${id}/resubmit`
  );
};

export const getAdminVendors = async (): Promise<Vendor[]> => {
  const response = await api.get<Vendor[]>(
    "/api/Vendors/admin/all"
  );

  return response.data;
};

export const getAdminVendor = async (
  id: string
): Promise<Vendor> => {
  const response = await api.get<Vendor>(
    `/api/Vendors/admin/${id}`
  );

  return response.data;
};

export const approveVendor = async (
  id: string
): Promise<void> => {
  await api.post(
    `/api/Vendors/${id}/approve`
  );
};

export const rejectVendor = async (
  id: string,
  data: RejectVendorRequest
): Promise<void> => {
  await api.post(
    `/api/Vendors/${id}/reject`,
    data
  );
};

export const deactivateVendor = async (
  id: string
): Promise<void> => {
  await api.post(
    `/api/Vendors/${id}/deactivate`
  );
};

export const activateVendor = async (
  id: string
): Promise<void> => {
  await api.post(
    `/api/Vendors/${id}/activate`
  );
};

export const updateVendorCategories = async (
  id: string,
  data: UpdateVendorCategoriesRequest
): Promise<void> => {
  await api.put(
    `/api/Vendors/${id}/categories`,
    data
  );
};