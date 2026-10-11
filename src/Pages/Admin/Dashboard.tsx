import React, { useState } from 'react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'

interface GrowthPoint {
  step: number
  users: number
}

interface AdminDashboardProps {
  stats?: {
    totalUsers?: number
    newRegistrations?: number
    totalSchools?: number
    systemStatus?: string
  }
  growth?: GrowthPoint[]
}

export default function AdminDashboard({ stats, growth = [] }: AdminDashboardProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ step: number; users: number; x: number; y: number } | null>(null)

  const displayTotalUsers = (stats?.totalUsers ?? 0).toLocaleString('id-ID')
  const displayNewRegistrations = `+${stats?.newRegistrations ?? 0}`
  const displayTotalSchools = (stats?.totalSchools ?? 0).toLocaleString('id-ID')
  const displaySystemStatus = stats?.systemStatus || 'Sehat'

  const points = growth.length > 0
    ? growth
    : [
        { step: 1, users: 0 },
        { step: 2, users: 0 },
        { step: 3, users: 0 },
        { step: 4, users: 0 },
        { step: 5, users: 0 },
        { step: 6, users: 0 },
        { step: 7, users: 0 },
        { step: 8, users: 0 },
      ]

  const maxVal = Math.max(...points.map((p) => p.users), 1)
  const minVal = Math.min(...points.map((p) => p.users))
  const rangeVal = maxVal === minVal ? (maxVal || 1) : maxVal - minVal

  const coords = points.map((pt, idx) => {
    const x = 30 + idx * (640 / Math.max(points.length - 1, 1))
    const y = 135 - ((pt.users - minVal) / rangeVal) * 105
    return { ...pt, x, y }
  })

  let linePath = ''
  if (coords.length > 0) {
    linePath = `M ${coords[0].x},${coords[0].y}`
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i]
      const p1 = coords[i + 1]
      const mx = (p0.x + p1.x) / 2
      linePath += ` C ${mx},${p0.y} ${mx},${p1.y} ${p1.x},${p1.y}`
    }
  }

  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x},150 L ${coords[0].x},150 Z`
    : ''

  return (
    <PortalLayout role="admin" menuItems={adminMenuItems} activeId="dashboard">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Control Panel</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-medium">Total Pengguna</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">{displayTotalUsers}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-medium">Registrasi Baru</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-2">{displayNewRegistrations}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-medium">Total Sekolah</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">{displayTotalSchools}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-medium">Sistem Status</p>
            <h3 className="text-2xl font-bold text-emerald-500 mt-2">{displaySystemStatus}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full min-h-[320px]">
            <div>
              <h2 className="text-base font-bold text-gray-900">Pertumbuhan Pengguna</h2>
            </div>

            <div className="relative py-4 flex-1 flex flex-col justify-center">
              <div className="relative w-full h-40">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 700 160"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {areaPath && (
                    <path
                      d={areaPath}
                      fill="url(#growthGradient)"
                    />
                  )}

                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}

                  {coords.map((pt) => (
                    <g key={pt.step}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        className="fill-white stroke-indigo-600 stroke-[2.5] hover:r-6 cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  ))}
                </svg>

                {hoveredPoint && (
                  <div
                    className="absolute -top-7 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2.5 rounded-lg pointer-events-none shadow-md"
                    style={{ left: `${(hoveredPoint.x / 700) * 100}%` }}
                  >
                    {hoveredPoint.users} pengguna
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 font-medium px-3 pt-6 border-t border-gray-100 mt-2">
                {coords.map((pt) => (
                  <span key={pt.step}>{pt.step}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full min-h-[320px]">
            <h2 className="text-base font-bold text-gray-900 mb-2">Ringkasan Sistem</h2>
            <div className="divide-y divide-gray-100 flex-1 flex flex-col justify-around py-1">
              <div className="py-4 flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Server API</span>
                <span className="font-bold text-gray-900">Online</span>
              </div>
              <div className="py-4 flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Database</span>
                <span className="font-bold text-gray-900">Normal</span>
              </div>
              <div className="py-4 flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Penyimpanan</span>
                <span className="font-bold text-gray-900">68%</span>
              </div>
              <div className="py-4 flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Backup terakhir</span>
                <span className="font-bold text-gray-900">Hari ini, 03:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
