import api from "@/lib/axios";

import type {
  PaginatedReviews,
  GetServiceReviewsParams,
  ReviewableService,
  Review,
  CreateReviewRequest,
  CreateReviewResponse,
  RejectReviewRequest,
  ToggleReviewDisplayRequest,
} from "@/types/review";

export const fetchServiceReviews = async (
  serviceId: string,
  params?: GetServiceReviewsParams
): Promise<PaginatedReviews> => {
  const response = await api.get<PaginatedReviews>(
    `/api/reviews/service/${serviceId}`,
    { params }
  );

  return response.data;
};

export const fetchReviewableServices = async (
  roadmapItemId: string
): Promise<ReviewableService[]> => {
  const response = await api.get<ReviewableService[]>("/api/reviews/reviewable", {
    params: { roadmapItemId },
  });

  return response.data;
};

export const submitReview = async (
  data: CreateReviewRequest
): Promise<CreateReviewResponse> => {
  const response = await api.post<CreateReviewResponse>("/api/reviews", data);

  return response.data;
};

export const fetchMyReviews = async (): Promise<Review[]> => {
  const response = await api.get<Review[]>("/api/reviews/me");

  return response.data;
};

export const fetchPendingReviews = async (): Promise<Review[]> => {
  const response = await api.get<Review[]>("/api/reviews/admin/pending");

  return response.data;
};

export const approveReview = async (id: string): Promise<void> => {
  await api.post(`/api/reviews/${id}/approve`);
};

export const rejectReview = async (
  id: string,
  data: RejectReviewRequest
): Promise<void> => {
  await api.post(`/api/reviews/${id}/reject`, data);
};

export const toggleReviewDisplay = async (
  id: string,
  data: ToggleReviewDisplayRequest
): Promise<void> => {
  await api.post(`/api/reviews/${id}/toggle-display`, data);
};
