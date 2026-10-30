import React, { useEffect, useRef, useState } from 'react'
import { router } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'
import {
  Star,
  Plus,
  Pencil,
  Check,
  X,
  Trash2,
  Camera,
} from 'lucide-react'
import {
  saveTestimonial,
  togglePublishTestimonial,
  deleteTestimonial,
} from '../../services/testimonialService'

interface TestimonialDbItem {
  id: number | string
  user_id?: number | string | null
  name: string
  role: string
  rating: number
  content: string
  avatar?: string | null
  user?: {
    id: number
    name: string
    avatar?: string | null
  }
  is_published?: boolean
  isPublished?: boolean
  created_at?: string
  updated_at?: string
}

interface MonitoringTestimoniProps {
  testimonials?: TestimonialDbItem[]
}

export default function MonitoringTestimoni({ testimonials: serverTestimonials }: MonitoringTestimoniProps) {
  const [testimonials, setTestimonials] = useState<TestimonialDbItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TestimonialDbItem | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<TestimonialDbItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarRemoved, setAvatarRemoved] = useState(false)

  const [formName, setFormName] = useState('')
  const [formRole, setFormRole] = useState<'Siswa' | 'Guru'>('Siswa')
  const [formRating, setFormRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [formMessage, setFormMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getInitials = (val?: string) => {
    if (!val) return 'U'
    const parts = val.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const syncList = () => {
    if (serverTestimonials && Array.isArray(serverTestimonials) && serverTestimonials.length > 0) {
      setTestimonials(serverTestimonials)
    } else {
      setTestimonials([])
    }
  }

  useEffect(() => {
    syncList()
  }, [serverTestimonials])

  const handleOpenAdd = () => {
    setEditingItem(null)
    setFormName('')
    setFormRole('Siswa')
    setFormRating(5)
    setFormMessage('')
    setAvatarFile(null)
    setAvatarPreview(null)
    setAvatarRemoved(false)
    setModalOpen(true)
  }

  const handleOpenEdit = (item: TestimonialDbItem) => {
    setEditingItem(item)
    setFormName(item.name)
    setFormRole(item.role === 'Guru' ? 'Guru' : 'Siswa')
    setFormRating(item.rating)
    setFormMessage(item.content)
    setAvatarFile(null)
    setAvatarPreview(item.avatar || item.user?.avatar || null)
    setAvatarRemoved(false)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingItem(null)
    setAvatarFile(null)
    setAvatarPreview(null)
    setAvatarRemoved(false)
    setIsSubmitting(false)
  }

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
      setAvatarRemoved(false)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    setAvatarRemoved(true)
    if (avatarInputRef.current) {
      avatarInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formRole || !formMessage.trim() || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('name', formName.trim())
    formData.append('role', formRole)
    formData.append('rating', String(formRating))
    formData.append('content', formMessage.trim())

    if (avatarFile) {
      formData.append('avatar', avatarFile)
    } else if (avatarRemoved) {
      formData.append('avatar', '')
    }

    if (editingItem) {
      formData.append('_method', 'PUT')

      saveTestimonial({
        id: String(editingItem.id),
        name: formName.trim(),
        role: formRole,
        rating: formRating,
        content: formMessage.trim(),
        avatar: avatarPreview || undefined,
        isPublished: Boolean(editingItem.is_published ?? editingItem.isPublished),
      })

      router.post(
        `/admin/testimonials/${editingItem.id}`,
        formData,
        {
          preserveScroll: true,
          forceFormData: true,
          onSuccess: () => handleCloseModal(),
          onError: () => setIsSubmitting(false),
          onFinish: () => setIsSubmitting(false),
        }
      )
    } else {
      saveTestimonial({
        name: formName.trim(),
        role: formRole,
        rating: formRating,
        content: formMessage.trim(),
        avatar: avatarPreview || undefined,
        isPublished: false,
      })

      router.post(
        '/admin/testimonials',
        formData,
        {
          preserveScroll: true,
          forceFormData: true,
          onSuccess: () => handleCloseModal(),
          onError: () => setIsSubmitting(false),
          onFinish: () => setIsSubmitting(false),
        }
      )
    }
  }

  const handleTogglePublish = (id: string | number) => {
    togglePublishTestimonial(String(id))
    setTestimonials((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              is_published: !(item.is_published ?? item.isPublished),
              isPublished: !(item.is_published ?? item.isPublished),
            }
          : item
      )
    )

    router.patch(
      `/admin/testimonials/${id}/publish`,
      {},
      {
        preserveScroll: true,
      }
    )
  }

  const handleRequestDelete = (item: TestimonialDbItem) => {
    setDeleteTarget(item)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    const targetId = deleteTarget.id

    deleteTestimonial(String(targetId))
    setTestimonials((prev) => prev.filter((item) => item.id !== targetId))

    router.delete(`/admin/testimonials/${targetId}`, {
      preserveScroll: true,
      onFinish: () => {
        setIsDeleting(false)
        setDeleteTarget(null)
      },
    })
  }

  return (
    <PortalLayout role="admin" menuItems={adminMenuItems} activeId="monitoring_testimoni">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Monitoring Testimoni</h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola masukan dan rating dari pengguna Gen-U.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition cursor-pointer self-start sm:self-auto"
          >
            <Plus size={18} /> Testimoni Baru
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6 w-1/3">Pengguna</th>
                  <th className="py-4 px-6 w-36">Rating</th>
                  <th className="py-4 px-6">Masukan</th>
                  <th className="py-4 px-6 w-36 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400">
                      Belum ada data testimoni.
                    </td>
                  </tr>
                ) : (
                  testimonials.map((item) => {
                    const isPublished = Boolean(item.is_published ?? item.isPublished)
                    const displayAvatar = item.avatar || item.user?.avatar
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-6 align-top">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 p-0.5 shrink-0 overflow-hidden shadow-xs">
                              {displayAvatar ? (
                                <img
                                  src={displayAvatar}
                                  alt={item.name}
                                  className="w-full h-full rounded-[9px] object-cover"
                                />
                              ) : (
                                <div className="w-full h-full rounded-[9px] bg-gradient-to-tr from-indigo-100 to-blue-50 text-indigo-700 font-bold text-xs flex items-center justify-center uppercase select-none">
                                  {getInitials(item.name)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{item.name}</div>
                              <span
                                className={`inline-block mt-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                  item.role.toLowerCase() === 'siswa'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'bg-emerald-50 text-emerald-600'
                                }`}
                              >
                                {item.role}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 align-top">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={
                                  star <= item.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-200 fill-gray-200'
                                }
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 align-top text-gray-600 leading-relaxed">
                          {item.content}
                        </td>
                        <td className="py-4 px-6 align-top">
                          <div className="flex flex-col items-stretch gap-1.5 w-28 mx-auto">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="w-full py-1.5 px-3 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(item.id)}
                              className={`w-full py-1.5 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition cursor-pointer ${
                                isPublished
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                  : 'border border-blue-200 bg-blue-50/30 hover:bg-blue-100 text-blue-600'
                              }`}
                            >
                              {isPublished ? (
                                <>
                                  <Check size={12} /> Diterbitkan
                                </>
                              ) : (
                                <>
                                  <span className="font-bold">-</span> Terbitkan
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRequestDelete(item)}
                              className="w-full py-1 px-3 text-[11px] text-gray-400 hover:text-rose-600 flex items-center justify-center gap-1 transition cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 size={11} /> Hapus
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
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Testimoni' : 'Tambah Testimoni'}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Foto Profil / Avatar Testimoni
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 p-0.5 shrink-0 overflow-hidden relative shadow-xs">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt={formName || 'Avatar'}
                        className="w-full h-full rounded-[14px] object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-indigo-100 to-blue-50 text-indigo-700 font-extrabold text-lg flex items-center justify-center uppercase select-none">
                        {getInitials(formName || 'User')}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="py-1.5 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Camera size={14} /> Pilih Foto
                      </button>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="py-1.5 px-3 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                        >
                          <Trash2 size={13} /> Hapus
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Khusus untuk testimoni ini. Format PNG, JPG, atau WebP.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Masukkan nama..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Peran / Role <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as 'Siswa' | 'Guru')}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition bg-white"
                >
                  <option value="Siswa">Siswa</option>
                  <option value="Guru">Guru</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Rating <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || formRating) >= star
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                      >
                        <Star
                          size={28}
                          className={
                            active
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Masukan / Pesan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Tuliskan masukan pengguna..."
                  className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="py-2.5 px-6 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-200 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Testimoni'}
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
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Konfirmasi Hapus Testimoni</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus testimoni dari{' '}
              <span className="font-semibold text-gray-800">{deleteTarget.name}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm transition disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus Testimoni'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  )
}
