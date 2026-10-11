import React, { useState } from 'react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'
import MajorForm, { MajorItem } from '../../components/Admin/MajorForm'
import MajorTable from '../../components/Admin/MajorTable'
import CategoryModal, { CategoryItem } from '../../components/Admin/CategoryModal'

interface AdminInputJurusanProps {
  majors: MajorItem[]
  categories: CategoryItem[]
}

export default function AdminInputJurusan({
  majors = [],
  categories = [],
}: AdminInputJurusanProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryItem | null>(null)
  const [majorToEdit, setMajorToEdit] = useState<MajorItem | null>(null)

  const handleOpenAddCategory = () => {
    setCategoryToEdit(null)
    setIsCategoryModalOpen(true)
  }

  const handleEditCategory = (category: CategoryItem) => {
    setCategoryToEdit(category)
    setIsCategoryModalOpen(true)
  }

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false)
    setCategoryToEdit(null)
  }

  const handleEditMajor = (major: MajorItem) => {
    setMajorToEdit(major)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEditMajor = () => {
    setMajorToEdit(null)
  }

  return (
    <PortalLayout role="admin" menuItems={adminMenuItems} activeId="input_jurusan">
      <div className="space-y-6">
        <MajorForm
          categories={categories}
          onOpenCategoryModal={handleOpenAddCategory}
          majorToEdit={majorToEdit}
          onCancelEdit={handleCancelEditMajor}
        />

        <MajorTable
          majors={majors}
          categories={categories}
          onEditMajor={handleEditMajor}
          onEditCategory={handleEditCategory}
        />

        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={handleCloseCategoryModal}
          categoryToEdit={categoryToEdit}
        />
      </div>
    </PortalLayout>
  )
}
