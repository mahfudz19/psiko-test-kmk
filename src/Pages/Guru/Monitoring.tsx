import React, { useState } from 'react'
import PortalLayout from '../../Layouts/PortalLayout'
import { guruMenuItems } from '../../config/navigation'
import StudentRiasecDetail, {
  StudentRiasecDetailData,
} from '../../components/Guru/StudentRiasecDetail'

interface GuruMonitoringProps {
  students: StudentRiasecDetailData[]
  guruNpsn?: string | null
  tests?: any[]
}

export default function GuruMonitoring({
  students = [],
  guruNpsn,
  tests = [],
}: GuruMonitoringProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentRiasecDetailData | null>(null)

  return (
    <PortalLayout role="guru" menuItems={guruMenuItems} activeId="monitoring">
      {selectedStudent ? (
        <StudentRiasecDetail
          student={selectedStudent}
          tests={tests}
          onBack={() => setSelectedStudent(null)}
          canEdit={false}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">
              Pemantauan Tes Minat Bakat
            </h1>
            {guruNpsn ? (
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 self-start sm:self-auto">
                Filter sekolah - NPSN {guruNpsn}
              </span>
            ) : (
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 self-start sm:self-auto">
                NPSN Belum Diisi
              </span>
            )}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50">
                  <th className="py-3 px-4 w-1/3">NAMA SISWA</th>
                  <th className="py-3 px-4 w-1/4">NPSN</th>
                  <th className="py-3 px-4 w-1/4">TES STATUS</th>
                  <th className="py-3 px-4 w-1/6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      {guruNpsn
                        ? 'Belum ada data siswa terdaftar dengan NPSN yang sama.'
                        : 'Silakan lengkapi NPSN Sekolah Anda terlebih dahulu untuk memantau siswa.'}
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const isCompleted = student.testStatus === 'Selesai'

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="py-4 px-4 font-bold text-gray-900">
                          {student.name}
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-xs">
                          {student.npsn}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {student.testStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {(student.importedCount ?? 0) > 0 || (student.completedCount ?? 0) > 0 || student.assessment ? (
                            <button
                              type="button"
                              onClick={() => setSelectedStudent(student)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                            >
                              Lihat Detail
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PortalLayout>
  )
}
