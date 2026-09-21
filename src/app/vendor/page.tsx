"use client";

import { useMemo, useState, useCallback } from "react";
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
  Sparkles,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  ChevronRight,
  AlertCircle,
  Users,
  Eye,
  Calendar,
  TrendingDown,
  Target,
  Zap,
  Shield,
  Clock,
  Package,
  ThumbsUp,
  MessageSquare,
  ShoppingBag,
  UserPlus,
  Gift,
  Crown,
} from "lucide-react";

import {
  Tooltip,
  Badge,
  Chip,
  LinearProgress,
  Avatar,
  AvatarGroup,
} from "@mui/material";

import AttentionPanel from "@/components/vendor/dashboard/AttentionPanel";
import ProfileCompleteness from "@/components/vendor/dashboard/ProfileCompleteness";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useVendorReviews } from "@/features/reviews/hooks/useVendorReviews";
import { ReviewStatus } from "@/types/review";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";

// ✅ استيراد recharts
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Line,
  ComposedChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";

// =========================================================
// Constants
// =========================================================

const statusConfig: Record<
  string,
  { icon: React.ElementType; className: string; color: string }
> = {
  Approved: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    color: "#10b981",
  },
  Pending: {
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    color: "#f59e0b",
  },
  Rejected: {
    icon: XCircle,
    className: "bg-red-50 text-red-700 border border-red-200",
    color: "#ef4444",
  },
  Inactive: {
    icon: XCircle,
    className: "bg-gray-100 text-gray-700 border border-gray-200",
    color: "#6b7280",
  },
};

