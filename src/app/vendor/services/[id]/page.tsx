"use client";

import { use } from "react";
import { Banknote, FileText } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { ContactAdminDialog } from "@/components/vendor/CategoryRequest";
import { RequiredLabel, TextAreaField, TextField } from "@/components/ui";
import EditServiceHeader from "@/components/vendor/services/EditServiceHeader";
import {
  EditServiceSkeleton,
  ServiceNotFound,
  SuccessToast,
} from "@/components/vendor/services/EditServiceStates";
import FormErrorAlert from "@/components/vendor/services/FormErrorAlert";
import PriceRowsEditor, { AddPriceButton } from "@/components/vendor/services/PriceRowsEditor";
import SectionCard from "@/components/vendor/services/SectionCard";
import ServiceCategoriesSidebar from "@/components/vendor/services/ServiceCategoriesSidebar";
import ServiceHelpNote from "@/components/vendor/services/ServiceHelpNote";
import ServiceImagesEditor from "@/components/vendor/services/ServiceImagesEditor";
import ServiceSaveBar from "@/components/vendor/services/ServiceSaveBar";
import { useEditServiceForm } from "@/components/vendor/services/useEditServiceForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditVendorServicePage({ params }: PageProps) {
  const { id } = use(params);
  const { t } = useLanguage();
  const form = useEditServiceForm(id);
  const { service } = form;

  if (form.loading) return <EditServiceSkeleton />;
  if (!service) return <ServiceNotFound />;

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        <SuccessToast message={form.toastMessage} />

        <EditServiceHeader
          service={service}
          isResubmitting={form.isResubmitting}
          onResubmit={form.handleResubmit}
        />

        {service.status === "Rejected" && (
          <FormErrorAlert
            title={t("vendor.services.detail.rejectionReason")}
            message={service.rejectionReason}
          />
        )}
        <FormErrorAlert message={form.formError || form.actionError} />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <form
            onSubmit={form.handleSaveAll}
            noValidate
            className="space-y-4 sm:space-y-6 lg:col-span-2"
          >
            <SectionCard
              icon={FileText}
              title={t("vendor.services.detail.detailsTitle")}
              subtitle={t("vendor.services.detail.detailsSub")}
            >
              <div className="space-y-6">
                <TextField
                  id="service-name"
                  label={<RequiredLabel text={t("vendor.services.form.name")} />}
                  value={form.name}
                  onChange={(event) => form.setName(event.target.value)}
                  placeholder={t("vendor.services.form.namePlaceholder")}
                />
                <TextAreaField
                  id="service-description"
                  label={<RequiredLabel text={t("vendor.services.form.description")} />}
                  value={form.description}
                  onChange={(event) => form.setDescription(event.target.value)}
                  rows={5}
                  placeholder={t("vendor.services.detail.descriptionPlaceholder")}
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={Banknote}
              title={t("vendor.services.form.pricing")}
              subtitle={t("vendor.services.detail.pricingSub")}
              aside={<AddPriceButton onClick={form.addPriceRow} />}
            >
              <PriceRowsEditor
                rows={form.prices}
                onChange={form.updatePriceRow}
                onRemove={form.removePriceRow}
              />
            </SectionCard>

            <ServiceImagesEditor
              serviceName={service.name}
              existingImages={form.existingImages}
              newImages={form.newImages}
              removedImageIds={form.removedImageIds}
              totalImageCount={form.totalImageCount}
              remainingImageSlots={form.remainingImageSlots}
              canAddImages={form.canAddImages}
              handleImagesSelected={form.handleImagesSelected}
              removeNewImage={form.removeNewImage}
              toggleRemoveExistingImage={form.toggleRemoveExistingImage}
              saving={form.saving}
            />

            <ServiceSaveBar
              hasChanges={form.hasChanges}
              saving={form.saving}
              savedImagesCount={form.savedImagesCount}
              onDiscard={form.handleDiscard}
            />
          </form>

          <ServiceCategoriesSidebar
            loading={form.categoriesLoading}
            search={form.categorySearch}
            onSearch={form.setCategorySearch}
            categories={form.filteredCategories}
            assignedNames={form.assignedCategoryNames}
            assignedCount={form.assignedCount}
            onRequest={form.handleContactAdmin}
          />
        </div>

        <ServiceHelpNote text={t("vendor.services.detail.changesReviewed")} />
      </div>

      <ContactAdminDialog
        open={form.contactDialogOpen}
        category={form.selectedCategory}
        vendorName={form.vendor?.businessName || t("vendor.services.detail.dialog.myBusiness")}
        vendorEmail={form.vendor?.contactEmail}
        vendorPhone={form.vendor?.contactPhone}
        onClose={() => {
          form.setContactDialogOpen(false);
          form.setSelectedCategory(null);
        }}
        onSuccess={form.handleContactSuccess}
      />
    </div>
  );
}
