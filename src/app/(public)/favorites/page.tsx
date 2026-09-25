"use client";

import AuthGuard from "@/components/guards/AuthGuard";
import { FavoritesBody } from "@/components/public/favorites/FavoritesBody";
import { FavoritesCompare } from "@/components/public/favorites/FavoritesCompare";
import { FavoritesHero } from "@/components/public/favorites/FavoritesHero";
import { useFavoritesPage } from "@/components/public/favorites/useFavoritesPage";

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <FavoritesContent />
    </AuthGuard>
  );
}

function FavoritesContent() {
  const state = useFavoritesPage();

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <FavoritesHero state={state} />
      <FavoritesBody state={state} />
      <FavoritesCompare state={state} />
    </main>
  );
}
