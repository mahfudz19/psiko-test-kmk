import React, { useState } from 'react'
import { Sparkles, BookOpen, SquarePen, Plus, X, RefreshCw, Save } from 'lucide-react'

interface MajorsSectionProps {
  majors: string[]
  canEdit?: boolean
  isSaving?: boolean
  onSave?: (updatedMajors: string[]) => void
  title?: string
  subtitle?: string
  isFormMode?: boolean
  onChange?: (updatedMajors: string[]) => void
}

export default function MajorsSection({
  majors = [],
  canEdit = true,
  isSaving = false,
  onSave,
  title = 'Rekomendasi Program Studi Berdasarkan Profil',
  subtitle = 'Bidang perkuliahan yang selaras dengan kecenderungan dinamika kerja dan kepribadian:',
  isFormMode = false,
  onChange,
}: MajorsSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [list, setList] = useState<string[]>(majors)
  const [newMajor, setNewMajor] = useState('')

  const currentList = isFormMode ? majors : isEditing ? list : majors

  const handleAddMajor = () => {
    const trimmed = newMajor.trim()
    if (!trimmed) return
    if (currentList.includes(trimmed)) {
      setNewMajor('')
      return
    }
    const updated = [...currentList, trimmed]
    if (isFormMode && onChange) {
      onChange(updated)
    } else {
      setList(updated)
    }
    setNewMajor('')
  }

  const handleRemoveMajor = (index: number) => {
    const updated = currentList.filter((_, idx) => idx !== index)
    if (isFormMode && onChange) {
      onChange(updated)
    } else {
      setList(updated)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddMajor()
    }
  }

  const handleCancel = () => {
    setList(majors)
    setNewMajor('')
    setIsEditing(false)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(list)
    }
    setIsEditing(false)
  }

  if (isFormMode) {
    return (
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              Rekomendasi Program Studi
            </h4>
            <span className="text-[11px] text-gray-500">
              Sesuaikan daftar jurusan yang disarankan untuk siswa ini.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentList.map((major, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold"
            >
              <BookOpen size={12} className="text-amber-600" />
              <span>{major}</span>
              <button
                type="button"
                onClick={() => handleRemoveMajor(idx)}
                className="hover:text-red-600 transition cursor-pointer ml-0.5"
                title="Hapus jurusan"
              >
                <X size={13} />
              </button>
            </span>
          ))}
          {currentList.length === 0 && (
            <span className="text-xs text-gray-400 italic">Belum ada jurusan yang ditambahkan.</span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newMajor}
            onChange={(e) => setNewMajor(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik nama jurusan baru lalu tekan Enter..."
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
          <button
            type="button"
            onClick={handleAddMajor}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            {title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>

        {canEdit && !isEditing && (
          <button
            type="button"
            onClick={() => {
              setList(majors)
              setIsEditing(true)
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <SquarePen size={13} />
            <span>Edit Rekomendasi Jurusan</span>
          </button>
        )}

        {isEditing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
              <span>Simpan Rekomendasi</span>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap gap-2">
            {list.map((major, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold"
              >
                <BookOpen size={12} className="text-amber-600" />
                <span>{major}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMajor(idx)}
                  className="hover:text-red-600 transition cursor-pointer ml-1"
                  title="Hapus jurusan"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
            {list.length === 0 && (
              <span className="text-xs text-gray-400 italic">Belum ada jurusan yang ditambahkan.</span>
            )}
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={newMajor}
              onChange={(e) => setNewMajor(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik nama jurusan baru..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddMajor}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Tambah</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {majors.map((major, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <BookOpen size={13} />
              </div>
              <span className="text-xs font-bold text-gray-800">{major}</span>
            </div>
          ))}
          {majors.length === 0 && (
            <div className="text-xs text-gray-400 italic col-span-3">Belum ada rekomendasi jurusan.</div>
          )}
        </div>
      )}
    </div>
  )
}

