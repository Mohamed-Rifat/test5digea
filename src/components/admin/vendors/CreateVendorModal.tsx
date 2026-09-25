"use client";

import type { ChangeEvent, FormEvent } from "react";
import { Loader2, Plus, Store } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { PasswordField, TextField } from "@/components/ui";
import { CloseButton, InlineError, ModalOverlay } from "./VendorModal";

export interface CreateVendorForm {
  email: string;
  password: string;
  fullName: string;
  businessName: string;
}

export const EMPTY_CREATE_FORM: CreateVendorForm = {
  email: "",
  password: "",
  fullName: "",
  businessName: "",
};

interface CreateVendorModalProps {
  form: CreateVendorForm;
  onChange: (form: CreateVendorForm) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  loading: boolean;
  error?: string;
}

export default function CreateVendorModal({
  form,
  onChange,
  onSubmit,
  onClose,
  loading,
  error,
}: CreateVendorModalProps) {
  const { t } = useLanguage();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <ModalOverlay onClose={() => !loading && onClose()}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-[28px] border border-[#e7dfda] bg-white shadow-[0_30px_90px_rgba(48,37,31,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden border-b border-[#eee8e4] px-5 py-5 sm:px-6">
          <div className="absolute right-[-50px] top-[-70px] h-40 w-40 rounded-full bg-[#f5eee9] blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3efec] text-[#846e60]">
                <Store size={19} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b7b67]">
                  {t('admin.vendors.newAccount')}
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#30251f]">
                  {t('admin.vendors.add')}
                </h2>

                <p className="mt-1 text-sm leading-5 text-[#766b65]">
                  {t('admin.vendors.createDesc')}
                </p>
              </div>
            </div>

            <CloseButton disabled={loading} onClick={onClose} />
          </div>
        </div>


        <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="fullName"
              name="fullName"
              label={t("admin.vendors.fullName")}
              value={form.fullName}
              onChange={handleChange}
              placeholder={t("admin.vendors.fullNamePlaceholder")}
              disabled={loading}
            />
            <TextField
              id="businessName"
              name="businessName"
              label={t("admin.vendors.businessName")}
              value={form.businessName}
              onChange={handleChange}
              placeholder={t("admin.vendors.businessNamePlaceholder")}
              disabled={loading}
            />
          </div>

          <TextField
            id="email"
            name="email"
            type="email"
            label={t("admin.vendors.email")}
            value={form.email}
            onChange={handleChange}
            placeholder="vendor@example.com"
            disabled={loading}
          />

          <PasswordField
            id="password"
            name="password"
            label={t("admin.vendors.password")}
            value={form.password}
            onChange={handleChange}
            placeholder={t("admin.vendors.passwordPlaceholder")}
            autoComplete="new-password"
            disabled={loading}
          />

          {error && <InlineError message={error} />}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="h-12 flex-1 rounded-2xl border border-[#ddd4ce] bg-white px-4 text-sm font-semibold text-[#5f544e] transition hover:bg-[#f8f5f3] disabled:opacity-50"
            >
              {t('admin.vendors.cancel')}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#30251f] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(48,37,31,0.55)] transition hover:bg-[#45362e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  {t('admin.vendors.creating')}
                </>
              ) : (
                <>
                  <Plus size={17} />
                  {t('admin.vendors.createTitle')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}
