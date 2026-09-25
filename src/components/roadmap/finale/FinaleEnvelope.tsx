"use client";

import { Sparkles, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { WeddingLetterState } from "./useWeddingLetter";

/** Sealed envelope that opens on tap. */
export function FinaleEnvelope({ letter }: { letter: WeddingLetterState }) {
  const { t, isArabic } = useLanguage();
  const { stage, setStage, sealRef, names, opened, risen, showLetter } = letter;

  return (
    <div
      aria-hidden={showLetter}
      className={`absolute flex flex-col items-center transition-all duration-700 ease-in ${
        showLetter
          ? "pointer-events-none translate-y-16 scale-90 opacity-0"
          : "opacity-100"
      }`}
    >
      <div
        className="animate-[envelopeIn_.9s_cubic-bezier(.2,.9,.25,1.15)_both]"
        style={{ perspective: 1400 }}
      >
        <div
          className={`relative h-[min(58vw,270px)] w-[min(86vw,400px)] ${stage === "intro" ? "animate-[envelopeFloat_3.2s_ease-in-out_1s_infinite]" : ""}`}
        >
          {/* inside */}
          <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-[#8c5d2e] to-[#b98a52] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]" />

          {/* the letter inside */}
          <div
            className="absolute inset-x-[7%] bottom-[5%] top-[7%] rounded-xl bg-[#fbf6ee] shadow-[0_-6px_20px_rgba(0,0,0,0.15)] transition-transform duration-[950ms] ease-[cubic-bezier(.3,.7,.2,1)]"
            style={{
              zIndex: 10,
              transform: risen ? "translateY(-68%)" : "translateY(0)",
            }}
          >
            <div className="flex h-full flex-col items-center justify-start gap-2 px-6 pt-5">
              <Heart size={18} fill="#d9a363" strokeWidth={0} />
              <span className="h-1.5 w-3/4 rounded-full bg-[#ecdcc2]" />
              <span className="h-1.5 w-2/3 rounded-full bg-[#ecdcc2]" />
              <span className="h-1.5 w-1/2 rounded-full bg-[#ecdcc2]" />
              <span className="h-1.5 w-3/5 rounded-full bg-[#ecdcc2]" />
            </div>
          </div>

          {/* front pocket */}
          <div
            className="absolute inset-0 z-20 rounded-2xl bg-linear-to-br from-[#f6e7cc] via-[#f0dcb8] to-[#e4c797]"
            style={{
              clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)",
            }}
          />
          <div
            className="absolute inset-0 z-20 rounded-2xl bg-linear-to-t from-[#e9cfa3] to-[#f3e2c4]"
            style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }}
          />
          <div className="pointer-events-none absolute inset-2 top-[30%] z-20 rounded-b-xl border border-t-0 border-[#c9914f]/25" />

          {/* names, handwritten onto the envelope */}
          <div className="absolute inset-x-0 bottom-[6%] z-30 text-center sm:bottom-[9%]">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#a8723a]/80">
              {t("roadmap.letter.to")}
            </p>
            <p
              className="mt-0.5 text-xl font-bold text-[#6b4423] sm:mt-1 sm:text-3xl"
              style={{
                animation: `${isArabic ? "writeInRtl" : "writeInLtr"} 1.4s cubic-bezier(.5,0,.3,1) .8s both`,
              }}
            >
              {names}
            </p>
          </div>

          {/* flap */}
          <div
            className="absolute inset-x-0 top-0 h-[56%] origin-top transition-transform duration-[850ms] ease-[cubic-bezier(.5,0,.25,1)] [transform-style:preserve-3d]"
            style={{
              zIndex: risen ? 5 : 40,
              transform: opened ? "rotateX(180deg)" : "rotateX(0deg)",
            }}
          >
            <div
              className="absolute inset-0 rounded-t-2xl bg-linear-to-b from-[#f3e1bf] to-[#dcbd88] [backface-visibility:hidden]"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />
            <div
              className="absolute inset-0 rounded-t-2xl bg-linear-to-t from-[#a87843] to-[#c99a5e] [backface-visibility:hidden]"
              style={{
                clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
                transform: "rotateX(180deg)",
              }}
            />
          </div>

          {/* wax seal */}
          <button
            ref={sealRef}
            type="button"
            onClick={() => stage === "intro" && setStage("opening")}
            aria-label={t("roadmap.letter.tapToOpen")}
            className={`absolute left-1/2 top-[56%] z-50 flex h-12 w-12 -translate-x-1/2 sm:h-16 sm:w-16 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d0645a,#9b2f2a_55%,#6e1c19)] shadow-[0_6px_16px_rgba(80,10,10,0.45),inset_0_-3px_6px_rgba(0,0,0,0.3)] ring-4 ring-[#b8463f]/30 transition-all duration-500 focus-visible:outline-none focus-visible:ring-[#f3d6a8] ${
              opened
                ? "pointer-events-none scale-150 opacity-0 blur-sm"
                : "animate-[sealPulse_1.8s_ease-in-out_2.2s_infinite] hover:scale-110"
            }`}
          >
            <span className="absolute inset-1.5 rounded-full border border-white/20" />
            <Heart
              fill="#fbe9e4"
              strokeWidth={0}
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
          </button>
        </div>
      </div>

      <p
        className={`mt-8 flex items-center gap-2 text-sm font-medium text-[#f1d4a6] transition-opacity duration-500 ${
          opened ? "opacity-0" : "animate-[letterFade_.8s_ease-out_2.2s_both]"
        }`}
      >
        <Sparkles size={14} aria-hidden="true" />
        {t("roadmap.letter.tapToOpen")}
      </p>
    </div>
  );
}
