import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { Check, X, AlertTriangle, LayoutGrid, List, Calendar, Clock } from 'lucide-react'
import { guruMenuItems } from '../../config/navigation'

interface BookingItem {
  id: number
  student?: { name: string; school: string; npsn?: string }
  topic: string
  booking_date: string
  booking_time: string
  status: string
}

interface GuruSesiMentoringProps {
  bookings: BookingItem[]
}

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

function formatBookingDate(dateStr: string): string {
  if (!dateStr) return '-'
  const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : (dateStr.includes(' ') ? dateStr.split(' ')[0] : dateStr)
  const parts = dateOnly.split('-')
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    const date = new Date(year, month, day)
    if (!isNaN(date.getTime())) {
      const monthName = MONTHS[date.getMonth()]
      return `${day} ${monthName} ${year}`
    }
  }
  return dateStr
}

function formatBookingTime(timeStr: string): string {
  if (!timeStr) return '-'
  const clean = timeStr.slice(0, 5)
  return `${clean} WIB`
}

export default function GuruSesiMentoring({ bookings = [] }: GuruSesiMentoringProps) {
  const { auth } = usePage<any>().props
  const guruNpsn = auth?.user?.npsn || '20101111'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [rejectingBooking, setRejectingBooking] = useState<BookingItem | null>(null)

  const handleUpdateStatus = (id: number, status: 'approved' | 'rejected') => {
    router.patch(
      `/guru/sesi-mentoring/${id}`,
      { status },
      { preserveScroll: true }
    )
  }

  return (
    <PortalLayout role="guru" menuItems={guruMenuItems} activeId="sesi">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Permintaan Jadwal</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tinjau permintaan dari siswa dengan NPSN {guruNpsn} .
            </p>
          </div>

          {bookings.length > 0 && (
            <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-950'
                }`}
              >
                <LayoutGrid size={15} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-950'
                }`}
              >
                <List size={15} /> List
              </button>
            </div>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-10 text-center shadow-sm max-w-md">
            <p className="text-sm text-gray-500">Belum ada pengajuan sesi mentoring.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => {
              const studentName = b.student?.name || 'Siswa'
              const studentInitial = (studentName[0] || 'S').toUpperCase()

              return (
                <div
                  key={b.id}
                  className="w-full max-w-[540px] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/70 border border-slate-100 bg-white"
                >
                  <div className="bg-[#463CE7] px-8 py-6 text-center text-white">
                    <h3 className="text-xl font-bold tracking-tight">Permintaan Jadwal</h3>
                    <p className="text-xs text-indigo-100 mt-1 font-medium">
                      Ada undangan pertemuan baru.
                    </p>
                  </div>

                  <div className="p-7 space-y-5">
                    <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg shrink-0 mt-0.5">
                        {studentInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-900 text-base leading-tight">
                          {studentName}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed break-words">
                          {b.topic || 'Konsultasi Proyek Baru'}
                        </p>
                        <span className="text-[10px] font-bold text-indigo-600 block mt-1 tracking-wide">
                          NPSN {b.student?.npsn || guruNpsn}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3.5 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Tanggal:</span>
                        <span className="font-bold text-gray-900">
                          {formatBookingDate(b.booking_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Waktu:</span>
                        <span className="font-bold text-gray-900">
                          {formatBookingTime(b.booking_time)}
                        </span>
                      </div>
                    </div>

                    {b.status === 'pending' ? (
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setRejectingBooking(b)}
                          className="flex-1 py-3 px-4 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-bold text-sm flex items-center justify-center gap-2 transition"
                        >
                          <X size={16} /> Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(b.id, 'approved')}
                          className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-300/40 transition"
                        >
                          <Check size={16} /> Terima
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2">
                        {b.status === 'approved' ? (
                          <div className="py-2.5 px-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2">
                            <Check size={16} /> Jadwal Disetujui
                          </div>
                        ) : (
                          <div className="py-2.5 px-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2">
                            <X size={16} /> Jadwal Ditolak
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const studentName = b.student?.name || 'Siswa'
              const studentInitial = (studentName[0] || 'S').toUpperCase()

              return (
                <div
                  key={b.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg shrink-0 mt-0.5">
                      {studentInitial}
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-base leading-tight">
                          {studentName}
                        </h4>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          NPSN {b.student?.npsn || guruNpsn}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed break-words">
                        {b.topic || 'Konsultasi Proyek Baru'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-gray-700 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Calendar size={13} className="text-gray-500" />
                          {formatBookingDate(b.booking_date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-gray-700 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Clock size={13} className="text-gray-500" />
                          {formatBookingTime(b.booking_time)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    {b.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setRejectingBooking(b)}
                          className="py-2.5 px-4 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
                        >
                          <X size={15} /> Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(b.id, 'approved')}
                          className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-indigo-300/40 transition"
                        >
                          <Check size={15} /> Terima
                        </button>
                      </>
                    ) : (
                      <div>
                        {b.status === 'approved' ? (
                          <div className="py-2 px-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs flex items-center gap-1.5">
                            <Check size={14} /> Disetujui
                          </div>
                        ) : (
                          <div className="py-2 px-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5">
                            <X size={14} /> Ditolak
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {rejectingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-7 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center tracking-tight">
                Tolak Permintaan Jadwal?
              </h3>
              <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
                Apakah Anda yakin ingin menolak permintaan mentoring dari{' '}
                <span className="font-semibold text-gray-800">
                  {rejectingBooking.student?.name || 'Siswa'}
                </span>{' '}
                pada{' '}
                <span className="font-semibold text-gray-800">
                  {formatBookingDate(rejectingBooking.booking_date)} pukul{' '}
                  {formatBookingTime(rejectingBooking.booking_time)}
                </span>
                ?
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setRejectingBooking(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(rejectingBooking.id, 'rejected')
                    setRejectingBooking(null)
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition flex items-center justify-center gap-1.5"
                >
                  <X size={16} /> Ya, Tolak
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
