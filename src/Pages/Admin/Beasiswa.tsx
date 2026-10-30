import React, { useState, useRef } from 'react'
import { router } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'
import {
  Award,
  Plus,
  Search,
  Trash2,
  Image as ImageIcon,
  Upload,
  Calendar,
  Users,
  Save,
  Info,
  CheckCircle2,
  FileCheck,
  FileText,
  ExternalLink,
  Tag as TagIcon,
  FolderPlus,
  X,
  Palette,
} from 'lucide-react'

export interface ScholarshipCategoryItem {
  id: number
  name: string
  badge_color: string
  scholarships_count?: number
  created_at?: string
}

export interface ScholarshipItem {
  id: number
  category_id?: number | null
  category?: ScholarshipCategoryItem | null
  name: string
  organizer: string
  tag: string
  tag_color?: string
  border_color?: string
  quota?: string | null
  image?: string | null
  image_url?: string | null
  summary_benefits?: string[] | null
  benefits?: string[] | null
  requirements?: string[] | null
  documents?: string[] | null
  deadline?: string | null
  status: string
  link_url?: string | null
  created_at?: string
}

interface AdminBeasiswaProps {
  scholarships?: ScholarshipItem[]
  categories?: ScholarshipCategoryItem[]
}

const TAG_COLOR_PRESETS = [
  { label: 'Emerald / Hijau', value: 'bg-emerald-100 text-emerald-700' },
  { label: 'Blue / Biru', value: 'bg-blue-100 text-blue-700' },
  { label: 'Amber / Kuning Emas', value: 'bg-amber-100 text-amber-800' },
  { label: 'Indigo / Nila', value: 'bg-indigo-100 text-indigo-700' },
  { label: 'Purple / Ungu', value: 'bg-purple-100 text-purple-700' },
  { label: 'Rose / Merah', value: 'bg-rose-100 text-rose-700' },
  { label: 'Cyan / Biru Langit', value: 'bg-cyan-100 text-cyan-800' },
  { label: 'Teal / Hijau Laut', value: 'bg-teal-100 text-teal-800' },
  { label: 'Slate / Abu Elegan', value: 'bg-slate-100 text-slate-700' },
]

const BORDER_COLOR_PRESETS = [
  { label: 'Amber Gold (#f59e0b)', value: '#f59e0b', bgClass: 'bg-[#f59e0b]' },
  { label: 'Navy Blue (#284f7a)', value: '#284f7a', bgClass: 'bg-[#284f7a]' },
  { label: 'Emerald (#10b981)', value: '#10b981', bgClass: 'bg-[#10b981]' },
  { label: 'Indigo (#4f46e5)', value: '#4f46e5', bgClass: 'bg-[#4f46e5]' },
  { label: 'Purple (#8b5cf6)', value: '#8b5cf6', bgClass: 'bg-[#8b5cf6]' },
  { label: 'Rose Red (#e11d48)', value: '#e11d48', bgClass: 'bg-[#e11d48]' },
]

