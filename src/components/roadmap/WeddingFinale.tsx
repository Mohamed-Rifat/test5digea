"use client";

import { useLanguage } from "@/context/LanguageContext";

import { ConfettiBurst } from "@/components/roadmap/finale/finaleEffects";
import { FinaleEnvelope } from "@/components/roadmap/finale/FinaleEnvelope";
import { FinaleLetterCard } from "@/components/roadmap/finale/FinaleLetterCard";
import { FinalePetals } from "@/components/roadmap/finale/FinalePetals";
import {
  useWeddingLetter,
  type WeddingLetterProps,
} from "@/components/roadmap/finale/useWeddingLetter";

/** Full-screen wedding letter shown once every roadmap step is done. */
export function WeddingLetter(props: WeddingLetterProps) {
  const { t } = useLanguage();
  const letter = useWeddingLetter(props);
  const { confetti, setConfetti } = letter;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="letter-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-3 sm:p-6"
    >
      {confetti && <ConfettiBurst onDone={() => setConfetti(false)} />}

      {/* backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-label={t("common.close")}
        onClick={props.onClose}
        className="absolute inset-0 cursor-default bg-[#120b09]/85 backdrop-blur-md animate-[letterFade_.5s_ease-out_both]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(226,183,119,0.22),transparent_55%)]" />

      <FinalePetals />
      <FinaleEnvelope letter={letter} />
      <FinaleLetterCard letter={letter} />
    </div>
  );
}
