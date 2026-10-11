import React, { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { X } from 'lucide-react'

export interface CategoryItem {
  id: number
  name: string
  description?: string | null
  majors_count?: number
}

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  categoryToEdit?: CategoryItem | null
}

export default function CategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
}: CategoryModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name)
      setDescription(categoryToEdit.description || '')
    } else {
      setName('')
      setDescription('')
    }
  }, [categoryToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (categoryToEdit) {
      router.put(
        `/admin/kategori-jurusan/${categoryToEdit.id}`,
        { name, description },
        {
          preserveScroll: true,
          onSuccess: () => {
            setIsSubmitting(false)
            onClose()
          },
          onError: () => setIsSubmitting(false),
        }
      )
    } else {
      router.post(
        '/admin/kategori-jurusan',
        { name, description },
        {
          preserveScroll: true,
          onSuccess: () => {
            setIsSubmitting(false)
            onClose()
          },
          onError: () => setIsSubmitting(false),
        }
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {categoryToEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5">
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Saintek, Soshum, Seni"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5">
              Deskripsi Kategori
            </label>
            <textarea
              rows={4}
              placeholder="Jelaskan cakupan kategori ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#4355F9] hover:bg-[#3243E5] rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