export default function AdminBeasiswa({
  scholarships = [],
  categories = [],
}: AdminBeasiswaProps) {
  const [activeTab, setActiveTab] = useState<'scholarships' | 'categories'>('scholarships')
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingItem, setEditingItem] = useState<ScholarshipItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'scholarship' | 'category'
    id: number
    name: string
    subText?: string
  } | null>(null)

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ScholarshipCategoryItem | null>(null)
  const [formCategoryName, setFormCategoryName] = useState('')
  const [formCategoryBadgeColor, setFormCategoryBadgeColor] = useState('bg-blue-100 text-blue-700')

  const [formCategoryId, setFormCategoryId] = useState<number | string>('')
  const [formName, setFormName] = useState('')
  const [formOrganizer, setFormOrganizer] = useState('')
  const [formTag, setFormTag] = useState('')
  const [formTagColor, setFormTagColor] = useState('bg-blue-100 text-blue-700')
  const [formBorderColor, setFormBorderColor] = useState('#284f7a')
  const [formQuota, setFormQuota] = useState('')
  const [formDeadline, setFormDeadline] = useState('')
  const [formStatus, setFormStatus] = useState('Aktif (Tampil)')
  const [formLinkUrl, setFormLinkUrl] = useState('')
  const [formImageFile, setFormImageFile] = useState<File | null>(null)
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null)

  const [formSummaryBenefits, setFormSummaryBenefits] = useState<string[]>(['', ''])
  const [formBenefits, setFormBenefits] = useState<string[]>([''])
  const [formRequirements, setFormRequirements] = useState<string[]>([''])
  const [formDocuments, setFormDocuments] = useState<string[]>([''])

  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleOpenAddCategory = () => {
    setEditingCategory(null)
    setFormCategoryName('')
    setFormCategoryBadgeColor('bg-blue-100 text-blue-700')
    setCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (cat: ScholarshipCategoryItem) => {
    setEditingCategory(cat)
    setFormCategoryName(cat.name)
    setFormCategoryBadgeColor(cat.badge_color || 'bg-blue-100 text-blue-700')
    setCategoryModalOpen(true)
  }

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCategoryName.trim() || isSubmitting) return

    setIsSubmitting(true)
    const payload = {
      name: formCategoryName.trim(),
      badge_color: formCategoryBadgeColor,
    }

    if (editingCategory) {
      router.post(`/admin/beasiswa-categories/${editingCategory.id}`, {
        _method: 'PUT',
        ...payload,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false)
          setCategoryModalOpen(false)
        },
        onError: () => setIsSubmitting(false),
        onFinish: () => setIsSubmitting(false),
      })
    } else {
      router.post('/admin/beasiswa-categories', payload, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false)
          setCategoryModalOpen(false)
        },
        onError: () => setIsSubmitting(false),
        onFinish: () => setIsSubmitting(false),
      })
    }
  }

  const handleOpenAdd = () => {
    setEditingItem(null)
    const initialCategory = categories.length > 0 ? categories[0] : null
    setFormCategoryId(initialCategory ? initialCategory.id : '')
    setFormName('')
    setFormOrganizer('')
    setFormTag(initialCategory ? initialCategory.name : 'S1 Dalam Negeri')
    setFormTagColor(initialCategory ? initialCategory.badge_color : 'bg-emerald-100 text-emerald-700')
    setFormBorderColor('#f59e0b')
    setFormQuota('')
    setFormDeadline('')
    setFormStatus('Aktif (Tampil)')
    setFormLinkUrl('')
    setFormImageFile(null)
    setFormImagePreview(null)
    setFormSummaryBenefits(['', ''])
    setFormBenefits([''])
    setFormRequirements([''])
    setFormDocuments([''])
    setViewMode('form')
  }

  const handleOpenEdit = (item: ScholarshipItem) => {
    setEditingItem(item)
    setFormCategoryId(item.category_id || '')
    setFormName(item.name || '')
    setFormOrganizer(item.organizer || '')
    setFormTag(item.category?.name || item.tag || '')
    setFormTagColor(item.category?.badge_color || item.tag_color || 'bg-blue-100 text-blue-700')
    setFormBorderColor(item.border_color || '#284f7a')
    setFormQuota(item.quota || '')
    setFormDeadline(item.deadline || '')
    setFormStatus(item.status || 'Aktif (Tampil)')
    setFormLinkUrl(item.link_url || '')
    setFormImageFile(null)
    setFormImagePreview(item.image_url || item.image || null)

    const sb = Array.isArray(item.summary_benefits) && item.summary_benefits.length > 0
      ? item.summary_benefits
      : ['', '']
    setFormSummaryBenefits(sb)

    const bf = Array.isArray(item.benefits) && item.benefits.length > 0
      ? item.benefits
      : ['']
    setFormBenefits(bf)

    const rq = Array.isArray(item.requirements) && item.requirements.length > 0
      ? item.requirements
      : ['']
    setFormRequirements(rq)

    const dc = Array.isArray(item.documents) && item.documents.length > 0
      ? item.documents
      : ['']
    setFormDocuments(dc)

    setViewMode('form')
  }

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (!val) {
      setFormCategoryId('')
      return
    }
    const catId = Number(val)
    setFormCategoryId(catId)
    const selected = categories.find((c) => c.id === catId)
    if (selected) {
      setFormTag(selected.name)
      setFormTagColor(selected.badge_color)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormImageFile(file)
      setFormImagePreview(URL.createObjectURL(file))
    }
  }

  const handleListFieldChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)))
  }

  const handleAddListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, ''])
  }

  const handleRemoveListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : ['']))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formOrganizer.trim() || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    if (formCategoryId) {
      formData.append('category_id', String(formCategoryId))
    }
    formData.append('name', formName.trim())
    formData.append('organizer', formOrganizer.trim())
    formData.append('tag', formTag.trim())
    formData.append('tag_color', formTagColor)
    formData.append('border_color', formBorderColor)
    formData.append('quota', formQuota.trim())
    formData.append('deadline', formDeadline.trim())
    formData.append('status', formStatus)
    formData.append('link_url', formLinkUrl.trim())

    const cleanSummary = formSummaryBenefits.filter((item) => item.trim() !== '')
    const cleanBenefits = formBenefits.filter((item) => item.trim() !== '')
    const cleanReqs = formRequirements.filter((item) => item.trim() !== '')
    const cleanDocs = formDocuments.filter((item) => item.trim() !== '')

    formData.append('summary_benefits', JSON.stringify(cleanSummary))
    formData.append('benefits', JSON.stringify(cleanBenefits))
    formData.append('requirements', JSON.stringify(cleanReqs))
    formData.append('documents', JSON.stringify(cleanDocs))

    if (formImageFile) {
      formData.append('image', formImageFile)
    } else if (!formImagePreview) {
      formData.append('image', '')
    }

    if (editingItem) {
      formData.append('_method', 'PUT')
      router.post(`/admin/beasiswa/${editingItem.id}`, formData, {
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
      router.post('/admin/beasiswa', formData, {
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
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget || isSubmitting) return

    setIsSubmitting(true)
    const url = deleteTarget.type === 'scholarship'
      ? `/admin/beasiswa/${deleteTarget.id}`
      : `/admin/beasiswa-categories/${deleteTarget.id}`

    router.delete(url, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false)
        setDeleteTarget(null)
      },
      onError: () => setIsSubmitting(false),
      onFinish: () => setIsSubmitting(false),
    })
  }

  const filteredScholarships = scholarships.filter((s) => {
    const q = searchQuery.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      s.organizer.toLowerCase().includes(q) ||
      (s.category?.name || s.tag || '').toLowerCase().includes(q)
    )
  })

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      (c.badge_color || '').toLowerCase().includes(q)
    )
  })

  return (
    <PortalLayout role="admin" menuItems={adminMenuItems} activeId="beasiswa">
      {viewMode === 'list' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Beasiswa</h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola daftar peluang beasiswa serta kategori &amp; badge tag untuk landing page dan pencarian publik.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-xs transition cursor-pointer"
              >
                <FolderPlus size={16} /> Tambah Kategori / Tag
              </button>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2b4c80] hover:bg-[#203c66] text-white font-semibold text-sm shadow-sm transition cursor-pointer"
              >
                <Plus size={17} /> Tambah Beasiswa
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('scholarships')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'scholarships'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Daftar Beasiswa
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      activeTab === 'scholarships' ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {scholarships.length}
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
                  Kategori / Tag
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
                  placeholder={
                    activeTab === 'scholarships'
                      ? 'Cari beasiswa atau penyelenggara...'
                      : 'Cari nama kategori atau tag...'
                  }
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            {activeTab === 'scholarships' ? (
              <div className="w-full overflow-hidden">
                <table className="w-full table-fixed text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                      <th className="py-3.5 px-3 w-12 text-center">No</th>
                      <th className="py-3.5 px-3 w-16 text-center">Foto</th>
                      <th className="py-3.5 px-3 w-[26%]">Nama Beasiswa</th>
                      <th className="py-3.5 px-3 w-[20%]">Penyelenggara &amp; Tag</th>
                      <th className="py-3.5 px-3 w-[18%]">Kuota &amp; Deadline</th>
                      <th className="py-3.5 px-3 w-28 text-center">Status</th>
                      <th className="py-3.5 px-3 w-24 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredScholarships.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          Belum ada data beasiswa yang tersedia.
                        </td>
                      </tr>
                    ) : (
                      filteredScholarships.map((item, index) => {
                        const displayTag = item.category?.name || item.tag
                        const displayTagColor = item.category?.badge_color || item.tag_color || 'bg-blue-100 text-blue-700'

                        return (
                          <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3.5 px-3 text-center text-gray-400 font-medium">{index + 1}</td>
                            <td className="py-3.5 px-3 text-center">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden mx-auto flex items-center justify-center shrink-0">
                                {item.image_url || item.image ? (
                                  <img
                                    src={item.image_url || item.image || ''}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Award size={18} className="text-gray-400" />
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-3 font-bold text-gray-900">
                              <div className="truncate" title={item.name}>
                                {item.name}
                              </div>
                              {item.link_url && (
                                <a
                                  href={item.link_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1 font-normal mt-0.5"
                                >
                                  <span>Website Resmi</span>
                                  <ExternalLink size={10} />
                                </a>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="text-gray-700 font-medium truncate" title={item.organizer}>
                                {item.organizer}
                              </div>
                              {displayTag && (
                                <span
                                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold ${displayTagColor}`}
                                >
                                  {displayTag}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="text-gray-700 font-semibold flex items-center gap-1.5">
                                <Users size={13} className="text-gray-400 shrink-0" />
                                <span className="truncate">{item.quota || '-'}</span>
                              </div>
                              <div className="text-red-600 text-[11px] font-medium flex items-center gap-1.5 mt-0.5">
                                <Calendar size={13} className="text-red-400 shrink-0" />
                                <span className="truncate">{item.deadline || '-'}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  item.status === 'Aktif (Tampil)'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(item)}
                                  className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: 'scholarship',
                                      id: item.id,
                                      name: item.name,
                                    })
                                  }
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
              </div>
            ) : (
              <div className="w-full overflow-hidden">
                <table className="w-full table-fixed text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                      <th className="py-3.5 px-3 w-12 text-center">No</th>
                      <th className="py-3.5 px-3 w-[30%]">Nama Kategori / Tag</th>
                      <th className="py-3.5 px-3 w-[25%]">Preview Badge</th>
                      <th className="py-3.5 px-3 w-[20%] text-center">Jumlah Beasiswa</th>
                      <th className="py-3.5 px-3 w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400">
                          Belum ada kategori atau tag yang ditambahkan.
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((cat, index) => (
                        <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3.5 px-3 text-center text-gray-400 font-medium">{index + 1}</td>
                          <td className="py-3.5 px-3 font-bold text-gray-900">
                            <div className="truncate" title={cat.name}>
                              {cat.name}
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                cat.badge_color || 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {cat.name}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                              <Award size={13} className="text-slate-400" />
                              {cat.scholarships_count || 0}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
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
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'category',
                                    id: cat.id,
                                    name: cat.name,
                                    subText: `Kategori ini terhubung dengan ${cat.scholarships_count || 0} program beasiswa.`,
                                  })
                                }
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
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'form' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {editingItem ? 'Edit Data Beasiswa' : 'Tambah Beasiswa Baru'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Lengkapi informasi program beasiswa yang akan tampil pada landing page dan halaman pencarian beasiswa.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
            <div className="flex items-center justify-between pb-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Formulir Data Beasiswa</h2>
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
                <span>Informasi Umum</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nama Program Beasiswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Beasiswa Indonesia Pintar 2027"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Instansi / Penyelenggara <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formOrganizer}
                    onChange={(e) => setFormOrganizer(e.target.value)}
                    placeholder="Contoh: Kementerian Pendidikan / Yayasan Generasi Universal"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Kategori / Tag Beasiswa <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleOpenAddCategory}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> Tambah Baru
                    </button>
                  </div>
                  <select
                    required
                    value={formCategoryId}
                    onChange={handleCategorySelectChange}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  >
                    <option value="">-- Pilih Kategori / Tag --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {formTag && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] text-gray-400">Badge Tag Terpilih:</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${formTagColor}`}>
                        {formTag}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Warna Garis Kiri Card
                  </label>
                  <select
                    value={formBorderColor}
                    onChange={(e) => setFormBorderColor(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  >
                    {BORDER_COLOR_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Kuota Penerima
                  </label>
                  <input
                    type="text"
                    value={formQuota}
                    onChange={(e) => setFormQuota(e.target.value)}
                    placeholder="Contoh: 10.000 Kuota / 500 Kuota"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Batas Waktu Pendaftaran
                  </label>
                  <input
                    type="text"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    placeholder="Contoh: 28 Februari 2027"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Status Tampilan
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  >
                    <option value="Aktif (Tampil)">Aktif (Tampil)</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Tautan Link Pendaftaran / Website Resmi (Opsional)
                </label>
                <input
                  type="url"
                  value={formLinkUrl}
                  onChange={(e) => setFormLinkUrl(e.target.value)}
                  placeholder="https://kip-kuliah.kemdikbud.go.id/ atau https://..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Foto / Thumbnail Beasiswa
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                    {formImagePreview ? (
                      <img
                        src={formImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={28} className="text-gray-300" />
                    )}
                  </div>
                  <div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition cursor-pointer"
                    >
                      <Upload size={14} /> Pilih Gambar
                    </button>
                    {formImagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormImageFile(null)
                          setFormImagePreview(null)
                          if (imageInputRef.current) imageInputRef.current.value = ''
                        }}
                        className="block mt-2 text-[11px] text-rose-500 hover:underline cursor-pointer"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <CheckCircle2 size={18} className="text-amber-500" />
                  <span>Benefit Singkat (Ditampilkan pada Card Landing Page - 2 Poin)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddListItem(setFormSummaryBenefits)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={13} /> Tambah Baris
                </button>
              </div>
              <div className="space-y-2">
                {formSummaryBenefits.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListFieldChange(setFormSummaryBenefits, index, e.target.value)}
                      placeholder="Contoh: Biaya Pendidikan Penuh (UKT)"
                      className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem(setFormSummaryBenefits, index)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <Award size={18} className="text-emerald-600" />
                  <span>Fasilitas &amp; Cakupan Dana Lengkap (Detail Modal)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddListItem(setFormBenefits)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={13} /> Tambah Fasilitas
                </button>
              </div>
              <div className="space-y-2">
                {formBenefits.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListFieldChange(setFormBenefits, index, e.target.value)}
                      placeholder="Contoh: Pembebasan biaya kuliah UKT secara penuh hingga lulus (8 semester)"
                      className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem(setFormBenefits, index)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <FileCheck size={18} className="text-blue-600" />
                  <span>Persyaratan Umum (Detail Modal)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddListItem(setFormRequirements)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={13} /> Tambah Syarat
                </button>
              </div>
              <div className="space-y-2">
                {formRequirements.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListFieldChange(setFormRequirements, index, e.target.value)}
                      placeholder="Contoh: Siswa SMA/SMK/MA sederajat kelas 12 atau lulusan maksimal 2 tahun"
                      className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem(setFormRequirements, index)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <FileText size={18} className="text-indigo-600" />
                  <span>Dokumen yang Diperlukan (Detail Modal)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddListItem(setFormDocuments)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={13} /> Tambah Dokumen
                </button>
              </div>
              <div className="space-y-2">
                {formDocuments.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListFieldChange(setFormDocuments, index, e.target.value)}
                      placeholder="Contoh: Kartu Peserta KIP Kuliah / Akun Kemendikbud"
                      className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem(setFormDocuments, index)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <TagIcon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                    {editingCategory ? 'Edit Kategori / Tag' : 'Tambah Kategori / Tag'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Atur nama kategori dan kombinasi warna badge tag.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nama Kategori / Tag <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formCategoryName}
                  onChange={(e) => setFormCategoryName(e.target.value)}
                  placeholder="Contoh: S1 Dalam Negeri, Mahasiswa Aktif, Vokasi"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Palette size={14} className="text-blue-600" />
                  <span>Pilihan Warna Badge Tag</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/50">
                  {TAG_COLOR_PRESETS.map((preset) => {
                    const isSelected = formCategoryBadgeColor === preset.value
                    return (
                      <button
                        type="button"
                        key={preset.value}
                        onClick={() => setFormCategoryBadgeColor(preset.value)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/80 shadow-xs ring-1 ring-blue-300'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-[11px] font-medium text-gray-700 truncate pr-1">
                          {preset.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${preset.value}`}>
                          Abc
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Custom Kelas CSS Badge (Tailwind)
                </label>
                <input
                  type="text"
                  value={formCategoryBadgeColor}
                  onChange={(e) => setFormCategoryBadgeColor(e.target.value)}
                  placeholder="bg-blue-100 text-blue-700"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-mono text-gray-800 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Preview Tampilan Badge:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${formCategoryBadgeColor}`}>
                  {formCategoryName || 'Nama Kategori / Tag'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#2b4c80] hover:bg-[#203c66] text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={26} strokeWidth={2.3} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              {deleteTarget.type === 'scholarship' ? 'Konfirmasi Hapus Beasiswa' : 'Konfirmasi Hapus Kategori / Tag'}
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus{' '}
              <span className="font-semibold text-gray-800">{deleteTarget.name}</span>?
              {deleteTarget.subText && (
                <span className="block mt-1 text-xs text-amber-600 font-medium">
                  {deleteTarget.subText}
                </span>
              )}
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
