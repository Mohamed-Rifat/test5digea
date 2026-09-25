"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useVendorContext } from "@/context/VendorContext";
import { useLanguage } from "@/context/LanguageContext";
import type { CreateServicePriceRequest } from "@/types/service";

import type { PriceRow } from "./PriceRowsEditor";
import { MAX_SERVICE_IMAGES } from "./serviceStatus";

/** State + submit logic of the "add service" page. */
export function useNewServiceForm() {
  const router = useRouter();
  const { t, localize } = useLanguage();

  const { create, uploadImages, actionError } = useVendorServices();
  const { categories, loading: categoriesLoading } = useCategories();
  const { vendor, loading: vendorLoading } = useVendorContext();

  // A vendor can only publish services under categories that were assigned
  // to their business — showing the full category catalog would let them
  // pick one the backend will reject.
  const availableCategories = useMemo(() => {
    if (!vendor) return [];

    const assignedNames = new Set(vendor.categories);

    return categories.filter(
      (category) =>
        category.isActive && assignedNames.has(category.name)
    );
  }, [categories, vendor]);

  const categoryOptions = useMemo(
    () =>
      availableCategories.map((category) => ({
        value: category.id,
        label: localize(category.name),
      })),
    [availableCategories, localize]
  );

  const categoriesLoadingCombined =
    categoriesLoading || vendorLoading;

  const hasNoAssignedCategories =
    !categoriesLoadingCombined &&
    availableCategories.length === 0;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Form state allows an empty price while the vendor is typing.
  // The value is converted to a number only before sending to the API.
  const [prices, setPrices] = useState<PriceRow[]>([
    { label: "", price: "" },
  ]);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formError, setFormError] = useState("");

  // Covers the whole create + upload-images sequence.
  // Prevents double-clicking the submit button from creating
  // the service more than once.
  const [submitting, setSubmitting] = useState(false);

  const isSubmitting = submitting;

  const handleImagesSelected = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);

      if (files.length === 0) return;

      setImages((prevImages) => {
        const remainingSlots =
          MAX_SERVICE_IMAGES - prevImages.length;

        if (remainingSlots <= 0) {
          return prevImages;
        }

        const filesToAdd = files.slice(
          0,
          remainingSlots
        );

        setImagePreviews((prevPreviews) => [
          ...prevPreviews,
          ...filesToAdd.map((file) =>
            URL.createObjectURL(file)
          ),
        ]);

        return [...prevImages, ...filesToAdd];
      });

      // Allow re-selecting the same file again later.
      event.target.value = "";
    },
    []
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImagePreviews((prev) => {
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }

      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const addPriceRow = useCallback(() => {
    setPrices((prev) => [
      ...prev,
      {
        label: "",
        price: "",
      },
    ]);
  }, []);

  const removePriceRow = useCallback((index: number) => {
    setPrices((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }, []);

  const updatePriceRow = useCallback(
    (
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
                    ? value === ""
                      ? ""
                      : Number(value)
                    : value,
              }
            : row
        )
      );
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (submitting) return;

      setFormError("");

      if (
        !name.trim() ||
        !description.trim() ||
        !categoryId
      ) {
        setFormError(
          t("vendor.services.form.errors.fillNew")
        );
        return;
      }

      // Extra protection against submitting more than 5 images.
      if (images.length > MAX_SERVICE_IMAGES) {
        setFormError(
          "You can upload a maximum of 5 images."
        );
        return;
      }

      // Convert the form values into the API request type.
      // Empty price inputs are ignored.
      const validPrices: CreateServicePriceRequest[] =
        prices
          .filter(
            (price) =>
              price.label.trim() !== "" &&
              price.price !== "" &&
              price.price >= 0
          )
          .map((price) => ({
            label: price.label.trim(),
            price: price.price as number,
          }));

      if (validPrices.length === 0) {
        setFormError(
          t(
            "vendor.services.form.errors.atLeastOnePrice"
          )
        );
        return;
      }

      setSubmitting(true);

      try {
        const id = await create({
          categoryId,
          name: name.trim(),
          description: description.trim(),
          prices: validPrices,
        });

        if (id) {
          if (images.length > 0) {
            const uploaded = await uploadImages(
              id,
              images
            );

            if (!uploaded) {
              // Service was created, but images failed.
              // Let the vendor add them from the edit page.
              router.push(`/vendor/services/${id}`);
              return;
            }
          }

          router.push("/vendor/services");
        }
      } finally {
        setSubmitting(false);
      }
    },
    [
      name,
      description,
      categoryId,
      prices,
      images,
      create,
      uploadImages,
      router,
      t,
      submitting,
    ]
  );

  const handleCancel = useCallback(() => {
    router.push("/vendor/services");
  }, [router]);

  return {
    actionError,
    categoryOptions,
    categoriesLoading: categoriesLoadingCombined,
    hasNoAssignedCategories,
    name,
    setName,
    description,
    setDescription,
    categoryId,
    setCategoryId,
    prices,
    addPriceRow,
    removePriceRow,
    updatePriceRow,
    imagePreviews,
    handleImagesSelected,
    removeImage,
    formError,
    isSubmitting,
    handleSubmit,
    handleCancel,
  };
}
