"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeartHandshake } from "lucide-react";
import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import { useToast } from "@/components/providers/ToastProvider";
import { RoadmapItemStatus, type RoadmapItem } from "@/types/roadmap";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";
import ViewReviewModal from "@/components/reviews/ViewReviewModal";
import { useMyReviews } from "@/features/reviews/hooks/useMyReviews";
import type { MyReview } from "@/features/reviews/hooks/useMyReviews";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { submitContactMessage } from "@/features/contactMessages/api";
import {
  ContactMessageType,
  encodeMessageDetails,
} from "@/features/contactMessages/types";
import { useLanguage } from "@/context/LanguageContext";
import { getApiErrorMessage } from "@/lib/error";
import { useAuth } from "@/context/AuthContext";

import { AllDoneCard } from "@/components/roadmap/AllDoneCard";
import { DoneSectionHeading } from "@/components/roadmap/DoneSectionHeading";
import { EnjoyAside } from "@/components/roadmap/EnjoyAside";
import { JourneyFilterHeader } from "@/components/roadmap/JourneyFilterHeader";
import { OutsideVendorsSection } from "@/components/roadmap/OutsideVendorsSection";
import { CreateRoadmapForm } from "@/components/roadmap/CreateRoadmapForm";
import { ExternalVendorModal } from "@/components/roadmap/ExternalVendorModal";
import { JourneyCard } from "@/components/roadmap/JourneyCard";
import {
  type JourneyHandlers,
  JourneyPath,
} from "@/components/roadmap/JourneyPath";
import { ReviewPromptModal } from "@/components/roadmap/ReviewPromptModal";
import { RoadmapHero } from "@/components/roadmap/RoadmapHero";
import { RoadmapOverview } from "@/components/roadmap/RoadmapOverview";
import { RoadmapSummary } from "@/components/roadmap/RoadmapSummary";
import {
  RoadmapError,
  RoadmapLoading,
} from "@/components/roadmap/RoadmapStates";
import { WeddingLetter } from "@/components/roadmap/WeddingFinale";
import { LetterTeaser } from "@/components/roadmap/finale/LetterTeaser";
import {
  FILTER_STORAGE_KEY,
  type JourneyGender,
  REFERRALS_KEY,
  type RoadmapFilter,
  getRoadmapItemKey,
  readReferrals,
  readStoredFilter,
  sortByPriority,
} from "@/components/roadmap/roadmapUtils";

