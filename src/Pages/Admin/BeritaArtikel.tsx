import React, { useState, useRef } from 'react'
import { router } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'
import {
  Newspaper,
  Plus,
  Search,
  Trash2,
  Image as ImageIcon,
  Upload,
  Calendar,
  Clock,
  ExternalLink,
  Save,
  Info,
  Tag as TagIcon,
  FolderPlus,
  X,
  Palette,
  Megaphone,
  Ticket,
  BookOpen,
  Eye,
} from 'lucide-react'
import RichText, { processImagesInHTML } from '../../components/RichText'

export interface PostCategoryItem {
  id: number
  name: string
  slug: string
  badge_color: string
  posts_count?: number
  created_at?: string
}

export interface PostItem {
  id: number
  category_id?: number | null
  category?: PostCategoryItem | null
  type: 'berita' | 'webinar' | 'pengumuman'
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  image?: string | null
  image_url?: string | null
  author?: string | null
  read_time?: string | null
  event_date?: string | null
  event_time?: string | null
  event_link?: string | null
  badge_label?: string | null
  status: string
  formatted_date?: string
  created_at?: string
}

interface AdminBeritaArtikelProps {
  posts?: PostItem[]
  categories?: PostCategoryItem[]
}

const CATEGORY_COLOR_PRESETS = [
  { label: 'Blue / Biru', value: 'bg-blue-100 text-blue-700' },
  { label: 'Emerald / Hijau', value: 'bg-emerald-100 text-emerald-700' },
  { label: 'Amber / Kuning Emas', value: 'bg-amber-100 text-amber-800' },
  { label: 'Indigo / Nila', value: 'bg-indigo-100 text-indigo-700' },
  { label: 'Purple / Ungu', value: 'bg-purple-100 text-purple-700' },
  { label: 'Rose / Merah', value: 'bg-rose-100 text-rose-700' },
  { label: 'Cyan / Biru Langit', value: 'bg-cyan-100 text-cyan-800' },
  { label: 'Teal / Hijau Laut', value: 'bg-teal-100 text-teal-800' },
]

