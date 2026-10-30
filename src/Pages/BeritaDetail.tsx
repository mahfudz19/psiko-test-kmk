import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Megaphone,
  BookOpen,
  Share2,
  Check,
  ExternalLink,
  GraduationCap,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Eye,
} from 'lucide-react'
import PerseComponent from '../components/ui/PerseComponent'

export interface PostCategoryItem {
  id: number
  name: string
  slug: string
  badge_color?: string
}

export interface PostItem {
  id: number
  category_id?: number | null
  category?: PostCategoryItem | null
  type: 'berita' | 'webinar' | 'pengumuman'
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  image?: string | null
  image_url?: string | null
  author?: string | null
  read_time?: string | null
  event_date?: string | null
  event_time?: string | null
  event_link?: string | null
  badge_label?: string | null
  status?: string
  formatted_date?: string
  created_at?: string
}

interface BeritaDetailPageProps {
  post?: PostItem | null
  relatedPosts?: PostItem[]
}

export default function BeritaDetail({
  post,
  relatedPosts = [],
}: BeritaDetailPageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] text-slate-800 antialiased font-sans selection:bg-[#284f7a] selection:text-white flex flex-col justify-between">
        <Head title="Konten Tidak Ditemukan - Gen-U" />

        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
          <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#284f7a] flex items-center justify-center text-white font-extrabold shadow-sm group-hover:bg-[#1f3f63] transition-colors">
                <GraduationCap size={22} />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#19355a] block leading-none">
                  Gen-U
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 block mt-0.5">
                  Pusat Informasi
                </span>
              </div>
            </Link>

            <Link
              href="/berita"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Semua Konten</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-20 px-6">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Konten Tidak Ditemukan
            </h1>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Artikel, webinar, atau pengumuman yang Anda cari belum dipublikasikan atau sedang dalam penyesuaian oleh penyunting.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#284f7a] hover:bg-[#1f3f63] text-white font-bold text-xs sm:text-sm shadow-sm transition"
              >
                <span>Lihat Konten Lainnya</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs sm:text-sm transition"
              >
                <span>Ke Beranda</span>
              </Link>
            </div>
          </div>
        </main>

        <footer className="bg-[#122b49] text-white py-8 border-t border-slate-700/50">
          <div className="max-w-6xl mx-auto px-6 text-center text-xs text-slate-400">
            <p>&copy; 2026 Gen-U. Hak Cipta Dilindungi Undang-Undang.</p>
          </div>
        </footer>
      </div>
    )
  }

  const isWebinar = post.type === 'webinar'
  const isAnnouncement = post.type === 'pengumuman'
  const isBerita = post.type === 'berita' || (!isWebinar && !isAnnouncement)
  const displayImage = post.image_url || post.image

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-800 antialiased font-sans selection:bg-[#284f7a] selection:text-white flex flex-col justify-between">
      <Head title={`${post.title || "Detail Berita"} - Gen-U`}>
        <meta name="description" content={post.excerpt || post.title || "Detail informasi Gen-U"} />
      </Head>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#284f7a] flex items-center justify-center text-white font-extrabold shadow-sm group-hover:bg-[#1f3f63] transition-colors">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#19355a] block leading-none">
                Gen-U
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 block mt-0.5">
                Pusat Informasi
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/berita"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Semua Konten</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-8 pb-4">
          <nav className="flex items-center gap-2 text-xs text-slate-400 overflow-x-auto whitespace-nowrap py-1">
            <Link href="/" className="hover:text-slate-700 transition">
              Beranda
            </Link>
            <ChevronRight size={12} />
            <Link href="/berita" className="hover:text-slate-700 transition">
              {isWebinar ? 'Webinar & Event' : isAnnouncement ? 'Pengumuman' : 'Berita & Artikel'}
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-semibold truncate max-w-xs">{post.title}</span>
          </nav>
        </div>

        {isWebinar && (
          <section className="max-w-6xl mx-auto px-6 md:px-12 mt-4">
            <div className="bg-gradient-to-br from-[#19355a] via-[#1f3f63] to-[#284f7a] text-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-12">
              <div
                className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-rose-500/20 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative z-10 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    {post.badge_label || 'LIVE WEBINAR'}
                  </span>
                  {post.event_date && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-blue-100/90 font-medium bg-white/10 px-3 py-1 rounded-full">
                      <Calendar size={13} />
                      {post.event_date}
                    </span>
                  )}
                  {post.event_time && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-blue-100/90 font-medium bg-white/10 px-3 py-1 rounded-full">
                      <Clock size={13} />
                      {post.event_time}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="mt-5 text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {post.event_link ? (
                    <a
                      href={post.event_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm shadow-lg shadow-amber-950/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <Ticket size={18} />
                      <span>Daftar Event Gratis Sekarang</span>
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm shadow-lg shadow-amber-950/20 transition-all cursor-pointer"
                    >
                      <Ticket size={18} />
                      <span>Daftar Event Gratis Sekarang</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/15 transition cursor-pointer"
                  >
                    {copied ? <Check size={16} className="text-emerald-300" /> : <Share2 size={16} />}
                    <span>{copied ? 'Tautan Disalin!' : 'Bagikan Event'}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {isAnnouncement && (
          <section className="max-w-6xl mx-auto px-6 md:px-12 mt-4">
            <div className="bg-white rounded-3xl border border-emerald-200/80 p-8 sm:p-12 shadow-sm relative overflow-hidden mb-12">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {post.badge_label || 'PENGUMUMAN RESMI'}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Diterbitkan pada {post.formatted_date || post.created_at || 'Terbaru'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                  <span>{copied ? 'Disalin' : 'Bagikan'}</span>
                </button>
              </div>

              <div className="mt-6 max-w-3xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#19355a] tracking-tight leading-snug">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                    {post.excerpt}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {isBerita && (
          <section className="max-w-6xl mx-auto px-6 md:px-12 mt-4 mb-10">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
                {post.category && (
                  <span className={`px-3 py-1 rounded-full font-bold ${post.category.badge_color || 'bg-blue-100 text-blue-700'}`}>
                    {post.category.name}
                  </span>
                )}
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar size={13} />
                  {post.formatted_date || post.created_at || 'Terbaru'}
                </span>
                {post.read_time && (
                  <span className="text-slate-500 font-semibold flex items-center gap-1">
                    <Clock size={13} />
                    {post.read_time}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#19355a] tracking-tight leading-tight mb-5">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-6">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between py-4 border-y border-slate-100 text-xs text-slate-500 mb-8">
                <span className="text-slate-400 font-medium">
                  Dipublikasikan pada {post.formatted_date || post.created_at || 'Terbaru'}
                </span>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                  <span>{copied ? 'Tautan Disalin!' : 'Bagikan'}</span>
                </button>
              </div>

              {displayImage && (
                <div className="rounded-3xl overflow-hidden shadow-md mb-8 border border-slate-100">
                  <img
                    src={displayImage}
                    alt={post.title}
                    className="w-full h-auto aspect-video object-cover"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl border border-slate-100 p-7 sm:p-10 shadow-sm">
                {isWebinar && (
                  <h3 className="text-lg font-bold text-slate-900 pb-4 mb-6 border-b border-slate-100 flex items-center gap-2">
                    <Sparkles size={18} className="text-blue-600" />
                    <span>Deskripsi &amp; Agenda Kegiatan</span>
                  </h3>
                )}

                {post.content ? (
                  <PerseComponent
                    data={post.content}
                    unresetTailwind
                    for_tiptap
                    className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4"
                  />
                ) : (
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {post.excerpt || 'Detail informasi lengkap belum ditambahkan oleh penyunting.'}
                  </p>
                )}

                {isWebinar && post.event_link && (
                  <div className="mt-10 p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        Tertarik Mengikuti Sesi Ini?
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Registrasi tidak dipungut biaya dan terbuka untuk seluruh siswa Indonesia.
                      </p>
                    </div>
                    <a
                      href={post.event_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#284f7a] hover:bg-[#1d3d61] text-white font-bold text-xs sm:text-sm shadow-sm transition shrink-0"
                    >
                      <Ticket size={16} />
                      <span>Daftar Sekarang</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}

                {isAnnouncement && post.event_link && (
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                    <span className="text-xs text-slate-500">Tautan tindak lanjut pengumuman:</span>
                    <a
                      href={post.event_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      <span>Buka Tautan Resmi</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              {isWebinar && (
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Rincian Pelaksanaan
                  </h4>
                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 text-xs block">Hari &amp; Tanggal</span>
                        <strong className="text-slate-800 font-semibold">{post.event_date || 'Akan diumumkan'}</strong>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 text-xs block">Waktu Pelaksanaan</span>
                        <strong className="text-slate-800 font-semibold">{post.event_time || 'Sesuai Jadwal'}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h4 className="font-bold text-sm text-slate-900">
                    Konten Terkait Lainnya
                  </h4>
                  <Link href="/berita" className="text-xs text-blue-600 font-bold hover:underline">
                    Semua
                  </Link>
                </div>

                {!relatedPosts || relatedPosts.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Belum ada konten terkait lainnya.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {relatedPosts.map((rp) => (
                      <Link
                        key={rp.id}
                        href={`/berita/${rp.slug || rp.id}`}
                        className="block p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                              rp.type === 'webinar'
                                ? 'bg-rose-100 text-rose-700'
                                : rp.type === 'pengumuman'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {rp.type}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {rp.formatted_date || rp.created_at || ''}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-600 line-clamp-2 leading-snug">
                          {rp.title}
                        </h5>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#122b49] text-white pt-16 pb-12 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-extrabold shadow-sm">
                <GraduationCap size={22} />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">Gen-U</span>
            </div>
            <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-300">
              <Link href="/" className="hover:text-white transition">
                Beranda
              </Link>
              <Link href="/beasiswa" className="hover:text-white transition">
                Beasiswa
              </Link>
              <Link href="/berita" className="hover:text-white transition font-bold text-white">
                Berita &amp; Artikel
              </Link>
            </div>
          </div>
          <div className="pt-6 text-center text-xs text-slate-400">
            <p>&copy; 2026 Gen-U. Hak Cipta Dilindungi Undang-Undang.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
