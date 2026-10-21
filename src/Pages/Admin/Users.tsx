import React, { useState } from 'react'
import { router, useForm } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'
import {
  Plus,
  Search,
  X,
  Check,
  UserPlus,
  Edit2,
  Mail,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react'

interface AdminUserItem {
  id: number
  registration_id: string
  name: string
  email: string
  personal_email: string
  phone: string
  role: 'siswa' | 'guru' | 'admin'
  school: string
  npsn?: string
  status: 'active' | 'pending' | 'banned'
  created_at: string
}

interface AdminUsersProps {
  users: AdminUserItem[]
  flash?: {
    success?: string
    error?: string
    warning?: string
  }
}

export default function AdminUsers({ users = [], flash }: AdminUsersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null)

  const generateRandom12Digits = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString()
  }

  const { data, setData, post, put, processing, reset, errors } = useForm({
    name: '',
    registration_id: '',
    email: '',
    personal_email: '',
    phone: '',
    role: 'siswa',
    status: 'active',
    school: '',
    npsn: '',
    password: '',
    send_email: true,
  })

  const openCreateModal = () => {
    setEditingUser(null)
    const newId = generateRandom12Digits()
    setData({
      name: '',
      registration_id: newId,
      email: `${newId}@gen.univeral.ac.id`,
      personal_email: '',
      phone: '',
      role: 'siswa',
      status: 'active',
      school: '',
      npsn: '',
      password: '',
      send_email: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (user: AdminUserItem) => {
    setEditingUser(user)
    setData({
      name: user.name,
      registration_id: user.registration_id || generateRandom12Digits(),
      email: user.email || (user.registration_id ? `${user.registration_id}@gen.univeral.ac.id` : ''),
      personal_email: user.personal_email || '',
      phone: user.phone || '',
      role: user.role,
      status: user.status === 'pending' ? 'active' : user.status,
      school: user.school && user.school !== '-' ? user.school : '',
      npsn: user.npsn && user.npsn !== '-' ? user.npsn : '',
      password: '',
      send_email: true,
    })
    setModalOpen(true)
  }

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      put(`/admin/users/${editingUser.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setModalOpen(false)
          reset()
        },
      })
    } else {
      post('/admin/users', {
        preserveScroll: true,
        onSuccess: () => {
          setModalOpen(false)
          reset()
        },
      })
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.personal_email && u.personal_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm)) ||
      (u.registration_id && u.registration_id.includes(searchTerm))

    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'guru' && u.role === 'guru') ||
      (roleFilter === 'siswa' && u.role === 'siswa') ||
      (roleFilter === 'admin' && u.role === 'admin')

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && u.status === 'active') ||
      (statusFilter === 'pending' && u.status === 'pending') ||
      (statusFilter === 'banned' && u.status === 'banned')

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <PortalLayout role="admin" menuItems={adminMenuItems} activeId="users">
      <div className="space-y-6">
        {flash?.success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.warning && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium flex items-center justify-between">
            <span>{flash.warning}</span>
          </div>
        )}
        {flash?.error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center justify-between">
            <span>{flash.error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Monitoring Pengguna
              </h1>
              <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-semibold">
                Total {users.length} User
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Kelola dan verifikasi akun pengguna, tetapkan email Google Workspace resmi serta kirimkan kredensial ke email pendaftar.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition self-start md:self-auto"
          >
            <Plus size={18} /> Buat Akun
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama, email, atau Gen-U ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            >
              <option value="all">Semua Role</option>
              <option value="siswa">Siswa</option>
              <option value="guru">Guru/Mentor</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="pending">Menunggu</option>
              <option value="banned">Nonaktif</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50">
                  <th className="py-3.5 px-5">NAMA & GEN-U ID</th>
                  <th className="py-3.5 px-4">ROLE</th>
                  <th className="py-3.5 px-4">ASAL SEKOLAH</th>
                  <th className="py-3.5 px-4">EMAIL PENDAFTAR</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-5 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      Tidak ada pengguna yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    return (
                      <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-bold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">
                            {u.email ? (
                              u.email
                            ) : (
                              <span className="text-amber-600 font-sans italic text-[11px]">
                                Belum dibuatkan
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              u.role === 'guru'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : u.role === 'siswa'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}
                          >
                            {u.role === 'guru' ? 'Guru/Mentor' : u.role === 'siswa' ? 'Siswa' : 'Admin'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700 text-sm">
                          {u.school || '-'}
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-xs">
                          {u.personal_email || u.email}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : u.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}
                          >
                            {u.status === 'active'
                              ? 'Aktif'
                              : u.status === 'pending'
                              ? 'Menunggu'
                              : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
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

          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Menampilkan {filteredUsers.length} dari {users.length} pengguna
            </span>
            <div className="flex items-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center">
                1
              </span>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingUser ? 'Edit Akun Pengguna' : 'Buat Akun Pengguna Baru'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  ID Gen-U dibuat otomatis dan dapat dikirim ke Email/WA.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 md:p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  NAMA LENGKAP
                </label>
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    NOMOR INDUK / ID REGISTRASI
                  </label>
                  {!editingUser && (
                    <button
                      type="button"
                      onClick={() => setData('registration_id', generateRandom12Digits())}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Acak ID
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  maxLength={12}
                  value={data.registration_id}
                  onChange={(e) => setData('registration_id', e.target.value)}
                  placeholder="12 digit angka unik"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                {errors.registration_id && (
                  <p className="text-xs text-rose-600 mt-1">{errors.registration_id}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  EMAIL GOOGLE WORKSPACE (MANUAL)
                </label>
                <input
                  type="email"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="contoh@gen.univeral.ac.id"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                {errors.email && (
                  <p className="text-xs text-rose-600 mt-1">{errors.email}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Ketikkan alamat email Google Workspace resmi untuk pengguna ini.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    EMAIL PENDAFTAR
                  </label>
                  <input
                    type="email"
                    required
                    value={data.personal_email}
                    onChange={(e) => setData('personal_email', e.target.value)}
                    placeholder="email@pribadi.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {errors.personal_email && (
                    <p className="text-xs text-rose-600 mt-1">{errors.personal_email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    NO. WHATSAPP
                  </label>
                  <input
                    type="text"
                    required
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    ROLE PENGGUNA
                  </label>
                  <select
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru/Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    STATUS
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    <option value="active">Aktif</option>
                    <option value="pending">Menunggu</option>
                    <option value="banned">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    ASAL SEKOLAH
                  </label>
                  <input
                    type="text"
                    value={data.school}
                    onChange={(e) => setData('school', e.target.value)}
                    placeholder="Contoh: SMAN 1 Jakarta"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    NPSN SEKOLAH
                  </label>
                  <input
                    type="text"
                    value={data.npsn}
                    onChange={(e) => setData('npsn', e.target.value)}
                    placeholder="Contoh: 20101111"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {errors.npsn && <p className="text-xs text-rose-600 mt-1">{errors.npsn}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  PASSWORD AKUN (MANUAL)
                </label>
                <input
                  type="text"
                  required={!editingUser || !editingUser.email}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder={editingUser && editingUser.email ? 'Kosongkan jika tidak ingin mengubah password' : 'Input password manual (min. 6 karakter)'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition font-mono"
                />
                {errors.password && (
                  <p className="text-xs text-rose-600 mt-1">{errors.password}</p>
                )}
                <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="send_email"
                    checked={data.send_email}
                    onChange={(e) => setData('send_email', e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="send_email" className="text-xs text-gray-700 font-medium cursor-pointer select-none">
                    Kirimkan informasi akun & kredensial ke email pendaftar: <strong>{data.personal_email || '(email pribadi)'}</strong> saat disimpan.
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-300/30 transition disabled:opacity-50"
                >
                  <Check size={18} /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  )
}
