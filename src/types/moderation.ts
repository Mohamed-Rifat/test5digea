// NOTE: same caveat as ReviewStatus in types/review.ts — the backend Swagger
// doc shows numeric enum examples as `1` regardless of what the value
// actually means. These mappings follow the natural order the admin panel
// already manages entities in (Vendors -> Services -> Reviews) and the
// Pending -> Approved/Rejected lifecycle used elsewhere. Confirm with the
// backend team before relying on the exact numbers for anything beyond
// display.
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
