"use client";

import { AlertCircle, Check, Inbox, Loader2, Mail, Phone } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import {
  MessageActions,
  MessageDetails,
} from "@/components/admin/messages/MessageDetails";
import { typeMeta } from "@/components/admin/messages/messagesConfig";

import type { AdminMessagesState } from "./useAdminMessages";

/** Loading / error / empty states and the message cards. */
export function MessagesList({ inbox }: { inbox: AdminMessagesState }) {
  const { t, language } = useLanguage();
  const {
    dateLocale,
    handleMarkHandled,
    items,
    loading,
    error,
    handlingId,
    refetch,
  } = inbox;

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={26} className="animate-spin text-[#ae7b40]" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 py-16 text-center">
          <AlertCircle size={24} className="text-red-500" />
          <p className="text-sm text-red-600">
            {t("admin.messages.messages.loadFailed")}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            {t("admin.messages.retry")}
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#e4dbd0] bg-[#faf7f4] py-16 text-center">
          <Inbox size={26} className="text-[#c2b6ac]" />
          <p className="text-sm text-[#8a7d75]">{t("admin.messages.empty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const meta = typeMeta[item.type];
            const Icon = meta?.icon ?? Mail;
            const isActing = handlingId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[#eee7e1] bg-white p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        meta?.className ?? "bg-[#f4eee9] text-[#766d67]"
                      }`}
                    >
                      <Icon size={16} />
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#30251f]">
                          {item.senderName || t("admin.messages.unknownSender")}
                        </p>

                        <span className="rounded-full bg-[#f4eee9] px-2 py-0.5 text-[10px] font-medium text-[#766d67]">
                          {meta
                            ? t(meta.labelKey)
                            : t("admin.messages.types.unknown")}
                        </span>

                        {!item.isHandled && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            {t("admin.messages.filters.unhandled")}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9b8f86]">
                        {item.senderEmail && (
                          <span className="inline-flex items-center gap-1">
                            <Mail size={11} /> {item.senderEmail}
                          </span>
                        )}
                        {item.senderPhone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone size={11} /> {item.senderPhone}
                          </span>
                        )}
                        <span>
                          {formatDateTime(item.createdAt, dateLocale)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!item.isHandled && (
                    <button
                      type="button"
                      disabled={isActing}
                      onClick={() => handleMarkHandled(item)}
                      className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {isActing ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Check size={13} />
                      )}
                      {t("admin.messages.markHandled")}
                    </button>
                  )}
                </div>

                <div className="mt-3 rounded-xl bg-[#faf7f4] p-3">
                  <MessageDetails item={item} language={language} t={t} />
                </div>

                <MessageActions item={item} t={t} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
