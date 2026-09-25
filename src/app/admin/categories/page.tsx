"use client";

import {
  CategoriesHeaderSkeleton,
  CategoriesSkeleton,
  StatsSkeleton,
  ToolbarSkeleton,
} from "@/components/admin/categories/CategoryBits";
import { CategoriesHeader } from "@/components/admin/categories/CategoriesHeader";
import { CategoriesToolbar } from "@/components/admin/categories/CategoriesToolbar";
import { CategoryAlerts } from "@/components/admin/categories/CategoryAlerts";
import { CategoryCard } from "@/components/admin/categories/CategoryCard";
import {
  CategoriesEmpty,
  CategoriesError,
  CategoriesNoMatch,
} from "@/components/admin/categories/CategoryEmptyStates";
import { CategoryFormModal } from "@/components/admin/categories/CategoryFormModal";
import { CategoryStats } from "@/components/admin/categories/CategoryStats";
import { DeleteCategoryModal } from "@/components/admin/categories/DeleteCategoryModal";
import { useAdminCategoriesPage } from "@/components/admin/categories/useAdminCategoriesPage";

export default function AdminCategoriesPage() {
  const page = useAdminCategoriesPage();
  const { loading, error, categories, filteredCategories, modal } = page;

  return (
    <div className="mx-auto">
      <CategoryAlerts
        successMessage={page.successMessage}
        actionError={page.actionError}
        servicesError={page.servicesError}
        modalOpen={!!modal}
        onDismissSuccess={() => page.setSuccessMessage(null)}
        onDismissError={() => page.setActionError(null)}
      />

      {loading ? (
        <CategoriesHeaderSkeleton />
      ) : (
        <CategoriesHeader
          loading={loading}
          busy={page.actionLoading}
          onRefresh={() => page.refetch()}
          onAdd={page.openCreateModal}
        />
      )}

      {loading ? (
        <StatsSkeleton />
      ) : !error ? (
        <CategoryStats
          total={page.totalCategories}
          active={page.activeCategories}
          inactive={page.inactiveCategories}
        />
      ) : null}

      {loading ? (
        <ToolbarSkeleton />
      ) : !error && categories.length > 0 ? (
        <CategoriesToolbar
          search={page.search}
          onSearch={page.setSearch}
          statusFilter={page.statusFilter}
          onStatusFilter={page.setStatusFilter}
          statusLabel={page.statusLabel}
          filterOpen={page.filterOpen}
          setFilterOpen={page.setFilterOpen}
          shown={filteredCategories.length}
          total={categories.length}
        />
      ) : null}

      {loading && <CategoriesSkeleton />}

      {!loading && error && (
        <CategoriesError error={error} onRetry={() => page.refetch()} />
      )}

      {!loading && !error && categories.length === 0 && (
        <CategoriesEmpty onAdd={page.openCreateModal} />
      )}

      {!loading &&
        !error &&
        categories.length > 0 &&
        filteredCategories.length === 0 && (
          <CategoriesNoMatch
            onClear={() => {
              page.setSearch("");
              page.setStatusFilter("all");
            }}
          />
        )}

      {!loading && !error && filteredCategories.length > 0 && (
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              serviceCount={page.getCategoryServices(category.id).length}
              servicesLoading={page.servicesLoading}
              isToggling={page.toggleLoadingId === category.id}
              busy={page.actionLoading}
              menuOpen={page.openMenuId === category.id}
              onToggleMenu={() =>
                page.setOpenMenuId(
                  page.openMenuId === category.id ? null : category.id,
                )
              }
              onEdit={() => page.openEditModal(category)}
              onDelete={() => page.openDeleteModal(category)}
              onToggleActive={() => page.handleToggleCategory(category)}
            />
          ))}
        </div>
      )}

      {(modal === "create" || modal === "edit") && (
        <CategoryFormModal
          mode={modal}
          name={modal === "create" ? page.name : page.editName}
          onNameChange={modal === "create" ? page.setName : page.setEditName}
          description={
            modal === "create" ? page.description : page.editDescription
          }
          onDescriptionChange={
            modal === "create" ? page.setDescription : page.setEditDescription
          }
          iconUrl={modal === "create" ? page.iconUrl : page.editIconUrl}
          onIconUrlChange={
            modal === "create" ? page.setIconUrl : page.setEditIconUrl
          }
          onSubmit={
            modal === "create"
              ? page.handleCreateCategory
              : page.handleUpdateCategory
          }
          onClose={page.closeModal}
          loading={page.actionLoading}
          error={page.actionError}
        />
      )}

      {modal === "delete" && page.selectedCategory && (
        <DeleteCategoryModal
          category={page.selectedCategory}
          onConfirm={page.handleDeleteCategory}
          onClose={page.closeModal}
          loading={page.actionLoading}
          error={page.actionError}
        />
      )}
    </div>
  );
}
