"use client";

import { AllCategoriesAside } from "@/components/vendor/categories/AllCategoriesAside";
import { AssignedCategoriesSection } from "@/components/vendor/categories/AssignedCategoriesSection";
import { CategoriesContactDialog } from "@/components/vendor/categories/CategoriesContactDialog";
import { CategoriesFooter } from "@/components/vendor/categories/CategoriesFooter";
import { CategoriesHeader } from "@/components/vendor/categories/CategoriesHeader";
import { CategoriesNote } from "@/components/vendor/categories/CategoriesNote";
import { CategoriesStats } from "@/components/vendor/categories/CategoriesStats";
import { CategoriesToast } from "@/components/vendor/categories/CategoriesToast";
import { useVendorCategoriesPage } from "@/components/vendor/categories/useVendorCategoriesPage";

export default function VendorCategoriesPage() {
  const page = useVendorCategoriesPage();

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        <CategoriesToast page={page} />
        <CategoriesHeader page={page} />
        <CategoriesStats page={page} />
        <CategoriesNote />

        <div className="mt-4 grid gap-4 sm:gap-6 lg:grid-cols-3">
          <AssignedCategoriesSection page={page} />
          <AllCategoriesAside page={page} />
        </div>

        <CategoriesFooter page={page} />
      </div>

      <CategoriesContactDialog page={page} />
    </div>
  );
}
