import React, { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { FileCheck, Check, Users, Save } from 'lucide-react'

export interface PsychometricTestItem {
  id: number
  name: string
  description: string
  gform_url: string
  spreadsheet_url?: string | null
  estimated_minutes: number
  order_num: number
  is_active: boolean
}

interface PsychometricTestFormProps {
  stats: {
    totalTests: number
    activeGform: number
    estimatedRespondents: string
  }
  testToEdit?: PsychometricTestItem | null
  onCancelEdit?: () => void
}

export default function PsychometricTestForm({
  stats,
  testToEdit,
  onCancelEdit,
}: PsychometricTestFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [gformUrl, setGformUrl] = useState('')
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (testToEdit) {
      setName(testToEdit.name)
      setDescription(testToEdit.description)
      setGformUrl(testToEdit.gform_url)
      setSpreadsheetUrl(testToEdit.spreadsheet_url || '')
    } else {
      setName('')
      setDescription('')
      setGformUrl('')
      setSpreadsheetUrl('')
    }
  }, [testToEdit])

  const handleReset = () => {
    setName('')
    setDescription('')
    setGformUrl('')
    setSpreadsheetUrl('')
    if (onCancelEdit) onCancelEdit()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      name,
      description,
      gform_url: gformUrl,
      spreadsheet_url: spreadsheetUrl,
    }

    if (testToEdit) {
      router.put(`/admin/input-test/${testToEdit.id}`, payload, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false)
          handleReset()
        },
        onError: () => setIsSubmitting(false),
      })
    } else {
      router.post('/admin/input-test', payload, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false)
          handleReset()
        },
        onError: () => setIsSubmitting(false),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileCheck size={24} />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
              TOTAL ALAT TES
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {stats.totalTests}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Check size={24} />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
              TAUTAN GFORM AKTIF
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {stats.activeGform}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
              ESTIMASI RESPONDEN
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {stats.estimatedRespondents}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {testToEdit ? 'Edit Form Data Alat Tes' : 'Input Form Data Alat Tes'}
              </h2>
              <p className="text-xs text-gray-500">
                Lengkapi parameter informasi instrumen tes minat bakat
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-400 self-start sm:self-auto">
            * Wajib diisi
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5">
              Nama Alat Tes <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Tes Holland (RIASEC)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              Gunakan nama resmi alat tes psikometri yang singkat dan mudah dikenal.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5">
              Deskripsi Singkat <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan tujuan dan fungsi tes secara singkat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Deskripsi ini ditampilkan kepada peserta sebelum memulai tes.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5">
              URL Google Form <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://forms.gle/..."
              value={gformUrl}
              onChange={(e) => setGformUrl(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              Tautan Google Form tempat peserta mengisi kuesioner tes psikometri.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5 flex items-center gap-2">
              <span>
                URL Google Spreadsheet Tanggapan <span className="text-red-500">*</span>
              </span>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Untuk Sinkronisasi Otomatis
              </span>
            </label>
            <input
              type="url"
              required
              placeholder="https://docs.google.com/spreadsheets/d/.../edit"
              value={spreadsheetUrl}
              onChange={(e) => setSpreadsheetUrl(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">
              Tautan Google Spreadsheet hasil respons Google Form. Pastikan akses sharing diatur ke &quot;Siapa saja yang memiliki link dapat melihat&quot;.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Reset Input
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#4355F9] hover:bg-[#3243E5] rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmitting
                ? 'Menyimpan...'
                : testToEdit
                ? 'Simpan Perubahan'
                : 'Simpan Data Alat Tes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
