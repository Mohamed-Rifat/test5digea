"use client";

import Link from "next/link";
import { FormEvent, use, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Sparkles,
  BriefcaseBusiness,
  FileText,
  DollarSign,
  Tag,
  Clock3,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Package,
  Lock,
  Send,
  Search,
  MessageSquarePlus,
  Building2,
  Mail,
  Phone,
  Shield,
} from "lucide-react";

import {
  Tooltip,
  Badge,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import type { CreateServicePriceRequest, Service } from "@/types/service";

interface PageProps {
  params: Promise<{ id: string }>;
}

// =========================================================
// Status Config
// =========================================================

const getStatusConfig = (status: string) => {
  const configs: Record<string, { label: string; icon: React.ElementType; className: string; dot: string }> = {
    Approved: {
      label: "Approved",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    Pending: {
      label: "Pending Review",
      icon: Clock3,
      className: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    Rejected: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
    Inactive: {
      label: "Inactive",
      icon: XCircle,
      className: "bg-gray-100 text-gray-600 border-gray-200",
      dot: "bg-gray-500",
    },
  };
  return configs[status] || configs.Pending;
};

// =========================================================
// Category Card - عرض فقط بدون إضافة
// =========================================================

const CategoryCard = ({
  category,
  isAssigned,
  onRequest,
}: {
  category: any;
  isAssigned: boolean;
  onRequest: (category: any) => void;
}) => {
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
            label="Active"
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
            label="Not Active"
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
          I offer this service — Notify Admin
        </button>
      )}
    </div>
  );
};

// =========================================================
// Contact Admin Dialog
// =========================================================

const ContactAdminDialog = ({
  open,
  category,
  vendorName,
  onClose,
  onSuccess,
}: {
  open: boolean;
  category: any;
  vendorName: string;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (category) {
      setMessage(
        `Hello 5digea Support Team,\n\nI noticed that the "${category.name}" category is available on the platform but not assigned to my business account.\n\nI actually offer services in this category and would like to have it added to my profile so I can list my services.\n\nBusiness Name: ${vendorName}\nCategory: ${category.name}\n\nPlease review my request and let me know the next steps.\n\nThank you.`
      );
    }
  }, [category, vendorName]);

  const handleSend = async () => {
    setSendError("");
    setIsSending(true);

    try {
      // ✅ هنا هتحط الـ API call الفعلي
      // await sendCategoryRequest({
      //   categoryId: category.id,
      //   categoryName: category.name,
      //   message,
      //   vendorId: vendor?.id,
      // });

      // مؤقتاً
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setIsSending(false);
      onSuccess?.();
      onClose();
    } catch (err) {
      setSendError("Failed to send your request. Please try again.");
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
              Notify Admin About This Category
            </h3>
            <p className="mt-0.5 text-xs text-[#9b8f86] sm:text-sm">
              Let the team know you offer services in{" "}
              <strong className="text-[#30251f]">{category?.name}</strong>
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
              Our team will review your message and get back to you within{" "}
              <strong>2 business days</strong>. If approved, this category will
              be added to your account and you&apos;ll be able to create
              services under it.
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
            Your Message
          </label>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={8}
            fullWidth
            placeholder="Explain your request..."
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
            Feel free to customize the message with additional details about your services.
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
          Cancel
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
              Sending...
            </>
          ) : (
            <>
              <Send size={14} />
              Send to Admin
            </>
          )}
        </button>
      </DialogActions>
    </Dialog>
  );
};

// =========================================================
// Main Page
// =========================================================

