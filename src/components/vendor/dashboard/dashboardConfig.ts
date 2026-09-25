import { CheckCircle2, Clock3, XCircle } from "lucide-react";

export const statusConfig: Record<
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

export const COLORS = [
  "#a47e43",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
];

export type ChartTooltipPayload = {
  value?: unknown;
  payload?: {
    name?: string;
    month?: string;
    category?: string;
    percentage?: number | string;
    [key: string]: unknown;
  };
};

export type ChartTooltipProps = {
  active?: boolean;
  payload?: readonly ChartTooltipPayload[] | ReadonlyArray<unknown>;
  label?: string | number;
  unit?: string;
  prefix?: string;
};
