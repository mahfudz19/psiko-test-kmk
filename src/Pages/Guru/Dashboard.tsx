import React from 'react'
import { Link } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { ChevronRight } from 'lucide-react'
import { guruMenuItems } from '../../config/navigation'

interface GuruDashboardProps {
  stats: {
    students: number
    tests: number
    pendingSessions: number
  }
}

const dummyActivities = [
  {
    text: 'Bagas Kusuma menyelesaikan Tes Minat Bakat',
    href: '/guru/monitoring',
  },
  {
    text: 'Diana Putri memulai simulasi PMB',
    href: '/guru/monitoring',
  },
  {
    text: 'Andi Pratama mengajukan sesi mentoring',
    href: '/guru/sesi-mentoring',
  },
]

export default function GuruDashboard({ stats }: GuruDashboardProps) {
  return (
    <PortalLayout role="guru" menuItems={guruMenuItems} activeId="dashboard">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru BK</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-blue-500">
            <p className="text-gray-500 text-sm font-medium">Siswa Terdaftar</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats?.students ?? 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-purple-500">
            <p className="text-gray-500 text-sm font-medium">Tes Selesai</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats?.tests ?? 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
            <p className="text-gray-500 text-sm font-medium">Sesi Menunggu</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats?.pendingSessions ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-7">
          <h2 className="text-base font-bold text-gray-900 mb-2">Aktivitas terkini</h2>
          <div className="divide-y divide-gray-100">
            {dummyActivities.map((act, idx) => (
              <Link
                key={idx}
                href={act.href}
                className="py-4 flex items-center justify-between group hover:bg-slate-50/70 transition-colors -mx-3 px-3 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-800">
                    {act.text}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-700 transition-colors shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
