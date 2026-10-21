import React, { useState } from 'react'
import { Link } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'
import {
  Users,
  UserCheck,
  School,
  GraduationCap,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'

interface GrowthPoint {
  step: number
  date?: string
  users: number
}

interface RecentUser {
  id: number
  name: string
  email: string
  role: string
  school: string
  status: string
  created_at: string
}

interface RecentAssessment {
  id: number
  student_name: string
  test_name: string
  dominant_code: string
  completed_at: string
}

interface PlatformSummary {
  totalCompletedAssessments: number
  totalMajors: number
  totalActiveTests: number
  totalMentoring: number
  activeMentoring: number
}

interface AdminDashboardProps {
  stats?: {
    totalUsers?: number
    newRegistrations?: number
    totalSchools?: number
    completedAssessments?: number
    totalStudents?: number
    totalTeachers?: number
  }
  platformSummary?: PlatformSummary
  growth?: GrowthPoint[]
  recentUsers?: RecentUser[]
  recentAssessments?: RecentAssessment[]
}

export default function AdminDashboard({
  stats,
  platformSummary = {
    totalCompletedAssessments: 0,
    totalMajors: 0,
    totalActiveTests: 0,
    totalMentoring: 0,
    activeMentoring: 0,
  },
  growth = [],
  recentUsers = [],
  recentAssessments = [],
}: AdminDashboardProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    step: number
    date?: string
    users: number
    x: number
    y: number
  } | null>(null)
  const [activeTab, setActiveTab] = useState<'users' | 'assessments'>('users')

  const displayTotalUsers = (stats?.totalUsers ?? 0).toLocaleString('id-ID')
  const displayNewRegistrations = `+${stats?.newRegistrations ?? 0}`
  const displayTotalSchools = (stats?.totalSchools ?? 0).toLocaleString('id-ID')
  const displayCompletedAssessments = (stats?.completedAssessments ?? 0).toLocaleString('id-ID')

  const points = growth.length > 0
    ? growth
    : [
      { step: 1, date: '1', users: 0 },
      { step: 2, date: '2', users: 0 },
      { step: 3, date: '3', users: 0 },
      { step: 4, date: '4', users: 0 },
      { step: 5, date: '5', users: 0 },
      { step: 6, date: '6', users: 0 },
      { step: 7, date: '7', users: 0 },
      { step: 8, date: '8', users: 0 },
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Control Panel</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Pusat kendali, analitik instrumen psikometri, dan aktivitas ekosistem Gen-U
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={14} className="text-emerald-600" />
              Sistem Aktif & Terhubung
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Pengguna</p>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-gray-900 leading-none">{displayTotalUsers}</h3>
              <p className="text-[11px] text-gray-400 mt-2 font-medium">
                {stats?.totalStudents || 0} Siswa &middot; {stats?.totalTeachers || 0} Guru
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Registrasi Baru</p>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UserCheck size={16} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-indigo-600 leading-none">{displayNewRegistrations}</h3>
              <p className="text-[11px] text-gray-400 mt-2 font-medium">Menunggu aktivasi / verifikasi</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Sekolah</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <School size={16} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-gray-900 leading-none">{displayTotalSchools}</h3>
              <p className="text-[11px] text-gray-400 mt-2 font-medium">Sekolah mitra terdaftar</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Tes Selesai</p>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText size={16} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-purple-600 leading-none">{displayCompletedAssessments}</h3>
              <p className="text-[11px] text-gray-400 mt-2 font-medium">Asesmen minat &amp; bakat RIASEC</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full min-h-[340px]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Pertumbuhan Pengguna</h2>
                <p className="text-xs text-gray-400 mt-0.5">Akumulasi pertumbuhan akun dalam 8 hari terakhir</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg">
                8 Hari Terakhir
              </span>
            </div>

            <div className="relative py-4 flex-1 flex flex-col justify-center">
              <div className="relative w-full h-44">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 700 160"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.20" />
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
                    className="absolute -top-8 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2.5 rounded-lg pointer-events-none shadow-md z-10 whitespace-nowrap"
                    style={{ left: `${(hoveredPoint.x / 700) * 100}%` }}
                  >
                    {hoveredPoint.date ? `${hoveredPoint.date}: ` : ''}{hoveredPoint.users} pengguna
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium px-2 pt-4 border-t border-gray-100 mt-2">
                {coords.map((pt) => (
                  <span key={pt.step} className="text-center">{pt.date || pt.step}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full min-h-[340px]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-base font-bold text-gray-900">Ringkasan Aktivitas Platform</h2>
                <p className="text-xs text-gray-400 mt-0.5">Metrik operasional dan utilisasi fitur siswa</p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Data
              </span>
            </div>

            <div className="divide-y divide-gray-100 flex-1 flex flex-col justify-around py-1">
              <div className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium block">Asesmen RIASEC Selesai</span>
                    <span className="text-[11px] text-gray-400">Total tes berhasil dirampungkan</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 text-base">{platformSummary.totalCompletedAssessments}</span>
                  <span className="text-xs text-gray-400 block">peserta</span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium block">Program Studi / Jurusan</span>
                    <span className="text-[11px] text-gray-400">Database panduan karir &amp; kuliah</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 text-base">{platformSummary.totalMajors}</span>
                  <Link
                    href="/admin/input-jurusan"
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 block font-medium"
                  >
                    Kelola Jurusan &gt;
                  </Link>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium block">Instrumen / Alat Tes Aktif</span>
                    <span className="text-[11px] text-gray-400">Bank soal &amp; tes yang tayang</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 text-base">{platformSummary.totalActiveTests}</span>
                  <Link
                    href="/admin/input-test"
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 block font-medium"
                  >
                    Kelola Tes &gt;
                  </Link>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium block">Sesi Mentoring Siswa</span>
                    <span className="text-[11px] text-gray-400">{platformSummary.activeMentoring} sesi aktif/menunggu</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 text-base">{platformSummary.totalMentoring}</span>
                  <span className="text-xs text-gray-400 block">total booking</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <Link
                href="/admin/monitoring-tes"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Buka Monitoring Tes Siswa <ArrowUpRight size={14} />
              </Link>
              <Link
                href="/admin/users"
                className="text-xs font-semibold text-gray-600 hover:text-gray-800"
              >
                Kelola Pengguna &gt;
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'users'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Pengguna Baru Terdaftar ({recentUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('assessments')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'assessments'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Tes Diselesaikan Terbaru ({recentAssessments.length})
              </button>
            </div>

            <Link
              href={activeTab === 'users' ? '/admin/users' : '/admin/monitoring-tes'}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              {activeTab === 'users' ? 'Lihat Semua Pengguna' : 'Lihat Monitoring Lengkap'}
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'users' ? (
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-6">Nama &amp; Email</th>
                    <th className="py-3 px-6">Peran</th>
                    <th className="py-3 px-6">Sekolah</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Terdaftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentUsers.length > 0 ? (
                    recentUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-3.5 px-6">
                          <div className="font-semibold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize ${u.role === 'admin'
                                ? 'bg-purple-50 text-purple-700'
                                : u.role === 'guru'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-xs text-gray-600">{u.school}</td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : u.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                          >
                            {u.status === 'active' ? 'Aktif' : u.status === 'pending' ? 'Pending' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right text-xs text-gray-400">{u.created_at}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-gray-400">
                        Belum ada data pendaftar baru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-6">Nama Siswa</th>
                    <th className="py-3 px-6">Instrumen Tes</th>
                    <th className="py-3 px-6">Kode Dominan</th>
                    <th className="py-3 px-6 text-right">Waktu Selesai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAssessments.length > 0 ? (
                    recentAssessments.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-3.5 px-6 font-semibold text-gray-900">{a.student_name}</td>
                        <td className="py-3.5 px-6 text-xs text-gray-600">{a.test_name}</td>
                        <td className="py-3.5 px-6">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {a.dominant_code}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right text-xs text-gray-400">{a.completed_at}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                        Belum ada asesmen yang diselesaikan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
