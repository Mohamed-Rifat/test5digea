"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, Loader2, Pencil, Sparkles, X } from "lucide-react";
import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import { useToast } from "@/components/providers/ToastProvider";
import { formatDate } from "@/lib/format";
import { TextField } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";

import { type JourneyGender, getJourneyCopy } from "@/components/roadmap/roadmapUtils";

export function RoadmapSummary({
  roadmap,
  onUpdate,
  updating,
  gender,
}: {
  roadmap: NonNullable<ReturnType<typeof useRoadmap>["roadmap"]>;
  onUpdate: (data: {
    partnerName: string;
    eventDate: string;
  }) => Promise<boolean>;
  updating: boolean;
  gender?: JourneyGender;
}) {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const copy = getJourneyCopy(gender, t);

  const [editing, setEditing] = useState(false);
  const [partnerName, setPartnerName] = useState(roadmap.partnerName ?? "");
  const [eventDate, setEventDate] = useState(
    roadmap.eventDate ? roadmap.eventDate.slice(0, 10) : "",
  );

  const startEditing = () => {
    setPartnerName(roadmap.partnerName ?? "");
    setEventDate(roadmap.eventDate ? roadmap.eventDate.slice(0, 10) : "");
    setEditing(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await onUpdate({
      partnerName: partnerName.trim(),
      eventDate: eventDate ? new Date(eventDate).toISOString() : "",
    });
    if (ok) {
      setEditing(false);
      toast(t("roadmap.summary.toast.updated"), "success");
    } else {
      toast(t("roadmap.summary.toast.updateFailed"), "error");
    }
  };

  

  return (
    <section
      id="plan-details"
      aria-labelledby="plan-details-title"
      className="scroll-mt-24 rounded-[28px] border border-[#ebe2da] bg-white p-5 shadow-sm sm:p-7"
    >
      {!editing ? (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f7eee5] text-[#a9773c]">
              <CalendarDays size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#a9773c]">
                {t("roadmap.summary.label")}
              </p>
              <h2
                id="plan-details-title"
                className="mt-0.5 text-lg font-bold text-[#30251f]"
              >
                {roadmap.partnerName
                  ? t("roadmap.summary.planningWith", {
                      name: roadmap.partnerName,
                    })
                  : copy.partnerHeaderFallback}
              </h2>
              <p className="mt-0.5 text-sm text-[#8b7e76]">
                {roadmap.eventDate
                  ? formatDate(
                      roadmap.eventDate,
                      LANGUAGE_DATE_LOCALE[language],
                    )
                  : t("roadmap.summary.dateComingSoon")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={startEditing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e2d8cf] px-5 text-sm font-semibold text-[#5f544d] transition hover:border-[#b17c42] hover:text-[#8f6330]"
          >
            <Pencil size={15} aria-hidden="true" />
            {t("roadmap.summary.editButton")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#a9773c]">
                {t("roadmap.summary.editEyebrow")}
              </p>
              <h2
                id="plan-details-title"
                className="mt-0.5 text-lg font-bold text-[#30251f]"
              >
                {t("roadmap.summary.label")}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setEditing(false)}
              aria-label={t("roadmap.summary.cancel")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4dad2] text-[#9b8e85] transition hover:bg-[#f8f4f0]"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              id="summary-partner"
              label={copy.partnerLabel}
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder={copy.partnerPlaceholder}
            />
            <TextField
              id="summary-date"
              type="date"
              label={t("roadmap.create.weddingDateLabel")}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>

          {!eventDate && (
            <p className="mt-3 flex items-start gap-1.5 text-sm leading-relaxed text-[#8b7e76]">
              <Sparkles
                size={14}
                className="mt-0.5 shrink-0 text-[#a9773c]"
                aria-hidden="true"
              />
              {copy.noDateReassurance}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-11 rounded-xl border border-[#e3d9d1] px-5 text-sm font-semibold text-[#766a62] transition hover:bg-[#f8f4f0]"
            >
              {t("roadmap.summary.cancel")}
            </button>
            <button
              type="submit"
              disabled={updating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30221d] px-6 text-sm font-semibold text-white transition hover:bg-[#46332a] disabled:opacity-60"
            >
              {updating && (
                <Loader2
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
              )}
              {updating
                ? t("roadmap.summary.saving")
                : t("roadmap.summary.saveChanges")}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
