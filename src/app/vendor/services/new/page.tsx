"use client";

import Link from "next/link";
import { ArrowLeft, Info, Loader2, Save } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import Select from "@/components/shared/Select";
import TextWithSlot from "@/components/shared/TextWithSlot";
import { FieldMessage, RequiredLabel, TextAreaField, TextField } from "@/components/ui";
import FormErrorAlert from "@/components/vendor/services/FormErrorAlert";
import NewServiceImagePicker from "@/components/vendor/services/NewServiceImagePicker";
import PriceRowsEditor, { AddPriceButton } from "@/components/vendor/services/PriceRowsEditor";
import ServiceHelpNote from "@/components/vendor/services/ServiceHelpNote";
import { useNewServiceForm } from "@/components/vendor/services/useNewServiceForm";

export default function NewVendorServicePage() {
  const { t } = useLanguage();
  const form = useNewServiceForm();

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:max-w-full lg:px-6 lg:py-8 xl:px-8 xl:py-10">
        <header className="mb-4 sm:mb-6 lg:mb-8">
          <Link
            href="/vendor/services"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#756b65] transition hover:text-[#30251f] sm:mb-4 sm:gap-2 sm:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180 sm:h-4 sm:w-4" />
            {t("vendor.services.add.back")}
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
            {t("vendor.services.add.title")}
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
            {t("vendor.services.add.intro")}
          </p>
        </header>

        <form
          onSubmit={form.handleSubmit}
          className="space-y-7 rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6 lg:p-8"
        >
          <FormErrorAlert message={form.formError || form.actionError} />

          <TextField
            id="service-name"
            label={<RequiredLabel text={t("vendor.services.form.name")} />}
            value={form.name}
            onChange={(event) => form.setName(event.target.value)}
            placeholder={t("vendor.services.form.namePlaceholder")}
            helperText={t("vendor.services.form.nameHint")}
          />

          <CategoryField form={form} />

          <TextAreaField
            id="service-description"
            label={<RequiredLabel text={t("vendor.services.form.description")} />}
            value={form.description}
            onChange={(event) => form.setDescription(event.target.value)}
            rows={5}
            placeholder={t("vendor.services.form.descriptionPlaceholder")}
            helperText={t("vendor.services.form.descriptionHint")}
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-[#40352f] sm:text-sm">
                <RequiredLabel text={t("vendor.services.form.pricing")} />
              </p>
              <AddPriceButton onClick={form.addPriceRow} />
            </div>

            <PriceRowsEditor
              rows={form.prices}
              onChange={form.updatePriceRow}
              onRemove={form.removePriceRow}
            />

            <FieldMessage tone="info" plain>
              {t("vendor.services.form.pricesHint")}
            </FieldMessage>
          </div>

          <NewServiceImagePicker
            previews={form.imagePreviews}
            onSelect={form.handleImagesSelected}
            onRemove={form.removeImage}
          />

          <FormActions
            submitting={form.isSubmitting}
            disabled={form.hasNoAssignedCategories}
            onCancel={form.handleCancel}
          />

          <ServiceHelpNote text={t("vendor.services.form.needHelpText")} />
        </form>
      </div>
    </div>
  );
}

function CategoryField({ form }: { form: ReturnType<typeof useNewServiceForm> }) {
  const { t } = useLanguage();

  return (
    <div>
      <p className="mb-1 text-xs text-[#a59a92]">
        <RequiredLabel text={t("vendor.services.form.category")} />
      </p>

      {form.categoriesLoading ? (
        <div className="flex items-center gap-3 border-b-2 border-[#ded5ce] py-3">
          <Loader2 className="h-4 w-4 animate-spin text-[#a47e43]" />
          <span className="text-sm text-[#9b8f86]">{t("vendor.services.form.loadingCategories")}</span>
        </div>
      ) : (
        <Select
          value={form.categoryId}
          onChange={form.setCategoryId}
          options={form.categoryOptions}
          placeholder={t("vendor.services.form.selectCategory")}
          emptyMessage={t("vendor.services.form.noCategoriesEmpty")}
        />
      )}

      {form.hasNoAssignedCategories ? (
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-700 sm:p-3">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="leading-5">
            <TextWithSlot
              text={t("vendor.services.form.noAssigned")}
              token="{link}"
              slot={
                <Link href="/vendor/support" className="font-semibold underline hover:no-underline">
                  {t("vendor.services.form.contactSupportLink")}
                </Link>
              }
            />
          </span>
        </div>
      ) : (
        <FieldMessage tone="info" plain>
          {t("vendor.services.form.categoryHint")}
        </FieldMessage>
      )}
    </div>
  );
}

function FormActions({
  submitting,
  disabled,
  onCancel,
}: {
  submitting: boolean;
  disabled: boolean;
  onCancel: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2 border-t border-[#eee7e2] pt-4 sm:flex-row sm:items-center sm:gap-3 sm:pt-6">
      <button
        type="submit"
        disabled={submitting || disabled}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 text-xs font-medium text-white transition hover:bg-[#463831] disabled:opacity-60 sm:h-11 sm:px-6 sm:text-sm"
      >
        {submitting ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
            {t("vendor.services.form.submitting")}
          </>
        ) : (
          <>
            <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {t("vendor.services.form.submitForReview")}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e3d9d1] bg-white px-4 text-xs font-medium text-[#514740] transition hover:bg-[#f7f2ef] sm:h-11 sm:px-6 sm:text-sm"
      >
        {t("vendor.services.form.cancel")}
      </button>

      <div className="mt-2 flex items-center gap-2 text-[10px] text-[#9b8f86] sm:ms-auto sm:mt-0 sm:text-xs">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
        <span>{t("vendor.services.form.draft")}</span>
      </div>
    </div>
  );
}
