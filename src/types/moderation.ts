export enum ModerationEntityType {
  Vendor = 1,
  Service = 2,
  Review = 3,
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
  pendingReviews: number;
  recentRequests: ModerationQueueItem[];
}
