"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Info,
  Loader2,
  Plus,
  Save,
  Trash2,
  Sparkles,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

import {
  Tooltip,
  Badge,
  CircularProgress,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";

import Select from "@/components/shared/Select";
import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import type { CreateServicePriceRequest } from "@/types/service";

export default function NewVendorServicePage() {
  const router = useRouter();

  const { create, actionLoading, actionError } = useVendorServices();
  const { categories, loading: categoriesLoading } = useCategories();
  const { vendor, loading: vendorLoading } = useVendor();

  // A vendor can only publish services under categories that were assigned
  // to their business — showing the full category catalog would let them
  // pick one the backend will reject.
  const availableCategories = useMemo(() => {
    if (!vendor) return [];

    const assignedNames = new Set(vendor.categories);

    return categories.filter(
      (category) => category.isActive && assignedNames.has(category.name)
    );
  }, [categories, vendor]);

  const categoryOptions = useMemo(
    () =>
      availableCategories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [availableCategories]
  );

  const categoriesLoadingCombined = categoriesLoading || vendorLoading;
  const hasNoAssignedCategories =
    !categoriesLoadingCombined && availableCategories.length === 0;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [prices, setPrices] = useState<CreateServicePriceRequest[]>([
    { label: "", price: 0 },
  ]);
  const [formError, setFormError] = useState("");

  const isSubmitting = actionLoading === "create";

  const addPriceRow = useCallback(() => {
    setPrices((prev) => [...prev, { label: "", price: 0 }]);
  }, []);

  const removePriceRow = useCallback((index: number) => {
    setPrices((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updatePriceRow = useCallback((
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
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!name.trim() || !description.trim() || !categoryId) {
      setFormError("Please fill in the service name, description and category.");
      return;
    }

    const validPrices = prices.filter(
      (price) => price.label.trim() !== "" && price.price >= 0
    );

    if (validPrices.length === 0) {
      setFormError("Please add at least one price option.");
      return;
    }

    const id = await create({
      categoryId,
      name: name.trim(),
      description: description.trim(),
      prices: validPrices,
    });

    if (id) {
      router.push("/vendor/services");
    }
  }, [name, description, categoryId, prices, create, router]);

  const handleCancel = useCallback(() => {
    router.push("/vendor/services");
  }, [router]);

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        {/* =================================================
            Header
        ================================================= */}

        <header className="mb-4 sm:mb-6 lg:mb-8">
          <Link
            href="/vendor/services"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#756b65] transition hover:text-[#30251f] sm:mb-4 sm:gap-2 sm:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to services
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
              <BriefcaseBusiness size={16} className="text-[#a47e43] sm:h-5 sm:w-5" strokeWidth={1.8} />
            </div>
            <div>
              <p className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b8171] sm:mb-1 sm:text-xs">
                <Sparkles size={11} className="sm:h-3.25 sm:w-3.25" />
                Vendor Dashboard
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
                Add a New Service
              </h1>
            </div>
          </div>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
            Your service will be sent for admin review before it appears in the marketplace.
            Fill in all the details below to get started.
          </p>
        </header>

        {/* =================================================
            Form
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6 lg:p-8"
        >
          {/* =================================================
              Errors
          ================================================= */}

          {(formError || actionError) && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-700 sm:mb-8 sm:p-4 sm:text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <span className="leading-5 sm:leading-6">{formError || actionError}</span>
            </div>
          )}

          {/* =================================================
              Service Name
          ================================================= */}

          <div className="mb-5 sm:mb-6">
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
            <p className="mt-1 text-[10px] text-[#9b8f86] sm:text-xs">
              Choose a clear and descriptive name for your service
            </p>
          </div>

          {/* =================================================
              Category
          ================================================= */}

          <div className="mb-5 sm:mb-6">
            <label className="mb-1.5 block text-xs font-medium text-[#40352f] sm:mb-2 sm:text-sm">
              Category <span className="text-red-500">*</span>
            </label>

            {categoriesLoadingCombined ? (
              <div className="flex items-center gap-3 rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-[#a47e43]" />
                <span className="text-sm text-[#9b8f86]">Loading categories...</span>
              </div>
            ) : (
              <Select
                value={categoryId}
                onChange={setCategoryId}
                options={categoryOptions}
                loading={categoriesLoadingCombined}
                placeholder="Select a category"
                emptyMessage="No categories assigned to your business yet."
              />
            )}

            {hasNoAssignedCategories ? (
              <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-700 sm:p-3">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="leading-5">
                  Your business has no assigned categories yet, so you can&apos;t add a service.
                  Please <a href="/support" className="font-semibold underline hover:no-underline">contact support</a> to get a category assigned.
                </span>
              </div>
            ) : (
              <p className="mt-1 text-[10px] text-[#9b8f86] sm:text-xs">
                Choose the category that best fits your service
              </p>
            )}
          </div>

          {/* =================================================
              Description
          ================================================= */}

          <div className="mb-5 sm:mb-6">
            <label className="mb-1.5 block text-xs font-medium text-[#40352f] sm:mb-2 sm:text-sm">
              Description <span className="text-red-500">*</span>
            </label>
            <TextField
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              multiline
              rows={5}
              placeholder="Describe what's included in this service, what customers can expect, and any special features..."
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
            <p className="mt-1 text-[10px] text-[#9b8f86] sm:text-xs">
              Be detailed and specific. This helps customers understand the value you offer.
            </p>
          </div>

          {/* =================================================
              Pricing Options
          ================================================= */}

          <div className="mb-5 sm:mb-6">
            <div className="mb-1.5 flex items-center justify-between sm:mb-2">
              <label className="text-xs font-medium text-[#40352f] sm:text-sm">
                Pricing Options <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addPriceRow}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#604b3e] transition hover:bg-[#f5eee9] hover:text-[#30251f] sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-sm"
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

            <p className="mt-1.5 text-[10px] text-[#9b8f86] sm:mt-2 sm:text-xs">
              Add at least one price option. You can add multiple packages or tiers.
            </p>
          </div>

          {/* =================================================
              Form Actions
          ================================================= */}

          <div className="flex flex-col gap-2 border-t border-[#eee7e2] pt-4 sm:flex-row sm:items-center sm:gap-3 sm:pt-6">
            <button
              type="submit"
              disabled={isSubmitting || hasNoAssignedCategories}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 text-xs font-medium text-white transition hover:bg-[#463831] disabled:opacity-60 sm:h-11 sm:px-6 sm:text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Submit for Review
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e3d9d1] bg-white px-4 text-xs font-medium text-[#514740] transition hover:bg-[#f7f2ef] sm:h-11 sm:px-6 sm:text-sm"
            >
              Cancel
            </button>

            {/* Status indicator */}
            <div className="mt-2 flex items-center gap-2 text-[10px] text-[#9b8f86] sm:ml-auto sm:mt-0 sm:text-xs">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Draft</span>
            </div>
          </div>

          {/* =================================================
              Form Footer Info
          ================================================= */}

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-3 text-[10px] text-[#6f625a] sm:mt-6 sm:p-3.5 sm:text-xs">
            <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a47e43] sm:h-4 sm:w-4" />
            <span className="leading-5">
              <span className="font-medium text-[#40352f]">Need help?</span>{' '}
              All services are reviewed by our team before going live. Make sure your description is clear and accurate.
              <a href="/support" className="ml-1 font-medium text-[#a47e43] hover:underline">
                Contact support
              </a>
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}