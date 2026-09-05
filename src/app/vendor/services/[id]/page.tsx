"use client";

import Link from "next/link";
import { FormEvent, use, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";

import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import type { CreateServicePriceRequest, Service } from "@/types/service";

interface PageProps {
  params: Promise<{ id: string }>;
}

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

  const service: Service | undefined = services.find((s) => s.id === id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prices, setPrices] = useState<CreateServicePriceRequest[]>([]);

  const [detailsSuccess, setDetailsSuccess] = useState(false);
  const [pricesSuccess, setPricesSuccess] = useState(false);
  const [formError, setFormError] = useState("");

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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f6] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6">
          <div className="h-6 w-40 rounded bg-[#e9e1db]" />
          <div className="h-64 rounded-3xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#e8dfd8] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[#30251f]">
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

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#30251f]">
              {service.name}
            </h1>
            <p className="mt-2 text-sm text-[#756b65]">
              {service.categoryName} &middot; Status: {service.status}
            </p>
          </div>

          {service.status === "Rejected" && (
            <button
              type="button"
              onClick={handleResubmit}
              disabled={isResubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-5 text-sm font-medium text-[#514740] transition hover:bg-[#f7f2ef] disabled:opacity-60"
            >
              {isResubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              Resubmit for Review
            </button>
          )}
        </div>

        {service.status === "Rejected" && service.rejectionReason && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            Rejection reason: {service.rejectionReason}
          </div>
        )}

        {(formError || actionError) && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {formError || actionError}
          </div>
        )}

        <form
          onSubmit={handleSaveDetails}
          className="mt-6 space-y-6 rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-lg font-semibold text-[#30251f]">
            Service Details
          </h2>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#40352f]">
              Service Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#40352f]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
            />
          </div>

          <div className="flex items-center gap-3 border-t border-[#eee7e2] pt-6">
            <button
              type="submit"
              disabled={isSavingDetails}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-6 text-sm font-medium text-white transition hover:bg-[#463831] disabled:opacity-60"
            >
              {isSavingDetails ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Details
            </button>

            {detailsSuccess && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <CheckCircle className="h-4 w-4" />
                Saved
              </span>
            )}
          </div>
        </form>

        <form
          onSubmit={handleSavePrices}
          className="mt-6 space-y-6 rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#30251f]">
              Pricing Options
            </h2>
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
                  placeholder="Label"
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

          <div className="flex items-center gap-3 border-t border-[#eee7e2] pt-6">
            <button
              type="submit"
              disabled={isSavingPrices}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-6 text-sm font-medium text-white transition hover:bg-[#463831] disabled:opacity-60"
            >
              {isSavingPrices ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Prices
            </button>

            {pricesSuccess && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <CheckCircle className="h-4 w-4" />
                Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
