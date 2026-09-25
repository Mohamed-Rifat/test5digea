"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Info,
  Loader2,
  MessageSquarePlus,
  Send,
  Tag,
} from "lucide-react";
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { useLanguage } from "@/context/LanguageContext";
import TextWithSlot from "@/components/shared/TextWithSlot";
import { submitContactMessage } from "@/features/contactMessages/api";
import {
  ContactMessageType,
  encodeMessageDetails,
} from "@/features/contactMessages/types";
import type { Category } from "@/types/category";

// =========================================================
// Category Card - عرض فقط بدون إضافة
// =========================================================

export const CategoryCard = ({
  category,
  isAssigned,
  onRequest,
}: {
  category: Category;
  isAssigned: boolean;
  onRequest: (category: Category) => void;
}) => {
  const { t } = useLanguage();

  return (
    <div
      className={`group relative rounded-xl border p-3 transition-all sm:p-3.5 ${
        isAssigned
          ? "border-emerald-200 bg-emerald-50/50"
          : "border-[#e8dfd8] bg-white hover:border-[#a47e43] hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {isAssigned ? (
              <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
            ) : (
              <Tag size={13} className="shrink-0 text-[#a47e43]" />
            )}
            <h4
              className={`truncate text-xs font-semibold sm:text-sm ${
                isAssigned ? "text-emerald-800" : "text-[#30251f]"
              }`}
            >
              {category.name}
            </h4>
          </div>

          {category.description && (
            <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#9b8f86] sm:text-xs">
              {category.description}
            </p>
          )}
        </div>

        {isAssigned ? (
          <Chip
            label={t("vendor.services.detail.catActive")}
            size="small"
            sx={{
              height: 18,
              fontSize: "8px",
              fontWeight: 600,
              backgroundColor: "#10b981",
              color: "white",
            }}
          />
        ) : (
          <Chip
            label={t("vendor.services.detail.catNotActive")}
            size="small"
            sx={{
              height: 18,
              fontSize: "8px",
              fontWeight: 600,
              backgroundColor: "#f5eee9",
              color: "#a47e43",
            }}
          />
        )}
      </div>

      {/* ✅ عرض زر التواصل بس لو الكاتيجوري مش مفعّلة */}
      {!isAssigned && (
        <button
          type="button"
          onClick={() => onRequest(category)}
          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#e3d9d1] bg-[#faf7f4] px-2 py-1.5 text-[10px] font-medium text-[#665950] transition hover:border-[#a47e43] hover:bg-[#a47e43] hover:text-white sm:gap-2 sm:text-xs"
        >
          <MessageSquarePlus size={11} />
          {t("vendor.services.detail.catNotify")}
        </button>
      )}
    </div>
  );
};

// =========================================================
// Contact Admin Dialog
// =========================================================

export const ContactAdminDialog = ({
  open,
  category,
  vendorName,
  vendorEmail,
  vendorPhone,
  onClose,
  onSuccess,
}: {
  open: boolean;
  category: Category | null;
  vendorName: string;
  vendorEmail?: string;
  vendorPhone?: string;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (category) {
      setMessage(
        t("vendor.services.detail.dialog.defaultMessage", {
          category: category.name,
          vendor: vendorName,
        })
      );
    }
  }, [category, vendorName, t]);

  const handleSend = async () => {
    setSendError("");
    setIsSending(true);

    try {
      await submitContactMessage({
        type: ContactMessageType.VendorCategoryRequest,
        senderName: vendorName,
        senderEmail: vendorEmail || "",
        senderPhone: vendorPhone || "",
        message: encodeMessageDetails({
          categoryId: String(category?.id ?? ""),
          categoryName: category?.name ?? "",
          note: message,
        }),
      });

      setIsSending(false);
      onSuccess?.();
      onClose();
    } catch {
      setSendError(t("vendor.services.detail.dialog.sendFailed"));
      setIsSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            padding: "8px",
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5eee9]">
            <MessageSquarePlus size={18} className="text-[#a47e43]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#30251f] sm:text-lg">
              {t("vendor.services.detail.dialog.title")}
            </h3>
            <p className="mt-0.5 text-xs text-[#9b8f86] sm:text-sm">
              <TextWithSlot
                text={t("vendor.services.detail.dialog.subtitle")}
                token="{bold}"
                slot={<strong className="text-[#30251f]">{category?.name}</strong>}
              />
            </p>
          </div>
        </div>
      </DialogTitle>

      <DialogContent>
        {/* Info Banner */}
        <div className="mb-4 rounded-xl bg-[#fbf6f1] p-3 text-xs text-[#6f625a] sm:text-sm">
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5 shrink-0 text-[#a47e43]" />
            <p className="leading-5">
              <TextWithSlot
                text={t("vendor.services.detail.dialog.info")}
                token="{bold}"
                slot={<strong>{t("vendor.services.detail.dialog.infoBold")}</strong>}
              />
            </p>
          </div>
        </div>

        {/* Category Preview */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Chip
            icon={<Tag size={12} />}
            label={category?.name}
            size="small"
            sx={{
              height: 26,
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "#f5eee9",
              color: "#5f544d",
              "& .MuiChip-icon": { color: "#a47e43" },
            }}
          />
          <Chip
            icon={<Building2 size={12} />}
            label={vendorName}
            size="small"
            sx={{
              height: 26,
              fontSize: "11px",
              fontWeight: 500,
              backgroundColor: "#f5eee9",
              color: "#5f544d",
              "& .MuiChip-icon": { color: "#a47e43" },
            }}
          />
        </div>

        {/* Message */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#40352f] sm:text-sm">
            {t("vendor.services.detail.dialog.yourMessage")}
          </label>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={8}
            fullWidth
            placeholder={t("vendor.services.detail.dialog.messagePlaceholder")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fcfaf8",
                fontSize: "13px",
                "& fieldset": { borderColor: "#e3d9d1" },
                "&:hover fieldset": { borderColor: "#d5c8be" },
                "&.Mui-focused fieldset": { borderColor: "#a47e43", borderWidth: "1px" },
              },
            }}
          />
          <p className="mt-1 text-[10px] text-[#9b8f86] sm:text-xs">
            {t("vendor.services.detail.dialog.messageHint")}
          </p>
        </div>

        {/* Error */}
        {sendError && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-600">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{sendError}</span>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px", gap: 1 }}>
        <button
          type="button"
          onClick={onClose}
          disabled={isSending}
          className="rounded-xl border border-[#e3d9d1] bg-white px-4 py-2.5 text-xs font-medium text-[#514740] transition hover:bg-[#f7f2ef] disabled:opacity-50 sm:text-sm"
        >
          {t("vendor.services.detail.dialog.cancel")}
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={isSending || !message.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#463831] disabled:opacity-60 sm:text-sm"
        >
          {isSending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {t("vendor.services.detail.dialog.sending")}
            </>
          ) : (
            <>
              <Send size={14} />
              {t("vendor.services.detail.dialog.send")}
            </>
          )}
        </button>
      </DialogActions>
    </Dialog>
  );
};

