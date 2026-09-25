"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, X, HeartHandshake } from "lucide-react";
import { RequiredLabel, TextField } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";

export function ExternalVendorModal({
  categoryName,
  mode = "complete",
  submitting,
  onSkip,
  onSubmit,
  onClose,
}: {
  categoryName: string;
  /** "complete": step not done yet. "share": step already done, only send details. */
  mode?: "complete" | "share";
  submitting: boolean;
  onSkip: () => void;
  onSubmit: (data: { vendorName: string; phone: string; link: string }) => void;
  onClose: () => void;
}) {
  const { t, localize } = useLanguage();
  const [vendorName, setVendorName] = useState("");
  const [phone, setPhone] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const handleSend = () => {
    const next: { name?: string; contact?: string } = {};
    if (!vendorName.trim()) next.name = t("roadmap.external.nameRequired");
    if (!phone.trim() && !link.trim())
      next.contact = t("roadmap.external.contactRequired");
    setErrors(next);
    if (next.name || next.contact) return;
    onSubmit({
      vendorName: vendorName.trim(),
      phone: phone.trim(),
      link: link.trim(),
    });
  };

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <button
        type="button"
        tabIndex={-1}
        aria-label={t("common.close")}
        onClick={() => !submitting && onClose()}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="external-vendor-title"
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white shadow-2xl animate-dialog-in"
      >
        <div className="relative overflow-hidden bg-[#30221d] px-6 py-7 text-center">
          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#d49b5b]/15 blur-3xl" />
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label={t("common.close")}
            className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
          <div className="relative">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#dfb67b]/30 bg-[#dfb67b]/10">
              <HeartHandshake
                size={24}
                className="text-[#d9a363]"
                aria-hidden="true"
              />
            </span>
            <h3
              id="external-vendor-title"
              className="mt-4 text-xl font-bold text-white"
            >
              {mode === "share"
                ? t("roadmap.external.shareTitle")
                : t("roadmap.external.title")}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/70">
              {mode === "share"
                ? t("roadmap.external.shareBody", { category: localize(categoryName) })
                : t("roadmap.external.body", { category: localize(categoryName) })}
            </p>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <TextField
            id="external-vendor-name"
            label={<RequiredLabel text={t("roadmap.external.nameLabel")} />}
            value={vendorName}
            onChange={(e) => {
              setVendorName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            placeholder={t("roadmap.external.namePlaceholder")}
            error={errors.name}
          />

          <fieldset className="rounded-2xl border border-[#efe7df] p-4">
            <legend className="px-1 text-xs font-semibold text-[#8b7e76]">
              {t("roadmap.external.orLabel")}{" "}
              <span className="text-red-500">*</span>
            </legend>
            <div className="space-y-5 pt-2">
              <TextField
                id="external-vendor-phone"
                type="tel"
                inputMode="tel"
                label={t("roadmap.external.phoneLabel")}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.contact) setErrors((p) => ({ ...p, contact: undefined }));
                }}
                placeholder="+20 1xx xxx xxxx"
                tone={errors.contact ? "error" : "default"}
              />
              <TextField
                id="external-vendor-link"
                type="url"
                inputMode="url"
                label={t("roadmap.external.linkLabel")}
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  if (errors.contact) setErrors((p) => ({ ...p, contact: undefined }));
                }}
                placeholder="https://instagram.com/..."
                tone={errors.contact ? "error" : "default"}
              />
            </div>
            {errors.contact && (
              <span role="alert" className="mt-2 block text-xs text-red-600">
                {errors.contact}
              </span>
            )}
          </fieldset>

          <p className="flex items-start gap-2 rounded-xl bg-[#fdf6ec] px-3.5 py-3 text-xs leading-relaxed text-[#8c6a3c]">
            <Sparkles
              size={14}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            {t("roadmap.external.helper")}
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSend}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#30221d] px-5 text-sm font-semibold text-white transition hover:bg-[#46332a] disabled:opacity-60"
            >
              {submitting && (
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              )}
              {mode === "share"
                ? t("roadmap.external.sendOnly")
                : t("roadmap.external.sendAndComplete")}
            </button>
            <button
              type="button"
              onClick={mode === "share" ? onClose : onSkip}
              disabled={submitting}
              className="h-11 rounded-xl border border-[#e3d9d1] px-5 text-sm font-semibold text-[#766a62] transition hover:bg-[#f8f4f0] disabled:opacity-60"
            >
              {mode === "share"
                ? t("roadmap.external.later")
                : t("roadmap.external.skipAndComplete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
