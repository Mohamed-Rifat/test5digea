"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  Info,
  MessageSquareText,
  ShieldCheck,
  ShieldX,
  Sparkles,
  XCircle,
} from "lucide-react";

import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useUnreadCount } from "@/features/notifications/hooks/useUnreadCount";
import { formatDate } from "@/lib/format";
import { NotificationType } from "@/types/notification";
import type { Notification } from "@/types/notification";

const PREVIEW_PAGE_SIZE = 8;

const typeMeta: Record<
  NotificationType,
  { icon: typeof Bell; className: string }
> = {
  [NotificationType.VendorApproved]: {
    icon: ShieldCheck,
    className: "bg-emerald-50 text-emerald-600",
  },
  [NotificationType.VendorRejected]: {
    icon: ShieldX,
    className: "bg-red-50 text-red-500",
  },
  [NotificationType.ServiceApproved]: {
    icon: ShieldCheck,
    className: "bg-emerald-50 text-emerald-600",
  },
  [NotificationType.ServiceRejected]: {
    icon: XCircle,
    className: "bg-red-50 text-red-500",
  },
  [NotificationType.NewReview]: {
    icon: MessageSquareText,
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },
  [NotificationType.System]: {
    icon: Sparkles,
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },
};

function NotificationIcon({ type }: { type: NotificationType }) {
  const meta = typeMeta[type] ?? {
    icon: Info,
    className: "bg-[#f0e9e0] text-[#a47e43]",
  };

  const Icon = meta.icon;

  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.className}`}
    >
      <Icon size={14} />
    </span>
  );
}

interface NotificationBellProps {
  // Where the "View all" link in the dropdown footer points to —
  // /admin/notifications or /vendor/notifications depending on context.
  viewAllHref: string;
}

export default function NotificationBell({
  viewAllHref,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { count: unreadCount, setCount: setUnreadCount } =
    useUnreadCount();

  const {
    notifications,
    loading,
    actionLoading,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useNotifications({ page: 1, pageSize: PREVIEW_PAGE_SIZE });

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleOpen = () => {
    setOpen((prev) => {
      if (!prev) refetch();
      return !prev;
    });
  };

  const handleItemClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setUnreadCount(0);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee5df] text-[#756860] transition hover:bg-[#faf7f4] hover:text-[#30251f] sm:h-10 sm:w-10"
      >
        <Bell size={17} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#c1443a] px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-2xl border border-[#eee5df] bg-white shadow-[0_20px_60px_rgba(48,37,31,0.15)] sm:w-96">
          <div className="flex items-center justify-between border-b border-[#f0e9e4] px-4 py-3">
            <p className="text-sm font-semibold text-[#30251f]">
              Notifications
            </p>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={actionLoading === "all"}
                className="flex items-center gap-1 text-xs font-semibold text-[#a47e43] transition hover:text-[#30251f] disabled:opacity-50"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="space-y-2 p-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-xl bg-[#faf7f4]"
                  />
                ))}
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-[#9b8f86]">
                No notifications yet.
              </p>
            )}

            {!loading &&
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleItemClick(notification)}
                  className={`flex w-full items-start gap-3 border-b border-[#f5f0eb] px-4 py-3 text-left transition hover:bg-[#faf7f4] ${
                    notification.isRead ? "" : "bg-[#faf5ee]"
                  }`}
                >
                  <NotificationIcon type={notification.type} />

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-5 text-[#30251f]">
                      {notification.message}
                    </span>

                    <span className="mt-0.5 block text-[11px] text-[#9b8f86]">
                      {formatDate(notification.createdAt)}
                    </span>
                  </span>

                  {!notification.isRead && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#a47e43]" />
                  )}
                </button>
              ))}
          </div>

          <Link
            href={viewAllHref}
            onClick={() => setOpen(false)}
            className="block border-t border-[#f0e9e4] px-4 py-3 text-center text-xs font-semibold text-[#a47e43] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
