"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  MapPin,
  Pencil,
  Sparkles,
  Store,
  Target,
  Trophy,
  X,
  XCircle,
  Camera,
  Music2,
  Utensils,
  Gem,
  Flower2,
  CakeSlice,
  Shirt,
  Heart,
  Car,
  MoreHorizontal,
  MessageSquarePlus,
  Users,
  AlertCircle,
} from "lucide-react";

import { Tooltip, Badge, LinearProgress, Chip } from "@mui/material";

import AuthGuard from "@/components/guards/AuthGuard";
import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import { useToast } from "@/components/providers/ToastProvider";
import { formatDate } from "@/lib/format";
import { RoadmapItemStatus } from "@/types/roadmap";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";

// =========================================================
// Constants & Helpers
// =========================================================

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  photography: Camera,
  venue: Gem,
  decoration: Flower2,
  catering: Utensils,
  cake: CakeSlice,
  music: Music2,
  dress: Shirt,
  transport: Car,
};

const getCategoryIcon = (name: string, index: number): React.ElementType => {
  const key = name.toLowerCase();
  const matchedKey = Object.keys(CATEGORY_ICONS).find((k) => key.includes(k));
  if (matchedKey) return CATEGORY_ICONS[matchedKey];
  const fallbacks = [Camera, Gem, Flower2, Utensils, CakeSlice, Music2, Shirt, Heart, Car, MoreHorizontal];
  return fallbacks[index % fallbacks.length];
};

const getStatusConfig = (status: RoadmapItemStatus) => {
  switch (status) {
    case RoadmapItemStatus.Completed:
      return {
        label: "Completed",
        icon: CheckCircle2,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dotColor: "bg-emerald-500",
      };
    case RoadmapItemStatus.VendorSelected:
      return {
        label: "Vendor Selected",
        icon: Store,
        className: "bg-amber-50 text-amber-700 border-amber-200",
        dotColor: "bg-amber-500",
      };
    default:
      return {
        label: "Not Started",
        icon: Circle,
        className: "bg-gray-50 text-gray-600 border-gray-200",
        dotColor: "bg-gray-400",
      };
  }
};

// =========================================================
// Sub-Components
// =========================================================

