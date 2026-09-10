
export enum RoadmapItemStatus {
  NotStarted = 1,
  VendorSelected = 2,
  Completed = 3,
}

export interface RoadmapItem {
  id: string;
  categoryId: string;
  categoryName: string;
  selectedVendorId: string | null;
  selectedVendorName: string | null;
  status: RoadmapItemStatus;
}

export interface Roadmap {
  id: string;
  partnerName: string;
  eventDate: string;
  daysUntilEvent: number;
  items: RoadmapItem[];
}

export interface CreateRoadmapRequest {
  partnerName: string;
  eventDate: string;
}

export type CreateRoadmapResponse = string;

export interface UpdateRoadmapRequest {
  partnerName: string;
  eventDate: string;
}

export interface SelectVendorRequest {
  vendorId: string;
}

