"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { loginPathFor } from "@/lib/auth-utils";
import { useLanguage } from "@/context/LanguageContext";
import { FavoriteTargetType } from "@/types/favorite";

interface FavoriteButtonProps {
  targetType: FavoriteTargetType;
  targetId: string;
  isFavorited: boolean;
  loading?: boolean;
  onToggle: (targetType: FavoriteTargetType, targetId: string) => void;
  size?: "sm" | "lg";
  className?: string;
}

export default function FavoriteButton({
  targetType,
  targetId,
  isFavorited,
  loading = false,
  onToggle,
  size = "sm",
  className = "",
}: FavoriteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isUser } = useAuth();
  const { t } = useLanguage();

  const dimensions = size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const iconSize = size === "lg" ? 20 : 16;

  // Favorites belong to couples' accounts: hide the heart for vendors/admins.
  if (isAuthenticated && !isUser) return null;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      router.push(loginPathFor(pathname));
      return;
    }

    onToggle(targetType, targetId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={
        isFavorited ? t("favorites.removeFromFavorites") : t("favorites.addToFavorites")
      }
      aria-pressed={isFavorited}
      className={`flex ${dimensions} items-center justify-center rounded-full border transition disabled:opacity-60 ${
        isFavorited
          ? "border-[#e2b3a8] bg-[#fdf1ef] text-[#c0564a]"
          : "border-[#e4dbd0] bg-white/90 text-[#8d7b70] hover:border-[#c0564a] hover:text-[#c0564a]"
      } ${className}`}
    >
      <Heart size={iconSize} fill={isFavorited ? "currentColor" : "none"} />
    </button>
  );
}
