import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import {
  Mail,
  ShieldCheck,
  School,
  Hash,
  Phone,
  User,
  KeyRound,
  Check,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'

interface NpsnFormCardProps {
  user: any
  role: 'siswa' | 'guru' | 'admin'
}

export default function NpsnFormCard({ user, role }: NpsnFormCardProps) {
  const { errors, flash } = usePage<any>().props

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')

  const [name, setName] = useState(user?.name || '')
  const [school, setSchool] = useState(user?.school && user.school !== '-' ? user.school : '')
  const [npsn, setNpsn] = useState(user?.npsn && user.npsn !== '-' ? user.npsn : '')
  const [phone, setPhone] = useState(user?.phone && user.phone !== '-' ? user.phone : '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [processing, setProcessing] = useState(false)

  const endpoint = role === 'siswa' ? '/student/profile' : '/guru/profile'
  const roleSubtitle =
    role === 'guru' ? 'Guru/Mentor' : `Siswa ${user?.school || 'Sekolah Mitra'}`

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    router.post(
      endpoint,
      {
        name: name.trim(),
        school: school.trim(),
        npsn: npsn.trim(),
        phone: phone.trim(),
      },
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false),
      }
    )
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    router.post(
      endpoint,
      {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setCurrentPassword('')
          setNewPassword('')
          setNewPasswordConfirmation('')
        },
        onFinish: () => setProcessing(false),
      }
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden max-w-3xl">
      <div className="h-32 sm:h-36 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 w-full relative">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
      </div>

      <div className="p-6 sm:p-8 -mt-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md shrink-0">
              <div className="w-full h-full rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {user?.name || '-'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={13} /> Terverifikasi
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">{roleSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User size={14} /> Profil & NPSN
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'password'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <KeyRound size={14} /> Ubah Password
            </button>
          </div>
        </div>

        {flash?.success && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
            <Check size={18} className="text-emerald-600 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}

        {errors && Object.keys(errors).length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <span>{Object.values(errors)[0] as string}</span>
          </div>
        )}

        <div className="mt-6">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug">
                      Akun Google Workspace Resmi
                    </h4>
                    <p className="text-xs text-indigo-800 font-mono font-semibold mt-0.5">
                      {user?.email || 'Belum diatur oleh Admin'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-indigo-100/80">
                  <div>
                    <span className="font-bold text-gray-500 block text-[11px] uppercase tracking-wider">
                      Nomor ID Registrasi (12 Digit):
                    </span>
                    <span className="font-mono font-bold text-gray-900 text-sm mt-0.5 block">
                      {user?.registration_id || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-500 block text-[11px] uppercase tracking-wider">
                      Email Pribadi Pendaftar:
                    </span>
                    <span className="text-gray-900 font-medium text-sm mt-0.5 block">
                      {user?.personal_email || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User size={14} className="text-indigo-600" /> NAMA LENGKAP
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {errors?.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-indigo-600" /> NO. WHATSAPP / HP
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {errors?.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <School size={14} className="text-indigo-600" /> ASAL SEKOLAH
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Contoh: SMAN 1 Jakarta"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {errors?.school && <p className="text-xs text-rose-600 mt-1">{errors.school}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Hash size={14} className="text-indigo-600" /> NPSN SEKOLAH (WAJIB)
                  </label>
                  <input
                    type="text"
                    required
                    value={npsn}
                    onChange={(e) => setNpsn(e.target.value)}
                    placeholder="Contoh: 20101111"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-sm font-bold text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {errors?.npsn && <p className="text-xs text-rose-600 mt-1">{errors.npsn}</p>}
                  <p className="text-[11px] text-gray-500 mt-1">
                    NPSN memastikan Anda terhubung dengan siswa/guru dari sekolah yang sama. Anda dapat memperbarui NPSN ini kapan saja.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3 rounded-xl text-sm transition shadow-md shadow-indigo-200 disabled:opacity-50"
                >
                  <Check size={18} /> {processing ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSavePassword} className="space-y-5">
              <div className="p-4.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 leading-relaxed flex items-start gap-3.5 shadow-sm">
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm text-amber-900 mb-1">
                    Perhatian: Password Hanya Berlaku untuk Login Manual
                  </span>
                  <p className="text-amber-900/90 leading-relaxed">
                    Password yang Anda ubah di sini <strong>hanya digunakan untuk Login Manual</strong> pada platform Gen-U (menggunakan email resmi dan password).
                  </p>
                  <p className="text-amber-900/90 leading-relaxed mt-1.5">
                    Pengubahan ini <strong>bukan untuk login Google ("Lanjutkan dengan Google")</strong>. Untuk masuk via Google, Anda tetap menggunakan password akun Google Workspace resmi Anda yang terdaftar di Google.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  PASSWORD SAAT INI
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password saat ini"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors?.current_password && (
                  <p className="text-xs text-rose-600 mt-1">{errors.current_password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  PASSWORD BARU (MINIMAL 6 KARAKTER)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors?.new_password && (
                  <p className="text-xs text-rose-600 mt-1">{errors.new_password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  KONFIRMASI PASSWORD BARU
                </label>
                <input
                  type="password"
                  required
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition font-mono"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={processing || !newPassword || !currentPassword}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3 rounded-xl text-sm transition shadow-md shadow-indigo-200 disabled:opacity-50"
                >
                  <KeyRound size={18} /> {processing ? 'Menyimpan...' : 'Perbarui Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
