import React, { useState, useRef } from 'react'
import { router } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'
import {
  Plus,
  FolderPlus,
  Search,
  Pencil,
  Trash2,
  Info,
  FileText,
  Briefcase,
  Save,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react'
import RichText, { processImagesInHTML } from '../../components/RichText'

interface CareerProspectItem {
  id?: string
  name: string
  icon?: string
  iconFile?: File | null
  description: string
}

interface StudyProgramItem {
  id: number | string
  category_id?: number | string | null
  name: string
  status: string
  icon?: string | null
  academic_degree: string
  short_description: string
  detailed_description?: string | null
  career_prospects?: CareerProspectItem[] | null
  category?: {
    id: number | string
    name: string
  } | null
  created_at?: string
  updated_at?: string
}

interface StudyProgramCategoryItem {
  id: number | string
  name: string
  description?: string | null
  study_programs_count?: number
  created_at?: string
  updated_at?: string
}

interface AdminProgramProps {
  programs?: StudyProgramItem[]
  categories?: StudyProgramCategoryItem[]
}

export default function AdminProgram({
  programs = [],
  categories = [],
}: AdminProgramProps) {
  const [activeTab, setActiveTab] = useState<'programs' | 'categories'>('programs')
  const [viewMode, setViewMode] = useState<'list' | 'form-program' | 'form-category'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  const [editingProgram, setEditingProgram] = useState<StudyProgramItem | null>(null)
  const [formProgramName, setFormProgramName] = useState('')
  const [formProgramCategoryId, setFormProgramCategoryId] = useState<string | number>('')
  const [formProgramStatus, setFormProgramStatus] = useState('Aktif (Tampil)')
  const [formProgramDegree, setFormProgramDegree] = useState('')
  const [formProgramShortDesc, setFormProgramShortDesc] = useState('')
  const [formProgramDetail, setFormProgramDetail] = useState('')
  const [formProgramIconPreview, setFormProgramIconPreview] = useState<string | null>(null)
  const [formProgramIconFile, setFormProgramIconFile] = useState<File | null>(null)
  const [formProgramCareers, setFormProgramCareers] = useState<CareerProspectItem[]>([])

  const [editingCategory, setEditingCategory] = useState<StudyProgramCategoryItem | null>(null)
  const [formCategoryName, setFormCategoryName] = useState('')
  const [formCategoryDesc, setFormCategoryDesc] = useState('')

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'program' | 'category'; id: number | string; name: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const programIconInputRef = useRef<HTMLInputElement | null>(null)

  const handleOpenAddProgram = () => {
    setEditingProgram(null)
    setFormProgramName('')
    setFormProgramCategoryId(categories.length > 0 ? categories[0].id : '')
    setFormProgramStatus('Aktif (Tampil)')
    setFormProgramDegree('')
    setFormProgramShortDesc('')
    setFormProgramDetail('')
    setFormProgramIconPreview(null)
    setFormProgramIconFile(null)
    setFormProgramCareers([
      { name: '', description: '', icon: '' },
      { name: '', description: '', icon: '' },
    ])
    setViewMode('form-program')
  }

  const handleOpenEditProgram = (prog: StudyProgramItem) => {
    setEditingProgram(prog)
    setFormProgramName(prog.name)
    setFormProgramCategoryId(prog.category_id || (categories.length > 0 ? categories[0].id : ''))
    setFormProgramStatus(prog.status || 'Aktif (Tampil)')
    setFormProgramDegree(prog.academic_degree || '')
    setFormProgramShortDesc(prog.short_description || '')
    setFormProgramDetail(prog.detailed_description || '')
    setFormProgramIconPreview(prog.icon || null)
    setFormProgramIconFile(null)
    setFormProgramCareers(
      Array.isArray(prog.career_prospects) && prog.career_prospects.length > 0
        ? prog.career_prospects
        : [{ name: '', description: '', icon: '' }]
    )
    setViewMode('form-program')
  }

  const handleOpenAddCategory = () => {
    setEditingCategory(null)
    setFormCategoryName('')
    setFormCategoryDesc('')
    setViewMode('form-category')
  }

  const handleOpenEditCategory = (cat: StudyProgramCategoryItem) => {
    setEditingCategory(cat)
    setFormCategoryName(cat.name)
    setFormCategoryDesc(cat.description || '')
    setViewMode('form-category')
  }

  const handleProgramIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormProgramIconFile(file)
      setFormProgramIconPreview(URL.createObjectURL(file))
    }
  }

  const handleAddCareer = () => {
    setFormProgramCareers((prev) => [...prev, { name: '', description: '', icon: '' }])
  }

  const handleRemoveCareer = (index: number) => {
    setFormProgramCareers((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCareerFieldChange = (index: number, field: 'name' | 'description', value: string) => {
    setFormProgramCareers((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const handleCareerIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormProgramCareers((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, iconFile: file, icon: URL.createObjectURL(file) }
            : item
        )
      )
    }
  }

  const handleSubmitProgram = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formProgramName.trim() || !formProgramDegree.trim() || !formProgramShortDesc.trim() || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const processedDetail = await processImagesInHTML(formProgramDetail)

      const formData = new FormData()
      formData.append('name', formProgramName.trim())
      if (formProgramCategoryId) {
        formData.append('category_id', String(formProgramCategoryId))
      }
      formData.append('status', formProgramStatus)
      formData.append('academic_degree', formProgramDegree.trim())
      formData.append('short_description', formProgramShortDesc.trim())
      formData.append('detailed_description', processedDetail)

      if (formProgramIconFile) {
        formData.append('icon', formProgramIconFile)
      } else if (!formProgramIconPreview) {
        formData.append('icon', '')
      }

      const cleanCareers = formProgramCareers
        .filter((c) => c.name.trim() !== '')
        .map((c) => ({
          name: c.name.trim(),
          description: c.description.trim(),
          icon: c.icon || '',
        }))
      formData.append('career_prospects', JSON.stringify(cleanCareers))

      formProgramCareers.forEach((c, idx) => {
        if (c.iconFile) {
          formData.append(`career_icon_${idx}`, c.iconFile)
        }
      })

      if (editingProgram) {
        formData.append('_method', 'PUT')
        router.post(`/admin/program/${editingProgram.id}`, formData, {
          preserveScroll: true,
          forceFormData: true,
          onSuccess: () => {
            setIsSubmitting(false)
            setViewMode('list')
          },
          onError: () => setIsSubmitting(false),
          onFinish: () => setIsSubmitting(false),
        })
      } else {
        router.post('/admin/program', formData, {
          preserveScroll: true,
          forceFormData: true,
          onSuccess: () => {
            setIsSubmitting(false)
            setViewMode('list')
          },
          onError: () => setIsSubmitting(false),
          onFinish: () => setIsSubmitting(false),
        })
      }
    } catch {
      setIsSubmitting(false)
    }
  }

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCategoryName.trim() || isSubmitting) return

    setIsSubmitting(true)
    const payload = {
      name: formCategoryName.trim(),
      description: formCategoryDesc.trim(),
    }

    if (editingCategory) {
      router.put(`/admin/program-categories/${editingCategory.id}`, payload, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false)
          setViewMode('list')
        },
        onError: () => setIsSubmitting(false),
        onFinish: () => setIsSubmitting(false),
      })
    } else {
      router.post('/admin/program-categories', payload, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false)
          setViewMode('list')
        },
        onError: () => setIsSubmitting(false),
        onFinish: () => setIsSubmitting(false),
      })
    }
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    setIsSubmitting(true)
    const { type, id } = deleteTarget

    const url = type === 'program' ? `/admin/program/${id}` : `/admin/program-categories/${id}`

    router.delete(url, {
      preserveScroll: true,
      onFinish: () => {
        setIsSubmitting(false)
        setDeleteTarget(null)
      },
    })
  }

  const filteredPrograms = programs.filter((p) => {
    const q = searchQuery.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category?.name || '').toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q)
    )
  })

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    )
  })

  return (
    <PortalLayout role="admin" menuItems={adminMenuItems} activeId="program">
      {viewMode === 'list' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Daftar Program Studi</h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola data jurusan dan program studi yang tersedia.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-xs transition cursor-pointer"
              >
                <FolderPlus size={16} /> Tambah Kategori
              </button>
              <button
                type="button"
                onClick={handleOpenAddProgram}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2b4c80] hover:bg-[#203c66] text-white font-semibold text-sm shadow-sm transition cursor-pointer"
              >
                <Plus size={17} /> Tambah Program
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('programs')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'programs'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Daftar Program Studi
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      activeTab === 'programs' ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {programs.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('categories')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Daftar Kategori
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      activeTab === 'categories' ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {categories.length}
                  </span>
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari data..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div className="w-full overflow-hidden">
              {activeTab === 'programs' ? (
                <table className="w-full table-fixed text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                      <th className="py-3.5 px-3 w-12 text-center">No</th>
                      <th className="py-3.5 px-3 w-[24%]">Nama Jurusan</th>
                      <th className="py-3.5 px-3 w-[15%]">Kategori</th>
                      <th className="py-3.5 px-3 w-[28%]">Penjelasan</th>
                      <th className="py-3.5 px-3 w-[22%]">Jenjang Karir</th>
                      <th className="py-3.5 px-3 w-24 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredPrograms.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400">
                          Belum ada data program studi.
                        </td>
                      </tr>
                    ) : (
                      filteredPrograms.map((prog, index) => {
                        const careerSummary = Array.isArray(prog.career_prospects)
                          ? prog.career_prospects.map((c) => c.name).filter(Boolean).join(', ')
                          : '-'
                        return (
                          <tr key={prog.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3.5 px-3 text-center text-gray-400 font-medium">{index + 1}</td>
                            <td className="py-3.5 px-3 font-bold text-gray-900">
                              <div className="flex items-center gap-2 min-w-0">
                                {prog.icon ? (
                                  <img
                                    src={prog.icon}
                                    alt={prog.name}
                                    className="w-6 h-6 rounded-md object-cover shrink-0 border border-gray-200"
                                  />
                                ) : null}
                                <span className="truncate" title={prog.name}>{prog.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="inline-block max-w-full truncate px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100" title={prog.category?.name || '-'}>
                                {prog.category?.name || '-'}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-gray-600 truncate" title={prog.short_description}>
                              {prog.short_description || '-'}
                            </td>
                            <td className="py-3.5 px-3 text-gray-600 truncate" title={careerSummary}>
                              {careerSummary || '-'}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProgram(prog)}
                                  className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget({ type: 'program', id: prog.id, name: prog.name })}
                                  className="text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full table-fixed text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                      <th className="py-3.5 px-4 w-12 text-center">No</th>
                      <th className="py-3.5 px-4 w-[32%]">Nama Kategori / Rumpun</th>
                      <th className="py-3.5 px-4 w-36">Jumlah Program</th>
                      <th className="py-3.5 px-4">Deskripsi</th>
                      <th className="py-3.5 px-4 w-24 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400">
                          Belum ada data kategori.
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((cat, index) => (
                        <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3.5 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                          <td className="py-3.5 px-4 font-bold text-gray-900 truncate" title={cat.name}>{cat.name}</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                              {cat.study_programs_count ?? 0} Program
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 truncate" title={cat.description || ''}>
                            {cat.description || '-'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditCategory(cat)}
                                className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget({ type: 'category', id: cat.id, name: cat.name })}
                                className="text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'form-program' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tambah / Edit Data</h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola data jurusan dan program studi yang tersedia.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitProgram} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
            <div className="flex items-center justify-between pb-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Form Data Program Studi</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2b4c80] hover:bg-[#203c66] text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  <Save size={15} /> {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <Info size={18} className="text-blue-600" />
                <span>Informasi Dasar</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nama Program Studi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formProgramName}
                  onChange={(e) => setFormProgramName(e.target.value)}
                  placeholder="Contoh: S1 Farmasi"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Rumpun Ilmu
                  </label>
                  <select
                    value={formProgramCategoryId}
                    onChange={(e) => setFormProgramCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  >
                    <option value="" disabled>Pilih Rumpun Ilmu</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Status Tampilan
                  </label>
                  <select
                    value={formProgramStatus}
                    onChange={(e) => setFormProgramStatus(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  >
                    <option value="Aktif (Tampil)">Aktif (Tampil)</option>
                    <option value="Tidak Aktif (Disembunyikan)">Tidak Aktif (Disembunyikan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Upload Ikon Program
                  </label>
                  <input
                    type="file"
                    ref={programIconInputRef}
                    onChange={handleProgramIconChange}
                    accept="image/png,image/jpeg,image/svg+xml"
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                      {formProgramIconPreview ? (
                        <img
                          src={formProgramIconPreview}
                          alt="Ikon Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => programIconInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold self-start cursor-pointer transition"
                      >
                        Pilih File...
                      </button>
                      <span className="text-[10px] text-gray-400">
                        Format: PNG, JPG, SVG (Max: 1MB)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Gelar Akademik <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formProgramDegree}
                    onChange={(e) => setFormProgramDegree(e.target.value)}
                    placeholder="Contoh: S.Farm. (Sarjana Farmasi)"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <FileText size={18} className="text-blue-600" />
                <span>Deskripsi Konten</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Deskripsi Singkat (Tampil di Card) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  maxLength={150}
                  rows={3}
                  value={formProgramShortDesc}
                  onChange={(e) => setFormProgramShortDesc(e.target.value)}
                  placeholder="Pelajari seluk beluk obat-obatan, pengembangan formula..."
                  className="w-full rounded-xl border border-gray-200 p-3.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                />
                <div className="text-right text-[11px] text-gray-400 mt-1">
                  Maksimal 150 karakter. ({formProgramShortDesc.length}/150)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Penjelasan Detail (Apa itu program ini?)
                </label>
                <RichText
                  value={formProgramDetail}
                  onChange={(val) => setFormProgramDetail(val)}
                  placeholder="S1 Farmasi adalah program studi yang mempelajari segala hal tentang obat-obatan..."
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <Briefcase size={18} className="text-blue-600" />
                  <span>Prospek Karir</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddCareer}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={14} /> Tambah Karir
                </button>
              </div>

              <div className="space-y-3">
                {formProgramCareers.map((career, index) => (
                  <div key={index} className="p-4 rounded-2xl border border-gray-200/90 bg-gray-50/40 space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Nama Profesi/Karir
                        </label>
                        <input
                          type="text"
                          value={career.name}
                          onChange={(e) => handleCareerFieldChange(index, 'name', e.target.value)}
                          placeholder="Fasilitas Kesehatan"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Upload Ikon
                        </label>
                        <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-700 font-medium cursor-pointer transition">
                          <Upload size={13} />
                          <span className="truncate max-w-[120px]">
                            {career.iconFile ? career.iconFile.name : 'Pilih File'}
                          </span>
                          <input
                            type="file"
                            onChange={(e) => handleCareerIconChange(index, e)}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCareer(index)}
                        className="p-2 text-gray-400 hover:text-rose-500 transition cursor-pointer self-end mb-0.5"
                        title="Hapus Karir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Deskripsi Pekerjaan
                      </label>
                      <textarea
                        rows={2}
                        value={career.description}
                        onChange={(e) => handleCareerFieldChange(index, 'description', e.target.value)}
                        placeholder="Menjadi Apoteker klinis di Rumah Sakit..."
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-800 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}

      {viewMode === 'form-category' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tambah / Edit Kategori</h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola data jurusan dan program studi yang tersedia.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitCategory} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Form Data Kategori</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2b4c80] hover:bg-[#203c66] text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  <Save size={15} /> {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nama Kategori / Rumpun <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formCategoryName}
                  onChange={(e) => setFormCategoryName(e.target.value)}
                  placeholder="Contoh: Sains & Teknologi"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Deskripsi Kategori
                </label>
                <textarea
                  rows={4}
                  value={formCategoryDesc}
                  onChange={(e) => setFormCategoryDesc(e.target.value)}
                  placeholder="Masukkan deskripsi untuk kategori ini..."
                  className="w-full rounded-xl border border-gray-200 p-3.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={26} strokeWidth={2.3} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Konfirmasi Hapus {deleteTarget.type === 'program' ? 'Program Studi' : 'Kategori'}
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus{' '}
              <span className="font-semibold text-gray-800">{deleteTarget.name}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm transition disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  )
}
