"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Loader2,
  Sparkles,
  Gem,
  Flower2,
  Heart,
  AlertCircle,
} from "lucide-react";
import { OptionalLabel, TextField } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";

import { type JourneyGender, getJourneyCopy } from "@/components/roadmap/roadmapUtils";

export function CreateRoadmapForm({
  onCreate,
  loading,
  gender,
}: {
  onCreate: (data: {
    partnerName: string;
    eventDate: string;
  }) => Promise<boolean>;
  loading: boolean;
  /** Signed-in user's gender ("Male" / "Female"), used to personalize the
   * copy below — who we ask about, and how we reassure them if a detail
   * isn't ready yet. */
  gender?: JourneyGender;
}) {
  const { t, isArabic } = useLanguage();
  const [partnerName, setPartnerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [formError, setFormError] = useState("");

  const copy = getJourneyCopy(gender, t);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setFormError("");

    // Neither field is required to begin the journey — a name or a date
    // that isn't settled yet shouldn't block someone from starting. We
    // simply carry forward whatever has been filled in.
    await onCreate({
      partnerName: partnerName.trim(),
      eventDate: eventDate ? new Date(eventDate).toISOString() : "",
    });
  };

  return (
    <div className="min-h-screen bg-[#fbf8f4] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[36px] border border-[#e5d9cf] bg-white shadow-[0_25px_80px_rgba(48,37,31,0.12)]">
        <div className="relative overflow-hidden bg-[#30221d] px-7 py-12 text-center sm:px-12">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#d49b5b]/15 blur-3xl" />

          <div className="relative">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#dfb67b]/30 bg-[#dfb67b]/10">
              <Heart size={27} fill="#d9a363" className="text-[#d9a363]" />

              {/* Small gendered touch on the entry screen too. */}
              {copy.touch !== "neutral" && (
                <div
                  className="absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#30221d] bg-[#fbf8f4] shadow-sm"
                  style={{ color: copy.accentColor }}
                >
                  {copy.touch === "groom" ? (
                    <Gem size={12} />
                  ) : (
                    <Flower2 size={12} />
                  )}
                </div>
              )}
            </div>

            <p className="mt-7 text-sm font-semibold text-[#dcb078]">
              {copy.eyebrow}
            </p>

            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
              {copy.heading}
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/55">
              {copy.subheading}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-10">
          <TextField
            id="roadmap-partner"
            label={<OptionalLabel text={copy.partnerLabel} optional={t("roadmap.create.optional")} />}
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder={copy.partnerPlaceholder}
            startIcon={<Heart size={16} />}
          />

          <div>
            <TextField
              id="roadmap-date"
              type="date"
              label={
                <OptionalLabel
                  text={t("roadmap.create.weddingDateLabel")}
                  optional={t("roadmap.create.optional")}
                />
              }
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              startIcon={<CalendarDays size={16} />}
            />

            {!eventDate && (
              <p className="mt-2.5 flex items-start gap-1.5 text-sm leading-relaxed text-[#8b7e76]">
                <Sparkles
                  size={12}
                  className="mt-0.5 shrink-0 text-[#b17c42]"
                />
                {copy.noDateReassurance}
              </p>
            )}
          </div>

          {formError && (
            <div className="flex gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs text-red-600">
              <AlertCircle size={15} className="shrink-0" />
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#30221d] text-sm font-semibold text-white transition hover:bg-[#46332a] hover:shadow-lg disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                {t("roadmap.create.submit.creating")}
              </>
            ) : (
              <>
                <Heart size={17} />
                {t("roadmap.create.submit.button")}
                <ArrowRight
                  size={16}
                  className={isArabic ? "rotate-180" : ""}
                />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
