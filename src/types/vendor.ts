export interface Vendor {
  id: string;
  userId: string;

  businessName: string;
  slogan: string;
  bio: string;

  profileImageUrl: string;

  location: string;
  latitude: number;
  longitude: number;

  contactPhone: string;
  contactEmail: string;

  socialLinksJson: string;
  workingHoursJson: string;

  status: "Pending" | "Approved" | "Rejected" | "Inactive";
  rejectionReason: string;

  averageRating: number;
  reviewsCount: number;

  categories: string[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorRequest {
  email: string;
  password: string;
  fullName: string;
  businessName: string;
}

export type CreateVendorResponse = string;

export interface UpdateVendorRequest {
  businessName: string;
  slogan: string;
  bio: string;
  location: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  contactEmail: string;
  socialLinksJson: string;
  workingHoursJson: string;
}

export interface RejectVendorRequest {
  reason: string;
}

export interface UpdateVendorCategoriesRequest {
  categoryIds: string[];
}

export interface VendorSearchParams {
  searchTerm?: string;
  categoryId?: string;
  location?: string;
  minRating?: number;
  sortBy?: number;
  page?: number;
  pageSize?: number;
}

export interface VendorSearchResponse {
  items: Vendor[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CompareVendorsRequest {
  vendorIds: string[];
  categoryId: string;
}