export default function AdminBeritaArtikel({
  posts = [],
  categories = [],
}: AdminBeritaArtikelProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts')
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'semua' | 'berita' | 'webinar' | 'pengumuman'>('semua')
  const [editingItem, setEditingItem] = useState<PostItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'post' | 'category'
    id: number
    name: string
    subText?: string
  } | null>(null)

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<PostCategoryItem | null>(null)
  const [formCategoryName, setFormCategoryName] = useState('')
  const [formCategoryBadgeColor, setFormCategoryBadgeColor] = useState('bg-blue-100 text-blue-700')

  const [formType, setFormType] = useState<'berita' | 'webinar' | 'pengumuman'>('berita')
  const [formCategoryId, setFormCategoryId] = useState<number | string>('')
  const [formTitle, setFormTitle] = useState('')
  const [formExcerpt, setFormExcerpt] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formReadTime, setFormReadTime] = useState('5 Menit Baca')
  const [formEventDate, setFormEventDate] = useState('')
  const [formEventTime, setFormEventTime] = useState('')
  const [formEventLink, setFormEventLink] = useState('')
  const [formBadgeLabel, setFormBadgeLabel] = useState('')
  const [formStatus, setFormStatus] = useState('Aktif (Tampil)')
  const [formImageFile, setFormImageFile] = useState<File | null>(null)
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleOpenAddCategory = () => {
    setEditingCategory(null)
    setFormCategoryName('')
    setFormCategoryBadgeColor('bg-blue-100 text-blue-700')
    setCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (cat: PostCategoryItem) => {
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
      router.post(`/admin/berita-categories/${editingCategory.id}`, {
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
      router.post('/admin/berita-categories', payload, {
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
    setFormType('berita')
    setFormCategoryId(categories.length > 0 ? categories[0].id : '')
    setFormTitle('')
    setFormExcerpt('')
    setFormContent('')
    setFormReadTime('5 Menit Baca')
    setFormEventDate('')
    setFormEventTime('')
    setFormEventLink('')
    setFormBadgeLabel('')
    setFormStatus('Aktif (Tampil)')
    setFormImageFile(null)
    setFormImagePreview(null)
    setViewMode('form')
  }

  const handleOpenEdit = (item: PostItem) => {
    setEditingItem(item)
    setFormType(item.type)
    setFormCategoryId(item.category_id || '')
    setFormTitle(item.title)
    setFormExcerpt(item.excerpt || '')
    setFormContent(item.content || '')
    setFormReadTime(item.read_time || '5 Menit Baca')
    setFormEventDate(item.event_date || '')
    setFormEventTime(item.event_time || '')
    setFormEventLink(item.event_link || '')
    setFormBadgeLabel(item.badge_label || '')
    setFormStatus(item.status || 'Aktif (Tampil)')
    setFormImageFile(null)
    setFormImagePreview(item.image_url || item.image || null)
    setViewMode('form')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormImageFile(file)
      setFormImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim() || isSubmitting) return

    setIsSubmitting(true)

    let finalContent = formContent
    try {
      finalContent = await processImagesInHTML(formContent)
    } catch { }

    const formData = new FormData()
    formData.append('type', formType)
    formData.append('title', formTitle.trim())
    if (formType === 'berita' && formCategoryId) {
      formData.append('category_id', String(formCategoryId))
    }
    formData.append('excerpt', formExcerpt.trim())
    formData.append('content', finalContent)
    formData.append('status', formStatus)

    if (formType === 'berita') {
      formData.append('read_time', formReadTime.trim())
    } else if (formType === 'webinar') {
      formData.append('event_date', formEventDate.trim())
      formData.append('event_time', formEventTime.trim())
      formData.append('event_link', formEventLink.trim())
      formData.append('badge_label', formBadgeLabel.trim() || 'LIVE WEBINAR')
    } else if (formType === 'pengumuman') {
      formData.append('badge_label', formBadgeLabel.trim() || 'Baru')
      if (formEventLink.trim()) {
        formData.append('event_link', formEventLink.trim())
      }
    }

    if (formImageFile) {
      formData.append('image', formImageFile)
    } else if (!formImagePreview) {
      formData.append('image', '')
    }

    if (editingItem) {
      formData.append('_method', 'PUT')
      router.post(`/admin/berita-artikel/${editingItem.id}`, formData, {
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
      router.post('/admin/berita-artikel', formData, {
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
    const url = deleteTarget.type === 'post'
      ? `/admin/berita-artikel/${deleteTarget.id}`
      : `/admin/berita-categories/${deleteTarget.id}`

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

  const filteredPosts = posts.filter((p) => {
    const q = searchQuery.toLowerCase()
    const matchesQuery = (
      p.title.toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q) ||
      (p.category?.name || '').toLowerCase().includes(q)
    )
    const matchesType = typeFilter === 'semua' || p.type === typeFilter
    return matchesQuery && matchesType
  })

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase()
    return c.name.toLowerCase().includes(q)
  })

  return (
    <PortalLayout role="admin" menuItems={adminMenuItems} activeId="berita_artikel">
      {viewMode === 'list' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Berita &amp; Artikel</h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola publikasi artikel berita, informasi live webinar, dan pengumuman resmi di landing page.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-xs transition cursor-pointer"
              >
                <FolderPlus size={16} /> Tambah Kategori Berita
              </button>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2b4c80] hover:bg-[#203c66] text-white font-semibold text-sm shadow-sm transition cursor-pointer"
              >
                <Plus size={17} /> Tambah Konten Baru
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('posts')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'posts'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  Semua Konten
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'posts' ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    {posts.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('categories')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'categories'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  Kategori Berita
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'categories' ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    {categories.length}
                  </span>
                </button>

                {activeTab === 'posts' && (
                  <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-3 border-l border-gray-200">
                    {(['semua', 'berita', 'webinar', 'pengumuman'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTypeFilter(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${typeFilter === t
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {t === 'berita' ? 'Berita / Artikel' : t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative w-full lg:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === 'posts'
                      ? 'Cari judul atau topik...'
                      : 'Cari nama kategori...'
                  }
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            {activeTab === 'posts' ? (
              <div className="w-full overflow-hidden">
                <table className="w-full table-fixed text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                      <th className="py-3.5 px-3 w-12 text-center">No</th>
                      <th className="py-3.5 px-3 w-16 text-center">Foto</th>
                      <th className="py-3.5 px-3 w-[30%]">Judul Konten</th>
                      <th className="py-3.5 px-3 w-[16%]">Tipe &amp; Kategori</th>
                      <th className="py-3.5 px-3 w-[18%]">Waktu Publikasi</th>
                      <th className="py-3.5 px-3 w-28 text-center">Status</th>
                      <th className="py-3.5 px-3 w-24 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          Belum ada konten berita, webinar, atau pengumuman yang sesuai.
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((item, index) => {
                        const typeBadgeColor = item.type === 'webinar'
                          ? 'bg-rose-100 text-rose-700'
                          : item.type === 'pengumuman'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'

                        const typeLabel = item.type === 'webinar'
                          ? 'Webinar'
                          : item.type === 'pengumuman'
                            ? 'Pengumuman'
                            : 'Berita'

                        return (
                          <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3.5 px-3 text-center text-gray-400 font-medium">{index + 1}</td>
                            <td className="py-3.5 px-3 text-center">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden mx-auto flex items-center justify-center shrink-0">
                                {item.image_url || item.image ? (
                                  <img
                                    src={item.image_url || item.image || ''}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : item.type === 'webinar' ? (
                                  <Ticket size={18} className="text-rose-500" />
                                ) : item.type === 'pengumuman' ? (
                                  <Megaphone size={18} className="text-emerald-600" />
                                ) : (
                                  <BookOpen size={18} className="text-blue-500" />
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-3 font-bold text-gray-900">
                              <div className="truncate" title={item.title}>
                                {item.title}
                              </div>
                              <a
                                href={`/berita/${item.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1 font-normal mt-0.5"
                              >
                                <span>Lihat Pratinjau</span>
                                <ExternalLink size={10} />
                              </a>
                            </td>
                            <td className="py-3.5 px-3">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${typeBadgeColor}`}
                              >
                                {typeLabel}
                              </span>
                              {item.type === 'berita' && item.category && (
                                <div className="text-[11px] text-gray-500 font-medium mt-1 truncate">
                                  {item.category.name}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="text-gray-800 font-medium truncate flex items-center gap-1.5">
                                <Calendar size={13} className="text-gray-400 shrink-0" />
                                <span>
                                  {item.type === 'webinar' && item.event_date
                                    ? item.event_date
                                    : item.formatted_date || item.created_at || '-'}
                                </span>
                              </div>
                              {item.type === 'berita' && item.read_time && (
                                <div className="text-gray-400 text-[11px] font-normal mt-0.5 truncate">
                                  {item.read_time}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${item.status === 'Aktif (Tampil)'
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
                                      type: 'post',
                                      id: item.id,
                                      name: item.title,
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
                      <th className="py-3.5 px-3 w-[35%]">Nama Kategori Berita</th>
                      <th className="py-3.5 px-3 w-[25%]">Preview Badge</th>
                      <th className="py-3.5 px-3 w-[20%] text-center">Jumlah Konten</th>
                      <th className="py-3.5 px-3 w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400">
                          Belum ada kategori berita yang ditambahkan.
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
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${cat.badge_color || 'bg-blue-100 text-blue-700'
                                }`}
                            >
                              {cat.name}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                              <BookOpen size={13} className="text-slate-400" />
                              {cat.posts_count || 0}
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
                                    subText: `Kategori berita ini terkait dengan ${cat.posts_count || 0} konten.`,
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
                {editingItem ? 'Edit Konten Publikasi' : 'Tambah Konten Publikasi Baru'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Lengkapi rincian berita, informasi webinar, atau pengumuman yang akan dipublikasikan ke landing page.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
            <div className="flex items-center justify-between pb-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Formulir Publikasi</h2>
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
                  <Save size={15} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Konten'}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Pilih Tipe Konten <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      type: 'berita',
                      title: 'Artikel & Berita',
                      desc: 'Wawasan edukasi, tips PMB, atau artikel minat bakat.',
                      icon: BookOpen,
                      color: 'text-blue-600 bg-blue-50 border-blue-200',
                    },
                    {
                      type: 'webinar',
                      title: 'Live Webinar & Event',
                      desc: 'Kegiatan interaktif dengan jadwal dan link registrasi gratis.',
                      icon: Ticket,
                      color: 'text-rose-600 bg-rose-50 border-rose-200',
                    },
                    {
                      type: 'pengumuman',
                      title: 'Pengumuman Resmi',
                      desc: 'Kabar penting mengenai fitur, beasiswa, atau pembaruan.',
                      icon: Megaphone,
                      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                    },
                  ].map((opt) => {
                    const isSelected = formType === opt.type
                    const OptIcon = opt.icon
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => {
                          const nextType = opt.type as any
                          setFormType(nextType)
                          if (nextType !== 'berita') {
                            setFormCategoryId('')
                          } else if (!formCategoryId && categories.length > 0) {
                            setFormCategoryId(categories[0].id)
                          }
                        }}
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${isSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${opt.color}`}>
                            <OptIcon size={18} />
                          </div>
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                              }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900">{opt.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">{opt.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Judul Konten <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Grand Webinar Strategi Memilih Jurusan 2027"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {formType === 'berita' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-700">
                        Kategori Berita <span className="text-rose-500">*</span>
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
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    >
                      <option value="">-- Pilih Kategori Berita --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {formType === 'webinar' && (
                <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-4">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                    <Ticket size={16} className="text-rose-600" />
                    <span>Konfigurasi Pelaksanaan Webinar</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Tanggal Pelaksanaan Event <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formEventDate}
                        onChange={(e) => setFormEventDate(e.target.value)}
                        placeholder="Contoh: Sabtu, 24 Oktober 2026"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Jam / Waktu Pelaksanaan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formEventTime}
                        onChange={(e) => setFormEventTime(e.target.value)}
                        placeholder="Contoh: 09.00 - 11.30 WITA"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Link Pendaftaran Event Gratis (Target Tombol Daftar)
                      </label>
                      <input
                        type="url"
                        value={formEventLink}
                        onChange={(e) => setFormEventLink(e.target.value)}
                        placeholder="https://zoom.us/ atau https://forms.gle/... atau /register"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Label Badge Status Event
                      </label>
                      <input
                        type="text"
                        value={formBadgeLabel}
                        onChange={(e) => setFormBadgeLabel(e.target.value)}
                        placeholder="Contoh: LIVE WEBINAR, SEGERA HADIR"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formType === 'pengumuman' && (
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <Megaphone size={16} className="text-emerald-600" />
                    <span>Konfigurasi Pengumuman Resmi</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Label Badge Tag Pengumuman
                      </label>
                      <input
                        type="text"
                        value={formBadgeLabel}
                        onChange={(e) => setFormBadgeLabel(e.target.value)}
                        placeholder="Contoh: Baru, Fitur, Penting, Rilis"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Tautan Eksternal / Aksi Lanjutan (Opsional)
                      </label>
                      <input
                        type="text"
                        value={formEventLink}
                        onChange={(e) => setFormEventLink(e.target.value)}
                        placeholder="Contoh: /beasiswa atau https://..."
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formType === 'berita' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Estimasi Waktu Baca
                    </label>
                    <input
                      type="text"
                      value={formReadTime}
                      onChange={(e) => setFormReadTime(e.target.value)}
                      placeholder="Contoh: 5 Menit Baca"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Status Publikasi
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Aktif (Tampil)">Aktif (Tampil)</option>
                      <option value="Draft">Draft (Nonaktif)</option>
                    </select>
                  </div>
                </div>
              )}

              {formType !== 'berita' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Status Publikasi
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full sm:w-64 rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Aktif (Tampil)">Aktif (Tampil)</option>
                    <option value="Draft">Draft (Nonaktif)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Foto / Thumbnail / Poster Konten
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
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
                      <Upload size={14} /> Pilih File Gambar
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

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Ringkasan Singkat <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat yang akan tampil pada card di landing page..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Konten Lengkap
                </label>
                <div className="pt-2">
                  <RichText
                    value={formContent}
                    onChange={setFormContent}
                    placeholder="Tuliskan isi artikel, pengumuman, atau penjelasan lengkap event webinar di sini..."
                  />
                </div>
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
                    {editingCategory ? 'Edit Kategori Berita' : 'Tambah Kategori Berita'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Atur nama kategori dan kombinasi warna badge tag berita.
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
                  Nama Kategori Berita <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formCategoryName}
                  onChange={(e) => setFormCategoryName(e.target.value)}
                  placeholder="Contoh: Tips Minat Bakat, Info PMB, Eksplorasi Studi"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Palette size={14} className="text-blue-600" />
                  <span>Pilihan Warna Badge</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/50">
                  {CATEGORY_COLOR_PRESETS.map((preset) => {
                    const isSelected = formCategoryBadgeColor === preset.value
                    return (
                      <button
                        type="button"
                        key={preset.value}
                        onClick={() => setFormCategoryBadgeColor(preset.value)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-left transition cursor-pointer ${isSelected
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
                  Custom Kelas CSS (Tailwind)
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
                <span className="text-xs text-slate-500 font-medium">Preview Badge:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${formCategoryBadgeColor}`}>
                  {formCategoryName || 'Nama Kategori'}
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
              {deleteTarget.type === 'post' ? 'Konfirmasi Hapus Konten' : 'Konfirmasi Hapus Kategori'}
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
