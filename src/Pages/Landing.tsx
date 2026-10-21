import React, { useEffect, useState } from 'react'
import { Head, Link } from '@inertiajs/react'
const landingPersonOne = '/landing-person-1.png'
const landingPersonTwo = '/landing-person-2.png'
const landingPersonThree = '/landing-person-3.png'
const landingAboutCampus = '/landing-about-campus.jpg'
const landingBakatMinat = '/landing-bakat-minat.jpg'
const landingBeasiswaOne = '/landing-beasiswa-1.jpg'
const landingBeasiswaTwo = '/landing-beasiswa-2.jpg'
const avatarSarah = '/avatar-sarah.png'
const avatarBudi = '/avatar-budi.png'
const avatarDina = '/avatar-dina.png'
import {
  GraduationCap,
  Compass,
  BookOpen,
  CheckSquare,
  ChevronRight,
  Lock,
  Menu,
  X,
  Sparkles,
  Users,
  Award,
  Newspaper,
  PhoneCall,
  Mail,
  ArrowUpRight,
  Calendar,
  MapPin,
  Phone,
  FlaskConical,
  Sprout,
  Cpu,
  Building2,
  Factory,
  Landmark,
  Microscope,
  Briefcase,
  Star,
  Heart,
  Target,
  Medal,
  Search,
  Check,
  Clock,
  Ticket,
  Megaphone,
} from 'lucide-react'

const landingSlides = [
  {
    title: (
      <>
        KENALI PASSIONMU<br />TENTUKAN MASA DEPANMU
      </>
    ),
    image: landingPersonOne,
    alt: 'Beragam profesional muda menyatukan tangan dengan semangat masa depan',
  },
  {
    title: (
      <>
        MASIH BINGUNG<br />DENGAN BAKAT<br />&amp; MINATMU?
      </>
    ),
    image: landingPersonTwo,
    alt: 'Siswa sedang memikirkan arah bakat dan minat studinya',
  },
  {
    title: (
      <>
        YUK.....!<br />KENALI LEBIH<br />DALAM PASSIONMU
      </>
    ),
    image: landingPersonThree,
    alt: 'Siswa antusias menjelajahi minat dan jurusan perkuliahan',
  },
]

interface CareerProspect {
  title: string
  desc: string
  icon: React.ElementType
}

interface ProgramDetail {
  id: string
  name: string
  isAvailable: boolean
  cardDesc: string
  icon: React.ElementType
  about: string
  degree: string
  degreeNote: string
  careerProspects: CareerProspect[]
}

const programsData: ProgramDetail[] = [
  {
    id: 's1-farmasi',
    name: 'S1 Farmasi',
    isAvailable: true,
    cardDesc: 'Pelajari seluk beluk obat-obatan, pengembangan formula, hingga analisis interaksi obat untuk penyembuhan.',
    icon: FlaskConical,
    about:
      'S1 Farmasi adalah program studi yang mempelajari segala hal tentang obat-obatan. Kamu akan belajar mulai dari pencarian bahan baku (alam maupun sintetis), pengembangan formula, cara memproduksi obat yang aman, hingga menganalisis interaksi dan efek klinis obat di dalam tubuh manusia untuk menyembuhkan penyakit.',
    degree: 'Lulusan program studi ini akan memperoleh gelar akademik S.Farm. (Sarjana Farmasi).',
    degreeNote:
      'Untuk dapat melakukan praktik profesi kefarmasian (seperti di apotek atau rumah sakit), lulusan wajib melanjutkan studi 1 tahun ke jenjang Program Profesi Apoteker untuk meraih gelar profesi Apoteker (apt.).',
    careerProspects: [
      {
        title: 'Fasilitas Kesehatan',
        desc: 'Menjadi Apoteker klinis di Rumah Sakit, Klinik, Puskesmas, atau Apotek Komunitas untuk memastikan pasien mendapat obat yang tepat.',
        icon: Building2,
      },
      {
        title: 'Industri Farmasi',
        desc: 'Bekerja di industri obat, kosmetik, atau makanan pada bagian Research & Development (R&D), Quality Assurance (QA), atau Produksi.',
        icon: Factory,
      },
      {
        title: 'Instansi Pemerintah',
        desc: 'Menjadi ASN di Kementerian Kesehatan, Badan POM (Pengawas Obat dan Makanan), Dinas Kesehatan, atau BNN.',
        icon: Landmark,
      },
      {
        title: 'Peneliti & Akademisi',
        desc: 'Mengembangkan ilmu pengetahuan dengan menjadi Dosen di Universitas atau Peneliti di lembaga riset seperti BRIN.',
        icon: Microscope,
      },
    ],
  },
  {
    id: 's1-agribisnis',
    name: 'S1 Agribisnis',
    isAvailable: false,
    cardDesc: 'Mempelajari bisnis di sektor pertanian, dari hulu hingga hilir beserta manajemennya.',
    icon: Sprout,
    about:
      'S1 Agribisnis menggabungkan ilmu pertanian, manajemen, dan ekonomi bisnis modern. Kamu akan belajar mengelola komoditas dari hulu ke hilir, rantai pasok pangan, tata niaga hasil bumi, hingga inovasi sociopreneurship agrikultur.',
    degree: 'Lulusan program studi ini akan memperoleh gelar akademik S.P. (Sarjana Pertanian).',
    degreeNote:
      'Lulusan dibekali sertifikasi manajemen agribisnis dan kewirausahaan modern untuk memimpin rantai pasok pangan dan agrikultur berkelanjutan.',
    careerProspects: [
      {
        title: 'Perusahaan Agribisnis',
        desc: 'Menjadi Manajer Operasional Perkebunan, Analis Rantai Pasok Pangan, atau Procurement Specialist di korporasi agrikultur.',
        icon: Building2,
      },
      {
        title: 'Industri Olahan Pangan',
        desc: 'Mengelola rantai produksi agroindustri hilir, distribusi bahan pangan, dan quality control komoditas komersial.',
        icon: Factory,
      },
      {
        title: 'Instansi Pemerintah & BUMN',
        desc: 'Menjadi ASN/Perencana di Kementerian Pertanian, Bapanas, Bulog, maupun dinas ketahanan pangan daerah.',
        icon: Landmark,
      },
      {
        title: 'Sociopreneur & Konsultan',
        desc: 'Membangun startup teknologi pertanian (agritech) atau konsultan pengembangan bisnis komoditas rakyat.',
        icon: Sprout,
      },
    ],
  },
  {
    id: 's1-teknik-informatika',
    name: 'S1 Teknik Informatika',
    isAvailable: false,
    cardDesc: 'Fokus pada pengembangan perangkat lunak, AI, dan sistem komputasi modern.',
    icon: Cpu,
    about:
      'S1 Teknik Informatika berfokus pada logika komputasi, arsitektur perangkat lunak modern, kecerdasan buatan (AI & machine learning), komputasi awan, serta keamanan siber untuk memecahkan berbagai tantangan digital masa depan.',
    degree: 'Lulusan program studi ini akan memperoleh gelar akademik S.Kom. (Sarjana Komputer).',
    degreeNote:
      'Lulusan dibekali portofolio proyek perangkat lunak nyata dan kesiapan sertifikasi industri internasional seperti Cloud Architect dan Security Specialist.',
    careerProspects: [
      {
        title: 'Industri Teknologi & Software',
        desc: 'Menjadi Software Engineer, Fullstack Developer, Mobile App Developer, atau Cloud Architect di perusahaan teknologi global.',
        icon: Building2,
      },
      {
        title: 'AI & Data Science',
        desc: 'Merancang model otomasi cerdas, algoritma kecerdasan buatan, dan analitik big data sebagai AI Engineer atau Data Scientist.',
        icon: Cpu,
      },
      {
        title: 'Pemerintah & Cyber Security',
        desc: 'Mengamankan infrastruktur siber kritis negara dan institusi keuangan sebagai Security Analyst atau IT Auditor.',
        icon: Landmark,
      },
      {
        title: 'Riset & Startup Founder',
        desc: 'Mendirikan produk digital rintisan (tech startup) atau menjadi peneliti inovasi komputasi kuantum & deep-tech.',
        icon: Microscope,
      },
    ],
  },
]

