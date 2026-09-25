"use client";

import { useState } from "react";
import { useContactMessagesAdmin } from "@/features/contactMessages/hooks/useContactMessagesAdmin";
import {
  ContactMessageType,
  type ContactMessageAdminItem,
} from "@/features/contactMessages/types";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/providers/ToastProvider";
import { LANGUAGE_DATE_LOCALE } from "@/locales";
import { PAGE_SIZE } from "@/components/admin/messages/messagesConfig";

/** Contact-messages inbox: filters, paging and the mark-handled action. */
export function useAdminMessages() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  const typeOptions = [
    { value: "", label: t("admin.messages.filters.allTypes") },
    {
      value: String(ContactMessageType.ExternalVendorReferral),
      label: t("admin.messages.types.externalVendor"),
    },
    {
      value: String(ContactMessageType.VendorApplication),
      label: t("admin.messages.types.vendorApplication"),
    },
    {
      value: String(ContactMessageType.VendorCategoryRequest),
      label: t("admin.messages.types.categoryRequest"),
    },
  ];

  const handledOptions = [
    { value: "", label: t("admin.messages.filters.allStatuses") },
    { value: "false", label: t("admin.messages.filters.unhandled") },
    { value: "true", label: t("admin.messages.filters.handled") },
  ];

  const [type, setType] = useState("");
  const [isHandled, setIsHandled] = useState("");
  const [page, setPage] = useState(1);

  const {
    items,
    totalCount,
    totalPages,
    loading,
    error,
    handlingId,
    markHandled,
    refetch,
  } = useContactMessagesAdmin({
    type: type ? (Number(type) as ContactMessageType) : undefined,
    isHandled: isHandled ? isHandled === "true" : undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const showMessage = (type: "success" | "error", text: string) => {
    toast(text, type);
  };

  const handleMarkHandled = async (item: ContactMessageAdminItem) => {
    const ok = await markHandled(item.id);

    showMessage(
      ok ? "success" : "error",
      ok
        ? t("admin.messages.messages.markedHandled")
        : t("admin.messages.messages.markFailed"),
    );
  };

  const resetToFirstPage =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setPage(1);
    };

  return {
    dateLocale,
    typeOptions,
    handledOptions,
    type,
    setType,
    isHandled,
    setIsHandled,
    page,
    setPage,
    showMessage,
    handleMarkHandled,
    resetToFirstPage,
    toast,
    items,
    totalCount,
    totalPages,
    loading,
    error,
    handlingId,
    markHandled,
    refetch,
  };
}

export type AdminMessagesState = ReturnType<typeof useAdminMessages>;
