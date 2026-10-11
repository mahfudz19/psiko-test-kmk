import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { Search } from 'lucide-react'
import { MajorItem } from './MajorForm'
import { CategoryItem } from './CategoryModal'

interface MajorTableProps {
  majors: MajorItem[]
  categories: CategoryItem[]
  onEditMajor: (major: MajorItem) => void
  onEditCategory: (category: CategoryItem) => void
}

export default function MajorTable({
  majors,
  categories,
  onEditMajor,
  onEditCategory,
}: MajorTableProps) {
  const [activeTab, setActiveTab] = useState<'majors' | 'categories'>('majors')
  const [search, setSearch] = useState('')

  const handleDeleteMajor = (id: number) => {
    if (confirm('Yakin ingin menghapus program studi ini?')) {
      router.delete(`/admin/input-jurusan/${id}`, { preserveScroll: true })
    }
  }

  const handleDeleteCategory = (id: number) => {
    if (confirm('Yakin ingin menghapus kategori ini?')) {
      router.delete(`/admin/kategori-jurusan/${id}`, { preserveScroll: true })
    }
  }

  const filteredMajors = majors.filter((m) => {
    const q = search.toLowerCase()
    return (
      m.title.toLowerCase().includes(q) ||
      (m.category && m.category.toLowerCase().includes(q)) ||
      (m.description && m.description.toLowerCase().includes(q))
    )
  })

  const filteredCategories = categories.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    )
  })

  const getCategoryBadgeClass = (categoryName?: string | null) => {
    const lower = (categoryName || '').toLowerCase()
    if (lower.includes('saintek')) {
      return 'bg-blue-50 text-blue-600 border-blue-100'
    }
    if (lower.includes('soshum')) {
      return 'bg-indigo-50 text-indigo-600 border-indigo-100'
    }
    if (lower.includes('kesehatan')) {
      return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    }
    return 'bg-violet-50 text-violet-600 border-violet-100'
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('majors')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'majors'
                ? 'bg-[#4355F9] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>Daftar Program Studi</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === 'majors'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {majors.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'categories'
                ? 'bg-[#4355F9] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>Daftar Kategori</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === 'categories'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {categories.length}
            </span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        {activeTab === 'majors' ? (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50">
                <th className="py-3 px-4 w-12 text-center">NO</th>
                <th className="py-3 px-4 w-48">NAMA JURUSAN</th>
                <th className="py-3 px-4 w-28">KATEGORI</th>
                <th className="py-3 px-4 min-w-[200px]">PENJELASAN</th>
                <th className="py-3 px-4 min-w-[200px]">KEGIATAN KULIAH</th>
                <th className="py-3 px-4 min-w-[200px]">JENJANG KARIR</th>
                <th className="py-3 px-4 w-28 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMajors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Tidak ada data program studi ditemukan.
                  </td>
                </tr>
              ) : (
                filteredMajors.map((m, idx) => {
                  const activities = Array.isArray(m.study_activities)
                    ? m.study_activities.join(', ')
                    : m.study_activities || '-'
                  const prospects = Array.isArray(m.career_prospects)
                    ? m.career_prospects.join(', ')
                    : m.career_prospects || '-'

                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="py-4 px-4 text-center text-gray-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900">
                        {m.title}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(
                            m.category
                          )}`}
                        >
                          {m.category || 'Umum'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-xs leading-relaxed max-w-xs">
                        {m.description || m.teaser || '-'}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-xs leading-relaxed max-w-xs">
                        {activities}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-xs leading-relaxed max-w-xs">
                        {prospects}
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onEditMajor(m)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-xs mr-3 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMajor(m.id)}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs transition-colors"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50">
                <th className="py-3 px-4 w-12 text-center">NO</th>
                <th className="py-3 px-4 w-48">NAMA KATEGORI</th>
                <th className="py-3 px-4 min-w-[300px]">DESKRIPSI KATEGORI</th>
                <th className="py-3 px-4 w-36">JUMLAH JURUSAN</th>
                <th className="py-3 px-4 w-28 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Tidak ada kategori ditemukan.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-4 px-4 text-center text-gray-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900">
                      {cat.name}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-xs leading-relaxed">
                      {cat.description || '-'}
                    </td>
                    <td className="py-4 px-4 text-gray-700 font-semibold text-xs">
                      {cat.majors_count ?? 0} Jurusan
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onEditCategory(cat)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs mr-3 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-xs transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
