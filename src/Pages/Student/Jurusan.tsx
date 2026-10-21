import React, { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { X, Bookmark } from 'lucide-react'
import { studentMenuItems } from '../../config/navigation'

interface MajorItem {
  id: number
  code: string
  group: 'kesehatan' | 'tech' | string
  category?: string | null
  jenjang?: string
  title: string
  teaser?: string
  description?: string
  study_activities?: string[] | string
  career_prospects?: string[] | string
}

interface CategoryItem {
  id?: number
  name: string
  description?: string | null
  majors_count?: number
}

interface StudentJurusanProps {
  majors: MajorItem[]
  categories?: CategoryItem[]
  savedMajorIds?: number[]
}

const formatList = (items?: string[] | string | null): string[] => {
  if (!items) return []
  if (Array.isArray(items)) return items
  if (typeof items === 'string') {
    return items.split(/[\r\n,]+/).map((s) => s.trim()).filter(Boolean)
  }
  return []
}

const MiniCard = ({
  p,
  isProfesi,
  onClick,
  isBookmarked,
  onBookmark,
}: {
  p?: MajorItem
  isProfesi: boolean
  onClick: () => void
  isBookmarked?: boolean
  onBookmark?: (e: React.MouseEvent) => void
}) => (
  <div
    onClick={onClick}
    className={`flex-1 border rounded-[10px] p-[13px] px-[15px] cursor-pointer transition-all hover:-translate-y-[3px] hover:shadow-[0_10px_16px_-12px_rgba(21,44,42,0.35)] bg-[#EEF3EF] ${
      isProfesi
        ? 'border-dashed border-[#CBD5CC] hover:border-[#8A5A18]'
        : 'border-[#CBD5CC] hover:border-[#2F6F62]'
    }`}
  >
    <div className="flex justify-between items-center mb-[7px] gap-2">
      <span className="font-bold text-[14px] text-[#152C2A]">{p?.title}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className={`text-[10px] font-bold px-[7px] py-[2px] rounded border ${
            isProfesi
              ? 'text-[#8A5A18] bg-[#F2E3C6] border-[#8A5A18]'
              : 'text-[#2F6F62] bg-[#DEEDE7] border-[#2F6F62]'
          } font-mono tracking-widest`}
        >
          {p?.jenjang || 'S1'}
        </span>
        {p && onBookmark && (
          <button
            type="button"
            onClick={onBookmark}
            className="p-1 rounded-full hover:bg-[#CBD5CC]/40 transition-colors"
          >
            <Bookmark
              size={13}
              className={isBookmarked ? 'fill-[#C0812A] text-[#C0812A]' : 'text-[#879B96]'}
            />
          </button>
        )}
      </div>
    </div>
    <p className="text-[12.5px] text-[#3E5551] leading-relaxed m-0">{p?.teaser || p?.description}</p>
    {isProfesi && (
      <span className="block mt-2 text-[9.5px] text-[#8A5A18] uppercase tracking-widest font-mono">
        Jenjang pendidikan lanjutan
      </span>
    )}
  </div>
)

export default function StudentJurusan({
  majors = [],
  categories = [],
  savedMajorIds = [],
}: StudentJurusanProps) {
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<MajorItem | null>(null)
  const [tab, setTab] = useState<'apa' | 'kuliah' | 'karir'>('apa')
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(savedMajorIds)

  useEffect(() => {
    setBookmarkedIds(savedMajorIds)
  }, [savedMajorIds])

  const handleToggleBookmark = (e: React.MouseEvent, majorId: number) => {
    e.stopPropagation()
    const isSaved = bookmarkedIds.includes(majorId)
    setBookmarkedIds((prev) =>
      isSaved ? prev.filter((id) => id !== majorId) : [...prev, majorId]
    )

    router.post(
      `/student/jurusan/${majorId}/bookmark`,
      {},
      {
        preserveScroll: true,
        onError: () => setBookmarkedIds(savedMajorIds),
      }
    )
  }

  const categoryNamesFromMajors = majors
    .map((m) => m.category || (m.group === 'kesehatan' ? 'Kesehatan' : 'Saintek'))
    .filter(Boolean) as string[]

  const categoryNamesFromProps = (categories || []).map((c) => c.name)

  const distinctCategories = Array.from(
    new Set([...categoryNamesFromProps, ...categoryNamesFromMajors])
  ).filter(Boolean)

  const tracks = [
    {
      name: 'Jalur Farmasi',
      blurb: 'Meracik, menguji, dan mengelola obat, dari bangku kuliah hingga praktik profesional.',
      vokasi: 'd3-farmasi',
      sarjana: 's1-farmasi',
      profesi: 'profesi-apoteker',
    },
    {
      name: 'Jalur Kebidanan',
      blurb: 'Mendampingi ibu dan bayi sejak kehamilan hingga masa nifas dengan asuhan yang aman.',
      vokasi: 'd3-kebidanan',
      sarjana: 's1-kebidanan',
      profesi: 'profesi-bidan',
    },
  ]

  const trackedKesehatanCodes = [
    'd3-farmasi',
    's1-farmasi',
    'profesi-apoteker',
    'd3-kebidanan',
    's1-kebidanan',
    'profesi-bidan',
  ]

  const isKesehatanCategory = (name: string) => name.toLowerCase().includes('kesehatan')

  const getCategoryDescription = (name: string) => {
    const fromProps = categories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    )?.description
    if (fromProps) return fromProps

    const lower = name.toLowerCase()
    if (lower.includes('kesehatan')) {
      return 'Jalur keilmuan untuk kamu yang ingin terjun langsung menyelamatkan dan merawat nyawa manusia. Kesehatan memiliki hierarki jenjang dari Vokasi (D3), Sarjana (S1), hingga program Profesi.'
    }
    if (lower.includes('saintek')) {
      return 'Fokus pada penguasaan sains, teknologi rekayasa, algoritma komputasi, dan inovasi ilmiah yang terhubung langsung dengan industri teknologi modern.'
    }
    if (lower.includes('soshum')) {
      return 'Fokus pada pengelolaan organisasi, komunikasi massa, hukum bisnis, dan dinamika sosial masyarakat berdaya saing global.'
    }
    return `Bidang dan program studi dalam lingkup ${name} untuk mempersiapkan keahlian profesionalmu.`
  }

  const getCategoryDotColor = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('kesehatan')) return 'bg-[#2F6F62]'
    if (lower.includes('saintek')) return 'bg-[#38507C]'
    if (lower.includes('soshum')) return 'bg-[#55416B]'
    return 'bg-[#C0812A]'
  }

  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="jurusan">
      <div className="font-serif bg-[#EEF3EF] -m-4 md:-m-8 p-4 md:p-8 min-h-screen bg-[linear-gradient(#DEE5DE_1px,transparent_1px),linear-gradient(90deg,#DEE5DE_1px,transparent_1px)] bg-[size:32px_32px]">
        <header className="max-w-5xl mx-auto py-8 md:py-12 relative z-10">
          <div className="inline-flex items-center gap-2 text-[12.5px] uppercase tracking-[0.12em] text-[#3E5551] mb-6">
            <div className="w-5 h-[1px] bg-[#3E5551]"></div>
            Panduan untuk siswa SMA / SMK / MA
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.02] mb-5 tracking-tight text-[#152C2A] font-sans">
                Jelajah{' '}
                <em className="not-italic text-[#1D473D] underline decoration-[#C0812A] decoration-4 underline-offset-[6px]">
                  jurusan
                </em>
                ,<br />
                temukan jalanmu.
              </h1>
              <p className="text-lg text-[#3E5551] mb-7 max-w-prose">
                Sebelum menentukan pilihan, kenali dulu isi sebenarnya dari program studi — apa yang dipelajari, seperti apa kuliahnya sehari-hari, dan ke mana jalur kariernya bisa membawamu.
              </p>
              <div className="flex gap-3 flex-wrap">
                {distinctCategories.slice(0, 3).map((catName, idx) => (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setFilter(catName)}
                    className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 font-sans ${
                      idx === 0
                        ? 'bg-[#152C2A] text-[#FBFAF4] hover:bg-[#1D473D]'
                        : 'border-2 border-[#152C2A] text-[#152C2A] bg-transparent hover:bg-[#152C2A]/5'
                    }`}
                  >
                    {catName}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <svg className="w-full max-w-[240px] h-auto" viewBox="0 0 260 260" fill="none">
                <circle cx="130" cy="130" r="110" stroke="#CBD5CC" strokeWidth="1.5" />
                <circle cx="130" cy="130" r="80" stroke="#CBD5CC" strokeWidth="1" />
                <path d="M130 20 L130 240 M20 130 L240 130" stroke="#CBD5CC" strokeWidth="1" />
                <path d="M130 130 L188 66" stroke="#2F6F62" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M130 130 L182 176" stroke="#38507C" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="130" cy="130" r="7" fill="#152C2A" />
                <circle cx="188" cy="66" r="5" fill="#2F6F62" />
                <circle cx="182" cy="176" r="5" fill="#38507C" />
                <text x="196" y="58" fontFamily="monospace" fontSize="9" fill="#1D473D">
                  {(distinctCategories[0] || 'KESEHATAN').toUpperCase()}
                </text>
                <text x="150" y="196" fontFamily="monospace" fontSize="9" fill="#233458">
                  {(distinctCategories[1] || 'SAINTEK').toUpperCase()}
                </text>
              </svg>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto mb-10 grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[#CBD5CC] border border-[#CBD5CC] rounded-xl overflow-hidden relative z-10 shadow-sm">
          {[
            { num: String(majors.length || 12), lbl: 'program studi' },
            { num: '3', lbl: 'jenjang: D3, S1, Profesi' },
            { num: String(distinctCategories.length || 3), lbl: 'kategori keilmuan' },
            { num: '2026', lbl: 'terkoneksi industri' },
          ].map((s, i) => (
            <div key={i} className="bg-[#FBFAF4] p-5">
              <div className="text-3xl font-bold text-[#152C2A] mb-1 font-sans">{s.num}</div>
              <div className="text-xs text-[#3E5551] font-sans">{s.lbl}</div>
            </div>
          ))}
        </div>

        <div className="sticky top-0 z-30 backdrop-blur-md bg-[#EEF3EF]/90 border-b border-[#CBD5CC] py-3 -mx-4 px-4 md:-mx-8 md:px-8 mb-10">
          <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap">
            <span className="text-[11.5px] text-[#3E5551] uppercase tracking-widest mr-2 font-bold font-sans">
              Tampilkan
            </span>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all border font-sans ${
                filter === 'all'
                  ? 'bg-[#152C2A] text-white border-[#152C2A]'
                  : 'bg-[#FBFAF4] text-[#3E5551] border-[#CBD5CC] hover:border-[#152C2A] hover:text-[#152C2A]'
              }`}
            >
              Semua program
            </button>
            <button
              type="button"
              onClick={() => setFilter('saved')}
              className={`px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all border font-sans inline-flex items-center gap-1.5 ${
                filter === 'saved'
                  ? 'bg-[#C0812A] text-white border-[#C0812A]'
                  : 'bg-[#FBFAF4] text-[#C0812A] border-[#CBD5CC] hover:border-[#C0812A]'
              }`}
            >
              <Bookmark size={13} className={filter === 'saved' ? 'fill-white' : 'fill-[#C0812A]'} />
              Disimpan ({bookmarkedIds.length})
            </button>
            {distinctCategories.map((catName) => (
              <button
                key={catName}
                type="button"
                onClick={() => setFilter(catName)}
                className={`px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all border font-sans ${
                  filter === catName
                    ? 'bg-[#152C2A] text-white border-[#152C2A]'
                    : 'bg-[#FBFAF4] text-[#3E5551] border-[#CBD5CC] hover:border-[#152C2A] hover:text-[#152C2A]'
                }`}
              >
                {catName}
              </button>
            ))}
          </div>
        </div>

        {filter === 'saved' && (
          <section className="max-w-5xl mx-auto mb-16 animate-in fade-in duration-500 relative z-10">
            <div className="flex items-baseline gap-3 mb-6">
              <div className="w-3 h-3 rounded-[3px] bg-[#C0812A]"></div>
              <h2 className="text-2xl font-bold text-[#152C2A] m-0 font-sans">Jurusan Tersimpan</h2>
              <span className="text-sm text-[#3E5551] font-sans">
                {bookmarkedIds.length} Program Studi Favorit
              </span>
            </div>
            {bookmarkedIds.length === 0 ? (
              <div className="bg-[#FBFAF4] border border-[#CBD5CC] rounded-[14px] p-12 text-center">
                <Bookmark className="mx-auto text-[#879B96] mb-3" size={32} />
                <h3 className="text-lg font-bold text-[#152C2A] mb-1">Belum ada jurusan yang disimpan</h3>
                <p className="text-sm text-[#3E5551] max-w-md mx-auto">
                  Klik ikon bookmark pada jurusan yang menarik perhatianmu untuk menyimpannya di sini dan melacak target eksplorasi.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {majors
                  .filter((m) => bookmarkedIds.includes(m.id))
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelected(p)
                        setTab('apa')
                      }}
                      className="relative bg-[#FBFAF4] border border-[#CBD5CC] rounded-[14px] p-[22px] px-[20px] pb-[20px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_18px_-14px_rgba(21,44,42,0.35)] hover:border-[#C0812A] group"
                    >
                      <div className="flex justify-between items-start mb-[14px]">
                        <span className="text-[10px] font-bold px-[8px] py-[3px] rounded-[5px] border -rotate-3 text-[#C0812A] bg-[#FAF1E4] border-[#C0812A] font-mono tracking-widest">
                          {p.jenjang || 'S1'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(e, p.id)}
                          className="p-1.5 rounded-full hover:bg-[#CBD5CC]/40 transition-colors"
                        >
                          <Bookmark size={16} className="fill-[#C0812A] text-[#C0812A]" />
                        </button>
                      </div>
                      <h3 className="text-[19px] font-bold text-[#152C2A] mb-2 font-sans leading-tight">
                        {p.title}
                      </h3>
                      <p className="text-[14px] text-[#3E5551] mb-[18px] leading-relaxed line-clamp-3">
                        {p.teaser || p.description}
                      </p>
                      <span className="text-[12.5px] font-bold text-[#C0812A] flex items-center gap-[6px] font-sans">
                        Buka profil rinci
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 transition-transform group-hover:translate-x-[3px]">
                          <path d="M2 6H10M10 6L6.5 2.5M10 6L6.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}

        {distinctCategories.map((catName) => {
          if (filter !== 'all' && filter !== catName) return null

          const isKesehatan = isKesehatanCategory(catName)
          const catPrograms = majors.filter((p) => {
            const currentCat = p.category || (p.group === 'kesehatan' ? 'Kesehatan' : 'Saintek')
            return currentCat.toLowerCase() === catName.toLowerCase()
          })

          if (catPrograms.length === 0) return null

          if (isKesehatan) {
            const otherKesehatan = catPrograms.filter(
              (p) => !trackedKesehatanCodes.includes(p.code)
            )

            return (
              <section
                key={catName}
                className="max-w-5xl mx-auto mb-16 animate-in fade-in duration-500 relative z-10"
              >
                <div className="flex items-baseline gap-3 mb-6">
                  <div className={`w-3 h-3 rounded-[3px] ${getCategoryDotColor(catName)}`}></div>
                  <h2 className="text-2xl font-bold text-[#152C2A] m-0 font-sans">{catName}</h2>
                  <span className="text-sm text-[#3E5551] font-sans">
                    {catPrograms.length} Program Studi
                  </span>
                </div>
                <p className="text-[14.5px] text-[#3E5551] max-w-[70ch] mb-6">
                  {getCategoryDescription(catName)}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {tracks.map((t) => {
                    const vokasi = majors.find((p) => p.code === t.vokasi)
                    const sarjana = majors.find((p) => p.code === t.sarjana)
                    const profesi = majors.find((p) => p.code === t.profesi)
                    return (
                      <div
                        key={t.name}
                        className="bg-[#FBFAF4] border border-[#CBD5CC] rounded-[14px] p-6 shadow-[0_1px_0_rgba(21,44,42,0.06)]"
                      >
                        <h3 className="text-xl font-bold text-[#152C2A] mb-1 font-sans">{t.name}</h3>
                        <p className="text-[13.5px] text-[#3E5551] mb-6">{t.blurb}</p>

                        <div className="mb-6">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#3E5551] font-mono mb-3">
                            <span>Kuliah dasar &middot; vokasi mandiri</span>
                            <div className="flex-1 h-[1px] bg-[#CBD5CC]"></div>
                          </div>
                          <div className="flex">
                            <MiniCard
                              p={vokasi}
                              isProfesi={false}
                              isBookmarked={vokasi ? bookmarkedIds.includes(vokasi.id) : false}
                              onBookmark={vokasi ? (e) => handleToggleBookmark(e, vokasi.id) : undefined}
                              onClick={() => {
                                if (vokasi) {
                                  setSelected(vokasi)
                                  setTab('apa')
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#3E5551] font-mono mb-3">
                            <span>Kuliah dasar &middot; berlanjut ke profesi</span>
                            <div className="flex-1 h-[1px] bg-[#CBD5CC]"></div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
                            <MiniCard
                              p={sarjana}
                              isProfesi={false}
                              isBookmarked={sarjana ? bookmarkedIds.includes(sarjana.id) : false}
                              onBookmark={sarjana ? (e) => handleToggleBookmark(e, sarjana.id) : undefined}
                              onClick={() => {
                                if (sarjana) {
                                  setSelected(sarjana)
                                  setTab('apa')
                                }
                              }}
                            />
                            <div className="flex items-center justify-center text-[#CBD5CC] py-1 sm:py-0 rotate-90 sm:rotate-0 shrink-0">
                              <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
                                <path
                                  d="M2 8H14M14 8L9.5 3.5M14 8L9.5 12.5"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                            <MiniCard
                              p={profesi}
                              isProfesi={true}
                              isBookmarked={profesi ? bookmarkedIds.includes(profesi.id) : false}
                              onBookmark={profesi ? (e) => handleToggleBookmark(e, profesi.id) : undefined}
                              onClick={() => {
                                if (profesi) {
                                  setSelected(profesi)
                                  setTab('apa')
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {otherKesehatan.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {otherKesehatan.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelected(p)
                          setTab('apa')
                        }}
                        className="relative bg-[#FBFAF4] border border-[#CBD5CC] rounded-[14px] p-[22px] px-[20px] pb-[20px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_18px_-14px_rgba(21,44,42,0.35)] hover:border-[#2F6F62] group"
                      >
                        <div className="flex justify-between items-start mb-[14px]">
                          <span className="text-[10px] font-bold px-[8px] py-[3px] rounded-[5px] border -rotate-3 text-[#2F6F62] bg-[#DEEDE7] border-[#2F6F62] font-mono tracking-widest">
                            {p.jenjang || 'S1'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleToggleBookmark(e, p.id)}
                            className="p-1.5 rounded-full hover:bg-[#CBD5CC]/40 transition-colors"
                          >
                            <Bookmark
                              size={16}
                              className={bookmarkedIds.includes(p.id) ? "fill-[#C0812A] text-[#C0812A]" : "text-[#879B96] hover:text-[#152C2A]"}
                            />
                          </button>
                        </div>
                        <h3 className="text-[19px] font-bold text-[#152C2A] mb-2 font-sans leading-tight">
                          {p.title}
                        </h3>
                        <p className="text-[14px] text-[#3E5551] mb-[18px] leading-relaxed line-clamp-3">
                          {p.teaser || p.description}
                        </p>
                        <span className="text-[12.5px] font-bold text-[#2F6F62] flex items-center gap-[6px] font-sans">
                          Buka profil rinci
                          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 transition-transform group-hover:translate-x-[3px]">
                            <path d="M2 6H10M10 6L6.5 2.5M10 6L6.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )
          }

          return (
            <section
              key={catName}
              className="max-w-5xl mx-auto mb-16 animate-in fade-in duration-500 relative z-10"
            >
              <div className="flex items-baseline gap-3 mb-6">
                <div className={`w-3 h-3 rounded-[3px] ${getCategoryDotColor(catName)}`}></div>
                <h2 className="text-2xl font-bold text-[#152C2A] m-0 font-sans">{catName}</h2>
                <span className="text-sm text-[#3E5551] font-sans">{catPrograms.length} Program Studi</span>
              </div>
              <p className="text-[14.5px] text-[#3E5551] max-w-[70ch] mb-6">
                {getCategoryDescription(catName)}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {catPrograms.map((p, i) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelected(p)
                      setTab('apa')
                    }}
                    className="relative bg-[#FBFAF4] border border-[#CBD5CC] rounded-[14px] p-[22px] px-[20px] pb-[20px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_18px_-14px_rgba(21,44,42,0.35)] hover:border-[#3E5551] group"
                  >
                    <div className="flex justify-between items-start mb-[14px]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-[8px] py-[3px] rounded-[5px] border -rotate-3 text-[#38507C] bg-[#E1E7F2] border-[#38507C] font-mono tracking-widest">
                          {p.jenjang || 'S1'}
                        </span>
                        <span className="text-[11px] text-[#3E5551] font-mono opacity-70">
                          N&deg;{String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(e, p.id)}
                        className="p-1.5 rounded-full hover:bg-[#CBD5CC]/40 transition-colors"
                      >
                        <Bookmark
                          size={16}
                          className={bookmarkedIds.includes(p.id) ? "fill-[#C0812A] text-[#C0812A]" : "text-[#879B96] hover:text-[#152C2A]"}
                        />
                      </button>
                    </div>
                    <h3 className="text-[19px] font-bold text-[#152C2A] mb-2 font-sans leading-tight">{p.title}</h3>
                    <p className="text-[14px] text-[#3E5551] mb-[18px] leading-relaxed line-clamp-3">
                      {p.teaser || p.description}
                    </p>
                    <span className="text-[12.5px] font-bold text-[#38507C] flex items-center gap-[6px] font-sans">
                      Buka profil rinci
                      <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 transition-transform group-hover:translate-x-[3px]">
                        <path d="M2 6H10M10 6L6.5 2.5M10 6L6.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {selected && (
          <div
            className="fixed inset-0 bg-[#152C2A]/50 flex items-center justify-center p-4 md:p-12 z-50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-[#FBFAF4] w-full max-w-2xl max-h-full rounded-2xl border border-[#CBD5CC] shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8 border-b border-[#CBD5CC] shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-[8px] py-[3px] rounded-[5px] border -rotate-3 font-mono tracking-widest ${
                        selected.group === 'kesehatan' || (selected.category && selected.category.toLowerCase().includes('kesehatan'))
                          ? 'text-[#2F6F62] bg-[#DEEDE7] border-[#2F6F62]'
                          : 'text-[#38507C] bg-[#E1E7F2] border-[#38507C]'
                      }`}
                    >
                      {selected.category || selected.jenjang || 'S1'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmark(e, selected.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border border-[#CBD5CC] bg-[#FBFAF4] hover:bg-[#EEF3EF] transition-colors"
                    >
                      <Bookmark
                        size={14}
                        className={bookmarkedIds.includes(selected.id) ? "fill-[#C0812A] text-[#C0812A]" : "text-[#879B96]"}
                      />
                      <span className="font-sans text-[11px] text-[#152C2A] font-medium">
                        {bookmarkedIds.includes(selected.id) ? 'Tersimpan' : 'Simpan'}
                      </span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full border border-[#CBD5CC] flex items-center justify-center text-[#3E5551] hover:bg-[#152C2A] hover:text-[#FBFAF4] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <h2 className="text-3xl font-bold text-[#152C2A]">{selected.title}</h2>
              </div>

              <div className="flex gap-1.5 px-6 md:px-8 pt-5 border-b border-[#CBD5CC] bg-[#EEF3EF] shrink-0 overflow-x-auto no-scrollbar">
                {(['apa', 'kuliah', 'karir'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`px-[16px] py-[10px] text-[13.5px] font-bold rounded-t-[10px] border transition-colors whitespace-nowrap ${
                      tab === t
                        ? 'bg-[#FBFAF4] border-[#CBD5CC] text-[#152C2A] border-b-[#FBFAF4] translate-y-[1px]'
                        : 'border-transparent text-[#3E5551] hover:bg-[#CBD5CC]/30'
                    }`}
                  >
                    {t === 'apa' ? 'Apa itu?' : t === 'kuliah' ? 'Kegiatan kuliah' : 'Jenjang karier'}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8 overflow-y-auto text-[#152C2A] font-serif flex-1">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {tab === 'apa' && <p className="leading-[1.8] text-[15.5px]">{selected.description || selected.teaser}</p>}
                  {tab === 'kuliah' && (
                    <ul className="space-y-3">
                      {formatList(selected.study_activities).map((k, i) => (
                        <li key={i} className="flex items-start gap-3 text-[15.5px] leading-[1.6]">
                          <span className="mt-[6px] w-[5px] h-[5px] shrink-0 rounded-full bg-[#C0812A]"></span>
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {tab === 'karir' && (
                    <ul className="space-y-3">
                      {formatList(selected.career_prospects).map((k, i) => (
                        <li key={i} className="flex items-start gap-3 text-[15.5px] leading-[1.6]">
                          <span className="mt-[6px] w-[5px] h-[5px] shrink-0 rounded-full bg-[#38507C]"></span>
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
