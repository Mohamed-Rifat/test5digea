import api from "@/lib/axios";

import type {
  Service,
  ServiceImage,
  CreateServiceRequest,
  UpdateServiceRequest,
  UpdateServicePricesRequest,
  RejectServiceRequest,
  RejectServiceImageRequest,
  CompareServicesRequest,
  SearchServicesParams,
  SearchServicesResponse,
  GetServicesParams,
  GetAdminServicesParams,
} from "@/types/service";

/* =========================
   Public Services
========================= */

export const getServices = async (
  params?: GetServicesParams
): Promise<Service[]> => {
  const response = await api.get<Service[]>("/api/Services", {
    params,
  });

  return response.data;
};

/* =========================
   Create Service
========================= */

export const createService = async (
  data: CreateServiceRequest
): Promise<string> => {
  const response = await api.post<string>(
    "/api/Services",
    data
  );

  return response.data;
};

/* =========================
   Get Service By ID
========================= */

export const getService = async (
  id: string
): Promise<Service> => {
  const response = await api.get<Service>(
    `/api/Services/${id}`
  );

  return response.data;
};

/* =========================
   Update Service
========================= */

export const updateService = async (
  id: string,
  data: UpdateServiceRequest
): Promise<void> => {
  await api.put(`/api/Services/${id}`, data);
};

/* =========================
   Search Services
========================= */

export const searchServices = async (
  params?: SearchServicesParams
): Promise<SearchServicesResponse> => {
  const response = await api.get<SearchServicesResponse>(
    "/api/Services/search",
    {
      params,
    }
  );

  return response.data;
};

/* =========================
   Compare Services
========================= */

export const compareServices = async (
  data: CompareServicesRequest
): Promise<Service[]> => {
  const response = await api.post<Service[]>(
    "/api/Services/compare",
    data
  );

  return response.data;
};

/* =========================
   My Services
========================= */

export const getMyServices = async (): Promise<Service[]> => {
  const response = await api.get<Service[]>(
    "/api/Services/me"
  );

  return response.data;
};

/* =========================
   Resubmit Service
========================= */

export const resubmitService = async (
  id: string
): Promise<void> => {
  await api.post(`/api/Services/${id}/resubmit`);
};

/* =========================
   Upload Service Images
========================= */

export const uploadServiceImages = async (
  id: string,
  files: File[]
): Promise<ServiceImage[]> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  // The shared axios instance sets a default "Content-Type: application/json"
  // header. If we leave that header in place, axios's default
  // transformRequest sees the JSON content-type and "helpfully" converts the
  // FormData into a JSON object via formDataToJSON() — which can't serialize
  // File values, so the actual image data is silently dropped and the server
  // receives an empty payload like {"images":[]}.
  // Setting Content-Type to undefined here removes that default for this one
  // request, so axios leaves the FormData untouched and the browser sets the
  // correct "multipart/form-data; boundary=..." header itself.
  const response = await api.post<ServiceImage[]>(
    `/api/Services/${id}/images`,
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    }
  );

  return response.data;
};

/* =========================
   Delete Service Image
========================= */

export const deleteServiceImage = async (
  id: string,
  imageId: string
): Promise<void> => {
  await api.delete(`/api/Services/${id}/images/${imageId}`);
};

/* =========================
   Update Service Prices
========================= */

export const updateServicePrices = async (
  id: string,
  data: UpdateServicePricesRequest
): Promise<void> => {
  await api.put(
    `/api/Services/${id}/prices`,
    data
  );
};

/* =========================
   Admin - Get All Services
========================= */

export const getAdminServices = async (
  params?: GetAdminServicesParams
): Promise<Service[]> => {
  const response = await api.get<Service[]>(
    "/api/Services/admin/all",
    {
      params,
    }
  );

  return response.data;
};

/* =========================
   Admin - Get Service By ID
========================= */

export const getAdminService = async (
  id: string
): Promise<Service> => {
  const response = await api.get<Service>(
    `/api/Services/admin/${id}`
  );

  return response.data;
};

/* =========================
   Admin - Approve
========================= */

export const approveService = async (
  id: string
): Promise<void> => {
  await api.post(`/api/Services/${id}/approve`);
};

/* =========================
   Admin - Reject
========================= */

export const rejectService = async (
  id: string,
  data: RejectServiceRequest
): Promise<void> => {
  await api.post(
    `/api/Services/${id}/reject`,
    data
  );
};

/* =========================
   Admin - Approve Service Image
========================= */

export const approveServiceImage = async (
  imageId: string
): Promise<void> => {
  await api.post(`/api/Services/images/${imageId}/approve`);
};

/* =========================
   Admin - Reject Service Image
========================= */

export const rejectServiceImage = async (
  imageId: string,
  data: RejectServiceImageRequest
): Promise<void> => {
  await api.post(
    `/api/Services/images/${imageId}/reject`,
    data
  );
};

/* =========================
   Admin - Deactivate
========================= */

export const deactivateService = async (
  id: string
): Promise<void> => {
  await api.post(
    `/api/Services/${id}/deactivate`
  );
};

/* =========================
   Admin - Activate
========================= */

export const activateService = async (
  id: string
): Promise<void> => {
  await api.post(
    `/api/Services/${id}/activate`
  );
};