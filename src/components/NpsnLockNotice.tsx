import React from 'react'
import { Link } from '@inertiajs/react'
import { Lock, User } from 'lucide-react'

interface NpsnLockNoticeProps {
  profileHref: string
}

export default function NpsnLockNotice({ profileHref }: NpsnLockNoticeProps) {
  return (
    <div className="flex items-center justify-center min-h-[65vh] py-8">
      <div className="bg-white rounded-3xl border border-amber-200/70 shadow-sm p-8 sm:p-12 max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center mx-auto mb-6">
          <Lock size={28} className="text-[#92400E]" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Lengkapi NPSN terlebih dahulu
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
          NPSN wajib diisi pada profil sebelum Anda dapat menggunakan fitur Portal Siswa. NPSN memastikan siswa dan Guru BK hanya terhubung dengan sekolah yang sama.
        </p>

        <Link
          href={profileHref}
          className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition-colors text-sm shadow-sm"
        >
          <User size={16} />
          <span>Lengkapi Profil</span>
        </Link>
      </div>
    </div>
  )
}
