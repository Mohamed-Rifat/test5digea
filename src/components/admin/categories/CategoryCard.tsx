"use client";

import {
  Edit3,
  Image as ImageIcon,
  Languages,
  MoreVertical,
  Trash2,
  Zap,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { isBilingual } from "@/lib/bilingual";
import type { Category } from "@/types/category";
import Switch from "@/components/ui/Switch";

interface CategoryCardProps {
  category: Category;
  serviceCount: number;
  servicesLoading: boolean;
  isToggling: boolean;
  busy: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

/** Category tile: icon, status, menu, description, service count and toggle. */
export function CategoryCard({
  category,
  serviceCount,
  servicesLoading,
  isToggling,
  busy,
  menuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  onToggleActive,
}: CategoryCardProps) {
  const { t, localize } = useLanguage();

  return (
    <article className="group relative overflow-visible rounded-xl border border-[#ebe3dd] bg-white shadow-[0_2px_10px_rgba(48,37,31,0.025)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(48,37,31,0.07)]">
      <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-t-xl bg-[#faf8f6] p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(210,195,185,0.18),transparent_65%)]" />

        {category.iconUrl ? (
          <img
            loading="lazy"
            decoding="async"
            src={category.iconUrl}
            alt={localize(category.name)}
            className="relative h-16 w-16 object-contain transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm">
            <ImageIcon size={24} className="text-[#b0a39b]" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold shadow-sm ${
              category.isActive
                ? "bg-white text-[#638069]"
                : "bg-white text-[#9a5d57]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                category.isActive ? "bg-[#719179]" : "bg-[#b66a63]"
              }`}
            />

            {category.isActive
              ? t("admin.categories.active")
              : t("admin.categories.inactive")}
          </span>
        </div>

        <div className="absolute right-3 top-3">
          <button
            type="button"
            onClick={onToggleMenu}
            disabled={busy || isToggling}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#756960] shadow-sm transition hover:bg-[#30251f] hover:text-white disabled:opacity-50"
            aria-label={t("admin.categories.actionsFor", {
              name: localize(category.name),
            })}
          >
            <MoreVertical size={15} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 z-50 w-40 overflow-hidden rounded-xl border border-[#e9e0da] bg-white p-1.5 shadow-xl">
              <button
                type="button"
                onClick={onEdit}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#65574f] transition hover:bg-[#faf7f4]"
              >
                <Edit3 size={14} />

                {t("admin.categories.edit")}
              </button>

              <div className="my-1 border-t border-[#f0e9e4]" />

              <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#b35f58] transition hover:bg-[#fff4f2]"
              >
                <Trash2 size={14} />

                {t("admin.categories.deleteAction")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-3.5">
        <div className="min-h-14.5">
          <h2 className="line-clamp-1 text-sm font-semibold text-[#30251f]">
            {localize(category.name)}
          </h2>

          <p className="mt-1.5 line-clamp-2 text-[11px] leading-4.5 text-[#91847c]">
            {localize(category.description) ||
              t("admin.categories.noDescription")}
          </p>
          {!isBilingual(category.name) && (
            <button
              type="button"
              onClick={onEdit}
              className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
            >
              <Languages size={11} />
              {t("admin.categories.missingTranslation")}
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-[#faf8f6] px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#806d61] shadow-sm">
              <Zap size={13} />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[#a2948b]">
                {t("admin.categories.services")}
              </p>

              <p className="mt-0.5 text-xs font-semibold text-[#4c3e36]">
                {servicesLoading ? "..." : serviceCount}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2">
            <span className="text-[9px] font-semibold text-[#8c7d74]" aria-hidden="true">
              {isToggling
                ? t("admin.categories.updating")
                : category.isActive
                  ? t("admin.categories.active")
                  : t("admin.categories.inactive")}
            </span>
            <Switch
              checked={category.isActive}
              onChange={onToggleActive}
              disabled={busy}
              loading={isToggling}
              label={`${
                category.isActive
                  ? t("admin.categories.disable")
                  : t("admin.categories.activate")
              } ${localize(category.name)}`}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#f1ebe7] pt-3">
          <div>
            <p className="text-[9px] text-[#a39790]">
              {t("admin.categories.created")}
            </p>

            <p className="mt-0.5 text-[10px] font-medium text-[#6e6058]">
              {new Date(category.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button
            type="button"
            onClick={onEdit}
            disabled={busy || isToggling}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8dfd9] px-2.5 py-1.5 text-[10px] font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f] disabled:opacity-50"
          >
            <Edit3 size={12} />

            {t("admin.categories.edit")}
          </button>
        </div>
      </div>
    </article>
  );
}
