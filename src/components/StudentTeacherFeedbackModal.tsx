import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { Star, CheckCircle2 } from 'lucide-react'
import { saveTestimonial, setUserReviewed } from '../services/testimonialService'

interface StudentTeacherFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
  userRole?: 'siswa' | 'guru' | string
  userId?: string | number | null
}

export default function StudentTeacherFeedbackModal({
  isOpen,
  onClose,
  userName = 'Pengguna Gen-U',
  userRole = 'siswa',
  userId,
}: StudentTeacherFeedbackModalProps) {
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || isSubmitting) return

    setIsSubmitting(true)
    const roleLabel = userRole === 'guru' ? 'Guru' : 'Siswa'
    const contentText = message.trim() || 'Aplikasi Gen-U sangat bermanfaat dan mudah digunakan.'

    saveTestimonial({
      name: userName,
      role: roleLabel,
      rating,
      content: contentText,
      userId: userId || undefined,
      isPublished: false,
    })
    setUserReviewed(userId)

    router.post(
      '/testimonials',
      {
        rating,
        content: contentText,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false)
          setIsSubmitted(true)
        },
        onError: () => {
          setIsSubmitting(false)
          setIsSubmitted(true)
        },
      }
    )
  }

  const handleFinish = () => {
    setIsSubmitted(false)
    setMessage('')
    setRating(5)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {!isSubmitted ? (
        <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Berikan Masukan</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Bagaimana pengalaman Anda menggunakan aplikasi Gen-U sejauh ini?
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating Anda <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                    >
                      <Star
                        size={32}
                        className={
                          active
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pesan / Masukan (Opsional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ceritakan pengalaman atau saran Anda..."
                rows={4}
                className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm transition"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-200 transition"
              >
                Kirim Masukan
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white w-full max-w-sm rounded-3xl p-7 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={34} strokeWidth={2.2} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Terima Kasih!</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Masukan Anda sangat berarti untuk pengembangan aplikasi kami.
          </p>
          <button
            type="button"
            onClick={handleFinish}
            className="w-full mt-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition"
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  )
}
