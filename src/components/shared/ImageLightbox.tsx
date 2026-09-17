"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [index, setIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        setIndex((prev) => (prev + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, images.length, onClose]);

  if (!open || !mounted || images.length === 0) return null;

  const goPrev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setIndex((prev) => (prev + 1) % images.length);

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex flex-col bg-black/95 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Image viewer"}
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <span className="text-xs font-medium tracking-wide text-white/70 sm:text-sm">
          {title}
          {images.length > 1 && (
            <span className="ml-2 text-white/50">
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
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main image */}
      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16">
        {images.length > 1 && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]?.url}
          alt={title ? `${title} — image ${index + 1}` : `Image ${index + 1}`}
          className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
