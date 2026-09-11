import api from "@/lib/axios";

import type {
  GetModerationQueueParams,
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
