// NOTE: the backend Swagger doc always shows numeric enum examples as `1`
// regardless of what the value actually means, so these mappings are a
// best guess based on the natural Pending -> Approved/Rejected lifecycle
// used elsewhere in this app (see RoadmapItemStatus in types/roadmap.ts).
// Confirm the exact numbers with the backend team before relying on them
// for anything other than the "is it pending / not pending" checks below.
export enum ReviewStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

export interface Review {
  id: string;
  serviceId: string;
  serviceName: string;
  vendorId: string;
  vendorBusinessName: string;
  userId: string;
  userFullName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  rejectionReason: string;
  isDisplayed: boolean;
  createdAt: string;
}

export interface PaginatedReviews {
  items: Review[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetServiceReviewsParams {
  page?: number;
  pageSize?: number;
}

export interface ReviewablePrice {
  id: string;
  label: string;
  price: number;
}

export interface ReviewableImage {
  id: string;
  url: string;
  displayOrder: number;
}

// A service the current user is eligible to review for a given roadmap item.
export interface ReviewableService {
  id: string;
  vendorId: string;
  vendorBusinessName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  status: string;
  rejectionReason: string;
  prices: ReviewablePrice[];
  images: ReviewableImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  roadmapItemId: string;
  serviceId: string;
  rating: number;
  comment: string;
}

export type CreateReviewResponse = string;

export interface RejectReviewRequest {
  reason: string;
}

export interface ToggleReviewDisplayRequest {
  isDisplayed: boolean;
}
