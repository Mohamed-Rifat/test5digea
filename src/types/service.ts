export interface ServicePrice {
  id: string;
  label: string;
  price: number;
}

export interface ServiceImage {
  id: string;
  url: string;
  displayOrder: number;
}

export interface Service {
  id: string;
  vendorId: string;
  vendorBusinessName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  status: string;
  rejectionReason: string;
  prices: ServicePrice[];
  images: ServiceImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePriceRequest {
  label: string;
  price: number;
}

export interface CreateServiceRequest {
  categoryId: string;
  name: string;
  description: string;
  prices: CreateServicePriceRequest[];
}

export interface UpdateServiceRequest {
  name: string;
  description: string;
}

export interface UpdateServicePricesRequest {
  prices: CreateServicePriceRequest[];
}

export interface RejectServiceRequest {
  reason: string;
}

export interface CompareServicesRequest {
  serviceIds: string[];
}

export interface SearchServicesParams {
  searchTerm?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: number;
  page?: number;
  pageSize?: number;
}

export interface SearchServicesResponse {
  items: Service[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetServicesParams {
  vendorId?: string;
  categoryId?: string;
}

export interface GetAdminServicesParams {
  status?: number;
}