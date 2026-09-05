"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import { useCategories } from "@/features/categories/hooks/useCategories";
import type { CreateServicePriceRequest } from "@/types/service";

export default function NewVendorServicePage() {
  const router = useRouter();

  const { create, actionLoading, actionError } = useVendorServices();
  const { vendor, loading: vendorLoading } = useVendor();
  const { categories, loading: categoriesLoading } = useCategories();
  const assignedCategories = categories.filter((category) =>
    vendor?.categories?.some(
      (vendorCategory) =>
        vendorCategory.toLowerCase() === category.name.toLowerCase()
    )
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [prices, setPrices] = useState<CreateServicePriceRequest[]>([
    { label: "", price: 0 },
  ]);
  const [formError, setFormError] = useState("");

  const loadingCategories = categoriesLoading || vendorLoading;
  const isSubmitting = actionLoading === "create";

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

  const handleSubmit = async (event: FormEvent) => {
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
  };

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/vendor/services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#756b65] transition hover:text-[#30251f]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight text-[#30251f]">
          Add a New Service
        </h1>
        <p className="mt-2 text-sm text-[#756b65]">
          Your service will be sent for admin review before it appears in the
          marketplace.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-sm sm:p-8"
        >
          {(formError || actionError) && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {formError || actionError}
            </div>
          )}

          {assignedCategories.length === 0 && !loadingCategories && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              You haven't been assigned any categories yet. Please contact
              an admin so they can enable categories for your account before
              you add services.
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#40352f]">
              Service Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Wedding Photography Package"
              className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#40352f]">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              disabled={loadingCategories || assignedCategories.length === 0}
              className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
            >
              <option value="">Select a category</option>
              {assignedCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-[#9b8f86]">
              Only categories an admin has approved for your account are
              shown here.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#40352f]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="Describe what's included in this service..."
              className="w-full resize-none rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-[#40352f]">
                Pricing Options
              </label>
              <button
                type="button"
                onClick={addPriceRow}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#604b3e] transition hover:text-[#30251f]"
              >
                <Plus className="h-4 w-4" />
                Add Price
              </button>
            </div>

            <div className="space-y-3">
              {prices.map((price, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={price.label}
                    onChange={(event) =>
                      updatePriceRow(index, "label", event.target.value)
                    }
                    placeholder="Label (e.g. Basic Package)"
                    className="flex-1 rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
                  />
                  <input
                    type="number"
                    min={0}
                    value={price.price}
                    onChange={(event) =>
                      updatePriceRow(index, "price", event.target.value)
                    }
                    placeholder="Price"
                    className="w-32 rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
                  />
                  {prices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePriceRow(index)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e3d9d1] text-[#9a5555] transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-[#eee7e2] pt-6">
            <button
              type="submit"
              disabled={isSubmitting || assignedCategories.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-6 text-sm font-medium text-white transition hover:bg-[#463831] disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Submit for Review
            </button>

            <Link
              href="/vendor/services"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e3d9d1] bg-white px-6 text-sm font-medium text-[#514740] transition hover:bg-[#f7f2ef]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
