import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import {
  Calendar,
  PlusCircle,
  X,
  Briefcase,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { studentMenuItems } from '../../config/navigation'

interface MentorItem {
  id: number
  name: string
  school: string
  expertise: string
}

interface BookingItem {
  id: number
  mentor?: MentorItem
  booking_date: string
  booking_time: string
  topic: string
  status: string
}

interface StudentBookingProps {
  mentors: MentorItem[]
  myBookings: BookingItem[]
  studentNpsn?: string | null
}

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
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
      const dayName = DAYS[date.getDay()]
      const monthName = MONTHS[date.getMonth()]
      return `${dayName}, ${day} ${monthName} ${year}`
    }
  }
  return dateStr
}

function formatBookingTime(timeStr: string): string {
  if (!timeStr) return ''
  return timeStr.slice(0, 5)
}

export default function StudentBooking({
  mentors = [],
  myBookings = [],
  studentNpsn,
}: StudentBookingProps) {
  const [bookingFormOpen, setBookingFormOpen] = useState(false)

  const { data, setData, post, processing, reset, errors } = useForm({
    mentor_id: '',
    booking_date: '',
    booking_time: '',
    topic: '',
  })

  const openFormForMentor = (mentorId: number) => {
    setData('mentor_id', String(mentorId))
    setBookingFormOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/student/booking', {
      preserveScroll: true,
      onSuccess: () => {
        reset()
        setBookingFormOpen(false)
      },
    })
  }

  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="booking">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Booking Sesi Mentoring</h2>
              {studentNpsn ? (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  NPSN {studentNpsn}
                </span>
              ) : (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  NPSN Belum Diisi
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Atur jadwal konsultasi bersama guru atau mentor dari sekolahmu.
            </p>
          </div>
          <button
            type="button"
            disabled={mentors.length === 0}
            onClick={() => {
              setData('mentor_id', mentors[0]?.id ? String(mentors[0].id) : '')
              setBookingFormOpen(true)
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle size={18} /> Booking Baru
          </button>
        </div>

        {errors.mentor_id && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{errors.mentor_id}</span>
          </div>
        )}

        {bookingFormOpen && (
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Buat Booking Baru</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Lengkapi seluruh informasi untuk mengajukan sesi konsultasi bersama guru sekolahmu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBookingFormOpen(false)}
                aria-label="Tutup formulir booking"
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="md:col-span-2">
                <label htmlFor="booking-mentor" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Pilih Guru / Mentor (Sekolah NPSN {studentNpsn || '-'})
                </label>
                <select
                  id="booking-mentor"
                  required
                  value={data.mentor_id}
                  onChange={(e) => setData('mentor_id', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Pilih guru atau mentor</option>
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.expertise}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="booking-date" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Tanggal
                </label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={data.booking_date}
                  onChange={(e) => setData('booking_date', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div>
                <label htmlFor="booking-time" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Waktu
                </label>
                <input
                  id="booking-time"
                  type="time"
                  required
                  value={data.booking_time}
                  onChange={(e) => setData('booking_time', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="booking-topic" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Topik Konsultasi
                </label>
                <textarea
                  id="booking-topic"
                  rows={4}
                  required
                  placeholder="Contoh: Konsultasi hasil minat bakat dan perencanaan jurusan kuliah"
                  value={data.topic}
                  onChange={(e) => setData('topic', e.target.value)}
                  className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-800 outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end md:col-span-2">
                <button
                  type="button"
                  onClick={() => setBookingFormOpen(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                  {processing ? 'Mengajukan...' : 'Ajukan Booking'}
                </button>
              </div>
            </form>
          </div>
        )}

        {myBookings.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pengajuan Mentoring Saya</h3>
            <div className="space-y-3">
              {myBookings.map((b) => (
                <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl gap-4">
                  <div>
                    <h4 className="font-bold text-gray-800">{b.mentor?.name || 'Mentor'}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{b.topic}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                      <Clock size={14} /> {formatBookingDate(b.booking_date)} pukul {formatBookingTime(b.booking_time)} WIB
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        b.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {b.status === 'approved'
                        ? 'Disetujui'
                        : b.status === 'rejected'
                        ? 'Ditolak'
                        : 'Menunggu Persetujuan'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mentors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Briefcase size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Belum Ada Guru Terdaftar</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              {studentNpsn
                ? `Belum ada guru pembimbing yang terdaftar dengan NPSN yang sama (${studentNpsn}).`
                : 'Silakan lengkapi NPSN Sekolah Anda terlebih dahulu untuk melihat dan mem-booking guru pembimbing.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mentors.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{m.name}</h3>
                    <p className="text-xs text-gray-500">{m.school}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    {m.expertise}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openFormForMentor(m.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={18} /> Booking Sesi
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
