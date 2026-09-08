"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  RotateCcw,
  Save,
} from "lucide-react";

import { useVendor } from "@/features/vendors/hooks/useVendor";
import type { UpdateVendorRequest } from "@/types/vendor";

const emptyForm: UpdateVendorRequest = {
  businessName: "",
  slogan: "",
  bio: "",
  location: "",
  latitude: 0,
  longitude: 0,
  contactPhone: "",
  contactEmail: "",
  socialLinksJson: "",
  workingHoursJson: "",
};

export default function VendorProfilePage() {
  const {
    vendor,
    loading,
    actionLoading,
    actionError,
    update,
    resubmit,
  } = useVendor();

  const [form, setForm] = useState<UpdateVendorRequest>(emptyForm);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (vendor) {
      setForm({
        businessName: vendor.businessName || "",
        slogan: vendor.slogan || "",
        bio: vendor.bio || "",
        location: vendor.location || "",
        latitude: vendor.latitude || 0,
        longitude: vendor.longitude || 0,
        contactPhone: vendor.contactPhone || "",
        contactEmail: vendor.contactEmail || "",
        socialLinksJson: vendor.socialLinksJson || "",
        workingHoursJson: vendor.workingHoursJson || "",
      });
    }
  }, [vendor]);

  const isSaving = actionLoading === "update";
  const isResubmitting = actionLoading === "resubmit";

  const handleChange = (
    field: keyof UpdateVendorRequest,
    value: string
  ) => {
    setSuccess(false);
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "latitude" || field === "longitude"
          ? Number(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    setSuccess(false);

    if (!form.businessName.trim()) {
      setFormError("Business name is required.");
      return;
    }

    const ok = await update(form);
    setSuccess(ok);
  };

  const handleResubmit = async () => {
    await resubmit();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f6] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6">
          <div className="h-6 w-40 rounded bg-[#e9e1db]" />
          <div className="h-96 rounded-3xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-[#9b8171]">
              Vendor Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#30251f]">
              Company Profile
            </h1>
            <p className="mt-2 text-sm text-[#756b65]">
              Keep your business information up to date.
            </p>
          </div>

          {vendor?.status === "Rejected" && (
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

        {vendor?.status === "Rejected" && vendor.rejectionReason && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            Rejection reason: {vendor.rejectionReason}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-sm sm:p-8"
        >
          {(formError || actionError) && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {formError || actionError}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#40352f]">
                Business Name
              </label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#40352f]">
                Slogan
              </label>
              <input
                type="text"
                value={form.slogan}
                onChange={(e) => handleChange("slogan", e.target.value)}
                placeholder="A short tagline for your business"
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#40352f]">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#40352f]">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#40352f]">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#40352f]">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#40352f]">
                Contact Phone
              </label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#40352f]">
                Contact Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#40352f]">
                Social Links (JSON)
              </label>
              <input
                type="text"
                value={form.socialLinksJson}
                onChange={(e) =>
                  handleChange("socialLinksJson", e.target.value)
                }
                placeholder='{"instagram":"...","facebook":"..."}'
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#40352f]">
                Working Hours (JSON)
              </label>
              <input
                type="text"
                value={form.workingHoursJson}
                onChange={(e) =>
                  handleChange("workingHoursJson", e.target.value)
                }
                placeholder='{"sat-thu":"9:00-18:00"}'
                className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-[#eee7e2] pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-6 text-sm font-medium text-white transition hover:bg-[#463831] disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>

            {success && (
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
