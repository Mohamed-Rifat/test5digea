"use client";

import { Suspense } from "react";
import AuthGuard from "@/components/guards/AuthGuard";

import { RoadmapContent } from "@/components/roadmap/RoadmapContent";

export default function RoadmapPage() {
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <RoadmapContent />
      </Suspense>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-14px) rotate(5deg);
          }
        }

        @keyframes heartBeat {
          0%,
          100% {
            transform: scale(1);
          }

          10% {
            transform: scale(1.12);
          }

          20% {
            transform: scale(1);
          }

          30% {
            transform: scale(1.08);
          }

          45%,
          100% {
            transform: scale(1);
          }
        }

        @keyframes heroNameIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes countdownTick {
          0% {
            opacity: 0;
            transform: translateY(-7px) scale(0.96);
            filter: blur(2px);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes slowSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes progressShimmer {
          from {
            transform: translateX(-110%);
          }

          to {
            transform: translateX(310%);
          }
        }

        @keyframes finaleFall {
          0% {
            transform: translate3d(0, -20px, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--drift, 0), 1100px, 0) rotate(300deg);
            opacity: 0;
          }
        }

        @keyframes envelopeIn {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.7) rotate(-6deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
        }

        @keyframes envelopeFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-1deg);
          }
        }

        @keyframes sealPulse {
          0%,
          100% {
            box-shadow: 0 6px 16px rgba(80, 10, 10, 0.45),
              0 0 0 0 rgba(208, 100, 90, 0.55);
          }
          50% {
            box-shadow: 0 6px 16px rgba(80, 10, 10, 0.45),
              0 0 0 14px rgba(208, 100, 90, 0);
          }
        }

        @keyframes writeInLtr {
          from {
            clip-path: inset(0 100% 0 0);
            opacity: 0.2;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }

        @keyframes writeInRtl {
          from {
            clip-path: inset(0 0 0 100%);
            opacity: 0.2;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }

        @keyframes letterFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes heartFall {
          0% {
            transform: translate3d(0, -20px, 0) rotate(-12deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translate3d(calc(var(--drift, 0px) * 0.5), 550px, 0)
              rotate(12deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--drift, 0px), 1100px, 0) rotate(-10deg);
            opacity: 0;
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--drift, 0), 110vh, 0)
              rotate(var(--spin, 540deg));
            opacity: 0;
          }
        }

        @keyframes finaleShimmer {
          from {
            background-position: 100% 0;
          }
          to {
            background-position: -150% 0;
          }
        }

        @keyframes finaleGlow {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.92);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes finaleSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes finaleTwinkle {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes dashMove {
          to {
            stroke-dashoffset: -24;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </AuthGuard>
  );
}
