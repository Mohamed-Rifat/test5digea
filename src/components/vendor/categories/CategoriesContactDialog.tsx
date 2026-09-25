"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ContactAdminDialog } from "@/components/vendor/CategoryRequest";

import type { VendorCategoriesPageState } from "./useVendorCategoriesPage";

/** Contact-admin dialog for requesting a category. */
export function CategoriesContactDialog({
  page,
}: {
  page: VendorCategoriesPageState;
}) {
  const { t } = useLanguage();
  const {
    contactDialogOpen,
    setContactDialogOpen,
    selectedCategory,
    setSelectedCategory,
    handleContactSuccess,
    vendor,
  } = page;

  return (
    <ContactAdminDialog
      open={contactDialogOpen}
      category={selectedCategory}
      vendorName={
        vendor?.businessName || t("vendor.services.detail.dialog.myBusiness")
      }
      vendorEmail={vendor?.contactEmail}
      vendorPhone={vendor?.contactPhone}
      onClose={() => {
        setContactDialogOpen(false);
        setSelectedCategory(null);
      }}
      onSuccess={handleContactSuccess}
    />
  );
}
