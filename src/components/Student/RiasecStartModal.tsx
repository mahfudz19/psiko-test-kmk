import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { X, ExternalLink, CheckCircle2, ClipboardList } from 'lucide-react'
import { PsychometricTestItem } from '../Admin/PsychometricTestForm'

interface RiasecStartModalProps {
  isOpen: boolean
  onClose: () => void
  test: PsychometricTestItem | null
  user: any
  mentors: { id: number; name: string; school: string }[]
}

export default function RiasecStartModal({
  isOpen,
  onClose,
  test,
  user,
  mentors = [],
}: RiasecStartModalProps) {
  const [className, setClassName] = useState('XI IPA 2')
  const [mentorName, setMentorName] = useState('Bpk. Budi Santoso, M.Psi')
  const [attendanceNumber, setAttendanceNumber] = useState('12')
  const [isStarted, setIsStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !test) return null

  const handleStartForm = () => {
    setIsSubmitting(true)
    const payload = {
      test_id: test.id,
      mentor_name: mentorName,
      class_name: className,
      attendance_number: attendanceNumber,
    }

    router.post('/student/riasec/start', payload, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false)
        setIsStarted(true)
        window.open(test.gform_url, '_blank')
      },
      onError: () => setIsSubmitting(false),
    })
  }

  const handleCompleteTest = () => {
    setIsSubmitting(true)
    const payload = {
      test_id: test.id,
      mentor_name: mentorName,
      class_name: className,
      attendance_number: attendanceNumber,
    }

    router.post('/student/riasec/complete', payload, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false)
        onClose()
      },
      onError: () => setIsSubmitting(false),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ClipboardList size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{test.name}</h3>
              <p className="text-xs text-gray-500">Persiapan Asesmen Google Form</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {!isStarted ? (
          <div className="mt-5 space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Nama Peserta:</span>
                <span className="font-bold text-gray-800">{user?.name || 'Andi Pratama'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">NPSN:</span>
                <span className="font-bold text-gray-800">{user?.npsn || '20101111'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Sekolah:</span>
                <span className="font-bold text-gray-800">{user?.school || 'SMAN 1 Jakarta'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kelas
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  No. Absen
                </label>
                <input
                  type="text"
                  value={attendanceNumber}
                  onChange={(e) => setAttendanceNumber(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Guru BK / Pembimbing
              </label>
              <select
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="Bpk. Budi Santoso, M.Psi">Bpk. Budi Santoso, M.Psi</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.school})
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100 text-xs text-blue-900 leading-relaxed">
              Klik tombol di bawah untuk membuka soal Google Form di tab baru. Pastikan kamu menyelesaikan seluruh pertanyaan yang disediakan.
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleStartForm}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#4355F9] hover:bg-[#3243E5] shadow-sm transition-all disabled:opacity-50"
              >
                Mulai Test
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-5 text-center">
            <div className="w-14 h-14 bg-green-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h4 className="text-base font-bold text-gray-900">
                Google Form Sedang Berlangsung
              </h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Tautan lembar tes telah dibuka di tab baru. Setelah selesai mengisi formulir sampai akhir, klik tombol di bawah untuk melihat hasil analisismu.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleCompleteTest}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#4355F9] hover:bg-[#3243E5] shadow-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Memproses...' : 'Saya Sudah Menyelesaikan Tes (Lihat Hasil)'}
              </button>
              <a
                href={test.gform_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Buka Ulang Google Form &rarr;
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