const CountdownTimer = ({ eventDate }: { eventDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(eventDate).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  const items = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {items.map(({ value, label }) => (
        <div
          key={label}
          className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center backdrop-blur-sm sm:px-3 sm:py-4"
        >
          <div className="font-mono text-xl font-bold text-white sm:text-3xl">
            {String(value).padStart(2, "0")}
          </div>
          <div className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.15em] text-white/50 sm:text-[9px]">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProgressRing = ({ progress }: { progress: number }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative h-24 w-24 sm:h-28 sm:w-28">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f0eae5" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#a47e43"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-[#30251f] sm:text-2xl">{progress}%</span>
        <span className="text-[8px] uppercase tracking-[0.12em] text-[#9b8f86] sm:text-[9px]">
          Complete
        </span>
      </div>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  color = "#a47e43",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle: string;
  color?: string;
}) => (
  <div className="group rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
    <div className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-110"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#9a8d85]">
          {label}
        </p>
        <p className="mt-0.5 text-xl font-bold text-[#30251f] sm:text-2xl">{value}</p>
        <p className="text-[11px] text-[#9b8f86]">{subtitle}</p>
      </div>
    </div>
  </div>
);

// =========================================================
// Main Component
// =========================================================

function RoadmapContent() {
  const { roadmap, loading, error, actionLoading, create, update, removeVendor, complete, uncomplete } =
    useRoadmap();
  const { toast } = useToast();
  const [reviewItem, setReviewItem] = useState<{ id: string; categoryName: string } | null>(null);

  const handleAction = async (
    action: () => Promise<boolean>,
    successMsg: string,
    errorMsg: string
  ) => {
    const ok = await action();
    toast(ok ? successMsg : errorMsg, ok ? "success" : "error");
    return ok;
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#a47e43]" />
          <p className="mt-4 text-sm text-[#9b8f86]">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-red-800">Unable to load roadmap</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Create Roadmap Form
  if (!roadmap) {
    return <CreateRoadmapForm onCreate={create} loading={actionLoading === "create"} />;
  }

  const totalItems = roadmap.items.length;
  const completedItems = roadmap.items.filter(
    (i) => i.status === RoadmapItemStatus.Completed
  ).length;
  const selectedVendors = roadmap.items.filter((i) => !!i.selectedVendorId).length;
  const progress = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
  const remainingItems = roadmap.items.filter(
    (i) => i.status !== RoadmapItemStatus.Completed
  );
  const nextItem = remainingItems[0];
//   console.log(
//   "ROADMAP ITEMS",
//   roadmap.items.map((item) => ({
//     id: item.id,
//     categoryId: item.categoryId,
//     categoryName: item.categoryName,
//   }))
// );

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#30251f] via-[#3d3028] to-[#2a201b] p-6 shadow-xl sm:p-8 lg:p-10">
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#a47e43]/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#8e685e]/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-[#d5b77d]">
              <Sparkles size={16} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
                Wedding Command Center
              </span>
            </div>

            <h1 className="mt-4 font-serif text-3xl font-light leading-tight text-white sm:text-4xl lg:text-5xl">
              Everything for <span className="italic text-[#d8bd89]">your forever.</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
              A smarter wedding plan that tells you what to do next, keeps your vendors
              organized, and makes progress feel effortless.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Chip
                icon={<CalendarDays size={13} />}
                label={formatDate(roadmap.eventDate)}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "white",
                  borderColor: "rgba(255,255,255,0.1)",
                  "& .MuiChip-icon": { color: "#d5b77d" },
                }}
              />
              {roadmap.partnerName && (
                <Chip
                  icon={<Users size={13} />}
                  label={`Planning with ${roadmap.partnerName}`}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.1)",
                    "& .MuiChip-icon": { color: "#d5b77d" },
                  }}
                />
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">
                  The Big Day
                </p>
                <p className="mt-1 text-sm text-white/70">Time left until your celebration</p>
              </div>
              <Clock3 size={18} className="text-[#d5b77d]" />
            </div>
            <CountdownTimer eventDate={roadmap.eventDate} />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={`${completedItems}/${totalItems}`}
          subtitle="Categories finished"
          color="#10b981"
        />
        <StatCard
          icon={Store}
          label="Vendors"
          value={selectedVendors}
          subtitle="Vendors selected"
          color="#a47e43"
        />
        <StatCard
          icon={Target}
          label="Progress"
          value={`${progress}%`}
          subtitle="Overall completion"
          color="#8b5cf6"
        />
        <StatCard
          icon={Clock3}
          label="Next Up"
          value={nextItem?.categoryName || "All done!"}
          subtitle={nextItem ? "Your next priority" : "You nailed it"}
          color="#f59e0b"
        />
      </section>

      {/* PROGRESS + NEXT STEP */}
      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="rounded-3xl border border-[#eee7e1] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a47e43]">
                Your Progress
              </p>
              <h2 className="mt-1 font-serif text-2xl font-light text-[#30251f]">
                The plan, at a glance
              </h2>
              <p className="mt-1 text-xs text-[#9b8f86]">
                You are {progress}% of the way there. Keep going — the little decisions add up.
              </p>
            </div>
            <ProgressRing progress={progress} />
          </div>

          <div className="mt-6">
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: "6px",
                backgroundColor: "#f1ebe6",
                "& .MuiLinearProgress-bar": {
                  borderRadius: "6px",
                  background: "linear-gradient(90deg, #8e685e, #a47e43, #d5b77d)",
                },
              }}
            />
            <div className="mt-2 flex justify-between text-xs text-[#9b8f86]">
              <span>{completedItems} completed</span>
              <span>{Math.max(totalItems - completedItems, 0)} remaining</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e9ded4] bg-linear-to-br from-[#f8f2ec] to-[#f5ede5] p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 text-[#a47e43]">
            <Target size={16} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              Recommended Next
            </span>
          </div>

          {nextItem ? (
            <>
              <h3 className="mt-3 font-serif text-2xl font-light text-[#30251f]">
                {nextItem.categoryName}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#766d67]">
                Start with this category to keep your planning momentum. You can change
                the vendor later.
              </p>
              <Link
                href={`/vendors?categoryId=${encodeURIComponent(nextItem.categoryId)}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#42332a]"
              >
                Explore Vendors
                <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <>
              <h3 className="mt-3 font-serif text-2xl font-light text-[#30251f]">
                🎉 You're ready!
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#766d67]">
                Every roadmap category is complete. Time to enjoy the countdown.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <Trophy size={18} />
                <span>Amazing job! You've completed everything.</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ROADMAP ITEMS */}
      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a47e43]">
              Planning Timeline
            </p>
            <h2 className="mt-1 font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
              Build your celebration, step by step
            </h2>
          </div>
          <Badge
            badgeContent={`${totalItems} categories`}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#f5eee9",
                color: "#5f544d",
                fontSize: 11,
                fontWeight: 600,
                height: 24,
                padding: "0 12px",
              },
            }}
          />
        </div>

        <div className="space-y-3">
          {roadmap.items.map((item, index) => {
            const isCompleted = item.status === RoadmapItemStatus.Completed;
            const hasVendor = !!item.selectedVendorId;
            const isVendorSelected = item.status === RoadmapItemStatus.VendorSelected;
            const isPending = !isCompleted && !isVendorSelected;

            const Icon = getCategoryIcon(item.categoryName, index);
            const statusConfig = getStatusConfig(item.status);

            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isCompleted
                    ? "border-emerald-100 bg-emerald-50/40"
                    : isVendorSelected
                    ? "border-amber-100 bg-amber-50/30"
                    : "border-[#eee7e1] bg-white hover:border-[#d5c8be] hover:shadow-md"
                }`}
              >
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
                  {/* Left - Status + Icon + Name */}
                  <div className="flex items-center gap-3 sm:w-70 sm:shrink-0">
                    <button
                      onClick={() =>
                        handleAction(
                          () =>
                            isCompleted
                              ? uncomplete(item.categoryId)
                              : complete(item.categoryId),
                          isCompleted ? "Category reopened." : "Category completed!",
                          "We couldn't update this category."
                        )
                      }
                      disabled={
                        actionLoading === `complete-${item.categoryId}` ||
                        (!isCompleted && !hasVendor)
                      }
                      title={
                        !isCompleted && !hasVendor ? "Select a vendor first" : undefined
                      }
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                        isCompleted
                          ? "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : !hasVendor
                          ? "cursor-not-allowed border-[#eee7e1] bg-[#f5f2f0] text-[#c8bdb5]"
                          : "border-[#e8dfd8] bg-[#faf7f4] text-[#b6a79d] hover:border-[#a47e43] hover:text-[#a47e43]"
                      }`}
                    >
                      {actionLoading === `complete-${item.categoryId}` ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : isCompleted ? (
                        <Check size={18} />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isCompleted
                          ? "bg-white text-emerald-700"
                          : isVendorSelected
                          ? "bg-amber-50 text-amber-600"
                          : "bg-[#f6efe9] text-[#a47e43]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#b0a198]">
                          Step {String(index + 1).padStart(2, "0")}
                        </span>
                        {!isPending && (
                          <span
                            className={`inline-flex h-1.5 w-1.5 rounded-full ${statusConfig.dotColor}`}
                          />
                        )}
                      </div>
                      <h3
                        className={`truncate text-sm font-semibold ${
                          isCompleted
                            ? "text-emerald-800"
                            : isVendorSelected
                            ? "text-amber-800"
                            : "text-[#30251f]"
                        }`}
                      >
                        {item.categoryName}
                      </h3>
                    </div>
                  </div>

                  {/* Middle - Status + Vendor */}
                  <div className="min-w-0 flex-1 sm:border-l sm:border-[#eee7e1] sm:pl-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip
                        label={statusConfig.label}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "9px",
                          fontWeight: 600,
                          backgroundColor: statusConfig.className
                            .split(" ")[0]
                            .replace("bg-", ""),
                          color: statusConfig.className
                            .split(" ")[1]
                            .replace("text-", ""),
                        }}
                      />
                      {hasVendor && (
                        <Chip
                          icon={<Store size={12} />}
                          label={item.selectedVendorName}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "9px",
                            fontWeight: 500,
                            backgroundColor: "#f3eadf",
                            color: "#8c6a3c",
                            "& .MuiChip-icon": { color: "#8c6a3c" },
                          }}
                        />
                      )}
                    </div>

                    {isVendorSelected && hasVendor && (
                      <p className="mt-1.5 text-xs text-amber-700">
                        Vendor selected — mark this category complete when you're done.
                      </p>
                    )}
                    {isCompleted && !hasVendor && (
                      <p className="mt-1.5 text-xs text-emerald-700">
                        Marked complete — you can reopen this anytime.
                      </p>
                    )}
                    {isPending && !hasVendor && (
                      <p className="mt-1.5 text-xs text-[#9b8f86]">
                        Find a vendor, save your choice, then mark this category complete.
                      </p>
                    )}
                  </div>

                  {/* Right - Actions */}
                  <div className="flex shrink-0 items-center gap-1.5 sm:pl-2">
                    {isCompleted && hasVendor && (
                      <Tooltip title="Write a review" arrow>
                        <button
                          onClick={() =>
                            setReviewItem({
                              id: item.id,
                              categoryName: item.categoryName,
                            })
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4dbd0] text-[#5f544d] transition hover:border-[#a47e43] hover:text-[#a47e43] sm:h-10 sm:w-10"
                        >
                          <MessageSquarePlus size={15} />
                        </button>
                      </Tooltip>
                    )}

                    <Link
                      href={`/vendors?categoryId=${encodeURIComponent(item.categoryId)}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#30251f] px-3 text-xs font-semibold text-white transition hover:bg-[#42332a] sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
                    >
                      {hasVendor ? "Change" : "Find"} Vendor
                      <ArrowRight size={14} />
                    </Link>

                    {hasVendor && (
                      <Tooltip title="Remove vendor" arrow>
                        <button
                          onClick={() =>
                            handleAction(
                              () => removeVendor(item.categoryId),
                              "Vendor removed from your roadmap.",
                              "We couldn't remove the vendor."
                            )
                          }
                          disabled={actionLoading === `remove-${item.categoryId}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee1d8] text-[#9b8f86] transition hover:border-red-200 hover:text-red-500 sm:h-10 sm:w-10"
                        >
                          {actionLoading === `remove-${item.categoryId}` ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#eee7e1] bg-[#faf7f4] p-4 text-xs leading-relaxed text-[#766d67]">
        <MapPin className="mt-0.5 shrink-0 text-[#a47e43]" size={15} />
        <span>
          Your roadmap stays flexible: changing a vendor never changes the category, and
          reopening a completed category keeps your previous selection.
        </span>
      </div>

      {/* EDIT PLAN DETAILS */}
      <RoadmapSummary
        roadmap={roadmap}
        onUpdate={update}
        updating={actionLoading === "update"}
      />

      {/* REVIEW MODAL */}
      {reviewItem && (
        <WriteReviewModal
          roadmapItemId={reviewItem.id}
          categoryName={reviewItem.categoryName}
          onClose={() => setReviewItem(null)}
        />
      )}
    </div>
  );
}

// =========================================================
// Create Roadmap Form
// =========================================================

function CreateRoadmapForm({
  onCreate,
  loading,
}: {
  onCreate: (data: { partnerName: string; eventDate: string }) => Promise<boolean>;
  loading: boolean;
}) {
  const [partnerName, setPartnerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !eventDate) {
      setFormError("Please add your partner's name and wedding date.");
      return;
    }
    setFormError("");
    await onCreate({
      partnerName: partnerName.trim(),
      eventDate: new Date(eventDate).toISOString(),
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-3 py-16 sm:px-4">
      <div className="overflow-hidden rounded-3xl border border-[#eee7e1] bg-white shadow-xl">
        <div className="bg-linear-to-br from-[#30251f] to-[#1f1814] p-8 text-white sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Sparkles className="text-[#d5b77d]" size={22} />
          </div>
          <h1 className="mt-5 font-serif text-3xl font-light sm:text-4xl">
            Let's build your wedding plan.
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">
            Start with two details. We'll turn your wedding categories into a beautiful
            roadmap you can actually follow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#766d67]">
              Partner's Name
            </label>
            <input
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="e.g. Sarah"
              className="w-full rounded-2xl border border-[#e4dbd0] bg-[#fcfaf8] px-4 py-3.5 text-sm outline-none transition focus:border-[#a47e43] focus:ring-2 focus:ring-[#a47e43]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#766d67]">
              Wedding Date
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-2xl border border-[#e4dbd0] bg-[#fcfaf8] px-4 py-3.5 text-sm outline-none transition focus:border-[#a47e43] focus:ring-2 focus:ring-[#a47e43]/20"
            />
          </div>

          {formError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600">
              <AlertCircle size={14} className="mr-1.5 inline" />
              {formError}
            </div>
          )}

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#30251f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#42332a] disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Sparkles size={17} />
            )}
            {loading ? "Building your roadmap..." : "Create my roadmap"}
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================================================
// Roadmap Summary (Edit Details)
// =========================================================

function RoadmapSummary({
  roadmap,
  onUpdate,
  updating,
}: {
  roadmap: NonNullable<ReturnType<typeof useRoadmap>["roadmap"]>;
  onUpdate: (data: { partnerName: string; eventDate: string }) => Promise<boolean>;
  updating: boolean;
}) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [partnerName, setPartnerName] = useState(roadmap.partnerName);
  const [eventDate, setEventDate] = useState(roadmap.eventDate.slice(0, 10));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await onUpdate({
      partnerName,
      eventDate: new Date(eventDate).toISOString(),
    });
    if (ok) {
      setEditing(false);
      toast("Plan details updated.", "success");
    } else {
      toast("We couldn't update your plan.", "error");
    }
  };

  return (
    <section className="mt-6 rounded-3xl border border-[#eee7e1] bg-white p-5 shadow-sm sm:p-6">
      {!editing ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a47e43]">
              Plan Details
            </p>
            <h2 className="mt-1 font-serif text-xl font-light text-[#30251f]">
              {roadmap.partnerName
                ? `Planning with ${roadmap.partnerName}`
                : "Your Wedding Plan"}
            </h2>
            <p className="mt-1 text-xs text-[#9b8f86]">{formatDate(roadmap.eventDate)}</p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e4dbd0] px-4 py-2.5 text-xs font-semibold text-[#5f544d] transition hover:border-[#a47e43] hover:text-[#a47e43]"
          >
            <Pencil size={14} />
            Edit Details
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
              Partner's Name
            </label>
            <input
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              required
              className="w-full rounded-xl border border-[#e4dbd0] px-3 py-2.5 text-sm outline-none transition focus:border-[#a47e43] focus:ring-2 focus:ring-[#a47e43]/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#766d67]">
              Wedding Date
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              className="w-full rounded-xl border border-[#e4dbd0] px-3 py-2.5 text-sm outline-none transition focus:border-[#a47e43] focus:ring-2 focus:ring-[#a47e43]/20"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              disabled={updating}
              className="rounded-xl bg-[#30251f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#42332a] disabled:opacity-60"
            >
              {updating ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4dbd0] text-[#9b8f86] transition hover:bg-[#f5f1ed]"
            >
              <X size={16} />
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

// =========================================================
// Page Component
// =========================================================

export default function RoadmapPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#faf8f6]">
        <RoadmapContent />
      </main>
    </AuthGuard>
  );
}