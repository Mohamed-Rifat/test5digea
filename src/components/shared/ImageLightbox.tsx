"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export interface LightboxImage {
  id: string;
  url: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
  title?: string;
}

/**
 * Fullscreen image viewer: click-to-zoom, arrow / swipe-style navigation,
 * a thumbnail strip, and keyboard support (Esc, ← / →).
 */
export default function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onClose,
  title,
}: ImageLightboxProps) {
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const [index, setIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  // Touch-swipe state for mobile: only the horizontal delta at the moment
  // of release decides whether it was a swipe (vs. a scroll or a tap).
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      // Arrow keys follow the visual direction: in RTL, ← goes forward.
      const forwardKey = isRtl ? "ArrowLeft" : "ArrowRight";
      const backKey = isRtl ? "ArrowRight" : "ArrowLeft";
      if (event.key === forwardKey) {
        setIndex((prev) => (prev + 1) % images.length);
      }
      if (event.key === backKey) {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, images.length, onClose, isRtl]);

  if (!open || !mounted || images.length === 0) return null;

  const goPrev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setIndex((prev) => (prev + 1) % images.length);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    // Require a clearly horizontal, deliberate drag so a vertical scroll or
    // a plain tap never gets mistaken for a swipe.
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    // A left swipe advances to the next photo in LTR (mirrors typical photo
    // viewers); in RTL the whole gesture flips, same as the arrow keys above.
    const swipedForward = isRtl ? deltaX > 0 : deltaX < 0;
    if (swipedForward) goNext();
    else goPrev();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex flex-col bg-black/95 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label={title || t("common.imageViewer")}
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <span className="text-xs font-medium tracking-wide text-white/70 sm:text-sm">
          {title}
          {images.length > 1 && (
            <span className="ms-2 text-white/50">
              {index + 1} / {images.length}
            </span>
          )}
        </span>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          aria-label={t("common.close")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main image */}
      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (isRtl) goNext();
              else goPrev();
            }}
            aria-label={isRtl ? t("common.nextImage") : t("common.previousImage")}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <img
          loading="lazy"
          decoding="async"
          src={images[index]?.url}
          alt={
            title
              ? t("common.titleImageNumber", { title, number: index + 1 })
              : t("common.imageNumber", { number: index + 1 })
          }
          className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (isRtl) goPrev();
              else goNext();
            }}
            aria-label={isRtl ? t("common.previousImage") : t("common.nextImage")}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4 sm:h-12 sm:w-12"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex justify-center gap-2 overflow-x-auto px-4 pb-4 sm:pb-6"
          onClick={(event) => event.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-14 sm:w-14 ${
                i === index
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img
                loading="lazy"
                decoding="async"
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