export default function Landing() {
  const [landingSlide, setLandingSlide] = useState(0)
  const visibleLandingSlide = landingSlide % landingSlides.length

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [selectedProgram, setSelectedProgram] = useState<ProgramDetail | null>(null)
  const [selectedScholarship, setSelectedScholarship] = useState<any | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProgram(null)
        setSelectedScholarship(null)
      }
    }
    if (selectedProgram || selectedScholarship) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedProgram, selectedScholarship])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setLandingSlide((prev) => (prev % landingSlides.length + 1) % landingSlides.length)
      }
    }, 5500)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      const sectionIds = ['home', 'program', 'bakat-minat', 'features', 'beasiswa', 'berita', 'about', 'narahubung']
      const scrollPosition = window.scrollY + 160
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50

      if (isBottom) {
        setActiveSection('narahubung')
        return
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i])
          break
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', href: '#home', id: 'nav-link-home' },
    { label: 'Program', href: '#program', id: 'nav-link-program' },
    { label: 'Bakat & Minat', href: '#bakat-minat', id: 'nav-link-bakat-minat' },
    { label: 'Fitur', href: '#features', id: 'nav-link-features' },
    { label: 'Beasiswa', href: '#beasiswa', id: 'nav-link-beasiswa' },
    { label: 'Berita', href: '#berita', id: 'nav-link-berita' },
    { label: 'Tentang Kami', href: '#about', id: 'nav-link-about' },
    { label: 'Narahubung', href: '#narahubung', id: 'nav-link-narahubung' },
  ]

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()
    const targetId = hash.replace('#', '')
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(targetId)
      window.history.pushState(null, '', hash)
      setIsMobileMenuOpen(false)
    }
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalApplication',
    name: 'Gen-U (Generasi Universal)',
    alternateName: 'Gen-U',
    description: 'Platform tes minat bakat RIASEC, eksplorasi jurusan perkuliahan, simulasi PMB, dan bimbingan karier terpadu untuk siswa sekolah.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All Web Browsers',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    featureList: [
      'Tes Minat Bakat RIASEC',
      'Eksplorasi Program Studi dan Jurusan Kuliah',
      'Simulasi Pendaftaran Mahasiswa Baru (PMB)',
      'Konsultasi dan Bimbingan Karier Siswa',
    ],
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col scroll-smooth">
      <Head>
        <title>Gen-U - Platform Tes Minat Bakat RIASEC &amp; Eksplorasi Jurusan Kuliah</title>
        <meta
          name="description"
          content="Kenali potensi, minat, dan bakat masa depanmu bersama Gen-U. Akses tes psikometri RIASEC, eksplorasi 50+ program studi, simulasi PMB, dan bimbingan karier terpadu."
        />
        <meta
          name="keywords"
          content="tes minat bakat, tes riasec, asesmen psikometri, jurusan kuliah, simulasi pmb, beasiswa, berita kampus, bimbingan konseling, universitas indonesia, gen-u"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gen-U - Kenali Passionmu, Tentukan Masa Depanmu" />
        <meta
          property="og:description"
          content="Platform interaktif asesmen minat bakat RIASEC, panduan jurusan kuliah, beasiswa, dan bimbingan karier siswa menuju kampus impian."
        />
        <meta property="og:image" content={landingAboutCampus} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gen-U - Kenali Passionmu, Tentukan Masa Depanmu" />
        <meta
          name="twitter:description"
          content="Platform edukasi terpadu untuk asesmen minat bakat, panduan program studi, beasiswa, dan bimbingan karier siswa."
        />
        <meta name="twitter:image" content={landingAboutCampus} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <header
        id="landing-header"
        className={`fixed top-0 z-40 w-full transition-all duration-300 px-6 md:px-10 lg:px-14 ${isScrolled
          ? 'bg-[#0e4477]/95 backdrop-blur-md shadow-lg py-3.5 border-b border-white/10 text-white'
          : 'bg-transparent py-5 text-white'
          }`}
      >
        <nav id="landing-navbar" aria-label="Navigasi Utama" className="flex items-center justify-between">
          <Link href="/" id="brand-logo" className="flex items-center gap-2 shrink-0">
            <div className="rounded-lg p-2 text-white bg-white/10">
              <GraduationCap size={22} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Gen-U</span>
          </Link>

          <div className="hidden items-center gap-4 xl:gap-6 lg:flex text-xs xl:text-sm">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '')
              return (
                <a
                  key={item.href}
                  href={item.href}
                  id={item.id}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`transition-colors cursor-pointer py-1 whitespace-nowrap ${isActive
                    ? 'text-white font-bold'
                    : 'text-slate-300 font-normal hover:text-white'
                    }`}
                >
                  {item.label}
                </a>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              id="btn-login"
              href="/login"
              className="rounded-xl px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/15"
            >
              Masuk
            </Link>
            <Link
              id="btn-register"
              href="/register"
              className="rounded-xl border border-white/80 px-4 py-2 text-xs font-semibold transition-colors hover:bg-white hover:text-blue-900 bg-white/10"
            >
              Daftar
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              id="btn-login-mobile"
              href="/login"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 transition-colors"
            >
              Masuk
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-yellow-300 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#0e4477] border-b border-white/10 shadow-2xl px-6 py-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 text-white">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace('#', '')
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={`py-2 text-sm border-b border-white/5 transition-colors cursor-pointer ${isActive
                      ? 'text-white font-bold'
                      : 'text-slate-300 font-normal hover:text-white'
                      }`}
                  >
                    {item.label}
                  </a>
                )
              })}
            </div>
            <div className="pt-2 flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 rounded-xl bg-yellow-400 text-blue-950 font-bold text-xs shadow-md"
              >
                Daftar
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        <section
          id="home"
          aria-label="Sorotan Utama Gen-U"
          className="relative flex min-h-screen items-center overflow-hidden bg-[#11518e] px-6 pt-28 text-white md:px-12 lg:px-16"
        >
          <div
            className="pointer-events-none absolute -bottom-36 -left-36 h-80 w-80 rounded-full border border-white/20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full border border-white/20"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-3 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[56%_44%]">
            <div className="relative z-10 pb-5 pt-8 lg:py-16">
              <div key={visibleLandingSlide} className="animate-in fade-in duration-500">
                <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:w-[75vw] lg:max-w-none lg:text-6xl xl:w-[850px] xl:text-7xl">
                  {landingSlides[visibleLandingSlide].title}
                </h1>
                <p className="mt-7 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
                  Generasi Universal akan membantu kamu menemukan jurusan, mengenal bakat dan minat, serta memperoleh informasi kampus secara lengkap dalam satu platform.
                </p>
              </div>
              <div className="mt-10 flex flex-col items-start gap-3 sm:mt-14">
                <Link
                  id="btn-hero-explore-majors"
                  href="/student/jurusan"
                  className="min-w-64 rounded-xl border-[3px] border-white px-5 py-2.5 text-center text-lg font-extrabold transition-colors hover:bg-white hover:text-blue-900"
                >
                  JELAJAHI JURUSAN
                </Link>
                <Link
                  id="btn-hero-riasec-test"
                  href="/student/riasec"
                  className="min-w-64 rounded-xl border-[3px] border-white px-5 py-2.5 text-center text-lg font-extrabold transition-colors hover:bg-white hover:text-blue-900"
                >
                  KENALI BAKAT MINATMU
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-3" role="group" aria-label="Pilih slide landing page">
                {landingSlides.map((_, index) => (
                  <button
                    key={index}
                    id={`btn-slide-indicator-${index + 1}`}
                    type="button"
                    onClick={() => setLandingSlide(index)}
                    aria-label={`Tampilkan slide ${index + 1}`}
                    aria-current={visibleLandingSlide === index ? 'true' : undefined}
                    className={`h-3.5 w-3.5 rounded-full transition-colors ${visibleLandingSlide === index ? 'bg-white' : 'bg-blue-950/40 hover:bg-white/60'
                      }`}
                  />
                ))}
              </div>
            </div>
            <div className="relative min-h-72 self-stretch sm:min-h-96 lg:min-h-[38rem]" aria-live="off">
              <div
                className="absolute bottom-[-18%] right-[-28%] aspect-square w-[125%] rounded-full bg-[#ffe45c] sm:right-[-15%] lg:bottom-[-36%] lg:right-[-35%] lg:w-[140%]"
                aria-hidden="true"
              />
              <div
                className="absolute right-0 top-5 h-14 w-14 rounded-full bg-[#ffe45c] lg:right-[-8%] lg:top-[15%] lg:h-20 lg:w-20"
                aria-hidden="true"
              />
              {landingSlides.map((slide, index) => (
                <img
                  key={index}
                  src={slide.image}
                  alt={slide.alt}
                  className={`absolute bottom-0 right-[-12%] w-[120%] object-contain object-bottom transition-opacity duration-500 sm:right-[-5%] sm:w-full lg:right-[-28%] lg:w-[155%] lg:max-w-none ${visibleLandingSlide === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  aria-hidden={visibleLandingSlide !== index}
                />
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Webinar dan Pengumuman" className="py-10 lg:py-16 bg-slate-50 px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-10 lg:p-12 shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
              <div
                className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-gradient-to-br from-amber-100/50 via-amber-50/20 to-transparent blur-2xl"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f87171] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      LIVE WEBINAR
                    </span>
                    <span className="text-xs text-slate-500 font-medium inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      Sabtu, 24 Oktober 2026
                    </span>
                    <span className="text-xs text-slate-500 font-medium inline-flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      09.00 - 11.30 WITA
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-extrabold text-[#19355a] tracking-tight leading-snug">
                    Grand Webinar: &quot;Strategi Memilih Jurusan &amp; Menembus Kampus Impian 2027&quot;
                  </h2>

                  <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
                    Temukan bedah tuntas bakat minat bersama Praktisi Edukasi &amp; Dosen Farmasi. Dapatkan pula bocoran beasiswa eksklusif Yayasan Gen-U!
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#284f7a] hover:bg-[#1d3d61] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <Ticket size={16} />
                      <span>Daftar Event Gratis</span>
                    </Link>
                    <a
                      href="#berita"
                      onClick={(e) => scrollToSection(e, '#berita')}
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#284f7a] hover:underline cursor-pointer"
                    >
                      <span>Lihat Berita Lainnya</span>
                      <ChevronRight size={15} />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-200/70 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#19355a] uppercase tracking-wider">
                        <Megaphone size={15} className="text-[#284f7a]" />
                        <span>PENGUMUMAN PENTING</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Diperbarui Hari Ini
                      </span>
                    </div>

                    <div className="space-y-3 mt-3">
                      <div className="bg-white rounded-xl p-3.5 border border-slate-200/60 shadow-sm hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            Beasiswa Prestasi Akademik 2026 Resmi Dibuka!
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                            Baru
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-1">
                          Pendaftaran dibuka hingga 30 November 2026. Kuota terbatas 100...
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-3.5 border border-slate-200/60 shadow-sm hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            Modul Simulasi Kuliah Farmasi Telah Diperbarui
                          </h3>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded shrink-0">
                            Fitur
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-1">
                          Coba pengalaman praktikum lab kefarmasian secara virtual gratis di Ge...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="program" aria-labelledby="program-title" className="py-20 bg-slate-50/70 px-6 md:px-12 lg:py-28 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-blue-600 font-extrabold text-xs tracking-widest uppercase">
                SOROTAN PROGRAM STUDI
              </span>
              <h2 id="program-title" className="mt-3 text-3xl md:text-4xl font-extrabold text-[#19355a] tracking-tight">
                Jelajahi Jurusan
              </h2>
              <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Temukan informasi lengkap mengenai berbagai program studi, mulai dari apa yang dipelajari hingga prospek kerjanya di masa depan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {programsData.map((prog) => {
                const ProgIcon = prog.icon
                return (
                  <div
                    key={prog.id}
                    onClick={() => setSelectedProgram(prog)}
                    className={`rounded-2xl p-8 flex flex-col items-center text-center justify-between transition-all duration-200 cursor-pointer group ${
                      prog.isAvailable
                        ? 'bg-white shadow-xl shadow-slate-200/70 border-t-4 border-[#244b7a] border-x border-b border-slate-100 hover:-translate-y-1'
                        : 'bg-slate-50/80 border border-slate-200/70 relative hover:bg-white hover:shadow-lg'
                    }`}
                  >
                    {!prog.isAvailable && (
                      <span className="absolute top-5 right-5 text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        SEGERA HADIR
                      </span>
                    )}

                    <div className="w-full flex flex-col items-center pt-2">
                      <div
                        className={`flex items-center justify-center mb-6 transition-transform group-hover:scale-105 ${
                          prog.isAvailable
                            ? 'w-16 h-16 rounded-full bg-[#244b7a] text-white shadow-md'
                            : 'w-14 h-14 rounded-full bg-slate-200/80 text-slate-400'
                        }`}
                      >
                        <ProgIcon size={prog.isAvailable ? 28 : 24} />
                      </div>

                      <h3
                        className={`text-lg sm:text-xl font-bold mb-3 ${
                          prog.isAvailable
                            ? 'text-slate-900 group-hover:text-blue-700'
                            : 'text-slate-600'
                        } transition-colors`}
                      >
                        {prog.name}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm leading-relaxed max-w-xs ${
                          prog.isAvailable ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        {prog.cardDesc}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 w-full flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedProgram(prog)
                        }}
                        className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all ${
                          prog.isAvailable
                            ? 'text-blue-700 group-hover:gap-2.5 group-hover:text-blue-900'
                            : 'text-slate-400 group-hover:text-blue-600'
                        }`}
                      >
                        <span>Lihat Detail</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="bakat-minat" aria-labelledby="bakat-minat-title" className="py-20 lg:py-28 bg-white px-6 md:px-12 lg:px-16 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 relative mx-auto w-full max-w-lg lg:max-w-none">
                <div
                  className="absolute -inset-2 sm:-inset-3 bg-[#fed24c] rounded-[2rem] sm:rounded-[2.5rem] -rotate-2 transform transition-transform"
                  aria-hidden="true"
                />
                <div className="relative rounded-[1.75rem] sm:rounded-[2.25rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-100">
                  <img
                    src={landingBakatMinat}
                    alt="Siswa sedang menulis dan menganalisis potensi bakat dan minat"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6">
                <h2 id="bakat-minat-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#19355a] tracking-tight leading-[1.18]">
                  Mengenal Bakat &amp; Minat<br />Kunci Sukses Kuliah
                </h2>
                <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Jangan sampai terjebak fenomena &quot;salah jurusan&quot;. Memahami perbedaan dan irisan antara bakat dan minat adalah langkah pertama menuju karir impian.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Star size={22} className="fill-blue-600 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        Apa itu Bakat?
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        Potensi bawaan atau kemampuan alami seseorang untuk menyerap, memahami, dan menguasai suatu keterampilan dengan lebih cepat dan mudah dibandingkan orang lain. <span className="italic">(What you are good at)</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Heart size={22} className="fill-rose-500 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        Apa itu Minat?
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        Ketertarikan, keinginan, atau gairah yang kuat terhadap suatu bidang atau aktivitas tertentu. Minat adalah sumber motivasi internal yang membuatmu betah belajar atau bekerja berlama-lama tanpa merasa terbebani. <span className="italic">(What you love to do)</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Target size={22} className="text-emerald-600 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        Mengapa Sangat Penting?
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        Memilih jurusan yang memadukan <strong>bakat (kemampuan)</strong> dan <strong>minat (ketertarikan)</strong> akan membuat proses perkuliahan lebih menyenangkan, meminimalisir stres, dan sangat meningkatkan peluangmu untuk sukses berkarir di masa depan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-9">
                  <Link
                    id="btn-bakat-minat-test"
                    href="/student/riasec"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-[#2b527d] hover:bg-[#204064] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Ikuti Tes Bakat Minat Gen-U
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="features-title" className="py-20 lg:py-28 bg-[#f9fafb] px-6 md:px-12 lg:px-16 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 id="features-title" className="text-3xl sm:text-4xl font-extrabold text-[#19355a] tracking-tight">
                Layanan Unggulan Kami
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
                Semua yang kamu butuhkan untuk merencanakan masa depan pendidikan dan karirmu ada di sini.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {[
                {
                  id: 'service-riasec',
                  icon: Compass,
                  iconColor: 'text-[#7c3aed]',
                  iconBg: 'bg-[#ede9fe]',
                  title: 'Tes Minat Bakat',
                  desc: 'Ketahui kecenderungan karir menggunakan metode asesmen terpercaya.',
                },
                {
                  id: 'service-pmb',
                  icon: CheckSquare,
                  iconColor: 'text-[#ea580c]',
                  iconBg: 'bg-[#ffedd5]',
                  title: 'Simulasi PMB',
                  desc: 'Latihan mengisi form penerimaan Mahasiswa Baru dan memahami proses registrasi.',
                },
                {
                  id: 'service-kuliah',
                  icon: GraduationCap,
                  iconColor: 'text-[#2563eb]',
                  iconBg: 'bg-[#dbeafe]',
                  title: 'Simulasi Kuliah',
                  desc: 'Rasakan pengalaman belajar dan atmosfer akademik di bangku perkuliahan secara virtual.',
                },
                {
                  id: 'service-mentoring',
                  icon: Users,
                  iconColor: 'text-[#16a34a]',
                  iconBg: 'bg-[#dcfce7]',
                  title: 'Mentoring',
                  desc: 'Dapatkan sesi mentoring dengan mentor terpercaya dan profesional.',
                },
              ].map((service) => (
                <div
                  key={service.id}
                  id={service.id}
                  className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${service.iconBg} ${service.iconColor} flex items-center justify-center mb-6 shadow-sm`}
                  >
                    <service.icon size={26} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="beasiswa" aria-labelledby="beasiswa-title" className="py-20 lg:py-28 bg-[#f9fafb] px-6 md:px-12 lg:px-16 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="w-12 h-12 rounded-2xl bg-[#fdf5e6] text-[#b8860b] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Medal size={24} />
              </div>
              <h2 id="beasiswa-title" className="text-3xl sm:text-4xl font-extrabold text-[#19355a] tracking-tight">
                Peluang Beasiswa &amp; Bantuan Dana
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
                Wujudkan mimpimu tanpa hambatan biaya. Temukan ratusan peluang beasiswa dari pemerintah, swasta, dan kampus mitra kami.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/50 border border-slate-100 border-l-[5px] border-l-[#f59e0b] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                <div>
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <img
                      src={landingBeasiswaOne}
                      alt="Mahasiswa berdiskusi di perpustakaan"
                      className="w-full sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 aspect-video sm:aspect-square shadow-sm"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                          S1 Dalam Negeri
                        </span>
                        <span className="text-xs text-slate-400 font-medium inline-flex items-center gap-1.5">
                          <Users size={14} className="text-slate-400" />
                          10.000 Kuota
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2.5 mb-0.5">
                        Beasiswa Indonesia Pintar 2027
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">
                        Oleh Kementerian Pendidikan
                      </p>

                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <Check size={16} className="text-amber-500 shrink-0 stroke-[2.5]" />
                          <span>Biaya Pendidikan Penuh (UKT)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={16} className="text-amber-500 shrink-0 stroke-[2.5]" />
                          <span>Uang Saku Bulanan Rp 1.500.000</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Batas Waktu:</span>
                    <span className="text-xs sm:text-sm font-bold text-red-600">
                      28 Februari 2027
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedScholarship({
                        name: 'Beasiswa Indonesia Pintar 2027',
                        organizer: 'Kementerian Pendidikan',
                        tag: 'S1 Dalam Negeri',
                        tagColor: 'bg-emerald-100 text-emerald-700',
                        deadline: '28 Februari 2027',
                        benefits: [
                          'Pembebasan biaya kuliah UKT secara penuh hingga lulus (8 semester)',
                          'Bantuan biaya hidup bulanan sebesar Rp 1.500.000 ditransfer langsung ke rekening',
                          'Akses prioritas program pembinaan dan magang kementerian',
                        ],
                        requirements: [
                          'Siswa SMA/SMK/MA sederajat kelas 12 atau lulusan maksimal 2 tahun sebelumnya.',
                          'Memiliki potensi akademik baik dan keterbatasan ekonomi yang didukung dokumen sah.',
                          'Terdaftar dalam Data Terpadu Kesejahteraan Sosial (DTKS) atau pemegang KIP/KKS.',
                          'Lolos seleksi masuk perguruan tinggi negeri maupun swasta mitra.',
                        ],
                        documents: [
                          'Kartu Peserta KIP Kuliah / Akun Kemendikbud',
                          'Kartu Keluarga (KK) & KTP / Kartu Pelajar',
                          'Rapor semester 1 hingga 5 yang dilegalisir sekolah',
                          'Surat Keterangan Penghasilan Orang Tua dari kelurahan/desa',
                        ],
                      })
                    }
                    className="px-6 py-2.5 rounded-xl bg-[#284f7a] hover:bg-[#1d3d61] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-colors cursor-pointer"
                  >
                    Lihat Syarat
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/50 border border-slate-100 border-l-[5px] border-l-[#284f7a] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                <div>
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <img
                      src={landingBeasiswaTwo}
                      alt="Mahasiswa tersenyum di taman kampus"
                      className="w-full sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 aspect-video sm:aspect-square shadow-sm"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
                          Mahasiswa Aktif
                        </span>
                        <span className="text-xs text-slate-400 font-medium inline-flex items-center gap-1.5">
                          <Users size={14} className="text-slate-400" />
                          500 Kuota
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2.5 mb-0.5">
                        Gen-U Future Leaders Program
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">
                        Oleh Yayasan Generasi Universal
                      </p>

                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <Check size={16} className="text-blue-600 shrink-0 stroke-[2.5]" />
                          <span>Bantuan Dana Rp 10.000.000 / Semester</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={16} className="text-blue-600 shrink-0 stroke-[2.5]" />
                          <span>Program Mentoring Eksklusif 1 Tahun</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Batas Waktu:</span>
                    <span className="text-xs sm:text-sm font-bold text-red-600">
                      15 Januari 2027
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedScholarship({
                        name: 'Gen-U Future Leaders Program',
                        organizer: 'Yayasan Generasi Universal',
                        tag: 'Mahasiswa Aktif',
                        tagColor: 'bg-blue-100 text-blue-700',
                        deadline: '15 Januari 2027',
                        benefits: [
                          'Bantuan dana pendidikan Rp 10.000.000 per semester untuk biaya kuliah & riset',
                          'Pendampingan mentorship 1-on-1 intensif selama 1 tahun bersama profesional industri',
                          'Akses jaringan alumni global dan peluang project leadership berskala nasional',
                        ],
                        requirements: [
                          'Mahasiswa aktif semester 1 hingga 6 jenjang D4/S1 di seluruh universitas Indonesia.',
                          'Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.25 dari skala 4.00.',
                          'Aktif dalam kegiatan organisasi, riset inovasi, kepanitiaan, atau pengabdian masyarakat.',
                          'Berkomitmen mengikuti seluruh rangkaian pembinaan kepemimpinan berkala.',
                        ],
                        documents: [
                          'Transkrip nilai semester terbaru yang dilegalisir',
                          'Curriculum Vitae (CV) atau portofolio kegiatan kemahasiswaan',
                          'Esai kepemimpinan dan rencana kontribusi masa depan (maksimal 500 kata)',
                          'Surat keterangan aktif kuliah dari pihak fakultas / program studi',
                        ],
                      })
                    }
                    className="px-6 py-2.5 rounded-xl bg-[#284f7a] hover:bg-[#1d3d61] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-colors cursor-pointer"
                  >
                    Lihat Syarat
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border-2 border-[#284f7a] text-[#284f7a] bg-white font-bold text-sm shadow-sm hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <span>Cari Beasiswa Lainnya</span>
                <Search size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section id="berita" aria-labelledby="berita-title" className="py-20 bg-slate-50 px-6 md:px-12 lg:py-28 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-800">
                <Newspaper size={14} className="text-indigo-600" />
                Kabar &amp; Edukasi
              </span>
              <h2 id="berita-title" className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Artikel &amp; Panduan Menuju Kampus
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
                Wawasan terkini seputar persiapan masuk perguruan tinggi, tips memilih peminatan, dan strategi karier masa depan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Panduan Lengkap Memilih Jurusan Kuliah Sesuai Tipe Kepribadian RIASEC',
                  category: 'Tips Minat Bakat',
                  date: '18 Oktober 2026',
                  readTime: '5 Menit Baca',
                  summary: 'Memilih jurusan bukan sekadar mengikuti tren, melainkan menyelaraskan antara ketertarikan alami, gaya berpikir, dan peluang masa depan.',
                },
                {
                  title: 'Strategi Mempersiapkan Dokumen & Portofolio Seleksi Masuk Perguruan Tinggi',
                  category: 'Info PMB',
                  date: '15 Oktober 2026',
                  readTime: '4 Menit Baca',
                  summary: 'Langkah taktis menyusun berkas administrasi, esai motivasi, dan sertifikat prestasi agar peluang diterima semakin besar.',
                },
                {
                  title: 'Mengenal Perbedaan Jalur Sarjana (S1), Sarjana Terapan (D4), dan Diploma (D3)',
                  category: 'Eksplorasi Studi',
                  date: '10 Oktober 2026',
                  readTime: '6 Menit Baca',
                  summary: 'Pahami perbedaan bobot teori dan praktik antar jenjang pendidikan agar tidak salah menentukan target kuliah sesuai passionmu.',
                },
              ].map((article, idx) => (
                <article
                  key={idx}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar size={12} /> {article.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-blue-700 transition-colors mb-3">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{article.readTime}</span>
                    <span className="text-blue-700 group-hover:underline flex items-center gap-1 font-bold">
                      Baca Artikel <ChevronRight size={13} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>


        <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-blue-50 px-6 py-20 md:px-12 lg:py-28 scroll-mt-20">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-200"
            aria-hidden="true"
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative order-2 pb-5 lg:order-1">
              <div className="absolute -bottom-3 -left-5 h-4/5 w-4/5 rounded-[3rem] bg-yellow-300" aria-hidden="true" />
              <div className="relative -rotate-2 overflow-hidden rounded-3xl border-8 border-white shadow-xl">
                <img
                  src={landingAboutCampus}
                  alt="Mahasiswa berbincang bersama di lingkungan kampus perkuliahan"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <span className="absolute -bottom-2 right-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-900 shadow-lg sm:right-6">
                Mengenal diri. Menemukan arah.
              </span>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-800">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                Tentang Kami
              </span>
              <h2 id="about-title" className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-blue-950 sm:text-5xl">
                Gen-U, temanmu menuju kampus.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                Gen-U adalah platform interaktif yang dirancang untuk membantu siswa mengenali minat dan bakat, sekaligus menjelajahi kehidupan kampus. Temukan jurusan yang cocok, kenali dunia perkuliahan, dan melangkah menuju masa depan dengan lebih percaya diri.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-blue-900">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2">
                  <Compass size={16} /> Kenali potensimu
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2">
                  <GraduationCap size={16} /> Jelajahi dunia kampus
                </span>
              </div>
              <a
                id="btn-about-features"
                href="#features"
                onClick={(e) => scrollToSection(e, '#features')}
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-900 cursor-pointer"
              >
                Lihat fitur Gen-U <ChevronRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="testimonial-title" className="py-20 lg:py-28 bg-[#214a77] text-white px-6 md:px-12 lg:px-16 relative overflow-hidden">
          <div className="pointer-events-none absolute left-6 sm:left-12 top-6 font-serif text-[130px] sm:text-[180px] font-black text-white/10 select-none leading-none -translate-y-6 sm:-translate-y-10" aria-hidden="true">
            &ldquo;
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="testimonial-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Kata Mereka yang Sudah Bergabung
              </h2>
              <p className="mt-3.5 text-blue-100/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Kisah sukses para siswa menemukan jalur yang tepat bersama Gen-U.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-7 border border-white/15 shadow-lg flex flex-col justify-between h-full">
                <div className="flex items-center gap-3.5">
                  <img
                    src={avatarSarah}
                    alt="Sarah Amanda"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-400/90 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base">Sarah Amanda</h3>
                    <p className="text-xs text-blue-200/90">Mahasiswa Psikologi UI</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-blue-100/95 leading-relaxed italic mt-5">
                  &quot;Dulu aku bingung banget mau milih Ilmu Komunikasi atau Psikologi. Setelah ikut tes di Gen-U dan baca database jurusannya, aku makin mantap pilih Psikologi. Valid banget!&quot;
                </p>
              </div>

              <div className="bg-white text-slate-800 rounded-3xl p-8 shadow-2xl border border-white/20 flex flex-col justify-between h-full transform md:-translate-y-2">
                <div className="flex items-center gap-3.5">
                  <img
                    src={avatarBudi}
                    alt="Budi Santoso"
                    className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Budi Santoso</h3>
                    <p className="text-xs text-slate-400">Siswa Kelas 12 SMAN 1</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mt-5">
                  &quot;Fitur perbandingan kampus nya juara. Aku bisa lihat jelas rincian biaya UKT dan prospek kerja dari masing-masing kampus incaran aku. UI-nya juga gampang banget dipakai.&quot;
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-7 border border-white/15 shadow-lg flex flex-col justify-between h-full">
                <div className="flex items-center gap-3.5">
                  <img
                    src={avatarDina}
                    alt="Dina Amelia"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-400/90 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base">Dina Amelia</h3>
                    <p className="text-xs text-blue-200/90">Mahasiswa Sistem Informasi</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-blue-100/95 leading-relaxed italic mt-5">
                  &quot;Gak nyangka hasil tesnya seakurat itu nebak kepribadian aku. Konselor Gen-U juga ramah banget jelasin hasil tes dan kasih opsi jurusan yang sesuai dengan passing grade raporku.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer id="narahubung" className="bg-[#283e5a] text-slate-300 relative scroll-mt-10">
        <div className="bg-gradient-to-b from-[#1b3d68] via-[#224773] to-[#283e5a] py-20 lg:py-24 px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Siap Menentukan Masa Depanmu?
            </h2>
            <p className="mt-4 text-blue-100/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan siswa lainnya yang telah menemukan jalan sukses mereka bersama Generasi Universal.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                id="btn-cta-register"
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#fcd34d] hover:bg-[#fbbf24] text-slate-900 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
              >
                Buat Akun Gratis
              </Link>
              <a
                id="btn-cta-learn-more"
                href="#about"
                onClick={(e) => scrollToSection(e, '#about')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/80 hover:bg-white/10 text-white font-bold text-sm sm:text-base transition-colors bg-[#294a73]/60 cursor-pointer"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-14 pb-12 px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-14">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <GraduationCap size={28} className="text-white" />
                <span className="text-xl font-bold tracking-tight">Gen-U</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
                Platform pendidikan terintegrasi yang membantu generasi muda Indonesia menemukan potensi sejati mereka dan merencanakan karir masa depan.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-[#1c2c42] flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-full bg-[#1c2c42] flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-[#1c2c42] flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-[#1c2c42] flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h3 className="text-white font-semibold text-sm sm:text-base">Layanan</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <a href="#bakat-minat" onClick={(e) => scrollToSection(e, '#bakat-minat')} className="hover:text-white transition-colors cursor-pointer">
                    Tes Bakat &amp; Minat
                  </a>
                </li>
                <li>
                  <a href="#program" onClick={(e) => scrollToSection(e, '#program')} className="hover:text-white transition-colors cursor-pointer">
                    Simulasi PMB
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="hover:text-white transition-colors cursor-pointer">
                    Simulasi Kuliah
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="hover:text-white transition-colors cursor-pointer">
                    Mentoring
                  </a>
                </li>
                <li>
                  <a href="#beasiswa" onClick={(e) => scrollToSection(e, '#beasiswa')} className="hover:text-white transition-colors cursor-pointer">
                    Informasi Beasiswa
                  </a>
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

          <div className="border-t border-slate-600/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>&copy; 2026 Generasi Universal (Gen-U). All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-slate-200 transition-colors">
                Syarat &amp; Ketentuan
              </Link>
              <Link href="#" className="hover:text-slate-200 transition-colors">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {selectedProgram && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-program-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-7 pb-4 px-6 sm:px-8 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="text-center sm:text-left w-full sm:w-auto">
                <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 uppercase tracking-widest px-3.5 py-1 rounded-full mb-2">
                  Detail Program Studi
                </span>
                <h3 id="modal-program-title" className="text-2xl sm:text-3xl font-extrabold text-[#152e4d] tracking-tight">
                  Mengenal {selectedProgram.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                aria-label="Tutup Detail Program"
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-5 flex flex-col gap-5">
                  <div className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:border-blue-200 transition-colors flex-1">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 shadow-sm">
                      <selectedProgram.icon size={22} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2.5">
                      Apa itu {selectedProgram.name}?
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {selectedProgram.about}
                    </p>
                  </div>

                  <div className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:border-amber-200 transition-colors flex-1">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-sm">
                      <GraduationCap size={22} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2.5">
                      Gelar Akademik
                    </h4>
                    <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2.5">
                      <p>{selectedProgram.degree}</p>
                      <p>{selectedProgram.degreeNote}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-gradient-to-br from-[#274872] via-[#1f3a5e] to-[#172d4a] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
                      <Briefcase size={22} className="text-amber-400" />
                      <h4 className="text-xl font-bold tracking-tight text-white">
                        Prospek Karir
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {selectedProgram.careerProspects.map((cp, idx) => {
                        const CpIcon = cp.icon
                        return (
                          <div
                            key={idx}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all flex flex-col"
                          >
                            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center mb-2.5">
                              <CpIcon size={16} />
                            </div>
                            <h5 className="font-bold text-white text-sm mb-1.5 leading-snug">
                              {cp.title}
                            </h5>
                            <p className="text-xs text-blue-100/80 leading-relaxed">
                              {cp.desc}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-200/80">
                    <span>* Prospek kerja terhubung dengan jejaring alumni &amp; mitra industri</span>
                    <button
                      type="button"
                      onClick={() => setSelectedProgram(null)}
                      className="px-4 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
                <span className={`inline-block text-[11px] font-bold px-3 py-0.5 rounded-full mb-1.5 ${selectedScholarship.tagColor}`}>
                  {selectedScholarship.tag}
                </span>
                <h3 id="modal-scholarship-title" className="text-xl sm:text-2xl font-extrabold text-[#152e4d] tracking-tight">
                  {selectedScholarship.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedScholarship.organizer}</p>
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
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  Benefit &amp; Cakupan Dana
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {selectedScholarship.benefits.map((b: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">Persyaratan Umum:</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {selectedScholarship.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">Dokumen yang Diperlukan:</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {selectedScholarship.documents.map((doc: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
                <span>Batas Waktu Pendaftaran:</span>
                <strong className="text-red-600 font-bold">{selectedScholarship.deadline}</strong>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setSelectedScholarship(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-xl bg-[#284f7a] hover:bg-[#1d3d61] text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
