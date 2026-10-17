import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import {
  Users,
  FileCheck2,
  CalendarClock,
  ChevronRight,
  AlertCircle,
  Calendar,
  Clock,
  BookOpen,
  ArrowUpRight,
  School,
  CheckCircle2,
  Compass,
} from 'lucide-react'
import { guruMenuItems } from '../../config/navigation'

interface ActivityItem {
  text: string
  time: string
  type: 'test' | 'mentoring' | 'student'
  href: string
}

interface UpcomingSessionItem {
  id: number
  student_name: string
  mentor_name: string
  time_string: string
  topic: string
  status: string
}

interface GuruDashboardProps {
  hasNpsn?: boolean
  stats?: {
    students: number
    tests: number
    pendingSessions: number
    schoolName?: string
    npsn?: string
  }
  activities?: ActivityItem[]
  upcomingSessions?: UpcomingSessionItem[]
}

export default function GuruDashboard({
  hasNpsn = true,
  stats = {
    students: 0,
    tests: 0,
    pendingSessions: 0,
    schoolName: '-',
    npsn: '-',
  },
  activities = [],
  upcomingSessions = [],
}: GuruDashboardProps) {
  const { auth } = usePage<any>().props
  const guruName = auth?.user?.name || 'Bapak/Ibu Guru'

  return (
    <PortalLayout role="guru" menuItems={guruMenuItems} activeId="dashboard">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Dashboard Guru &amp; Konselor
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Selamat datang kembali, {guruName}! Pantau perkembangan minat dan bimbingan siswa sekolah Anda.
            </p>
          </div>
          {stats?.schoolName && stats.schoolName !== '-' && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 shrink-0">
              <School size={15} className="text-blue-600" />
              <span>{stats.schoolName}</span>
              {stats.npsn && stats.npsn !== '-' && (
                <span className="text-[11px] text-blue-500 font-mono">({stats.npsn})</span>
              )}
            </div>
          )}
        </div>

        {!hasNpsn && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Data NPSN Sekolah Belum Dilengkapi</h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Lengkapi data NPSN di halaman profil agar akun Anda otomatis terhubung dengan siswa di sekolah Anda.
                </p>
              </div>
            </div>
            <Link
              href="/guru/profile"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shrink-0 inline-flex items-center gap-1.5"
            >
              Lengkapi Profil &gt;
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/guru/monitoring"
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-all group block"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Siswa Terdaftar</p>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={16} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-gray-900 leading-none">{stats?.students ?? 0}</h3>
              <p className="text-xs text-blue-600 font-medium mt-2 inline-flex items-center gap-1">
                Buka monitoring siswa <ArrowUpRight size={13} />
              </p>
            </div>
          </Link>

          <Link
            href="/guru/monitoring"
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-purple-500 hover:shadow-md transition-all group block"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Tes Selesai</p>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck2 size={16} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-gray-900 leading-none">{stats?.tests ?? 0}</h3>
              <p className="text-xs text-purple-600 font-medium mt-2 inline-flex items-center gap-1">
                Lihat hasil asesmen <ArrowUpRight size={13} />
              </p>
            </div>
          </Link>

          <Link
            href="/guru/sesi-mentoring"
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-500 hover:shadow-md transition-all group block"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Sesi Menunggu</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarClock size={16} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-bold text-emerald-600 leading-none">{stats?.pendingSessions ?? 0}</h3>
              <p className="text-xs text-emerald-600 font-medium mt-2 inline-flex items-center gap-1">
                Kelola sesi mentoring <ArrowUpRight size={13} />
              </p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Aktivitas Terkini Siswa</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Pembaruan real-time dari siswa sekolah Anda</p>
                </div>
                <Link
                  href="/guru/monitoring"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Lihat Semua &gt;
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {activities.length > 0 ? (
                  activities.map((act, idx) => (
                    <Link
                      key={idx}
                      href={act.href}
                      className="py-3.5 flex items-center justify-between group hover:bg-slate-50/70 transition-colors -mx-3 px-3 rounded-xl cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.type === 'test'
                              ? 'bg-purple-50 text-purple-600'
                              : act.type === 'mentoring'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-blue-50 text-blue-600'
                            }`}
                        >
                          {act.type === 'test' ? (
                            <Compass size={15} />
                          ) : act.type === 'mentoring' ? (
                            <Calendar size={15} />
                          ) : (
                            <Users size={15} />
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-800 block line-clamp-1">
                            {act.text}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">{act.time}</span>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-gray-700 transition-colors shrink-0 ml-2"
                      />
                    </Link>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <CheckCircle2 size={28} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">Belum ada aktivitas baru dari siswa.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100">
              <Link
                href="/guru/monitoring"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Monitoring Progres Tes Siswa <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Sesi Mentoring Mendatang</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Jadwal konsultasi bimbingan karier terdekat</p>
                </div>
                <Link
                  href="/guru/sesi-mentoring"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Kelola Sesi &gt;
                </Link>
              </div>

              <div className="space-y-3">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {session.student_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-gray-900">{session.student_name}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${session.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                                }`}
                            >
                              {session.status === 'approved' ? 'Disetujui' : 'Menunggu'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{session.topic}</p>
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 mt-1 font-mono">
                            <Clock size={12} /> {session.time_string}
                          </span>
                        </div>
                      </div>
                      <Link
                        href="/guru/sesi-mentoring"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 shrink-0 px-2.5 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition"
                      >
                        Detail &gt;
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Calendar size={28} className="mx-auto text-gray-300 mb-2" />
                    <h4 className="text-sm font-bold text-gray-700">Belum Ada Sesi Mendatang</h4>
                    <p className="text-xs text-gray-400 mt-0.5 max-w-xs mx-auto">
                      Jadwal konsultasi 1-on-1 yang diajukan oleh siswa akan muncul di sini.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">
                {stats?.pendingSessions ?? 0} sesi perlu tanggapan
              </span>
              <Link
                href="/guru/sesi-mentoring"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Buka Semua Jadwal <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 tracking-tight">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              href="/guru/monitoring"
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Monitoring Siswa</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pantau perkembangan hasil tes minat dan status tiap siswa.
                </p>
              </div>
            </Link>

            <Link
              href="/guru/sesi-mentoring"
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CalendarClock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Konfirmasi Mentoring</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Setujui atau jadwalkan ulang permohonan bimbingan siswa.
                </p>
              </div>
            </Link>

            <Link
              href="/guru/profile"
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <School size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Profil &amp; NPSN</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sesuaikan nama sekolah mitra dan data akun Anda.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
