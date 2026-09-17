export enum ModerationEntityType {
  Vendor = 1,
  Service = 2,
  Review = 3,
  ServiceImage = 4,
}

export enum ModerationStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

export interface ModerationQueueItem {
  entityId: string;
  entityType: ModerationEntityType;
  title: string;
  vendorId: string;
  vendorBusinessName: string;
  submittedAt: string;
  status: ModerationStatus;
  // Only populated for entityType === ServiceImage: the service the image
  // belongs to, and the image itself so the queue can render a thumbnail
  // and act on it directly (approve/reject) without navigating away.
  serviceId?: string;
  imageUrl?: string;
}

export interface GetModerationQueueParams {
  vendorId?: string;
  entityType?: ModerationEntityType;
  status?: ModerationStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface ModerationDashboardSummary {
  totalUsers: number;
  totalVendors: number;
  activeVendors: number;
  pendingVendorRequests: number;
  totalServices: number;
  pendingServiceRequests: number;
  pendingReviews: number;
  recentRequests: ModerationQueueItem[];
}