export function RoadmapContent() {
  const {
    roadmap,
    loading,
    error,
    actionLoading,
    create,
    update,
    removeVendor,
    complete,
    uncomplete,
  } = useRoadmap();

  const { currentUser } = useCurrentUser();
  const myReviews = useMyReviews();
  const { user: authUser } = useAuth();
  const [referrals, setReferrals] = useState<Record<string, string>>(() =>
    typeof window === "undefined" ? {} : readReferrals(),
  );
  const rememberReferral = (categoryId: string, vendorName: string) => {
    setReferrals((current) => {
      const next = { ...current, [categoryId]: vendorName };
      try {
        window.localStorage.setItem(REFERRALS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };
  const [viewReview, setViewReview] = useState<MyReview | null>(null);
  const gender = currentUser?.gender as JourneyGender;

  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams.get("returnTo");
  const returnTo =
    rawReturnTo && rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//")
      ? rawReturnTo
      : null;

  const [filter, setFilter] = useState<RoadmapFilter>(() =>
    typeof window === "undefined" ? "all" : readStoredFilter(),
  );
  const [reviewItem, setReviewItem] = useState<{
    id: string;
    categoryName: string;
  } | null>(null);
  const [externalCompleteItem, setExternalCompleteItem] =
    useState<RoadmapItem | null>(null);
  const [externalSubmitting, setExternalSubmitting] = useState(false);
  const [externalMode, setExternalMode] = useState<"complete" | "share">(
    "complete",
  );
  const requestExternalComplete = (item: RoadmapItem) => {
    setExternalMode("complete");
    setExternalCompleteItem(item);
  };
  const requestShareExternal = (item: RoadmapItem) => {
    setExternalMode("share");
    setExternalCompleteItem(item);
  };
  const [reviewPromptItem, setReviewPromptItem] = useState<{
    id: string;
    categoryName: string;
  } | null>(null);

  // Every step done? Celebrate when it happens during this visit.
  const allDone =
    !!roadmap &&
    roadmap.items.length > 0 &&
    roadmap.items.every((i) => i.status === RoadmapItemStatus.Completed);
  const wasAllDone = useRef<boolean | null>(null);
  const [letterOpen, setLetterOpen] = useState(false);
  useEffect(() => {
    if (loading || !roadmap) return;
    if (wasAllDone.current === false && allDone) {
      const timer = window.setTimeout(() => setLetterOpen(true), 700);
      wasAllDone.current = allDone;
      return () => window.clearTimeout(timer);
    }
    wasAllDone.current = allDone;
  }, [allDone, loading, roadmap]);

  if (loading) return <RoadmapLoading />;

  if (error) return <RoadmapError message={error} />;

  if (!roadmap) {
    return (
      <CreateRoadmapForm
        onCreate={async (data) => {
          const ok = await create(data);
          // Came here from a vendor/service page: go straight back so the
          // couple can finish choosing — no dead end.
          if (ok && returnTo) {
            toast(t("roadmap.pick.createdReturn"), "success");
            router.push(returnTo);
          }
          return ok;
        }}
        loading={actionLoading === "create"}
        gender={gender}
      />
    );
  }

  const items = sortByPriority(roadmap.items);
  const numberOf = (item: RoadmapItem) => items.indexOf(item) + 1;
  const remainingItems = items.filter(
    (item) => item.status !== RoadmapItemStatus.Completed,
  );
  const doneItems = items.filter(
    (item) => item.status === RoadmapItemStatus.Completed,
  );
  // Done steps booked outside 5Digea get their own section, inviting the
  // couple to share the vendor so our team can bring them on board.
  const doneOutside = doneItems.filter((item) => !item.selectedVendorId);
  const doneOnSite = doneItems.filter((item) => item.selectedVendorId);
  const outsidePending = doneOutside.filter(
    (item) => !referrals[String(item.categoryId)],
  ).length;
  const renderDoneCard = (
    item: RoadmapItem,
    extra: Partial<JourneyHandlers> = {},
  ) => (
    <JourneyCard
      {...extra}
      item={item}
      index={numberOf(item) - 1}
      total={items.length}
      isNext={false}
      actionLoading={actionLoading}
      onReview={(item) => {
        if (item.id)
          setReviewItem({
            id: item.id,
            categoryName: item.categoryName,
          });
      }}
      onComplete={(categoryId) =>
        handleAction(
          () => complete(String(categoryId)),
          t("roadmap.toast.categoryCompleted"),
          t("roadmap.toast.categoryCompleteFailed"),
        )
      }
      onUncomplete={(categoryId) =>
        handleAction(
          () => uncomplete(String(categoryId)),
          t("roadmap.toast.categoryReopened"),
          t("roadmap.toast.categoryReopenFailed"),
        )
      }
      onRemove={(categoryId) =>
        handleAction(
          () => removeVendor(String(categoryId)),
          t("roadmap.toast.vendorRemoved"),
          t("roadmap.toast.vendorRemoveFailed"),
        )
      }
      onRequestExternalComplete={requestExternalComplete}
      onCompletedWithVendor={handleCompletedWithVendor}
      reviewOf={(item) => myReviews.reviewForVendor(item.selectedVendorId)}
      onViewReview={setViewReview}
      referralOf={(item) => referrals[String(item.categoryId)]}
    />
  );
  const changeFilter = (next: RoadmapFilter) => {
    setFilter(next);
    try {
      window.localStorage.setItem(FILTER_STORAGE_KEY, next);
    } catch {
      // ignore (private mode)
    }
  };
  const totalItems = items.length;
  const completedItems = items.filter(
    (item) => item.status === RoadmapItemStatus.Completed,
  ).length;
  const progress = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : 0;
  const nextItem =
    items.find((item) => item.status !== RoadmapItemStatus.Completed) ?? null;

  const handleAction = async (
    action: () => Promise<boolean>,
    success: string,
    failure: string,
  ) => {
    const ok = await action();
    toast(ok ? success : failure, ok ? "success" : "error");
    return ok;
  };

  const handleCompletedWithVendor = (item: RoadmapItem) => {
    // Already reviewed this vendor: don't ask again.
    if (myReviews.reviewForVendor(item.selectedVendorId)) return;
    if (item.id)
      setReviewPromptItem({ id: item.id, categoryName: item.categoryName });
  };

  const handleMarkDone = async (item: RoadmapItem) => {
    if (!item.selectedVendorId) {
      setExternalCompleteItem(item);
      return;
    }
    const ok = await handleAction(
      () => complete(String(item.categoryId)),
      t("roadmap.toast.categoryCompleted"),
      t("roadmap.toast.categoryCompleteFailed"),
    );
    if (ok) handleCompletedWithVendor(item);
  };

  const finalizeExternalComplete = async (feedback?: {
    vendorName: string;
    phone: string;
    link: string;
  }) => {
    if (!externalCompleteItem) return;
    const step = externalCompleteItem;
    setExternalSubmitting(true);

    if (feedback) {
      try {
        await submitContactMessage({
          type: ContactMessageType.ExternalVendorReferral,
          // /api/Auth/me can be slow or unavailable: fall back to the session.
          senderName: currentUser?.fullName || authUser?.fullName || "",
          senderEmail: currentUser?.email || authUser?.email || "",
          senderPhone: currentUser?.phoneNumber || "",
          message: encodeMessageDetails({
            categoryId: String(step.categoryId),
            categoryName: step.categoryName,
            vendorName: feedback.vendorName,
            vendorPhone: feedback.phone,
            vendorLink: feedback.link,
          }),
        });
        rememberReferral(String(step.categoryId), feedback.vendorName);
      } catch (err) {
        // Keep the form open with what was typed so the couple can retry
        // (or skip) - never lose the referral silently.
        toast(
          getApiErrorMessage(err, t("roadmap.external.sendFailed")),
          "error",
        );
        setExternalSubmitting(false);
        return;
      }
    }

    // Step already done ("share" mode): nothing to complete.
    if (
      externalMode === "share" ||
      step.status === RoadmapItemStatus.Completed
    ) {
      if (feedback)
        toast(
          t("roadmap.external.sent", { name: feedback.vendorName }),
          "success",
        );
      setExternalSubmitting(false);
      setExternalCompleteItem(null);
      return;
    }

    const ok = await complete(String(step.categoryId));
    if (ok) {
      toast(
        feedback
          ? t("roadmap.external.sent", { name: feedback.vendorName })
          : t("roadmap.toast.categoryCompleted"),
        "success",
      );
    } else {
      toast(t("roadmap.toast.categoryCompleteFailed"), "error");
    }
    setExternalSubmitting(false);
    setExternalCompleteItem(null);
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fbf8f4]">
      <RoadmapHero
        partnerName={roadmap.partnerName}
        eventDate={roadmap.eventDate}
        progress={progress}
        gender={gender}
      />

      <div className="mx-auto lg:max-w-10/12 px-4 pb-16 sm:px-6 lg:px-8">
        <RoadmapOverview
          items={items}
          progress={progress}
          eventDate={roadmap.eventDate}
          nextItem={nextItem}
          onMarkNextDone={handleMarkDone}
          onOpenLetter={allDone ? () => setLetterOpen(true) : undefined}
        />

        {/* JOURNEY */}
        <section aria-labelledby="journey-title" className="mt-14 sm:mt-16">
          <JourneyFilterHeader
            filter={filter}
            onChange={changeFilter}
            counts={{
              all: items.length,
              remaining: remainingItems.length,
              completed: doneItems.length,
            }}
          />

          {/* Still to do — the path, in recommended order */}
          {filter !== "completed" &&
            (remainingItems.length > 0 ? (
              <JourneyPath
                items={remainingItems}
                nextItem={nextItem}
                numberOf={numberOf}
                total={items.length}
                actionLoading={actionLoading}
                onReview={(item) => {
                  if (item.id)
                    setReviewItem({
                      id: item.id,
                      categoryName: item.categoryName,
                    });
                }}
                onComplete={(categoryId) =>
                  handleAction(
                    () => complete(String(categoryId)),
                    t("roadmap.toast.categoryCompleted"),
                    t("roadmap.toast.categoryCompleteFailed"),
                  )
                }
                onUncomplete={(categoryId) =>
                  handleAction(
                    () => uncomplete(String(categoryId)),
                    t("roadmap.toast.categoryReopened"),
                    t("roadmap.toast.categoryReopenFailed"),
                  )
                }
                onRemove={(categoryId) =>
                  handleAction(
                    () => removeVendor(String(categoryId)),
                    t("roadmap.toast.vendorRemoved"),
                    t("roadmap.toast.vendorRemoveFailed"),
                  )
                }
                onRequestExternalComplete={requestExternalComplete}
                onCompletedWithVendor={handleCompletedWithVendor}
                reviewOf={(item) =>
                  myReviews.reviewForVendor(item.selectedVendorId)
                }
                onViewReview={setViewReview}
                referralOf={(item) => referrals[String(item.categoryId)]}
              />
            ) : (
              <AllDoneCard
                onOpenLetter={allDone ? () => setLetterOpen(true) : undefined}
              />
            ))}

          {/* Done — moved below so the couple focuses on what's left */}
          {filter !== "remaining" && (
            <div
              className={
                filter === "all" && remainingItems.length > 0 ? "mt-14" : ""
              }
            >
              {filter === "all" && doneItems.length > 0 && (
                <DoneSectionHeading count={doneItems.length} />
              )}

              {doneOutside.length > 0 && (
                <OutsideVendorsSection
                  count={doneOutside.length}
                  pending={outsidePending}
                >
                  {doneOutside.map((item) => (
                    <li key={getRoadmapItemKey(item, numberOf(item))}>
                      {renderDoneCard(item, {
                        onShareExternal: requestShareExternal,
                      })}
                    </li>
                  ))}
                </OutsideVendorsSection>
              )}

              {doneOnSite.length > 0 && (
                <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {doneOnSite.map((item) => (
                    <li key={getRoadmapItemKey(item, numberOf(item))}>
                      {renderDoneCard(item)}
                    </li>
                  ))}
                </ul>
              )}

              {doneItems.length === 0 && filter === "completed" && (
                <p className="rounded-[28px] border border-dashed border-[#e0d4c8] bg-white p-8 text-center text-sm text-[#8b7e76]">
                  {t("roadmap.emptyState.noneDone")}
                </p>
              )}
            </div>
          )}
        </section>

        {allDone && <LetterTeaser onOpen={() => setLetterOpen(true)} />}

        {/* DETAILS + MESSAGE */}
        <div className="mt-14 grid gap-4 sm:mt-16 lg:grid-cols-[1fr_340px]">
          <RoadmapSummary
            roadmap={roadmap}
            onUpdate={update}
            updating={actionLoading === "update"}
            gender={gender}
          />

          <EnjoyAside />
        </div>

        <p className="mt-4 flex items-start gap-3 rounded-2xl border border-[#ebe2da] bg-white/70 p-4 text-sm leading-relaxed text-[#6f635b]">
          <HeartHandshake
            size={18}
            className="mt-0.5 shrink-0 text-[#ae7a3f]"
            aria-hidden="true"
          />
          {t("roadmap.footer.flexibleNote")}
        </p>
      </div>

      {letterOpen && (
        <WeddingLetter
          partnerName={roadmap.partnerName}
          eventDate={roadmap.eventDate}
          gender={gender}
          onClose={() => setLetterOpen(false)}
        />
      )}

      {viewReview && (
        <ViewReviewModal
          review={viewReview}
          onClose={() => setViewReview(null)}
        />
      )}

      {reviewItem && (
        <WriteReviewModal
          roadmapItemId={reviewItem.id}
          categoryName={reviewItem.categoryName}
          onClose={() => setReviewItem(null)}
          myReviews={myReviews}
          onViewReview={(review) => {
            setReviewItem(null);
            setViewReview(review);
          }}
        />
      )}

      {externalCompleteItem && (
        <ExternalVendorModal
          categoryName={externalCompleteItem.categoryName}
          mode={externalMode}
          submitting={externalSubmitting}
          onSkip={() => finalizeExternalComplete()}
          onSubmit={(data) => finalizeExternalComplete(data)}
          onClose={() => setExternalCompleteItem(null)}
        />
      )}

      {reviewPromptItem && (
        <ReviewPromptModal
          categoryName={reviewPromptItem.categoryName}
          onReviewNow={() => {
            setReviewItem({
              id: reviewPromptItem.id,
              categoryName: reviewPromptItem.categoryName,
            });
            setReviewPromptItem(null);
          }}
          onLater={() => setReviewPromptItem(null)}
        />
      )}
    </main>
  );
}
