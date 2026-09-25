"use client";

import { Archive, Check, Tags } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { StatCard } from "./CategoryBits";

export function CategoryStats({
  total,
  active,
  inactive,
}: {
  total: number;
  active: number;
  inactive: number;
}) {
  const { t } = useLanguage();

  return (
    <div className="mb-5 grid grid-cols-3 gap-2.5 sm:gap-4">
      <StatCard
        label={t("admin.categories.total")}
        value={total}
        icon={<Tags size={17} />}
        description={t("admin.categories.all")}
      />

      <StatCard
        label={t("admin.categories.active")}
        value={active}
        icon={<Check size={17} />}
        description={t("admin.categories.visible")}
      />

      <StatCard
        label={t("admin.categories.inactive")}
        value={inactive}
        icon={<Archive size={17} />}
        description={t("admin.categories.disabled")}
      />
    </div>
  );
}
