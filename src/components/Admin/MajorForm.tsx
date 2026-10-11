import React, { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { Save } from 'lucide-react'
import { CategoryItem } from './CategoryModal'

export interface MajorItem {
  id: number
  code: string
  title: string
  category?: string | null
  category_id?: number | null
  group: string
  jenjang: string
  teaser: string
  description: string
  study_activities?: string[] | string
  career_prospects?: string[] | string
}

interface MajorFormProps {
  categories: CategoryItem[]
  onOpenCategoryModal: () => void
  majorToEdit?: MajorItem | null
  onCancelEdit?: () => void
}

export default function MajorForm({
  categories,
  onOpenCategoryModal,
  majorToEdit,
  onCancelEdit,
}: MajorFormProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [studyActivities, setStudyActivities] = useState('')
  const [careerProspects, setCareerProspects] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (majorToEdit) {
      setTitle(majorToEdit.title)
      setCategory(majorToEdit.category || (categories[0]?.name ?? ''))
      setDescription(majorToEdit.description || majorToEdit.teaser || '')
      const activities = Array.isArray(majorToEdit.study_activities)
        ? majorToEdit.study_activities.join(', ')
        : majorToEdit.study_activities || ''
      setStudyActivities(activities)
      const prospects = Array.isArray(majorToEdit.career_prospects)
        ? majorToEdit.career_prospects.join(', ')
        : majorToEdit.career_prospects || ''
      setCareerProspects(prospects)
    } else {
      setTitle('')
      setCategory(categories[0]?.name ?? 'Saintek')
      setDescription('')
      setStudyActivities('')
      setCareerProspects('')
    }
  }, [majorToEdit, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      title,
      category: category || (categories[0]?.name ?? 'Saintek'),
      description,
      study_activities: studyActivities,
      career_prospects: careerProspects,
    }

    if (majorToEdit) {
      router.put(`/admin/input-jurusan/${majorToEdit.id}`, payload, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false)
          if (onCancelEdit) onCancelEdit()
        },
        onError: () => setIsSubmitting(false),
      })
    } else {
      router.post('/admin/input-jurusan', payload, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false)
          setTitle('')
          setDescription('')
          setStudyActivities('')
          setCareerProspects('')
        },
        onError: () => setIsSubmitting(false),
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {majorToEdit ? 'Edit Data Program Studi' : 'Input Data Program Studi'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tambahkan informasi jurusan lengkap dengan deskripsi, kegiatan, dan jenjang karir.
          </p>
        </div>
        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
            * Form Isian Lengkap
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5">
              Nama Jurusan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Teknik Informatika"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-gray-800">
                Kategori <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={onOpenCategoryModal}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                + Tambah Kategori Baru
              </button>
            </div>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              {categories.length === 0 ? (
                <option value="Saintek">Saintek</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1.5">
            Penjelasan / Deskripsi Singkat Jurusan <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            placeholder="Jelaskan gambaran umum mengenai jurusan ini..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1.5">
            Kegiatan Kuliah <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            placeholder="Contoh: Praktikum, proyek, seminar, dan internship..."
            value={studyActivities}
            onChange={(e) => setStudyActivities(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1.5">
            Jenjang Karir <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            placeholder="Contoh: Software Engineer, Data Scientist, IT Consultant..."
            value={careerProspects}
            onChange={(e) => setCareerProspects(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#4355F9] hover:bg-[#3243E5] rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {isSubmitting ? 'Menyimpan...' : majorToEdit ? 'Simpan Perubahan' : 'Simpan Data'}
          </button>
          {majorToEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-5 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