const COLORS = ["#a47e43", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"];

// =========================================================
// Custom Tooltips - محسن للموبايل
// =========================================================

const CustomTooltip = ({ active, payload, label, unit = "", prefix = "" }: any) => {
  const { t } = useLanguage();

  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[#e8dfd8] bg-white px-3 py-2 shadow-lg max-w-50 sm:max-w-none">
        <p className="text-xs sm:text-sm font-semibold text-[#30251f] truncate">
          {label || payload[0]?.payload?.name || payload[0]?.payload?.month || payload[0]?.payload?.category}
        </p>
        <p className="text-[10px] sm:text-xs text-[#9b8f86]">
          {prefix}{payload[0]?.value} {unit}
        </p>
        {payload[0]?.payload?.percentage && (
          <p className="text-[10px] sm:text-xs text-[#a47e43] font-medium">
            {t("vendor.dashboard.charts.percentOfTotal", { percent: payload[0].payload.percentage })}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// =========================================================
// KPI Card Component - محسن للموبايل
// =========================================================

const KPICard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  progress,
  color = "#a47e43",
  badge,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle: string;
  trend?: { value: number; label: string; isPositive: boolean };
  progress?: number;
  color?: string;
  badge?: string;
}) => (
  <div className="group relative overflow-hidden rounded-2xl border border-[#e8dfd8] bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="absolute inset-e-8 -top-8 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#f8f2ed] opacity-60 transition-transform duration-500 group-hover:scale-125" />
    
    <div className="relative">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <p className="text-[10px] sm:text-sm text-[#81746d] truncate">{title}</p>
            {badge && (
              <span className="inline-flex shrink-0 items-center rounded-full bg-[#f5eee9] px-1.5 sm:px-2 py-0.5 text-[7px] sm:text-[9px] font-medium text-[#a47e43]">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-xl sm:text-3xl font-bold tracking-tight text-[#30251f]">
            {value}
          </p>
          <p className="mt-0.5 text-[9px] sm:text-xs text-[#9a8d85] truncate">{subtitle}</p>
        </div>
        <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color }} />
        </div>
      </div>

      {trend && (
        <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
          <span className={`inline-flex items-center gap-0.5 text-[9px] sm:text-xs font-medium ${
            trend.isPositive ? "text-emerald-600" : "text-red-600"
          }`}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-[9px] sm:text-xs text-[#9a8d85] truncate">{trend.label}</span>
        </div>
      )}

      {progress !== undefined && (
        <div className="mt-2 sm:mt-3">
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 3,
              borderRadius: "4px",
              backgroundColor: "#f0eae5",
              "& .MuiLinearProgress-bar": {
                backgroundColor: color,
                borderRadius: "4px",
              },
            }}
          />
        </div>
      )}
    </div>
  </div>
);

// =========================================================
// Charts Components
// =========================================================

// ✅ Rating Distribution Chart
const RatingDistribution = ({ reviews }: { reviews: any[] }) => {
  const { t } = useLanguage();
  const data = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    const approvedReviews = reviews.filter(r => r.status === ReviewStatus.Approved);
    const total = approvedReviews.length || 1;
    approvedReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating - 1]++;
      }
    });
    return counts.map((count, index) => ({
      name: `${index + 1}⭐`,
      value: count,
      percentage: ((count / total) * 100).toFixed(0),
    }));
  }, [reviews]);

  if (data.every(d => d.value === 0)) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-[#9b8f86]">
        {t("vendor.dashboard.charts.noRatings")}
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0eae5" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#9a8d85", fontSize: 11 }} axisLine={false} />
          <YAxis tick={{ fill: "#9a8d85", fontSize: 11 }} axisLine={false} />
          <ReTooltip content={<CustomTooltip unit={t("vendor.dashboard.charts.unitReviews")} />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell 
                key={index} 
                fill={COLORS[index % COLORS.length]} 
                opacity={entry.value > 0 ? 1 : 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ Monthly Activity Chart - كلها خطوط
const MonthlyActivity = ({ reviews }: { reviews: any[] }) => {
  const { t, language } = useLanguage();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];
  const data = useMemo(() => {
    // Buckets are keyed by year + month so a review from the same month of
    // last year is never counted in this year's bar.
    const bucketKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
    const months: Record<string, { month: string; total: number; approved: number; pending: number; rejected: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months[bucketKey(d)] = {
        month: d.toLocaleString(dateLocale, { month: "short" }),
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
      };
    }
    reviews.forEach((r) => {
      const bucket = months[bucketKey(new Date(r.createdAt))];
      if (bucket) {
        bucket.total++;
        if (r.status === ReviewStatus.Approved) bucket.approved++;
        else if (r.status === ReviewStatus.Pending) bucket.pending++;
        else if (r.status === ReviewStatus.Rejected) bucket.rejected++;
      }
    });
    return Object.values(months);
  }, [reviews, dateLocale]);

  if (data.every(d => d.total === 0)) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-[#9b8f86]">
        {t("vendor.dashboard.charts.noActivity")}
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a47e43" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a47e43" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientApproved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientRejected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0eae5" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#9a8d85", fontSize: 11 }} axisLine={false} />
          <YAxis tick={{ fill: "#9a8d85", fontSize: 11 }} axisLine={false} />
          <ReTooltip content={<CustomTooltip unit={t("vendor.dashboard.charts.unitReviews")} />} />
          <Legend wrapperStyle={{ fontSize: "11px", color: "#9a8d85" }} />
          {/* ✅ Total - Area Chart (خط مع تعبئة) */}
          <Area
            type="monotone"
            dataKey="total"
            stroke="#a47e43"
            strokeWidth={3}
            fill="url(#gradientTotal)"
            name={t("vendor.dashboard.charts.total")}
          />
          {/* ✅ Approved - Line Chart (خط بس) */}
          <Line
            type="monotone"
            dataKey="approved"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ fill: "#10b981", r: 4 }}
            name={t("vendor.dashboard.charts.approved")}
          />
          {/* ✅ Pending - Line Chart (خط بس) */}
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={{ fill: "#f59e0b", r: 4 }}
            name={t("vendor.dashboard.charts.pending")}
          />
          {/* ✅ Rejected - Line Chart (خط بس) */}
          <Line
            type="monotone"
            dataKey="rejected"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ fill: "#ef4444", r: 4 }}
            name={t("vendor.dashboard.charts.rejected")}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ Service Status Pie Chart
