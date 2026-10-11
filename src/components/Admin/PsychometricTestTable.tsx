import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { Search, ExternalLink, SquarePen, X } from 'lucide-react'
import { PsychometricTestItem } from './PsychometricTestForm'

interface PsychometricTestTableProps {
  tests: PsychometricTestItem[]
  onEditTest: (test: PsychometricTestItem) => void
}

export default function PsychometricTestTable({
  tests,
  onEditTest,
}: PsychometricTestTableProps) {
  const [search, setSearch] = useState('')

  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus alat tes ini?')) {
      router.delete(`/admin/input-test/${id}`, { preserveScroll: true })
    }
  }

  const filteredTests = tests.filter((t) => {
    const q = search.toLowerCase()
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Daftar Alat Tes Terdaftar
          </h3>
          <p className="text-xs text-gray-500">
            Kelola data alat tes yang aktif digunakan pada platform
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari nama atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50">
              <th className="py-3 px-4 w-12 text-center">NO</th>
              <th className="py-3 px-4 w-56">NAMA ALAT TES</th>
              <th className="py-3 px-4 min-w-[300px]">DESKRIPSI</th>
              <th className="py-3 px-4 w-44">URL GOOGLE FORM</th>
              <th className="py-3 px-4 w-28 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTests.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  Tidak ada alat tes ditemukan.
                </td>
              </tr>
            ) : (
              filteredTests.map((test, idx) => (
                <tr
                  key={test.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-4 px-4 text-center text-gray-500 font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {test.name}
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-xs leading-relaxed">
                    {test.description}
                  </td>
                  <td className="py-4 px-4">
                    <a
                      href={test.gform_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Buka Google Form
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditTest(test)}
                        title="Edit Alat Tes"
                        className="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <SquarePen size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(test.id)}
                        title="Hapus Alat Tes"
                        className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
        Menampilkan <span className="font-bold text-gray-700">{filteredTests.length}</span> alat tes psikometri
      </div>
    </div>
  )
}
