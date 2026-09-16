import api from "@/lib/axios";

import type {
  GetModerationQueueParams,
  ModerationDashboardSummary,
  ModerationQueueItem,
} from "@/types/moderation";

export const getModerationQueue = async (
  params?: GetModerationQueueParams
): Promise<ModerationQueueItem[]> => {
  const response = await api.get<ModerationQueueItem[]>(
    "/api/moderation/queue",
    { params }
  );

  return response.data;
};

export const getModerationDashboard = async (): Promise<ModerationDashboardSummary> => {
  const response = await api.get<ModerationDashboardSummary>(
    "/api/moderation/dashboard"
  );

  return response.data;
};
