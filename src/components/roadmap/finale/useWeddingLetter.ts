"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { SITE_URL } from "@/lib/site";
import {
  type JourneyGender,
  getCurrentUserName,
  getFirstName,
  getJourneyCopy,
} from "@/components/roadmap/roadmapUtils";

/** Wedding letter: envelope stages, names, date and sharing. */
export interface WeddingLetterProps {
  partnerName: string;
  eventDate: string;
  gender?: JourneyGender;
  onClose: () => void;
}

export type LetterStage = "intro" | "opening" | "rising" | "letter";

export function useWeddingLetter({
  partnerName,
  eventDate,
  gender,
  onClose,
}: WeddingLetterProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const copy = getJourneyCopy(gender, t);
  const [stage, setStage] = useState<LetterStage>(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "letter"
      : "intro",
  );
  const [confetti, setConfetti] = useState(false);
  const sealRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const firstUserName = getFirstName(user?.fullName || getCurrentUserName());
  const firstPartnerName = getFirstName(partnerName || copy.partnerFallback);
  const names = `${firstUserName} & ${firstPartnerName}`;

  const target = eventDate ? new Date(eventDate) : null;
  const hasDate = !!target && !Number.isNaN(target.getTime());
  const [today] = useState(() => new Date());
  const isToday = hasDate && target!.toDateString() === today.toDateString();

  const shareUrl =
    typeof window === "undefined" ? SITE_URL : window.location.origin;
  const shareText = t("roadmap.finale.shareText");

  // Timeline: names are written, then the envelope opens (on tap, or by
  // itself after a moment), the letter rises out and unfolds full-size.
  useEffect(() => {
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));
    if (stage === "intro") at(3600, () => setStage("opening"));
    if (stage === "opening") at(1050, () => setStage("rising"));
    if (stage === "rising") at(1000, () => setStage("letter"));
    if (stage === "letter") {
      at(0, () => setConfetti(true));
      at(650, () => closeRef.current?.focus({ preventScroll: true }));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [stage]);

  // Esc to close, page scroll locked while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    sealRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prev;
    };
  }, [onClose]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "5Digea",
          text: shareText,
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast(t("roadmap.finale.copied"), "success");
    } catch {
      // share sheet dismissed
    }
  };

  const opened = stage !== "intro";
  const risen = stage === "rising" || stage === "letter";
  const showLetter = stage === "letter";

  const line = (delay: number) => ({
    className: `transition-all duration-[900ms] ease-out ${
      showLetter
        ? "translate-y-0 opacity-100 blur-0"
        : "translate-y-4 opacity-0 blur-[2px]"
    }`,
    style: { transitionDelay: `${showLetter ? delay : 0}ms` },
  });

  return {
    eventDate,
    onClose,
    copy,
    stage,
    setStage,
    confetti,
    setConfetti,
    sealRef,
    closeRef,
    firstUserName,
    firstPartnerName,
    names,
    target,
    hasDate,
    isToday,
    shareUrl,
    shareText,
    handleShare,
    opened,
    risen,
    showLetter,
    line,
    user,
    toast,
  };
}

export type WeddingLetterState = ReturnType<typeof useWeddingLetter>;
