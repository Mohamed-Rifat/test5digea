"use client";

import { useState } from "react";
import { Bell, CheckCheck, ChevronLeft, ChevronRight, Info, MessageSquareText, ShieldCheck, ShieldX, Sparkles, XCircle } from "lucide-react";

import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { formatDate } from "@/lib/format";
import { NotificationType } from "@/types/notification";

const PAGE_SIZE = 15;

const typeMeta: Record<
  NotificationType,
  { icon: typeof Bell; label: string; className: string }
> = {
  [NotificationType.VendorApproved]: {
    icon: ShieldCheck,
    label: "Vendor approved",
    className: "bg-emerald-50 text-emerald-600",
  },
  [NotificationType.VendorRejected]: {
    icon: ShieldX,
    label: "Vendor rejected",
    className: "bg-red-50 text-red-500",
  },
  [NotificationType.ServiceApproved]: {
    icon: ShieldCheck,
    label: "Service approved",
    className: "bg-emerald-50 text-emerald-600",
  },
  [NotificationType.ServiceRejected]: {
    icon: XCircle,
    label: "Service rejected",
    className: "bg-red-50 text-red-500",
  },
  [NotificationType.NewReview]: {
    icon: MessageSquareText,
    label: "New review",
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },
  [NotificationType.System]: {
    icon: Sparkles,
    label: "System",
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },
};

interface NotificationsPageContentProps {
  title?: string;
}

export default function NotificationsPageContent({
  title = "Notifications",
}: NotificationsPageContentProps) {
  const [page, setPage] = useState(1);

  const {
    notifications,
    totalCount,
    totalPages,
    loading,
    error,
    actionLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ page, pageSize: PAGE_SIZE });

  const unreadOnPage = notifications.some((n) => !n.isRead);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
            {title}
          </h1>

          {totalCount > 0 && (
            <p className="mt-1 text-sm text-[#9b8f86]">
              {totalCount} total
            </p>
          )}
        </div>

        {unreadOnPage && (
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={actionLoading === "all"}
            className="flex shrink-0 items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition hover:border-[#b99a62] hover:bg-[#faf7f4] disabled:opacity-50"
          >
            <CheckCheck size={14} />
            Mark all as read
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#dfd2c5] bg-white px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4eee9]">
            <Bell size={22} className="text-[#b99a62]" />
          </div>

          <p className="text-sm font-medium text-[#30251f]">
            No notifications yet
          </p>

          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-[#9b8f86]">
            You&apos;ll see updates about approvals, reviews and
            other activity here.
          </p>
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <>
          <div className="space-y-2.5">
            {notifications.map((notification) => {
              const meta = typeMeta[notification.type] ?? {
                icon: Info,
                label: "Update",
                className: "bg-[#f0e9e0] text-[#a47e43]",
              };

              const Icon = meta.icon;

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    !notification.isRead && markAsRead(notification.id)
                  }
                  className={`flex w-full items-start gap-3 rounded-2xl border border-[#eee7e1] bg-white p-4 text-left transition hover:border-[#dccab8] ${
                    notification.isRead ? "" : "bg-[#faf5ee]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.className}`}
                  >
                    <Icon size={15} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-[#a47e43]">
                      {meta.label}
                    </span>

                    <span className="block text-sm leading-5 text-[#30251f]">
                      {notification.message}
                    </span>

                    <span className="mt-1 block text-xs text-[#9b8f86]">
                      {formatDate(notification.createdAt)}
                    </span>
                  </span>

                  {!notification.isRead && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#a47e43]" />
                  )}
                </button>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4dbd0] text-[#5f544d] transition hover:border-[#b99a62] disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>

              <span className="text-xs text-[#766d67]">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4dbd0] text-[#5f544d] transition hover:border-[#b99a62] disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
