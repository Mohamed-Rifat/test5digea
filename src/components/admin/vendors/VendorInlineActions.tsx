"use client";

import type { ReactNode } from "react";
import { Ban, Eye, Loader2, ShieldCheck, UserCheck, UserX } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";

export interface VendorRowActions {
  onViewDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}

export interface VendorRowProps extends VendorRowActions {
  vendor: Vendor;
  loading: boolean;
}

/** View / approve / reject / (de)activate buttons for one vendor. */
export default function VendorInlineActions({
  vendor,
  loading,
  onViewDetails,
  onApprove,
  onReject,
  onActivate,
  onDeactivate,
}: VendorRowProps) {
  const { t } = useLanguage();

  const isPending = vendor.status === "Pending";
  const isApproved = vendor.status === "Approved";
  const isInactive = vendor.status === "Inactive";

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <ActionButton
        icon={<Eye size={14} />}
        label={t('admin.vendors.view')}
        onClick={onViewDetails}
        disabled={loading}
        variant="neutral"
      />

      {isPending && (
        <>
          <ActionButton
            icon={
              loading ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <ShieldCheck size={14} />
              )
            }
            label={t('admin.vendors.approve')}
            onClick={onApprove}
            disabled={loading}
            variant="approve"
          />

          <ActionButton
            icon={<UserX size={14} />}
            label={t('admin.vendors.reject')}
            onClick={onReject}
            disabled={loading}
            variant="reject"
          />
        </>
      )}

      {isInactive && (
        <ActionButton
          icon={
            loading ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <UserCheck size={14} />
            )
          }
          label={t('admin.vendors.activate')}
          onClick={onActivate}
          disabled={loading}
          variant="approve"
        />
      )}

      {isApproved && (
        <ActionButton
          icon={
            loading ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <Ban size={14} />
            )
          }
          label={t('admin.vendors.deactivate')}
          onClick={onDeactivate}
          disabled={loading}
          variant="danger"
        />
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  variant,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant:
    | "neutral"
    | "approve"
    | "reject"
    | "danger";
}) {
  const variants = {
    neutral:
      "border-[#ddd4ce] bg-white text-[#4f4540] hover:border-[#c9beb5] hover:bg-[#f6f2ef]",

    approve:
      "bg-emerald-600 text-white shadow-[0_5px_14px_-6px_rgba(5,150,105,0.55)] hover:bg-emerald-700",

    reject:
      "bg-red-600 text-white shadow-[0_5px_14px_-6px_rgba(220,38,38,0.55)] hover:bg-red-700",

    danger:
      "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[10px] font-bold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
