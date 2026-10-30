import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import {
  Search,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Ticket,
  Megaphone,
  BookOpen,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Award,
} from 'lucide-react'
import { PostItem, PostCategoryItem } from './Admin/BeritaArtikel'

interface BeritaPageProps {
  posts?: PostItem[]
  categories?: PostCategoryItem[]
  filters?: {
    q?: string
    type?: string
    kategori?: string
  }
}

export default function BeritaPage({
  posts = [],
  categories = [],
  filters = {},
}: BeritaPageProps) {
  const [search, setSearch] = useState(filters.q || '')
  const [selectedType, setSelectedType] = useState(filters.type || 'semua')
  const [selectedKategori, setSelectedKategori] = useState(filters.kategori || 'Semua')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(
      '/berita',
      {
        q: search,
        type: selectedType,
        kategori: selectedKategori,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    )
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    const nextKategori = type === 'berita' ? selectedKategori : 'Semua'
    if (type !== 'berita') {
      setSelectedKategori('Semua')
    }
    router.get(
      '/berita',
      {
        q: search,
        type,
        kategori: nextKategori,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    )
  }

  const handleKategoriChange = (kategori: string) => {
    setSelectedKategori(kategori)
    router.get(
      '/berita',
      {
        q: search,
        type: selectedType,
        kategori,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    )
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-800 antialiased font-sans selection:bg-[#284f7a] selection:text-white flex flex-col justify-between">
      <Head>
        <title>Berita, Webinar &amp; Pengumuman - Gen-U</title>
        <meta
          name="description"
          content="Jelajahi berbagai informasi artikel edukasi, jadwal webinar interaktif, dan pengumuman resmi di Gen-U."
        />
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

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#284f7a] transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Kembali ke Beranda</span>
            </Link>
            <Link
              href="/beasiswa"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#284f7a] transition-colors"
            >
              <span>Info Beasiswa</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <section className="bg-gradient-to-b from-blue-50/70 via-white to-transparent py-14 md:py-20 px-6 md:px-12 border-b border-slate-100/80">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} className="text-blue-600" />
              <span>Wawasan, Event &amp; Kabar Terkini</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#19355a] tracking-tight leading-tight">
              Pusat Berita &amp; Aktivitas Gen-U
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Dapatkan panduan persiapan kuliah, tips memilih jurusan, jadwal live webinar bersama narasumber ahli, dan kabar pengumuman resmi.
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto relative">
              <div className="relative flex items-center shadow-lg shadow-blue-950/5 rounded-2xl bg-white border border-slate-200 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                <Search size={18} className="absolute left-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari berita, webinar, atau pengumuman..."
                  className="w-full pl-11 pr-28 py-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2 rounded-xl bg-[#284f7a] hover:bg-[#1d3d61] text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
                >
                  Cari
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-2 mt-7 flex-wrap">
              {[
                { key: 'semua', label: 'Semua Konten', icon: BookOpen },
                { key: 'berita', label: 'Berita & Artikel', icon: BookOpen },
                { key: 'webinar', label: 'Live Webinar', icon: Ticket },
                { key: 'pengumuman', label: 'Pengumuman Resmi', icon: Megaphone },
              ].map((tab) => {
                const isSelected = selectedType === tab.key
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTypeChange(tab.key)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#284f7a] text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <TabIcon size={14} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {categories.length > 0 && selectedType === 'berita' && (
              <div className="flex items-center justify-center gap-1.5 mt-4 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Kategori Berita:</span>
                <button
                  type="button"
                  onClick={() => handleKategoriChange('Semua')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                    selectedKategori === 'Semua'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua
                </button>
                {categories.map((cat) => {
                  const isSelected = selectedKategori === cat.slug || selectedKategori === cat.name
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleKategoriChange(cat.slug)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 md:px-12 mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Daftar Konten Publikasi ({posts.length})
            </h2>
            {(search || selectedType !== 'semua' || selectedKategori !== 'Semua') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedType('semua')
                  setSelectedKategori('Semua')
                  router.get('/berita')
                }}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tidak ada konten yang cocok</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                Coba gunakan kata kunci pencarian yang lain atau ganti filter kategori/tipe untuk menampilkan konten lainnya.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedType('semua')
                  setSelectedKategori('Semua')
                  router.get('/berita')
                }}
                className="mt-6 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {posts.map((post) => {
                const displayImage = post.image_url || post.image || '/landing-about-campus.jpg'
                const isWebinar = post.type === 'webinar'
                const isAnnouncement = post.type === 'pengumuman'

                const badgeBg = isWebinar
                  ? 'bg-[#f87171] text-white'
                  : isAnnouncement
                    ? 'bg-emerald-600 text-white'
                    : post.category?.badge_color || 'bg-blue-100 text-blue-700'

                const badgeText = isWebinar
                  ? (post.badge_label || 'LIVE WEBINAR')
                  : isAnnouncement
                    ? (post.badge_label || 'PENGUMUMAN')
                    : (post.category?.name || 'BERITA')

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                        <img
                          src={displayImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${badgeBg}`}>
                            {isWebinar && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                            {badgeText}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 gap-2 flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar size={13} className="text-slate-400" />
                            {isWebinar && post.event_date ? post.event_date : post.formatted_date || post.created_at}
                          </span>
                          {isWebinar && post.event_time && (
                            <span className="flex items-center gap-1 font-medium text-slate-500">
                              <Clock size={13} className="text-slate-400" />
                              {post.event_time}
                            </span>
                          )}
                          {!isWebinar && post.read_time && (
                            <span className="text-[11px] font-semibold text-slate-500">
                              {post.read_time}
                            </span>
                          )}
                        </div>

                        <Link href={`/berita/${post.slug}`}>
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 mb-2.5">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-slate-100/70 mt-4 flex items-center justify-end text-xs font-semibold">
                      <Link
                        href={`/berita/${post.slug}`}
                        className="inline-flex items-center gap-1 text-blue-700 font-bold group-hover:underline cursor-pointer"
                      >
                        <span>{isWebinar ? 'Ikuti Webinar' : isAnnouncement ? 'Lihat Maklumat' : 'Baca Selengkapnya'}</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-[#122b49] text-white pt-16 pb-12 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-700/60">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-extrabold shadow-sm">
                  <GraduationCap size={22} />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-white">Gen-U</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm max-w-sm leading-relaxed">
                Platform tes minat bakat RIASEC, simulasi PMB, eksplorasi program studi, dan panduan beasiswa terpadu untuk merancang masa depan generasi muda Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Navigasi Utama</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/beasiswa" className="hover:text-white transition-colors">
                    Peluang Beasiswa
                  </Link>
                </li>
                <li>
                  <Link href="/berita" className="hover:text-white transition-colors font-bold text-white">
                    Berita &amp; Artikel
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Narahubung</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Butuh bantuan seputar pendaftaran event atau artikel? Hubungi admin Gen-U melalui email atau WhatsApp.
              </p>
              <Link
                href="/register"
                className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
              >
                Daftar Akun Siswa
              </Link>
            </div>
          </div>

          <div className="pt-8 text-center text-xs text-slate-400">
            <p>&copy; 2026 Gen-U. Hak Cipta Dilindungi Undang-Undang.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
