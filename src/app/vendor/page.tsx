"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Plus,
  RefreshCw,
  Star,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { useVendor } from "@/features/vendors/hooks/useVendor";
import { useVendorServices } from "@/features/services/hooks/useVendorServices";

const statusConfig = {
  Approved: {
    label: "Approved",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  Pending: {
    label: "Pending Review",
    icon: Clock3,
    className:
      "bg-amber-50 text-amber-700 border border-amber-200",
  },
  Rejected: {
    label: "Rejected",
    icon: XCircle,
    className:
      "bg-red-50 text-red-700 border border-red-200",
  },
  Inactive: {
    label: "Inactive",
    icon: XCircle,
    className:
      "bg-gray-100 text-gray-700 border border-gray-200",
  },
};

export default function VendorDashboardPage() {
  const {
    vendor,
    loading: vendorLoading,
    error: vendorError,
    refetch: refetchVendor,
  } = useVendor();

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    refetch: refetchServices,
  } = useVendorServices();

  const loading = vendorLoading || servicesLoading;

  const handleRefresh = async () => {
    await Promise.all([
      refetchVendor(),
      refetchServices(),
    ]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f6]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-72 rounded-xl bg-[#e9e1db]" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>

            <div className="h-72 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (vendorError || servicesError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-6">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="text-xl font-semibold text-[#30251f]">
            Unable to load dashboard
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#756b65]">
            Something went wrong while loading your vendor information.
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#463831]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return null;
  }

  const status =
    statusConfig[vendor.status] ?? statusConfig.Pending;

  const StatusIcon = status.icon;

  const activeServices = services.filter(
    (service) => service.status === "Approved"
  );

  const pendingServices = services.filter(
    (service) => service.status === "Pending"
  );

  const rejectedServices = services.filter(
    (service) => service.status === "Rejected"
  );

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-[#9b8171]">
              Vendor Dashboard
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-[#30251f] sm:text-4xl">
              Welcome, {vendor.businessName}
            </h1>

            <p className="mt-2 text-sm text-[#756b65]">
              Manage your business, services and marketplace presence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e3d9d1] bg-white px-4 text-sm font-medium text-[#514740] transition hover:bg-[#f7f2ef]"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/vendor/services"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-5 text-sm font-medium text-white transition hover:bg-[#463831]"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </Link>
          </div>
        </div>

        {/* Status Alert */}
        {vendor.status !== "Approved" && (
          <div className="mb-8 rounded-2xl border border-[#e8ddd5] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  vendor.status === "Rejected"
                    ? "bg-red-50"
                    : "bg-amber-50"
                }`}
              >
                <StatusIcon
                  className={`h-5 w-5 ${
                    vendor.status === "Rejected"
                      ? "text-red-500"
                      : "text-amber-600"
                  }`}
                />
              </div>

              <div className="min-w-0">
                <h2 className="font-semibold text-[#30251f]">
                  {vendor.status === "Rejected"
                    ? "Your vendor account was rejected"
                    : "Your vendor account is under review"}
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#756b65]">
                  {vendor.status === "Rejected"
                    ? vendor.rejectionReason ||
                      "Please review your information and resubmit your vendor profile."
                    : "Your account is currently being reviewed by the administration team."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Services"
            value={services.length}
            icon={BriefcaseBusiness}
            description="Services in your account"
          />

          <StatCard
            title="Average Rating"
            value={vendor.averageRating.toFixed(1)}
            icon={Star}
            description={`${vendor.reviewsCount} reviews`}
          />

          <StatCard
            title="Approved Services"
            value={activeServices.length}
            icon={CheckCircle2}
            description="Currently active"
          />

          <StatCard
            title="Pending Services"
            value={pendingServices.length}
            icon={Clock3}
            description={
              rejectedServices.length > 0
                ? `${rejectedServices.length} rejected`
                : "Awaiting review"
            }
          />
        </div>

        {/* Main Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Company Overview */}
          <section className="rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a08a7b]">
                  Company Overview
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#30251f]">
                  {vendor.businessName}
                </h2>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {status.label}
              </span>
            </div>

            {vendor.slogan && (
              <p className="mt-4 text-sm italic text-[#756b65]">
                “{vendor.slogan}”
              </p>
            )}

            {vendor.bio && (
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#625852]">
                {vendor.bio}
              </p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={MapPin}
                label="Location"
                value={vendor.location || "Not provided"}
              />

              <InfoItem
                icon={MessageCircle}
                label="Contact"
                value={
                  vendor.contactPhone ||
                  vendor.contactEmail ||
                  "Not provided"
                }
              />
            </div>

            {/* Categories */}
            <div className="mt-7 border-t border-[#eee7e2] pt-6">
              <p className="mb-3 text-sm font-semibold text-[#40352f]">
                Categories
              </p>

              {vendor.categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {vendor.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-[#f7f1ed] px-3.5 py-2 text-xs font-medium text-[#66564c]"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#8a7d75]">
                  No categories assigned yet.
                </p>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-3xl border border-[#e8dfd8] bg-[#30251f] p-6 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d9c7ba]">
              Quick Actions
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Manage your business
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#d6cbc4]">
              Keep your profile and services up to date to attract more
              customers.
            </p>

            <div className="mt-6 space-y-3">
              <QuickAction
                href="/vendor/services"
                icon={BriefcaseBusiness}
                title="My Services"
                description={`${services.length} services`}
              />

              <QuickAction
                href="/vendor/profile"
                icon={TrendingUp}
                title="Company Profile"
                description="Update your business information"
              />
            </div>
          </section>
        </div>

        {/* Recent Services */}
        <section className="mt-8 rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a08a7b]">
                Services
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#30251f]">
                Your Latest Services
              </h2>
            </div>

            <Link
              href="/vendor/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#604b3e] transition hover:text-[#30251f]"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {services.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#ded3cb] bg-[#fcfaf8] px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3ebe6]">
                <BriefcaseBusiness className="h-5 w-5 text-[#806b5e]" />
              </div>

              <h3 className="mt-4 font-semibold text-[#40352f]">
                No services yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#81746d]">
                Start adding your services so customers can discover what
                your business offers.
              </p>

              <Link
                href="/vendor/services"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#463831]"
              >
                <Plus className="h-4 w-4" />
                Add Your First Service
              </Link>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#eee7e2]">
              <div className="divide-y divide-[#eee7e2]">
                {services.slice(0, 5).map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col gap-3 p-4 transition hover:bg-[#fcfaf8] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-[#40352f]">
                        {service.name}
                      </h3>

                      <p className="mt-1 truncate text-sm text-[#81746d]">
                        {service.categoryName}
                      </p>
                    </div>

                    <ServiceStatus status={service.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#81746d]">{title}</p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-[#30251f]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#9a8d85]">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5eee9]">
          <Icon className="h-5 w-5 text-[#705b4e]" />
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#fcfaf8] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
        <Icon className="h-4 w-4 text-[#806b5e]" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-[#9a8d85]">{label}</p>
        <p className="mt-1 truncate text-sm font-medium text-[#514740]">
          {value}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
        <Icon className="h-5 w-5 text-white" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 truncate text-xs text-[#cfc2ba]">
          {description}
        </p>
      </div>

      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#cfc2ba]" />
    </Link>
  );
}

function ServiceStatus({ status }: { status: string }) {
  const config: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    Approved: {
      label: "Approved",
      className: "bg-emerald-50 text-emerald-700",
    },
    Pending: {
      label: "Pending",
      className: "bg-amber-50 text-amber-700",
    },
    Rejected: {
      label: "Rejected",
      className: "bg-red-50 text-red-700",
    },
    Inactive: {
      label: "Inactive",
      className: "bg-gray-100 text-gray-700",
    },
  };

  const current = config[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}
