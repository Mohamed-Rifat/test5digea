import api from "@/lib/axios";

import type {
  ContactMessageRequest,
  GetContactMessagesParams,
  PagedContactMessages,
} from "./types";

// Public — used by all three forms (roadmap, become-a-vendor,
// vendor category request). Anonymous when there's no signed-in
// user; the axios instance attaches a bearer token automatically
// when one exists, which is how the backend can resolve a
// category-request message back to the requesting vendor.
export const submitContactMessage = async (
  data: ContactMessageRequest
): Promise<string> => {
  const response = await api.post<string>("/api/contact-messages", data);
  return response.data;
};

// Admin inbox — list with filters + pagination.
export const getContactMessagesAdmin = async (
  params: GetContactMessagesParams = {}
): Promise<PagedContactMessages> => {
  const response = await api.get<PagedContactMessages>(
    "/api/contact-messages/admin",
    { params }
  );
  return response.data;
};

export const markContactMessageHandled = async (
  id: string
): Promise<void> => {
  await api.patch(`/api/contact-messages/admin/${id}/handled`);
};
