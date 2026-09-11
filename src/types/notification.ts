// NOTE: same caveat as ReviewStatus in types/review.ts — the backend Swagger
// doc shows numeric enum examples as `1` regardless of what the value
// actually means, so this mapping is a best guess. It only really matters
// for choosing which icon to show; the notification's own `message` text is
// always displayed regardless, so a wrong guess here is cosmetic, not
// functionally broken.
export enum NotificationType {
  VendorApproved = 1,
  VendorRejected = 2,
  ServiceApproved = 3,
  ServiceRejected = 4,
  NewReview = 5,
  System = 6,
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  relatedEntityId: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedNotifications {
  items: Notification[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
}
