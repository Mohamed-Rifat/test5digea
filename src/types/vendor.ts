export interface VendorGalleryImage {
  id: string;
  url: string;
  displayOrder: number;
}

export type VendorStatus = "Pending" | "Approved" | "Rejected" | "Inactive";

// The fields a vendor edits on their profile. The backend keeps the live
// (approved) copy and, since profile edits now need admin approval, a
// separate pending copy of the same shape.
export interface VendorProfileData {
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
}

// Raw vendor payload as the API sends it: profile fields may be nested
// under `profile`, and `status` may be numeric (1 Pending, 2 Approved,
// 3 Rejected, 4 Inactive) or a string. normalizeVendor() turns this into
// the flat `Vendor` the rest of the app uses.
export interface VendorApiResponse extends Partial<VendorProfileData> {
  id: string;
  userId: string;
  status?: VendorStatus | number | string;
  rejectionReason?: string | null;
  averageRating?: number;
  reviewsCount?: number;
  categories?: string[];
  galleryImages?: VendorGalleryImage[];
  createdAt?: string;
  updatedAt?: string;
  profile?: Partial<VendorProfileData> | null;
  pendingChanges?: Partial<VendorProfileData> | null;
}

export interface Vendor {
  id: string;
  userId: string;

  businessName: string;
  slogan: string;
  bio: string;

  profileImageUrl: string;
  galleryImages?: VendorGalleryImage[];

  location: string;
  latitude: number;
  longitude: number;

  contactPhone: string;
  contactEmail: string;

  socialLinksJson: string;
  workingHoursJson: string;

  status: VendorStatus;
  rejectionReason: string;

  // Profile edits waiting for admin approval (null when there are none).
  // Everything above is the live, already-approved profile.
  pendingChanges?: VendorProfileData | null;

  // true when the API says an edit is awaiting review — even if it is
  // identical to the live profile (so `pendingChanges` above is null).
  hasPendingRecord?: boolean;

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