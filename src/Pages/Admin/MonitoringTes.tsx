import React, { useState } from 'react'
import {
  Search,
  Check,
  Clock,
} from 'lucide-react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'
import StudentRiasecDetail, {
  StudentRiasecDetailData,
} from '../../components/Guru/StudentRiasecDetail'
import { PsychometricTestItem } from '../../components/Admin/PsychometricTestForm'

export interface StudentImportedTestInfo {
  id: number
  name: string
  is_imported: boolean
}

interface StudentItem extends StudentRiasecDetailData {
  email?: string | null
  personal_email?: string | null
  mentor_name?: string | null
  isCompleted?: boolean
  completedCount?: number
  totalTests?: number
  isAllImported?: boolean
  importedCount?: number
  imported_tests?: StudentImportedTestInfo[]
}

export interface MonitoringTestItem extends PsychometricTestItem {
  is_imported?: boolean
}

interface MonitoringTesProps {
  students: StudentItem[]
  tests?: MonitoringTestItem[]
  flash?: {
    success?: string
    error?: string
    warning?: string
  }
}

export default function MonitoringTes({
  students = [],
  tests = [],
  flash,
}: MonitoringTesProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentRiasecDetailData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.npsn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.personal_email && student.personal_email.toLowerCase().includes(searchTerm.toLowerCase()))

    const isDone = Boolean(student.isCompleted)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'selesai' && isDone) ||
      (statusFilter === 'belum' && !isDone)

    return matchesSearch && matchesStatus
  })

  const currentStudent = selectedStudent
    ? students.find((s) => s.id === selectedStudent.id) || selectedStudent
    : null

  return (
    <PortalLayout role="admin" menuItems={adminMenuItems} activeId="monitoring_tes">
      {currentStudent ? (
        <StudentRiasecDetail
          student={currentStudent}
          tests={tests}
          onBack={() => setSelectedStudent(null)}
          canEdit={true}
          updateUrl={`/admin/monitoring-tes/${currentStudent.id}`}
        />
      ) : (
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
                  Monitoring Tes Siswa
                </h1>
                <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-semibold">
                  Total {students.length} Siswa
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 max-w-xl">
                Pantau progres dan hasil tes minat bakat seluruh siswa yang terdaftar. Nilai siswa otomatis tersinkronisasi dari Google Spreadsheet saat siswa menyelesaikan alat tes.
              </p>
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-700">Status Alat Tes:</span>
                {tests && tests.length > 0 ? (
                  tests.map((t) => (
                    <span
                      key={t.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${t.is_imported
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-50 text-gray-400 border border-dashed border-gray-200'
                        }`}
                    >
                      {t.is_imported ? (
                        <Check size={13} className="text-emerald-600 shrink-0" />
                      ) : (
                        <Clock size={13} className="text-gray-400 shrink-0" />
                      )}
                      <span>{t.name}</span>
                      {t.is_imported ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold">
                          Tersinkron
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-200/80 text-gray-500 px-1.5 py-0.5 rounded-md font-medium">
                          Belum Ada Data
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">Belum ada alat tes terdaftar</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari nama siswa, NPSN, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
              >
                <option value="all">Semua Status Tes</option>
                <option value="selesai">Selesai</option>
                <option value="belum">Belum Selesai</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50">
                    <th className="py-3.5 px-5">NAMA SISWA</th>
                    <th className="py-3.5 px-4">NPSN</th>
                    <th className="py-3.5 px-4">STATUS TES</th>
                    <th className="py-3.5 px-4">GURU/MENTOR</th>
                    <th className="py-3.5 px-5 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        Tidak ada data siswa yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const missingTests = (student.imported_tests || [])
                        .filter((t) => !t.is_imported)
                        .map((t) => t.name)
                        .join(', ')

                      return (
                        <tr key={student.id} className="hover:bg-gray-50/60 transition">
                          <td className="py-4 px-5">
                            <div>
                              <div className="font-bold text-gray-900">{student.name}</div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                {student.email || student.personal_email || '-'}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-xs text-gray-600">
                            {student.npsn}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            {student.isCompleted ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Selesai
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                {student.completedCount && student.completedCount > 0
                                  ? `Belum Selesai (${student.completedCount}/${student.totalTests || 1} Tes)`
                                  : 'Belum Selesai'}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs text-gray-700 font-medium">
                            {student.mentor_name || 'Bpk. Budi Santoso, M.Psi'}
                          </td>
                          <td className="py-4 px-5 text-center whitespace-nowrap">
                            {(student.importedCount ?? 0) > 0 || student.assessment ? (
                              <button
                                type="button"
                                onClick={() => setSelectedStudent(student)}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold text-xs shadow-sm transition cursor-pointer"
                              >
                                <span>Lihat Detail</span>
                                {!student.isAllImported && (
                                  <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-semibold">
                                    {student.importedCount ?? 0}/{student.totalTests || 1}
                                  </span>
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-400 bg-gray-50 font-medium text-xs cursor-not-allowed opacity-80"
                              >
                                Belum Ada Data
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
              <span>
                Menampilkan {filteredStudents.length} dari {students.length} siswa
              </span>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  )
}