const StatusDistribution = ({ services }: { services: any[] }) => {
  const { t } = useLanguage();
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    const statusLabels: Record<string, string> = {
      Approved: t("vendor.dashboard.itemStatus.approved"),
      Pending: t("vendor.dashboard.itemStatus.pending"),
      Rejected: t("vendor.dashboard.itemStatus.rejected"),
      Inactive: t("vendor.dashboard.itemStatus.inactive"),
    };
    return Object.entries(counts).map(([name, value]) => ({
      name: statusLabels[name] ?? name,
      value,
    }));
  }, [services, t]);

  if (data.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-[#9b8f86]">
        {t("vendor.dashboard.charts.noServices")}
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={65}
            paddingAngle={3}
            dataKey="value"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={index} 
                fill={COLORS[index % COLORS.length]} 
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <ReTooltip content={<CustomTooltip unit={t("vendor.dashboard.charts.unitServices")} />} />
          <Legend 
            wrapperStyle={{ fontSize: "11px", color: "#9a8d85" }}
            iconType="circle"
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ Performance Radar Chart
const PerformanceRadar = ({ reviews, services }: { reviews: any[]; services: any[] }) => {
  const { t } = useLanguage();
  const data = useMemo(() => {
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter(r => r.status === ReviewStatus.Approved).length;
    const avgRating = approvedReviews > 0
      ? reviews.filter(r => r.status === ReviewStatus.Approved).reduce((acc, r) => acc + r.rating, 0) / approvedReviews
      : 0;
    const totalServices = services.length;
    const approvedServices = services.filter(s => s.status === "Approved").length;
    
    return [
      { category: t("vendor.dashboard.charts.quality"), value: avgRating > 0 ? (avgRating / 5) * 100 : 0, fullMark: 100 },
      { category: t("vendor.dashboard.charts.approvalRate"), value: totalServices > 0 ? (approvedServices / totalServices) * 100 : 0, fullMark: 100 },
      { category: t("vendor.dashboard.charts.customerTrust"), value: totalReviews > 0 ? Math.min((approvedReviews / totalReviews) * 100, 100) : 0, fullMark: 100 },
      { category: t("vendor.dashboard.charts.serviceDiversity"), value: Math.min((totalServices / 10) * 100, 100), fullMark: 100 },
      { category: t("vendor.dashboard.charts.engagement"), value: Math.min((totalReviews / 20) * 100, 100), fullMark: 100 },
    ];
  }, [reviews, services, t]);

  if (data.every(d => d.value === 0)) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-[#9b8f86]">
        {t("vendor.dashboard.charts.noPerformance")}
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="#f0eae5" />
          <PolarAngleAxis dataKey="category" tick={{ fill: "#9a8d85", fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9a8d85", fontSize: 9 }} />
          <Radar
            name={t("vendor.dashboard.charts.performanceSeries")}
            dataKey="value"
            stroke="#a47e43"
            fill="#a47e43"
            fillOpacity={0.3}
            strokeWidth={2}
            animationDuration={1500}
          />
          <ReTooltip 
            content={({ active, payload }: any) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-xl border border-[#e8dfd8] bg-white px-3 py-2 shadow-lg">
                    <p className="text-sm font-semibold text-[#30251f]">{payload[0]?.payload?.category}</p>
                    <p className="text-xs text-[#a47e43] font-medium">{payload[0]?.value?.toFixed(0)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// =========================================================
// Sub-Components
// =========================================================

const ServiceStatus = ({ status }: { status: string }) => {
  const { t } = useLanguage();

  const config: Record<string, { label: string; className: string }> = {
    Approved: { label: `✅ ${t("vendor.dashboard.itemStatus.approved")}`, className: "bg-emerald-50 text-emerald-700" },
    Pending: { label: `⏳ ${t("vendor.dashboard.itemStatus.pending")}`, className: "bg-amber-50 text-amber-700" },
    Rejected: { label: `❌ ${t("vendor.dashboard.itemStatus.rejected")}`, className: "bg-red-50 text-red-700" },
    Inactive: { label: `⚪ ${t("vendor.dashboard.itemStatus.inactive")}`, className: "bg-gray-100 text-gray-700" },
  };

  const current = config[status] ?? config.Pending;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs ${current.className}`}>
      {current.label}
    </span>
  );
};

const ReviewStatusBadge = ({ status }: { status: ReviewStatus }) => {
  const { t } = useLanguage();

  const config = {
    [ReviewStatus.Approved]: { label: `✅ ${t("vendor.dashboard.itemStatus.approved")}`, className: "bg-emerald-50 text-emerald-700" },
    [ReviewStatus.Pending]: { label: `⏳ ${t("vendor.dashboard.itemStatus.pending")}`, className: "bg-amber-50 text-amber-700" },
    [ReviewStatus.Rejected]: { label: `❌ ${t("vendor.dashboard.itemStatus.rejected")}`, className: "bg-red-50 text-red-700" },
  };

  const current = config[status] ?? config[ReviewStatus.Pending];

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${current.className}`}>
      {current.label}
    </span>
  );
};

// =========================================================
// Main Component
// =========================================================

export default function VendorDashboardPage() {
  const { t, language } = useLanguage();
  const { vendor, loading: vendorLoading, error: vendorError, refetch: refetchVendor } = useVendor();
  const { services, loading: servicesLoading, error: servicesError, refetch: refetchServices } = useVendorServices();
  const { reviews, loading: reviewsLoading, error: reviewsError, refetch: refetchReviews } = useVendorReviews();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loading = vendorLoading || servicesLoading || reviewsLoading;

  const stats = useMemo(() => {
    const totalServices = services.length;
    const approvedServices = services.filter(s => s.status === "Approved").length;
    const pendingServices = services.filter(s => s.status === "Pending").length;
    const rejectedServices = services.filter(s => s.status === "Rejected").length;
    
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter(r => r.status === ReviewStatus.Approved).length;
    const pendingReviews = reviews.filter(r => r.status === ReviewStatus.Pending).length;
    const rejectedReviews = reviews.filter(r => r.status === ReviewStatus.Rejected).length;
    
    const avgRating = approvedReviews > 0
      ? reviews.filter(r => r.status === ReviewStatus.Approved).reduce((acc, r) => acc + r.rating, 0) / approvedReviews
      : 0;
    
    const approvalRate = totalServices > 0 ? (approvedServices / totalServices) * 100 : 0;
    
    const ratingCounts = [0, 0, 0, 0, 0];
    reviews.filter(r => r.status === ReviewStatus.Approved).forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating - 1]++;
    });
    const fiveStarRate = approvedReviews > 0 ? (ratingCounts[4] / approvedReviews) * 100 : 0;
    
    return {
      totalServices,
      approvedServices,
      pendingServices,
      rejectedServices,
      totalReviews,
      approvedReviews,
      pendingReviews,
      rejectedReviews,
      avgRating,
      approvalRate,
      fiveStarRate,
      ratingCounts,
    };
  }, [services, reviews]);

  // "Latest reviews" must really be the newest ones, whatever order the API returns.
  const recentReviews = useMemo(
    () =>
      [...reviews]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 4),
    [reviews]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchVendor(), refetchServices(), refetchReviews()]);
    setIsRefreshing(false);
  }, [refetchVendor, refetchServices, refetchReviews]);

  if (loading) return <LoadingSkeleton />;
  if (vendorError || servicesError || reviewsError) return <ErrorState onRefresh={handleRefresh} />;
  if (!vendor) return null;

  const status = statusConfig[vendor.status] ?? statusConfig.Pending;
  const StatusIcon = status.icon;

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-6 lg:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">

              <div className="mt-1.5 flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                  <Award size={16} className="text-[#a47e43] sm:h-5 sm:w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-[#30251f] sm:text-2xl lg:text-3xl">
                    {t("vendor.dashboard.welcome", { name: vendor.businessName })}
                  </h1>
                </div>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-3 sm:mt-2">
                <p className="text-xs text-[#756b65] sm:text-sm">
                  {t("vendor.dashboard.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                aria-label={t("vendor.dashboard.refresh")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] disabled:opacity-50 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin sm:h-5 sm:w-5" : "sm:h-5 sm:w-5"} />
              </button>

              <Link
                href="/vendor/services/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#30251f] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#463831] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                <Plus size={13} className="sm:h-4 sm:w-4" /> <span>{t("vendor.dashboard.addServices")}</span>
              </Link>
            </div>
          </div>
        </header>

        {/* =================================================
            STATUS ALERT
        ================================================= */}

        {vendor.status !== "Approved" && (
          <div className="mb-6 rounded-2xl border border-[#e8ddd5] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${vendor.status === "Rejected" ? "bg-red-50" : "bg-amber-50"}`}>
                <StatusIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${vendor.status === "Rejected" ? "text-red-500" : "text-amber-600"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                  {vendor.status === "Rejected" ? t("vendor.dashboard.alert.rejectedTitle") : t("vendor.dashboard.alert.pendingTitle")}
                </h2>
                <p className="mt-0.5 text-xs leading-5 text-[#756b65] sm:mt-1 sm:text-sm sm:leading-6">
                  {vendor.status === "Rejected"
                    ? vendor.rejectionReason || t("vendor.dashboard.alert.rejectedDefault")
                    : t("vendor.dashboard.alert.pendingText")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            KPI CARDS - 4 Columns
        ================================================= */}

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KPICard
            title={t("vendor.dashboard.kpi.totalServices")}
            value={stats.totalServices}
            icon={BriefcaseBusiness}
            subtitle={t("vendor.dashboard.kpi.activeCount", { count: stats.approvedServices })}
            color="#a47e43"
            badge={t("vendor.dashboard.kpi.active")}
          />

          <KPICard
            title={t("vendor.dashboard.kpi.avgRating")}
            value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
            icon={Star}
            subtitle={t("vendor.dashboard.kpi.reviewsCount", { count: stats.totalReviews })}
            color="#f59e0b"
            badge={stats.fiveStarRate > 50 ? t("vendor.dashboard.kpi.topRated") : t("vendor.dashboard.kpi.good")}
          />

          <KPICard
            title={t("vendor.dashboard.kpi.approvalRate")}
            value={`${stats.approvalRate.toFixed(0)}%`}
            icon={TrendingUp}
            subtitle={t("vendor.dashboard.kpi.ofTotal", { approved: stats.approvedServices, total: stats.totalServices })}
            progress={stats.approvalRate}
            color="#10b981"
            badge={stats.approvalRate > 70 ? t("vendor.dashboard.kpi.excellent") : t("vendor.dashboard.kpi.needsWork")}
          />

          <KPICard
            title={t("vendor.dashboard.kpi.pendingReviews")}
            value={stats.pendingReviews}
            icon={Clock}
            subtitle={t("vendor.dashboard.kpi.rejectedCount", { count: stats.rejectedReviews })}
            color="#f59e0b"
            badge={stats.pendingReviews > 0 ? t("vendor.dashboard.kpi.actionRequired") : t("vendor.dashboard.kpi.allClear")}
          />
        </div>

        {/* =================================================
            NEEDS ATTENTION + PROFILE COMPLETENESS
        ================================================= */}

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <AttentionPanel services={services} />
          <ProfileCompleteness vendor={vendor} />
        </div>

        {/* =================================================
            CHARTS SECTION - 2 Columns
        ================================================= */}

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#30251f]">{t("vendor.dashboard.charts.serviceStatus")}</h3>
                <p className="text-xs text-[#9b8f86]">{t("vendor.dashboard.charts.serviceStatusSub")}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5eee9]">
                <PieChart size={16} className="text-[#a47e43]" />
              </div>
            </div>
            <StatusDistribution services={services} />
          </div>

          <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#30251f]">{t("vendor.dashboard.charts.ratingDistribution")}</h3>
                <p className="text-xs text-[#9b8f86]">{t("vendor.dashboard.charts.ratingDistributionSub")}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5eee9]">
                <BarChart3 size={16} className="text-[#a47e43]" />
              </div>
            </div>
            <RatingDistribution reviews={reviews} />
          </div>
        </div>

        {/* =================================================
            MONTHLY ACTIVITY + PERFORMANCE RADAR
        ================================================= */}

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#30251f]">{t("vendor.dashboard.charts.monthlyActivity")}</h3>
                <p className="text-xs text-[#9b8f86]">{t("vendor.dashboard.charts.monthlyActivitySub")}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5eee9]">
                <LineChart size={16} className="text-[#a47e43]" />
              </div>
            </div>
            <MonthlyActivity reviews={reviews} />
          </div>

          <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#30251f]">{t("vendor.dashboard.charts.performance")}</h3>
                <p className="text-xs text-[#9b8f86]">{t("vendor.dashboard.charts.performanceSub")}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5eee9]">
                <Activity size={16} className="text-[#a47e43]" />
              </div>
            </div>
            <PerformanceRadar reviews={reviews} services={services} />
          </div>
        </div>

        {/* =================================================
            RECENT REVIEWS + QUICK STATS
        ================================================= */}

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#30251f]">{t("vendor.dashboard.reviews.title")}</h3>
                <p className="text-xs text-[#9b8f86]">{t("vendor.dashboard.reviews.subtitle")}</p>
              </div>
              <Link
                href="/vendor/reviews"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#a47e43] hover:text-[#8b6d55]"
              >
                {t("vendor.dashboard.reviews.viewAll")} <ChevronRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#ded3cb] bg-[#fcfaf8] px-4 py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3ebe6]">
                  <Star className="h-5 w-5 text-[#806b5e]" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[#40352f]">{t("vendor.dashboard.reviews.emptyTitle")}</h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-[#81746d]">{t("vendor.dashboard.reviews.emptyText")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex flex-col gap-2 rounded-xl border border-[#f0eae5] bg-[#fcfaf8] p-3 transition hover:border-[#e3d9d1] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-[#30251f] text-sm">
                          {review.userFullName || t("vendor.dashboard.reviews.anonymous")}
                        </span>
                        <span className="text-[10px] text-[#9b8f86]">
                          {new Date(review.createdAt).toLocaleDateString(LANGUAGE_DATE_LOCALE[language])}
                        </span>
                        <ReviewStatusBadge status={review.status} />
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-amber-500 text-sm">
                          {"⭐".repeat(Math.round(review.rating))}
                        </span>
                        <span className="text-xs text-[#9b8f86]">{review.rating}/5</span>
                      </div>
                      {review.comment && (
                        <p className="mt-1 truncate text-xs text-[#625852]">{review.comment}</p>
                      )}
                    </div>
                    <Link
                      href={`/vendor/reviews?review=${encodeURIComponent(review.id)}`}
                      className="text-xs font-medium text-[#a47e43] hover:text-[#8b6d55] whitespace-nowrap"
                    >
                      {t("vendor.dashboard.reviews.view")}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-[#30251f]">{t("vendor.dashboard.quickStats.title")}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-[#fcfaf8] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9a8d85]">{t("vendor.dashboard.quickStats.approved")}</p>
                    <p className="text-sm font-semibold text-[#30251f]">{stats.approvedServices}</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 font-medium">+{stats.approvedServices > 0 ? Math.round(stats.approvalRate) : 0}%</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#fcfaf8] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                    <Clock3 size={14} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9a8d85]">{t("vendor.dashboard.quickStats.pending")}</p>
                    <p className="text-sm font-semibold text-[#30251f]">{stats.pendingServices}</p>
                  </div>
                </div>
                <span className="text-xs text-amber-600 font-medium">{t("vendor.dashboard.quickStats.awaiting")}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#fcfaf8] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                    <XCircle size={14} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9a8d85]">{t("vendor.dashboard.quickStats.rejected")}</p>
                    <p className="text-sm font-semibold text-[#30251f]">{stats.rejectedServices}</p>
                  </div>
                </div>
                <span className="text-xs text-red-600 font-medium">{t("vendor.dashboard.quickStats.needsReview")}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#fcfaf8] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                    <Star size={14} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9a8d85]">{t("vendor.dashboard.quickStats.fiveStar")}</p>
                    <p className="text-sm font-semibold text-[#30251f]">{stats.fiveStarRate.toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            RECENT SERVICES
        ================================================= */}

        {services.length > 0 && (
          <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#30251f]">{t("vendor.dashboard.services.title")}</h3>
                <p className="text-xs text-[#9b8f86]">{t("vendor.dashboard.services.subtitle")}</p>
              </div>
              <Link
                href="/vendor/services"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#a47e43] hover:text-[#8b6d55]"
              >
                {t("vendor.dashboard.reviews.viewAll")} <ChevronRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.slice(0, 4).map((service) => (
                <Link
                  key={service.id}
                  href={`/vendor/services/${service.id}`}
                  className="group rounded-xl border border-[#f0eae5] bg-[#fcfaf8] p-4 transition hover:border-[#a47e43] hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-[#30251f]">{service.name}</h4>
                      <p className="mt-0.5 text-xs text-[#9a8d85]">{service.categoryName || t("vendor.dashboard.services.uncategorized")}</p>
                    </div>
                    <ServiceStatus status={service.status} />
                  </div>
                  {service.prices.length > 0 && (
                    <p className="mt-2 text-xs text-[#a47e43] font-medium">
                      {t("vendor.dashboard.services.from", { price: `${Math.min(...service.prices.map(p => p.price))} ${t("common.currency")}` })}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// =========================================================
// Loading & Error States
// =========================================================

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-72 rounded-xl bg-[#e9e1db]" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-72 rounded-2xl bg-white shadow-sm" />
            <div className="h-72 rounded-2xl bg-white shadow-sm" />
          </div>
          <div className="h-80 rounded-2xl bg-white shadow-sm" />
          <div className="h-96 rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ onRefresh }: { onRefresh: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-4">
      <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 sm:mb-5 sm:h-16 sm:w-16">
          <XCircle className="h-7 w-7 text-red-500 sm:h-8 sm:w-8" />
        </div>
        <h1 className="text-lg font-semibold text-[#30251f] sm:text-xl">{t("vendor.dashboard.error.title")}</h1>
        <p className="mt-2 text-sm leading-6 text-[#756b65]">{t("vendor.dashboard.error.text")}</p>
        <button
          type="button"
          onClick={onRefresh}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#463831] sm:mt-6 sm:px-5 sm:py-3"
        >
          <RefreshCw className="h-4 w-4" />
          {t("vendor.dashboard.error.retry")}
        </button>
      </div>
    </div>
  );
}