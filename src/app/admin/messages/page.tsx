"use client";

import { MessagesFilters } from "@/components/admin/messages/MessagesFilters";
import { MessagesHeader } from "@/components/admin/messages/MessagesHeader";
import { MessagesList } from "@/components/admin/messages/MessagesList";
import { MessagesPagination } from "@/components/admin/messages/MessagesPagination";
import { useAdminMessages } from "@/components/admin/messages/useAdminMessages";

export default function AdminContactMessagesPage() {
  const inbox = useAdminMessages();

  return (
    <div className="mx-auto">
      <MessagesHeader />
      <MessagesFilters inbox={inbox} />
      <MessagesList inbox={inbox} />
      <MessagesPagination inbox={inbox} />
    </div>
  );
}
