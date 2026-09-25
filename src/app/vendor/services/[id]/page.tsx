"use client";

import Link from "next/link";
import {
  FormEvent,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  Banknote,
  Tag,
  Clock3,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Package,
  Lock,
  Search,
  MessageSquarePlus,
  Mail,
  X,
  Images as ImagesIcon,
} from "lucide-react";

import {
  Tooltip,
  Badge,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";

import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useVendorContext } from "@/context/VendorContext";
import type {
  CreateServicePriceRequest,
  Service,
} from "@/types/service";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";
import {
  CategoryCard,
  ContactAdminDialog,
} from "@/components/vendor/CategoryRequest";
import TextWithSlot from "@/components/shared/TextWithSlot";
import type { Category } from "@/types/category";

interface PageProps {
  params: Promise<{ id: string }>;
}

const MAX_IMAGES = 5;

// =========================================================
// Status Config
// =========================================================

const getStatusConfig = (status: string) => {
  const configs: Record<
    string,
    {
      labelKey: TranslationKey;
      icon: React.ElementType;
      className: string;
      dot: string;
    }
  > = {
    Approved: {
      labelKey: "vendor.services.statusLabel.approved",
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    Pending: {
      labelKey: "vendor.services.statusLabel.pending",
      icon: Clock3,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    Rejected: {
      labelKey: "vendor.services.statusLabel.rejected",
      icon: XCircle,
      className:
        "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
    Inactive: {
      labelKey: "vendor.services.statusLabel.inactive",
      icon: XCircle,
      className:
        "bg-gray-100 text-gray-600 border-gray-200",
      dot: "bg-gray-500",
    },
  };

  return configs[status] || configs.Pending;
};

// =========================================================
// Main Page
// =========================================================

export default function EditVendorServicePage({
  params,
}: PageProps) {
  const { id } = use(params);
  const { t } = useLanguage();

  const {
    services,
    loading,
    actionLoading,
    actionError,
    update,
    updatePrices,
    resubmit,
    uploadImages,
    deleteImage,
  } = useVendorServices();

  const { categories, loading: categoriesLoading } =
    useCategories();

  const { vendor } = useVendorContext();

  const service: Service | undefined = services.find(
    (s) => s.id === id
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [prices, setPrices] = useState<
    CreateServicePriceRequest[]
  >([]);

  const [formError, setFormError] = useState("");

  const [categorySearch, setCategorySearch] =
    useState("");

  const [contactDialogOpen, setContactDialogOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [toastMessage, setToastMessage] = useState("");

  // Each form is re-synced only when ITS OWN server value changes.
  const serverName = service?.name;

  const serverDescription = service?.description;

  const serverPricesKey = service
    ? JSON.stringify(
        service.prices.map((price) => [
          price.label,
          price.price,
        ])
      )
    : "";

  useEffect(() => {
    if (serverName !== undefined) {
      setName(serverName);
    }
  }, [serverName]);

  useEffect(() => {
    if (serverDescription !== undefined) {
      setDescription(serverDescription);
    }
  }, [serverDescription]);

  useEffect(() => {
    if (!serverPricesKey) return;

    const rows = JSON.parse(serverPricesKey) as [
      string,
      number
    ][];

    setPrices(
      rows.map(([label, price]) => ({
        label,
        price,
      }))
    );
  }, [serverPricesKey]);

  const isResubmitting =
    actionLoading === `resubmit-${id}`;

  // =======================================================
  // Images
  // =======================================================

  const [newImages, setNewImages] = useState<
    { file: File; preview: string }[]
  >([]);

  const [removedImageIds, setRemovedImageIds] =
    useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  const [savedImagesCount, setSavedImagesCount] =
    useState<number | null>(null);

  const newImagesRef = useRef(newImages);

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(
    () => () => {
      newImagesRef.current.forEach((item) =>
        URL.revokeObjectURL(item.preview)
      );
    },
    []
  );

  // =======================================================
  // Change Detection
  // =======================================================

  const currentPricesKey = JSON.stringify(
    prices
      .filter(
        (price) =>
          price.label.trim() !== "" &&
          price.price >= 0
      )
      .map((price) => [
        price.label,
        price.price,
      ])
  );

  const detailsChanged =
    serverName !== undefined &&
    (name.trim() !== serverName.trim() ||
      description.trim() !==
        (serverDescription ?? "").trim());

  const pricesChanged =
    serverPricesKey !== "" &&
    currentPricesKey !== serverPricesKey;

  const hasChanges =
    detailsChanged ||
    pricesChanged ||
    newImages.length > 0 ||
    removedImageIds.length > 0;

  // =======================================================
  // Image Count
  // =======================================================

  const existingImagesCount = service?.images?.length ?? 0;

  const remainingImageSlots = Math.max(
    0,
    MAX_IMAGES -
      existingImagesCount -
      newImages.length
  );

  const totalImageCount =
    existingImagesCount +
    newImages.length -
    removedImageIds.length;

  const canAddImages =
    existingImagesCount +
      newImages.length -
      removedImageIds.length <
    MAX_IMAGES;

  // =======================================================
  // Image Selection
  // =======================================================

  const handleImagesSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files ?? []
    );

    // Always reset input so the same file can be selected again.
    event.target.value = "";

    if (files.length === 0) return;

    setSavedImagesCount(null);

    const currentTotal =
      existingImagesCount +
      newImages.length -
      removedImageIds.length;

    const remainingSlots = Math.max(
      0,
      MAX_IMAGES - currentTotal
    );

    // Already reached the limit.
    if (remainingSlots <= 0) {
      setFormError(
        t("vendor.services.detail.imagesMaxReached") ||
          `Maximum ${MAX_IMAGES} images are allowed.`
      );

      return;
    }

    // Only accept the number of files that can fit.
    const filesToAdd = files.slice(
      0,
      remainingSlots
    );

    // If user selected more than available slots,
    // inform them but still add the allowed files.
    if (files.length > remainingSlots) {
      setFormError(
        t(
          "vendor.services.detail.imagesMaxReached"
        ) ||
          `Maximum ${MAX_IMAGES} images are allowed.`
      );
    } else {
      setFormError("");
    }

    const newItems = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [
      ...prev,
      ...newItems,
    ]);
  };

  const removeNewImage = (index: number) => {
    const item = newImages[index];

    if (item) {
      URL.revokeObjectURL(item.preview);
    }

    setNewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setSavedImagesCount(null);
    setFormError("");
  };

  const toggleRemoveExistingImage = (
    imageId: string
  ) => {
    setSavedImagesCount(null);

    setRemovedImageIds((prev) =>
      prev.includes(imageId)
        ? prev.filter(
            (value) => value !== imageId
          )
        : [...prev, imageId]
    );

    setFormError("");
  };

  // =======================================================
  // Discard
  // =======================================================

  const handleDiscard = () => {
    newImages.forEach((item) =>
      URL.revokeObjectURL(item.preview)
    );

    setNewImages([]);
    setRemovedImageIds([]);
    setFormError("");

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
  };

  // =======================================================
  // Categories
  // =======================================================

  const assignedCategoryNames = useMemo(
    () =>
      new Set(vendor?.categories || []),
    [vendor]
  );

  const filteredCategories = useMemo(() => {
    const activeCategories = categories.filter(
      (c) => c.isActive
    );

    if (!categorySearch.trim()) {
      return activeCategories;
    }

    const query =
      categorySearch.toLowerCase();

    return activeCategories.filter(
      (c) =>
        c.name
          .toLowerCase()
          .includes(query) ||
        c.description
          ?.toLowerCase()
          .includes(query)
    );
  }, [categories, categorySearch]);

  const assignedCount = useMemo(
    () =>
      filteredCategories.filter((c) =>
        assignedCategoryNames.has(c.name)
      ).length,
    [
      filteredCategories,
      assignedCategoryNames,
    ]
  );

  // =======================================================
  // Price Handlers
  // =======================================================

  const addPriceRow = () => {
    setPrices((prev) => [
      ...prev,
      {
        label: "",
        price: 0,
      },
    ]);
  };

  const removePriceRow = (
    index: number
  ) => {
    setPrices((prev) =>
      prev.filter((_, i) => i !== index)
    );
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
              [field]:
                field === "price"
                  ? Number(value) || 0
                  : value,
            }
          : row
      )
    );
  };

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  // =======================================================
  // Save Everything
  // =======================================================

  const handleSaveAll = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (saving || !hasChanges) return;

    setFormError("");
    setSavedImagesCount(null);

    if (
      !name.trim() ||
      !description.trim()
    ) {
      setFormError(
        t(
          "vendor.services.detail.errors.fillDetails"
        )
      );

      scrollToTop();
      return;
    }

    const validPrices =
      prices.filter(
        (price) =>
          price.label.trim() !== "" &&
          price.price >= 0
      );

    if (validPrices.length === 0) {
      setFormError(
        t(
          "vendor.services.detail.errors.keepOnePrice"
        )
      );

      scrollToTop();
      return;
    }

    // Final image limit protection.
    const finalImageCount =
      existingImagesCount -
      removedImageIds.length +
      newImages.length;

    if (finalImageCount > MAX_IMAGES) {
      setFormError(
        t(
          "vendor.services.detail.imagesMaxReached"
        ) ||
          `Maximum ${MAX_IMAGES} images are allowed.`
      );

      scrollToTop();
      return;
    }

    setSaving(true);

    try {
      if (detailsChanged) {
        const ok = await update(id, {
          name: name.trim(),
          description: description.trim(),
        });

        if (!ok) {
          scrollToTop();
          return;
        }

        setName(name.trim());
        setDescription(
          description.trim()
        );
      }

      if (pricesChanged) {
        const ok = await updatePrices(id, {
          prices: validPrices,
        });

        if (!ok) {
          scrollToTop();
          return;
        }

        setPrices(validPrices);
      }

      for (const imageId of removedImageIds) {
        const ok = await deleteImage(
          id,
          imageId
        );

        if (!ok) {
          scrollToTop();
          return;
        }

        setRemovedImageIds((prev) =>
          prev.filter(
            (value) => value !== imageId
          )
        );
      }

      const sentImages =
        newImages.length;

      if (sentImages > 0) {
        const ok = await uploadImages(
          id,
          newImages.map(
            (item) => item.file
          )
        );

        if (!ok) {
          scrollToTop();
          return;
        }

        newImages.forEach((item) =>
          URL.revokeObjectURL(item.preview)
        );

        setNewImages([]);
      }

      setSavedImagesCount(
        sentImages
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResubmit = async () => {
    await resubmit(id);
  };

  const handleContactAdmin = (
    category: Category
  ) => {
    setSelectedCategory(category);
    setContactDialogOpen(true);
  };

  const handleContactSuccess = () => {
    setToastMessage(
      t(
        "vendor.services.detail.toastText"
      )
    );

    setTimeout(
      () => setToastMessage(""),
      4000
    );
  };

  // =======================================================
  // Loading State
  // =======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f6]">
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
      </div>
    );
  }

  // =======================================================
  // Not Found
  // =======================================================

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#e8dfd8] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="mt-4 text-xl font-semibold text-[#30251f]">
            {t(
              "vendor.services.detail.notFoundTitle"
            )}
          </h1>

          <p className="mt-2 text-sm text-[#756b65]">
            {t(
              "vendor.services.detail.notFoundText"
            )}
          </p>

          <Link
            href="/vendor/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#463831]"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t(
              "vendor.services.detail.back"
            )}
          </Link>
        </div>
      </div>
    );
  }

  const status = getStatusConfig(
    service.status
  );

  const StatusIcon = status.icon;

  const existingImages = (
    service.images ?? []
  )
    .slice()
    .sort(
      (a, b) =>
        a.displayOrder -
        b.displayOrder
    );

  // =======================================================
  // Render
  // =======================================================

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">

        {/* Toast */}

        {toastMessage && (
          <div className="fixed bottom-6 end-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#30251f]">
                  {t(
                    "vendor.services.detail.toastTitle"
                  )}
                </p>

                <p className="text-xs text-[#9b8f86]">
                  {toastMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}

        <Link
          href="/vendor/services"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#756b65] transition hover:text-[#30251f] sm:mb-6 sm:gap-2 sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 rtl:rotate-180" />
          {t(
            "vendor.services.detail.back"
          )}
        </Link>

        {/* Header */}

        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] rtl:tracking-normal text-[#9b8171] sm:mb-2 sm:text-xs">
                <Sparkles
                  size={11}
                  className="sm:h-3.25 sm:w-3.25"
                />

                {t(
                  "vendor.services.detail.editService"
                )}
              </p>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                  <BriefcaseBusiness
                    size={16}
                    className="text-[#a47e43] sm:h-5 sm:w-5"
                    strokeWidth={1.8}
                  />
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
                  label={
                    service.categoryName ||
                    t(
                      "vendor.dashboard.services.uncategorized"
                    )
                  }
                  size="small"
                  sx={{
                    height: 26,
                    fontSize: "11px",
                    fontWeight: 500,
                    backgroundColor:
                      "#f5eee9",
                    color: "#5f544d",
                    "& .MuiChip-icon": {
                      color: "#a47e43",
                    },
                  }}
                />

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs ${status.className}`}
                >
                  <StatusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {t(status.labelKey)}
                </span>
              </div>
            </div>

            {service.status ===
              "Rejected" && (
              <button
                type="button"
                onClick={handleResubmit}
                disabled={
                  isResubmitting
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-xs font-medium text-[#514740] transition hover:bg-[#f7f2ef] disabled:opacity-60 sm:h-11 sm:px-5 sm:text-sm"
              >
                {isResubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}

                {t(
                  "vendor.services.detail.resubmitForReview"
                )}
              </button>
            )}
          </div>
        </header>

        {/* Alerts */}

        {service.status ===
          "Rejected" &&
          service.rejectionReason && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:mb-6">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />

              <div>
                <p className="font-semibold">
                  {t(
                    "vendor.services.detail.rejectionReason"
                  )}
                </p>

                <p className="mt-1 leading-5 text-red-600">
                  {
                    service.rejectionReason
                  }
                </p>
              </div>
            </div>
          )}

        {(formError || actionError) && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:mb-6">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />

            <span className="leading-5">
              {formError ||
                actionError}
            </span>
          </div>
        )}

        {/* Main Grid */}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">

          {/* LEFT */}

          <form
            onSubmit={handleSaveAll}
            noValidate
            className="space-y-4 sm:space-y-6 lg:col-span-2"
          >

            {/* Service Details */}

            <div className="rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
              <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
                  <FileText
                    size={14}
                    className="text-[#a47e43] sm:h-4.5 sm:w-4.5"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                    {t(
                      "vendor.services.detail.detailsTitle"
                    )}
                  </h2>

                  <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                    {t(
                      "vendor.services.detail.detailsSub"
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#40352f] sm:mb-2 sm:text-sm">
                    {t(
                      "vendor.services.form.name"
                    )}{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <TextField
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder={t(
                      "vendor.services.form.namePlaceholder"
                    )}
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root":
                        {
                          borderRadius:
                            "12px",
                          backgroundColor:
                            "#fcfaf8",
                          fontSize:
                            "13px",
                          "& fieldset": {
                            borderColor:
                              "#e3d9d1",
                          },
                          "&:hover fieldset":
                            {
                              borderColor:
                                "#d5c8be",
                            },
                          "&.Mui-focused fieldset":
                            {
                              borderColor:
                                "#a47e43",
                              borderWidth:
                                "1px",
                            },
                        },
                    }}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#40352f] sm:mb-2 sm:text-sm">
                    {t(
                      "vendor.services.form.description"
                    )}{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <TextField
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    multiline
                    rows={5}
                    placeholder={t(
                      "vendor.services.detail.descriptionPlaceholder"
                    )}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root":
                        {
                          borderRadius:
                            "12px",
                          backgroundColor:
                            "#fcfaf8",
                          fontSize:
                            "13px",
                          "& fieldset": {
                            borderColor:
                              "#e3d9d1",
                          },
                          "&:hover fieldset":
                            {
                              borderColor:
                                "#d5c8be",
                            },
                          "&.Mui-focused fieldset":
                            {
                              borderColor:
                                "#a47e43",
                              borderWidth:
                                "1px",
                            },
                        },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}

            <div className="rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
              <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
                    <Banknote
                      size={14}
                      className="text-[#a47e43] sm:h-4.5 sm:w-4.5"
                    />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                      {t(
                        "vendor.services.form.pricing"
                      )}
                    </h2>

                    <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                      {t(
                        "vendor.services.detail.pricingSub"
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addPriceRow}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#604b3e] transition hover:bg-[#f5eee9] hover:text-[#30251f] sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

                  {t(
                    "vendor.services.form.addPrice"
                  )}
                </button>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {prices.map(
                  (price, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-xl border border-[#f0eae5] bg-[#fcfaf8] p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-3.5"
                    >
                      <div className="flex-1">
                        <TextField
                          type="text"
                          value={
                            price.label
                          }
                          onChange={(
                            event
                          ) =>
                            updatePriceRow(
                              index,
                              "label",
                              event.target
                                .value
                            )
                          }
                          placeholder={t(
                            "vendor.services.form.labelPlaceholder"
                          )}
                          size="small"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root":
                              {
                                borderRadius:
                                  "10px",
                                backgroundColor:
                                  "white",
                                fontSize:
                                  "12px",
                                "& fieldset":
                                  {
                                    borderColor:
                                      "#e3d9d1",
                                  },
                                "&:hover fieldset":
                                  {
                                    borderColor:
                                      "#d5c8be",
                                  },
                                "&.Mui-focused fieldset":
                                  {
                                    borderColor:
                                      "#a47e43",
                                    borderWidth:
                                      "1px",
                                  },
                              },
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-full sm:w-40">
                          <TextField
                            type="number"
                            value={
                              price.price
                            }
                            onChange={(
                              event
                            ) =>
                              updatePriceRow(
                                index,
                                "price",
                                event.target
                                  .value
                              )
                            }
                            placeholder={t(
                              "vendor.services.form.pricePlaceholder"
                            )}
                            size="small"
                            fullWidth
                            slotProps={{
                              input: {
                                startAdornment:
                                  (
                                    <InputAdornment position="start">
                                      <span className="text-[#9b8f86]">
                                        {t(
                                          "common.currency"
                                        )}
                                      </span>
                                    </InputAdornment>
                                  ),
                                inputProps:
                                  {
                                    min: 0,
                                    step: "0.01",
                                  },
                              },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root":
                                {
                                  borderRadius:
                                    "10px",
                                  backgroundColor:
                                    "white",
                                  fontSize:
                                    "12px",
                                  "& fieldset":
                                    {
                                      borderColor:
                                        "#e3d9d1",
                                    },
                                  "&:hover fieldset":
                                    {
                                      borderColor:
                                        "#d5c8be",
                                    },
                                  "&.Mui-focused fieldset":
                                    {
                                      borderColor:
                                        "#a47e43",
                                      borderWidth:
                                        "1px",
                                    },
                                },
                            }}
                          />
                        </div>

                        {prices.length >
                          1 && (
                          <Tooltip
                            title={t(
                              "vendor.services.form.removePrice"
                            )}
                            arrow
                          >
                            <button
                              type="button"
                              onClick={() =>
                                removePriceRow(
                                  index
                                )
                              }
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e3d9d1] text-[#9a5555] transition hover:bg-red-50 hover:border-red-200 sm:h-11 sm:w-11"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Images */}

            <div className="rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
              <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
                    <ImagesIcon
                      size={14}
                      className="text-[#a47e43] sm:h-4.5 sm:w-4.5"
                    />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                      {t(
                        "vendor.services.form.images"
                      )}
                    </h2>

                    <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                      {t(
                        "vendor.services.detail.imagesSub"
                      )}
                    </p>
                  </div>
                </div>

                {/* Image Counter */}

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
                    totalImageCount >=
                    MAX_IMAGES
                      ? "bg-amber-50 text-amber-700"
                      : "bg-[#f5eee9] text-[#756b65]"
                  }`}
                >
                  {totalImageCount}/{MAX_IMAGES}
                </span>
              </div>

              <div className="mb-4 flex items-start gap-2 rounded-xl bg-[#faf6f1] px-3 py-2.5 text-[11px] leading-5 text-[#6f5f52] sm:text-xs">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a47e43]" />

                <span>
                  {t(
                    "vendor.services.detail.imagesReviewNote"
                  )}

                  <span className="ms-1 font-semibold text-[#a47e43]">
                    {MAX_IMAGES}{" "}
                    {t(
                      "vendor.services.detail.imagesMaxLabel"
                    )}
                  </span>
                </span>
              </div>

              {/* Maximum Reached Message */}

              {totalImageCount >=
                MAX_IMAGES && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700">
                  <Info className="h-4 w-4 shrink-0" />

                  <span>
                    {t(
                      "vendor.services.detail.imagesMaxReached"
                    ) ||
                      `You have reached the maximum limit of ${MAX_IMAGES} images.`}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {/* Existing Images */}

                {existingImages.map(
                  (image) => {
                    const isRemoving =
                      removedImageIds.includes(
                        image.id
                      );

                    return (
                      <div
                        key={image.id}
                        className="space-y-1.5"
                      >
                        <div className="group relative aspect-square overflow-hidden rounded-xl border-2 border-[#e3d9d1]">
                          <img
                            loading="lazy"
                            decoding="async"
                            src={image.url}
                            alt={
                              service.name
                            }
                            className={`h-full w-full object-cover transition ${
                              isRemoving
                                ? "opacity-30 grayscale"
                                : ""
                            }`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              toggleRemoveExistingImage(
                                image.id
                              )
                            }
                            disabled={saving}
                            aria-label={
                              isRemoving
                                ? t(
                                    "vendor.services.detail.imageStatus.undoRemove"
                                  )
                                : t(
                                    "vendor.services.detail.imageStatus.remove"
                                  )
                            }
                            title={
                              isRemoving
                                ? t(
                                    "vendor.services.detail.imageStatus.undoRemove"
                                  )
                                : t(
                                    "vendor.services.detail.imageStatus.remove"
                                  )
                            }
                            className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75 focus-visible:opacity-100 disabled:opacity-60 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            {isRemoving ? (
                              <RotateCcw className="h-3.5 w-3.5" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>

                        {isRemoving && (
                          <p className="text-[10px] leading-4 text-red-600">
                            {t(
                              "vendor.services.detail.imageStatus.removeOnSave"
                            )}
                          </p>
                        )}
                      </div>
                    );
                  }
                )}

                {/* New Images */}

                {newImages.map(
                  (item, index) => (
                    <div
                      key={item.preview}
                      className="space-y-1.5"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-[#a47e43]">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={
                            item.preview
                          }
                          alt={
                            service.name
                          }
                          className="h-full w-full object-cover"
                        />

                        <span className="absolute bottom-1.5 start-1.5 inline-flex items-center gap-1 rounded-full bg-[#a47e43] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                          <Plus className="h-3 w-3" />

                          {t(
                            "vendor.services.detail.imageStatus.new"
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeNewImage(
                              index
                            )
                          }
                          disabled={
                            saving
                          }
                          aria-label={t(
                            "vendor.services.detail.imageStatus.removeNew"
                          )}
                          title={t(
                            "vendor.services.detail.imageStatus.removeNew"
                          )}
                          className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75 disabled:opacity-60"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p className="text-[10px] leading-4 text-[#a47e43]">
                        {t(
                          "vendor.services.detail.imageStatus.willBeSent"
                        )}
                      </p>
                    </div>
                  )
                )}

                {/* Add Image Button */}

                {canAddImages && (
                  <label
                    className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#d5c8be] bg-[#fcfaf8] text-[#9b8f86] transition hover:border-[#a47e43] hover:text-[#a47e43] ${
                      saving
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }`}
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />

                    <span className="px-1 text-center text-[10px]">
                      {t(
                        "vendor.services.form.addPhoto"
                      )}
                    </span>

                    <span className="text-[9px] text-[#b0a39a]">
                      {remainingImageSlots}{" "}
                      {t(
                        "vendor.services.detail.imagesRemaining"
                      )}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={
                        saving
                      }
                      onChange={
                        handleImagesSelected
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {existingImages.length ===
                0 &&
                newImages.length ===
                  0 && (
                  <p className="mt-3 text-[10px] text-[#9b8f86] sm:text-xs">
                    {t(
                      "vendor.services.detail.noImages"
                    )}
                  </p>
                )}
            </div>

            {/* Save Bar */}

            <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-[#e8dfd8] bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                {hasChanges ? (
                  <>
                    <p className="text-sm font-semibold text-[#30251f]">
                      {t(
                        "vendor.services.detail.unsavedTitle"
                      )}
                    </p>

                    <p className="mt-0.5 text-xs text-[#756b65]">
                      {t(
                        "vendor.services.detail.unsavedText"
                      )}
                    </p>
                  </>
                ) : savedImagesCount !==
                  null ? (
                  <div className="flex items-start gap-2 text-emerald-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <div>
                      <p className="text-sm font-semibold">
                        {t(
                          "vendor.services.detail.savedAll"
                        )}
                      </p>

                      {savedImagesCount >
                        0 && (
                        <p className="mt-0.5 text-xs text-[#756b65]">
                          {t(
                            savedImagesCount ===
                              1
                              ? "vendor.services.detail.savedImagesOne"
                              : "vendor.services.detail.savedImagesMany",
                            {
                              count:
                                savedImagesCount,
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#9b8f86]">
                    {t(
                      "vendor.services.detail.noChanges"
                    )}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {hasChanges &&
                  !saving && (
                    <button
                      type="button"
                      onClick={
                        handleDiscard
                      }
                      className="h-10 rounded-xl px-4 text-xs font-medium text-[#514740] transition hover:bg-[#f7f2ef] sm:h-11 sm:text-sm"
                    >
                      {t(
                        "vendor.services.detail.discard"
                      )}
                    </button>
                  )}

                <button
                  type="submit"
                  disabled={
                    !hasChanges ||
                    saving
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-5 text-xs font-medium text-white transition hover:bg-[#463831] disabled:opacity-50 sm:h-11 sm:px-6 sm:text-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />

                      {t(
                        "vendor.services.detail.saving"
                      )}
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

                      {t(
                        "vendor.services.detail.saveAll"
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* RIGHT: Available Categories */}

          <aside className="space-y-4 lg:sticky lg:top-4 lg:h-fit">
            <div className="rounded-3xl border border-[#e8dfd8] bg-white shadow-sm">

              {/* Header */}

              <div className="border-b border-[#f0eae5] p-4 sm:p-5">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                    <Package
                      size={16}
                      className="text-[#a47e43] sm:h-4.5 sm:w-4.5"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                      {t(
                        "vendor.services.detail.categoriesTitle"
                      )}
                    </h2>

                    <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                      {t(
                        "vendor.services.detail.categoriesSub"
                      )}
                    </p>
                  </div>

                  <Badge
                    badgeContent={
                      filteredCategories.length
                    }
                    sx={{
                      "& .MuiBadge-badge":
                        {
                          backgroundColor:
                            "#a47e43",
                          color:
                            "white",
                          fontSize: 10,
                          fontWeight:
                            600,
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
                    value={
                      categorySearch
                    }
                    onChange={(e) =>
                      setCategorySearch(
                        e.target.value
                      )
                    }
                    placeholder={t(
                      "vendor.services.detail.searchCategories"
                    )}
                    size="small"
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment:
                          (
                            <InputAdornment position="start">
                              <Search
                                size={14}
                                className="text-[#9b8f86]"
                              />
                            </InputAdornment>
                          ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root":
                        {
                          height: 38,
                          borderRadius:
                            "10px",
                          backgroundColor:
                            "#fcfaf8",
                          fontSize:
                            "12px",
                          "& fieldset": {
                            borderColor:
                              "#e3d9d1",
                          },
                          "&:hover fieldset":
                            {
                              borderColor:
                                "#d5c8be",
                            },
                          "&.Mui-focused fieldset":
                            {
                              borderColor:
                                "#a47e43",
                              borderWidth:
                                "1px",
                            },
                        },
                    }}
                  />
                </div>

                {/* Stats */}

                <div className="mt-3 flex items-center justify-between text-[10px] text-[#9b8f86] sm:text-xs">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2
                      size={11}
                      className="text-emerald-600"
                    />

                    <span className="font-medium text-emerald-700">
                      {assignedCount}
                    </span>{" "}
                    {t(
                      "vendor.services.detail.activeCount"
                    )}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <Lock
                      size={11}
                      className="text-[#a47e43]"
                    />

                    <span className="font-medium text-[#a47e43]">
                      {
                        filteredCategories.length -
                        assignedCount
                      }
                    </span>{" "}
                    {t(
                      "vendor.services.detail.availableCount"
                    )}
                  </span>
                </div>
              </div>

              {/* Category List */}

              <div className="max-h-150 overflow-y-auto p-3 sm:p-4">
                {categoriesLoading ? (
                  <div className="space-y-2">
                    {Array.from({
                      length: 5,
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 animate-pulse rounded-xl bg-[#f5f1ee]"
                        style={{
                          animationDelay: `${
                            i * 100
                          }ms`,
                        }}
                      />
                    ))}
                  </div>
                ) : filteredCategories.length ===
                  0 ? (
                  <div className="py-8 text-center">
                    <Search className="mx-auto h-8 w-8 text-[#d5c8be]" />

                    <p className="mt-3 text-xs text-[#9b8f86]">
                      {t(
                        "vendor.services.detail.noCategories"
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCategories.map(
                      (category) => (
                        <CategoryCard
                          key={
                            category.id
                          }
                          category={
                            category
                          }
                          isAssigned={assignedCategoryNames.has(
                            category.name
                          )}
                          onRequest={
                            handleContactAdmin
                          }
                        />
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}

              <div className="border-t border-[#f0eae5] p-3 sm:p-4">
                <div className="flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-2.5 text-[10px] text-[#6f625a] sm:p-3 sm:text-xs">
                  <Info
                    size={12}
                    className="mt-0.5 shrink-0 text-[#a47e43] sm:h-3.5 sm:w-3.5"
                  />

                  <p className="leading-4 sm:leading-5">
                    <TextWithSlot
                      text={t(
                        "vendor.services.detail.categoriesFooter"
                      )}
                      token="{bold}"
                      slot={
                        <strong className="text-[#a47e43]">
                          {t(
                            "vendor.services.detail.notifyAdminBold"
                          )}
                        </strong>
                      }
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support */}

            <div className="rounded-3xl border border-[#e8dfd8] bg-linear-to-br from-[#fbf6f1] to-[#f5ede5] p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm sm:h-10 sm:w-10">
                  <HelpCircle
                    size={16}
                    className="text-[#a47e43] sm:h-4.5 sm:w-4.5"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#30251f] sm:text-base">
                    {t(
                      "vendor.services.detail.needHelpTitle"
                    )}
                  </h3>

                  <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                    {t(
                      "vendor.services.detail.contactTeam"
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <a
                  href="mailto:support@5digea.com"
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#5f544d] transition hover:bg-[#f5eee9] sm:text-sm"
                >
                  <Mail
                    size={13}
                    className="text-[#a47e43]"
                  />

                  support@5digea.com
                </a>

                <Link
                  href="/vendor/support"
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#5f544d] transition hover:bg-[#f5eee9] sm:text-sm"
                >
                  <MessageSquarePlus
                    size={13}
                    className="text-[#a47e43]"
                  />

                  {t(
                    "vendor.services.detail.visitSupport"
                  )}
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Help Footer */}

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-3 text-[10px] text-[#6f625a] sm:mt-6 sm:p-3.5 sm:text-xs">
          <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a47e43] sm:h-4 sm:w-4" />

          <span className="leading-5">
            <span className="font-medium text-[#40352f]">
              {t(
                "vendor.services.form.needHelp"
              )}
            </span>{" "}

            {t(
              "vendor.services.detail.changesReviewed"
            )}

            <Link
              href="/vendor/support"
              className="ms-1 font-medium text-[#a47e43] hover:underline"
            >
              {t(
                "vendor.services.form.contactSupport"
              )}
            </Link>
          </span>
        </div>
      </div>

      {/* Contact Admin Dialog */}

      <ContactAdminDialog
        open={contactDialogOpen}
        category={selectedCategory}
        vendorName={
          vendor?.businessName ||
          t(
            "vendor.services.detail.dialog.myBusiness"
          )
        }
        vendorEmail={vendor?.contactEmail}
        vendorPhone={vendor?.contactPhone}
        onClose={() => {
          setContactDialogOpen(false);
          setSelectedCategory(null);
        }}
        onSuccess={
          handleContactSuccess
        }
      />
    </div>
  );
}