export default function EditVendorServicePage({ params }: PageProps) {
  const { id } = use(params);

  const {
    services,
    loading,
    actionLoading,
    actionError,
    update,
    updatePrices,
    resubmit,
  } = useVendorServices();

  const { categories, loading: categoriesLoading } = useCategories();
  const { vendor } = useVendor();

  const service: Service | undefined = services.find((s) => s.id === id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prices, setPrices] = useState<CreateServicePriceRequest[]>([]);

  const [detailsSuccess, setDetailsSuccess] = useState(false);
  const [pricesSuccess, setPricesSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const [categorySearch, setCategorySearch] = useState("");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setPrices(
        service.prices.map((price) => ({
          label: price.label,
          price: price.price,
        }))
      );
    }
  }, [service]);

  const isSavingDetails = actionLoading === `update-${id}`;
  const isSavingPrices = actionLoading === `prices-${id}`;
  const isResubmitting = actionLoading === `resubmit-${id}`;

  // =======================================================
  // Categories
  // =======================================================

  const assignedCategoryNames = useMemo(
    () => new Set(vendor?.categories || []),
    [vendor]
  );

  const filteredCategories = useMemo(() => {
    const activeCategories = categories.filter((c) => c.isActive);

    if (!categorySearch.trim()) return activeCategories;

    const query = categorySearch.toLowerCase();
    return activeCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
    );
  }, [categories, categorySearch]);

  const assignedCount = useMemo(
    () => filteredCategories.filter((c) => assignedCategoryNames.has(c.name)).length,
    [filteredCategories, assignedCategoryNames]
  );

  // =======================================================
  // Handlers
  // =======================================================

  const addPriceRow = () => {
    setPrices((prev) => [...prev, { label: "", price: 0 }]);
  };

  const removePriceRow = (index: number) => {
    setPrices((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePriceRow = (
    index: number,
    field: "label" | "price",
    value: string
  ) => {
    setPrices((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: field === "price" ? Number(value) || 0 : value,
            }
          : row
      )
    );
  };

  const handleSaveDetails = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    setDetailsSuccess(false);

    if (!name.trim() || !description.trim()) {
      setFormError("Please fill in the service name and description.");
      return;
    }

    const success = await update(id, {
      name: name.trim(),
      description: description.trim(),
    });

    setDetailsSuccess(success);
  };

  const handleSavePrices = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    setPricesSuccess(false);

    const validPrices = prices.filter(
      (price) => price.label.trim() !== "" && price.price >= 0
    );

    if (validPrices.length === 0) {
      setFormError("Please keep at least one valid price option.");
      return;
    }

    const success = await updatePrices(id, { prices: validPrices });
    setPricesSuccess(success);
  };

  const handleResubmit = async () => {
    await resubmit(id);
  };

  const handleContactAdmin = (category: any) => {
    setSelectedCategory(category);
    setContactDialogOpen(true);
  };

  const handleContactSuccess = () => {
    setToastMessage("Your request has been sent to the admin team.");
    setTimeout(() => setToastMessage(""), 4000);
  };

  // =======================================================
  // Loading State
  // =======================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f6]">
        <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-40 rounded bg-[#e9e1db]" />
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="h-64 rounded-3xl bg-white shadow-sm" />
                <div className="h-64 rounded-3xl bg-white shadow-sm" />
              </div>
              <div className="h-96 rounded-3xl bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =======================================================
  // Not Found
  // =======================================================

  if (!service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#e8dfd8] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-[#30251f]">
            Service not found
          </h1>
          <p className="mt-2 text-sm text-[#756b65]">
            This service does not exist or does not belong to your account.
          </p>
          <Link
            href="/vendor/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#463831]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </Link>
        </div>
      </main>
    );
  }

  const status = getStatusConfig(service.status);
  const StatusIcon = status.icon;

  // =======================================================
  // Render
  // =======================================================

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">

        {/* =================================================
            Toast Notification
        ================================================= */}

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#30251f]">Request Sent</p>
                <p className="text-xs text-[#9b8f86]">{toastMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}
        <Link
          href="/vendor/services"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#756b65] transition hover:text-[#30251f] sm:mb-6 sm:gap-2 sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to services
        </Link>

        {/* =================================================
            Header
        ================================================= */}

        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b8171] sm:mb-2 sm:text-xs">
                <Sparkles size={11} className="sm:h-3.25 sm:w-3.25" />
                Edit Service
              </p>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                  <BriefcaseBusiness size={16} className="text-[#a47e43] sm:h-5 sm:w-5" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-xl font-semibold tracking-tight text-[#30251f] sm:text-2xl lg:text-3xl">
                    {service.name}
                  </h1>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-3">
                <Chip
                  icon={<Tag size={12} />}
                  label={service.categoryName}
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

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs ${status.className}`}
                >
                  <StatusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {status.label}
                </span>
              </div>
            </div>

            {service.status === "Rejected" && (
              <button
                type="button"
                onClick={handleResubmit}
                disabled={isResubmitting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-xs font-medium text-[#514740] transition hover:bg-[#f7f2ef] disabled:opacity-60 sm:h-11 sm:px-5 sm:text-sm"
              >
                {isResubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
                Resubmit for Review
              </button>
            )}
          </div>
        </header>

        {/* =================================================
            Alerts
        ================================================= */}

        {service.status === "Rejected" && service.rejectionReason && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:mb-6">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            <div>
              <p className="font-semibold">Rejection reason</p>
              <p className="mt-1 leading-5 text-red-600">{service.rejectionReason}</p>
            </div>
          </div>
        )}

        {(formError || actionError) && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:mb-6">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            <span className="leading-5">{formError || actionError}</span>
          </div>
        )}

        {/* =================================================
            Main Grid
        ================================================= */}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* LEFT: Forms */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            {/* Service Details Form */}
            <form
              onSubmit={handleSaveDetails}
              className="rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6 lg:p-8"
            >
              <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
                  <FileText size={14} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                    Service Details
                  </h2>
                  <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                    Name and description visible to customers
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#40352f] sm:mb-2 sm:text-sm">
                    Service Name <span className="text-red-500">*</span>
                  </label>
                  <TextField
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Wedding Photography Package"
                    fullWidth
                    size="small"
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
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#40352f] sm:mb-2 sm:text-sm">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <TextField
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    multiline
                    rows={5}
                    placeholder="Describe what's included in this service..."
                    fullWidth
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
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-[#eee7e2] pt-4 sm:mt-6 sm:flex-row sm:items-center sm:gap-3 sm:pt-6">
                <button
                  type="submit"
                  disabled={isSavingDetails}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 text-xs font-medium text-white transition hover:bg-[#463831] disabled:opacity-60 sm:h-11 sm:px-6 sm:text-sm"
                >
                  {isSavingDetails ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Save Details
                    </>
                  )}
                </button>

                {detailsSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 sm:text-sm">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Saved successfully
                  </span>
                )}
              </div>
            </form>

            {/* Pricing Form */}
            <form
              onSubmit={handleSavePrices}
              className="rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6 lg:p-8"
            >
              <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
                    <DollarSign size={14} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                      Pricing Options
                    </h2>
                    <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                      Add multiple packages or tiers
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addPriceRow}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#604b3e] transition hover:bg-[#f5eee9] hover:text-[#30251f] sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Add Price
                </button>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {prices.map((price, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 rounded-xl border border-[#f0eae5] bg-[#fcfaf8] p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-3.5"
                  >
                    <div className="flex-1">
                      <TextField
                        type="text"
                        value={price.label}
                        onChange={(event) =>
                          updatePriceRow(index, "label", event.target.value)
                        }
                        placeholder="Label (e.g. Basic Package)"
                        size="small"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            backgroundColor: "white",
                            fontSize: "12px",
                            "& fieldset": { borderColor: "#e3d9d1" },
                            "&:hover fieldset": { borderColor: "#d5c8be" },
                            "&.Mui-focused fieldset": { borderColor: "#a47e43", borderWidth: "1px" },
                          },
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-full sm:w-32">
                        <TextField
                          type="number"
                          value={price.price}
                          onChange={(event) =>
                            updatePriceRow(index, "price", event.target.value)
                          }
                          placeholder="Price"
                          size="small"
                          fullWidth
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <span className="text-[#9b8f86]">$</span>
                                </InputAdornment>
                              ),
                              inputProps: {
                                min: 0,
                                step: "0.01",
                              },
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              backgroundColor: "white",
                              fontSize: "12px",
                              "& fieldset": { borderColor: "#e3d9d1" },
                              "&:hover fieldset": { borderColor: "#d5c8be" },
                              "&.Mui-focused fieldset": { borderColor: "#a47e43", borderWidth: "1px" },
                            },
                          }}
                        />
                      </div>

                      {prices.length > 1 && (
                        <Tooltip title="Remove this price option" arrow>
                          <button
                            type="button"
                            onClick={() => removePriceRow(index)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e3d9d1] text-[#9a5555] transition hover:bg-red-50 hover:border-red-200 sm:h-11 sm:w-11"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-[#eee7e2] pt-4 sm:mt-6 sm:flex-row sm:items-center sm:gap-3 sm:pt-6">
                <button
                  type="submit"
                  disabled={isSavingPrices}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 text-xs font-medium text-white transition hover:bg-[#463831] disabled:opacity-60 sm:h-11 sm:px-6 sm:text-sm"
                >
                  {isSavingPrices ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Save Prices
                    </>
                  )}
                </button>

                {pricesSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 sm:text-sm">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Saved successfully
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT: Available Categories (عرض فقط) */}
          <aside className="space-y-4 lg:sticky lg:top-4 lg:h-fit">
            <div className="rounded-3xl border border-[#e8dfd8] bg-white shadow-sm">
              {/* Header */}
              <div className="border-b border-[#f0eae5] p-4 sm:p-5">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                    <Package size={16} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                      Available Categories
                    </h2>
                    <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                      Services available on 5digea
                    </p>
                  </div>

                  <Badge
                    badgeContent={filteredCategories.length}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#a47e43",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 600,
                        height: 20,
                        minWidth: 20,
                      },
                    }}
                  >
                    <span className="h-2 w-2" />
                  </Badge>
                </div>

                {/* Search */}
                <div className="mt-3">
                  <TextField
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories..."
                    size="small"
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={14} className="text-[#9b8f86]" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 38,
                        borderRadius: "10px",
                        backgroundColor: "#fcfaf8",
                        fontSize: "12px",
                        "& fieldset": { borderColor: "#e3d9d1" },
                        "&:hover fieldset": { borderColor: "#d5c8be" },
                        "&.Mui-focused fieldset": { borderColor: "#a47e43", borderWidth: "1px" },
                      },
                    }}
                  />
                </div>

                {/* Stats */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-[#9b8f86] sm:text-xs">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    <span className="font-medium text-emerald-700">{assignedCount}</span> active
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Lock size={11} className="text-[#a47e43]" />
                    <span className="font-medium text-[#a47e43]">
                      {filteredCategories.length - assignedCount}
                    </span> available
                  </span>
                </div>
              </div>

              {/* Category List */}
              <div className="max-h-150 overflow-y-auto p-3 sm:p-4">
                {categoriesLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 animate-pulse rounded-xl bg-[#f5f1ee]"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="py-8 text-center">
                    <Search className="mx-auto h-8 w-8 text-[#d5c8be]" />
                    <p className="mt-3 text-xs text-[#9b8f86]">
                      No categories found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCategories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        isAssigned={assignedCategoryNames.has(category.name)}
                        onRequest={handleContactAdmin}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[#f0eae5] p-3 sm:p-4">
                <div className="flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-2.5 text-[10px] text-[#6f625a] sm:p-3 sm:text-xs">
                  <Info size={12} className="mt-0.5 shrink-0 text-[#a47e43] sm:h-3.5 sm:w-3.5" />
                  <p className="leading-4 sm:leading-5">
                    Do you offer services in a category that&apos;s not active on
                    your account? Click{" "}
                    <strong className="text-[#a47e43]">Notify Admin</strong> to
                    request adding it.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support Card */}
            <div className="rounded-3xl border border-[#e8dfd8] bg-linear-to-br from-[#fbf6f1] to-[#f5ede5] p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm sm:h-10 sm:w-10">
                  <HelpCircle size={16} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#30251f] sm:text-base">
                    Need Help?
                  </h3>
                  <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                    Contact our support team
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <a
                  href="mailto:support@5digea.com"
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#5f544d] transition hover:bg-[#f5eee9] sm:text-sm"
                >
                  <Mail size={13} className="text-[#a47e43]" />
                  support@5digea.com
                </a>

                <Link
                  href="/vendor/support"
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#5f544d] transition hover:bg-[#f5eee9] sm:text-sm"
                >
                  <MessageSquarePlus size={13} className="text-[#a47e43]" />
                  Visit Support Center
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* =================================================
            Help Footer
        ================================================= */}

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-3 text-[10px] text-[#6f625a] sm:mt-6 sm:p-3.5 sm:text-xs">
          <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a47e43] sm:h-4 sm:w-4" />
          <span className="leading-5">
            <span className="font-medium text-[#40352f]">Need help?</span>{" "}
            Changes to your service will be reviewed by our team before going live.
            Make sure all details are accurate.
            <Link href="/vendor/support" className="ml-1 font-medium text-[#a47e43] hover:underline">
              Contact support
            </Link>
          </span>
        </div>
      </div>

      {/* =================================================
          Contact Admin Dialog
      ================================================= */}

      <ContactAdminDialog
        open={contactDialogOpen}
        category={selectedCategory}
        vendorName={vendor?.businessName || "My Business"}
        onClose={() => {
          setContactDialogOpen(false);
          setSelectedCategory(null);
        }}
        onSuccess={handleContactSuccess}
      />
    </main>
  );
}