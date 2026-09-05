import {
  getVendor,
  searchVendors,
  compareVendors,
  getMyVendor,
  createVendor as createVendorApi,
  updateVendor as updateVendorApi,
  resubmitVendor as resubmitVendorApi,
  getAdminVendors,
  getAdminVendor,
  approveVendor as approveVendorApi,
  rejectVendor as rejectVendorApi,
  deactivateVendor as deactivateVendorApi,
  activateVendor as activateVendorApi,
  updateVendorCategories as updateVendorCategoriesApi,
} from "@/features/vendors/api/vendors.api";

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


export const getVendorDetails = async (
  id: string
): Promise<Vendor> => {
  return getVendor(id);
};

export const searchVendorList = async (
  params?: VendorSearchParams
): Promise<VendorSearchResponse> => {
  return searchVendors(params);
};

export const compareVendorList = async (
  data: CompareVendorsRequest
): Promise<Vendor[]> => {
  return compareVendors(data);
};


export const getCurrentVendor = async (): Promise<Vendor> => {
  return getMyVendor();
};

export const createVendor = async (
  data: CreateVendorRequest
): Promise<CreateVendorResponse> => {
  return createVendorApi(data);
};

export const updateVendor = async (
  id: string,
  data: UpdateVendorRequest
): Promise<void> => {
  return updateVendorApi(id, data);
};

export const resubmitVendor = async (
  id: string
): Promise<void> => {
  return resubmitVendorApi(id);
};


export const getAdminVendorsList = async (): Promise<Vendor[]> => {
  return getAdminVendors();
};

export const getAdminVendorDetails = async (
  id: string
): Promise<Vendor> => {
  return getAdminVendor(id);
};

export const approveVendor = async (
  id: string
): Promise<void> => {
  return approveVendorApi(id);
};

export const rejectVendor = async (
  id: string,
  data: RejectVendorRequest
): Promise<void> => {
  return rejectVendorApi(id, data);
};

export const deactivateVendor = async (
  id: string
): Promise<void> => {
  return deactivateVendorApi(id);
};

export const activateVendor = async (
  id: string
): Promise<void> => {
  return activateVendorApi(id);
};

export const updateVendorCategories = async (
  id: string,
  data: UpdateVendorCategoriesRequest
): Promise<void> => {
  return updateVendorCategoriesApi(id, data);
};