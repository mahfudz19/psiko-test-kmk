import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import {
  GraduationCap,
  Medal,
  Users,
  Check,
  Search,
  ArrowLeft,
  X,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Calendar,
} from 'lucide-react'
import { ScholarshipItem } from './Admin/Beasiswa'

interface BeasiswaPageProps {
  scholarships?: ScholarshipItem[]
  allTags?: string[]
  filters?: {
    q?: string
    tag?: string
  }
}

const parseScholarshipList = (val: any): string[] => {
  if (!val) return []
  if (Array.isArray(val)) {
    return val
      .map((item) => (typeof item === 'string' ? item : item?.title || item?.name || item?.desc || ''))
      .filter((s) => typeof s === 'string' && s.trim().length > 0)
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val)
      if (Array.isArray(parsed)) return parseScholarshipList(parsed)
    } catch {
      return val.split('\n').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

const getScholarshipTag = (sch: any): string => {
  if (!sch) return ''
  if (sch.category && typeof sch.category === 'object' && sch.category.name) return sch.category.name
  if (typeof sch.tag === 'string' && sch.tag) return sch.tag
  if (typeof sch.tag === 'object' && sch.tag?.name) return sch.tag.name
  return ''
}

const getScholarshipTagColor = (sch: any): string => {
  if (!sch) return 'bg-blue-100 text-blue-700'
  if (sch.category && typeof sch.category === 'object' && sch.category.badge_color) return sch.category.badge_color
  if (typeof sch.tag === 'object' && sch.tag?.badge_color) return sch.tag.badge_color
  return sch.tag_color || 'bg-blue-100 text-blue-700'
}

export default function BeasiswaPage({
  scholarships = [],
  allTags = [],
  filters = {},
}: BeasiswaPageProps) {
  const [search, setSearch] = useState(filters.q || '')
  const [selectedTag, setSelectedTag] = useState(filters.tag || 'Semua')
  const [selectedScholarship, setSelectedScholarship] = useState<any | null>(null)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(
      '/beasiswa',
      {
        q: search,
        tag: selectedTag,
      },
      { preserveState: true }
    )
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    router.get(
      '/beasiswa',
      {
        q: search,
        tag: tag,
      },
      { preserveState: true }
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Head>
        <title>Peluang Beasiswa &amp; Bantuan Dana - Gen-U</title>
        <meta
          name="description"
          content="Jelajahi berbagai informasi peluang beasiswa pendidikan untuk jenjang kuliah, bantuan dana, UKT, dan program kepemimpinan di Gen-U."
        />
      </Head>

      <header className="sticky top-0 z-40 w-full bg-[#0e4477]/95 backdrop-blur-md shadow-lg py-4 border-b border-white/10 text-white px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="rounded-lg p-2 text-white bg-white/10">
              <GraduationCap size={22} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Gen-U</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Beranda</span>
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#f59e0b] hover:bg-[#d97706] text-white transition-colors cursor-pointer shadow-sm"
            >
              Daftar Gen-U
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-[#0e4477] to-[#1a3d66] text-white py-16 px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-white/15">
              <Medal size={24} />
            </div>
            <span className="inline-block text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 uppercase tracking-widest px-3.5 py-1 rounded-full mb-3">
              Informasi Terpadu Beasiswa
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Peluang Beasiswa &amp; Bantuan Dana
            </h1>
            <p className="mt-4 text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
              Wujudkan mimpi kuliah tanpa hambatan biaya. Temukan peluang beasiswa dari pemerintah, swasta, dan yayasan mitra resmi Gen-U.
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto flex items-center bg-white rounded-2xl p-1.5 shadow-xl">
              <div className="flex items-center gap-2 pl-4 flex-1 text-slate-400">
                <Search size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari beasiswa, penyelenggara, atau jenjang..."
                  className="w-full py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#284f7a] hover:bg-[#1d3d61] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
              >
                Cari
              </button>
            </form>
          </div>
        </section>

        <section className="py-10 px-6 md:px-12 lg:px-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
            <button
              type="button"
              onClick={() => handleTagClick('Semua')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedTag === 'Semua'
                  ? 'bg-[#284f7a] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Kategori
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#284f7a] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Daftar Beasiswa ({scholarships.length})
            </h2>
            {selectedTag !== 'Semua' && (
              <span className="text-xs text-slate-500 font-medium">
                Kategori: <strong className="text-slate-800">{selectedTag}</strong>
              </span>
            )}
          </div>

          {scholarships.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tidak ada beasiswa yang cocok</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                Coba gunakan kata kunci pencarian yang lain atau pilih kategori Semua untuk menampilkan seluruh peluang beasiswa.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedTag('Semua')
                  router.get('/beasiswa')
                }}
                className="mt-6 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition cursor-pointer"
              >
                Reset Filter Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-stretch">
              {scholarships.map((sch) => {
                const borderStyle = sch.border_color ? { borderLeftColor: sch.border_color } : {}
                const displayImage = sch.image_url || sch.image || '/landing-beasiswa-1.jpg'
                const summaryList = parseScholarshipList(sch.summary_benefits).length > 0
                  ? parseScholarshipList(sch.summary_benefits)
                  : parseScholarshipList(sch.benefits).slice(0, 2)
                const tagName = getScholarshipTag(sch)
                const tagColor = getScholarshipTagColor(sch)

                return (
                  <div
                    key={sch.id}
                    style={borderStyle}
                    className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/50 border border-slate-100 border-l-[5px] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      <div className="flex flex-col sm:flex-row items-start gap-5">
                        <img
                          src={displayImage}
                          alt={sch.name}
                          className="w-full sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 aspect-video sm:aspect-square shadow-sm"
                        />
                        <div className="flex-1 w-full">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            {tagName && (
                              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${tagColor}`}>
                                {tagName}
                              </span>
                            )}
                            {sch.quota && (
                              <span className="text-xs text-slate-400 font-medium inline-flex items-center gap-1.5">
                                <Users size={14} className="text-slate-400" />
                                {sch.quota}
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2.5 mb-0.5">
                            {sch.name}
                          </h3>
                          <p className="text-xs text-slate-400 mb-3">
                            Oleh {sch.organizer}
                          </p>

                          {summaryList.length > 0 && (
                            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                              {summaryList.map((b, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <Check size={16} className="text-amber-500 shrink-0 stroke-[2.5]" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Batas Waktu:</span>
                        <span className="text-xs sm:text-sm font-bold text-red-600">
                          {sch.deadline || 'Sesuai Ketentuan'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {sch.link_url && (
                          <a
                            href={sch.link_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                            title="Buka Website Resmi"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedScholarship(sch)}
                          className="px-6 py-2.5 rounded-xl bg-[#284f7a] hover:bg-[#1d3d61] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-colors cursor-pointer"
                        >
                          Lihat Syarat
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      {selectedScholarship && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-scholarship-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedScholarship(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-7 pb-4 px-6 sm:px-8 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                {getScholarshipTag(selectedScholarship) && (
                  <span
                    className={`inline-block text-[11px] font-bold px-3 py-0.5 rounded-full mb-1.5 ${getScholarshipTagColor(selectedScholarship)}`}
                  >
                    {getScholarshipTag(selectedScholarship)}
                  </span>
                )}
                <h3 id="modal-scholarship-title" className="text-xl sm:text-2xl font-extrabold text-[#152e4d] tracking-tight">
                  {typeof selectedScholarship.name === 'string' ? selectedScholarship.name : ''}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {typeof selectedScholarship.organizer === 'string' ? selectedScholarship.organizer : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScholarship(null)}
                aria-label="Tutup Syarat Beasiswa"
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {(() => {
                const benefits = parseScholarshipList(selectedScholarship.benefits)
                if (benefits.length === 0) return null
                return (
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Check size={16} className="text-emerald-600" />
                      Benefit &amp; Cakupan Dana
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                      {benefits.map((b: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })()}

              {(() => {
                const reqs = parseScholarshipList(selectedScholarship.requirements)
                if (reqs.length === 0) return null
                return (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Persyaratan Umum:</h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                      {reqs.map((req: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })()}

              {(() => {
                const docs = parseScholarshipList(selectedScholarship.documents)
                if (docs.length === 0) return null
                return (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Dokumen yang Diperlukan:</h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                      {docs.map((doc: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })()}

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
                <span>Batas Waktu Pendaftaran:</span>
                <strong className="text-red-600 font-bold">{selectedScholarship.deadline || 'Sesuai Ketentuan'}</strong>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
              {selectedScholarship.link_url ? (
                <a
                  href={selectedScholarship.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition shadow-xs"
                >
                  <span>Daftar / Info Resmi</span>
                  <ExternalLink size={14} />
                </a>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setSelectedScholarship(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#122b49] text-white pt-16 pb-12 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-700/60">
            <div className="md:col-span-5 space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="rounded-lg p-2 text-white bg-white/10">
                  <GraduationCap size={22} />
                </div>
                <span className="text-2xl font-extrabold tracking-tight">Gen-U</span>
              </Link>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
                Platform tes minat bakat RIASEC, simulasi PMB, eksplorasi program studi, dan panduan beasiswa terpadu untuk merancang masa depan generasi muda Indonesia.
              </p>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h3 className="text-white font-semibold text-sm sm:text-base">Navigasi</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/beasiswa" className="hover:text-white transition-colors">
                    Daftar Beasiswa
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Pendaftaran Siswa
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-4">
              <h3 className="text-white font-semibold text-sm sm:text-base">Hubungi Kami</h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <MapPin size={17} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Paccerakkang, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90245
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={17} className="text-slate-400 shrink-0" />
                  <a href="mailto:halo@gen.univeral.ac.id" className="hover:text-white transition-colors">
                    halo@gen.univeral.ac.id
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={17} className="text-slate-400 shrink-0" />
                  <a href="tel:+6285299184832" className="hover:text-white transition-colors">
                    +62 852 9918 4832
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} Gen-U. Seluruh hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
