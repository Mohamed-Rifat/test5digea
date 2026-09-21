import api from "@/lib/axios";

import type {
  GetNotificationsParams,
  PaginatedNotifications,
} from "@/types/notification";

export const getNotifications = async (
  params?: GetNotificationsParams
): Promise<PaginatedNotifications> => {
  const response = await api.get<PaginatedNotifications>(
    "/api/notifications",
    { params }
  );

  return response.data;
};

export const getUnreadNotificationsCount = async (): Promise<number> => {
  const response = await api.get<number>(
    "/api/notifications/unread-count"
  );

  return response.data;
};

export const markNotificationRead = async (
  id: string
): Promise<void> => {
  await api.post(`/api/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.post("/api/notifications/read-all");
};
