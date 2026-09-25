"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useVendorContext } from "@/context/VendorContext";
import { useLanguage } from "@/context/LanguageContext";
import type { CreateServicePriceRequest, Service } from "@/types/service";
import type { Category } from "@/types/category";

import { MAX_SERVICE_IMAGES } from "./serviceStatus";

/**
 * All state of the "edit service" page: the details / prices / images
 * drafts, change detection, the single "save everything" action and the
 * category sidebar search.
 */
export function useEditServiceForm(id: string) {
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
    MAX_SERVICE_IMAGES -
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
    MAX_SERVICE_IMAGES;

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
      MAX_SERVICE_IMAGES - currentTotal
    );

    // Already reached the limit.
    if (remainingSlots <= 0) {
      setFormError(
        t("vendor.services.detail.imagesMaxReached") ||
          `Maximum ${MAX_SERVICE_IMAGES} images are allowed.`
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
          `Maximum ${MAX_SERVICE_IMAGES} images are allowed.`
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

    if (finalImageCount > MAX_SERVICE_IMAGES) {
      setFormError(
        t(
          "vendor.services.detail.imagesMaxReached"
        ) ||
          `Maximum ${MAX_SERVICE_IMAGES} images are allowed.`
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

  const existingImages = (service?.images ?? [])
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return {
    loading,
    service,
    vendor,
    actionError,
    // details
    name,
    setName,
    description,
    setDescription,
    // prices
    prices,
    addPriceRow,
    removePriceRow,
    updatePriceRow,
    // images
    existingImages,
    newImages,
    removedImageIds,
    totalImageCount,
    remainingImageSlots,
    canAddImages,
    handleImagesSelected,
    removeNewImage,
    toggleRemoveExistingImage,
    // save
    formError,
    hasChanges,
    saving,
    savedImagesCount,
    handleSaveAll,
    handleDiscard,
    isResubmitting,
    handleResubmit,
    // categories
    categoriesLoading,
    categorySearch,
    setCategorySearch,
    filteredCategories,
    assignedCategoryNames,
    assignedCount,
    // contact admin dialog
    contactDialogOpen,
    setContactDialogOpen,
    selectedCategory,
    setSelectedCategory,
    handleContactAdmin,
    handleContactSuccess,
    toastMessage,
  };
}

export type EditServiceForm = ReturnType<typeof useEditServiceForm>;
