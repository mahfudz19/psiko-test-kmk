import React, { useEffect, useState } from 'react'
import { Head, Link } from '@inertiajs/react'
const landingPersonOne = '/landing-person-1.png'
const landingPersonTwo = '/landing-person-2.png'
const landingPersonThree = '/landing-person-3.png'
const landingAboutCampus = '/landing-about-campus.jpg'
const landingBakatMinat = '/landing-bakat-minat.jpg'
const landingBeasiswaOne = '/landing-beasiswa-1.jpg'
const landingBeasiswaTwo = '/landing-beasiswa-2.jpg'

import {
  GraduationCap,
  Compass,
  BookOpen,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
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
  ExternalLink,
} from 'lucide-react'
import { Testimonial, getPublishedTestimonials } from '../services/testimonialService'
import ScrollReveal from '../components/ui/ScrollReveal'

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

interface TestimonialItem {
  id: number | string
  name: string
  role: string
  rating: number
  content: string
  avatar?: string | null
  user?: {
    avatar?: string | null
  }
  is_published?: boolean
  isPublished?: boolean
}

interface LandingProps {
  majors?: any[]
  testimonials?: TestimonialItem[]
  studyPrograms?: any[]
  scholarships?: any[]
  webinar?: any | null
  announcements?: any[]
  news?: any[]
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
  return sch.tag_color || sch.tagColor || 'bg-blue-100 text-blue-700'
}

export default function Landing({
  testimonials: serverTestimonials = [],
  studyPrograms: serverStudyPrograms = [],
  scholarships: serverScholarships = [],
  webinar: serverWebinar = null,
  announcements: serverAnnouncements = [],
  news: serverNews = [],
}: LandingProps) {
  const effectiveNews = (serverNews && serverNews.length > 0)
    ? serverNews.slice(0, 3)
    : []
  const effectiveScholarships = (serverScholarships && serverScholarships.length > 0)
    ? serverScholarships.slice(0, 2)
    : []
  const effectivePrograms = (serverStudyPrograms && serverStudyPrograms.length > 0)
    ? serverStudyPrograms.map((p) => ({
      id: String(p.id),
      name: p.name,
      isAvailable: !p.status || p.status.includes('Aktif'),
      cardDesc: p.short_description || '',
      iconUrl: p.icon || null,
      icon: FlaskConical,
      about: p.detailed_description || p.short_description || '',
      degree: p.academic_degree ? `Lulusan program studi ini akan memperoleh gelar akademik ${p.academic_degree}.` : '',
      degreeNote: '',
      careerProspects: (Array.isArray(p.career_prospects) ? p.career_prospects : []).map((cp: any) => ({
        title: cp.name || cp.title || '',
        desc: cp.description || cp.desc || '',
        iconUrl: cp.icon || null,
        icon: Building2,
      })),
    }))
    : programsData
  const [landingSlide, setLandingSlide] = useState(0)
  const visibleLandingSlide = landingSlide % landingSlides.length

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [selectedProgram, setSelectedProgram] = useState<ProgramDetail | null>(null)
  const [selectedScholarship, setSelectedScholarship] = useState<any | null>(null)
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(serverTestimonials || [])
  const [testimonialPage, setTestimonialPage] = useState(0)

  const getInitials = (name: string) => {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  useEffect(() => {
    if (serverTestimonials && serverTestimonials.length > 0) {
      setTestimonials(serverTestimonials)
      return
    }
    fetch('/api/testimonials/published')
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data)
        }
      })
      .catch(() => { })
  }, [serverTestimonials])

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
      const scrollPosition = window.scrollY + 110
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
          ? 'bg-[#0e4477]/95 backdrop-blur-md shadow-md py-3 border-b border-white/10 text-white'
          : 'bg-transparent py-4 text-white'
          }`}
      >
        <nav id="landing-navbar" aria-label="Navigasi Utama" className="mx-auto flex max-w-7xl 2xl:max-w-[90rem] items-center justify-between">
          <Link href="/" id="brand-logo" className="flex items-center gap-2 shrink-0 group">
            <div className="rounded-lg p-1.5 text-white bg-white/10 transition-transform duration-300 group-hover:scale-105 group-hover:bg-white/20">
              <GraduationCap size={20} />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight">Gen-U</span>
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
                  className={`relative transition-colors duration-200 cursor-pointer py-1 whitespace-nowrap after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-amber-300 after:transition-all after:duration-300 ${isActive
                    ? 'text-white font-bold after:w-full'
                    : 'text-slate-300 font-normal hover:text-white after:w-0 hover:after:w-1/2'
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
              className="rounded-xl px-4 py-1.5 text-xs xl:text-sm font-semibold transition-all duration-200 hover:bg-white/15"
            >
              Masuk
            </Link>
            <Link
              id="btn-register"
              href="/register"
              className="rounded-xl border border-white/80 px-4 py-1.5 text-xs xl:text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-blue-900 hover:shadow-md bg-white/10"
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
              className="p-1.5 text-white hover:text-yellow-300 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#0e4477] border-b border-white/10 shadow-2xl px-5 py-4 space-y-2.5 animate-mobile-menu text-white">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace('#', '')
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={`py-1.5 text-xs border-b border-white/5 transition-colors cursor-pointer ${isActive
                      ? 'text-white font-bold'
                      : 'text-slate-300 font-normal hover:text-white'
                      }`}
                  >
                    {item.label}
                  </a>
                )
              })}
            </div>
            <div className="pt-1.5 flex gap-2.5">
              <Link
                href="/login"
                className="flex-1 text-center py-2 rounded-lg bg-white/10 text-white font-bold text-xs transition hover:bg-white/20"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2 rounded-lg bg-yellow-400 text-blue-950 font-bold text-xs shadow-md transition hover:bg-yellow-300"
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
          className="relative flex min-h-dvh lg:h-dvh overflow-hidden bg-[#11518e] px-6 pt-20 lg:pt-16 text-white md:px-10 lg:px-14"
        >
          <div
            className="pointer-events-none absolute -bottom-36 -left-36 h-[42dvh] w-[42dvh] rounded-full border border-white/20 animate-ring-pulse"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-28 -left-28 h-[42dvh] w-[42dvh] rounded-full border border-white/20 animate-ring-pulse"
            style={{ animationDelay: '1.8s' }}
            aria-hidden="true"
          />
          <div className="mx-auto grid w-full max-w-7xl 2xl:max-w-[90rem] flex-1 grid-rows-[1fr_auto] gap-4 lg:grid-rows-1 lg:grid-cols-[58%_42%] lg:gap-6">
            <div className="relative z-20 self-center py-4 lg:py-6">
              <div key={visibleLandingSlide} className="animate-hero-enter">
                <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:w-max lg:max-w-[56vw] lg:text-[clamp(2.2rem,min(3.9vw,7.4dvh),4.25rem)]">
                  {landingSlides[visibleLandingSlide].title}
                </h1>
                <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base lg:mt-[2.6dvh] lg:max-w-[46vw] lg:text-[clamp(0.9rem,min(1.2vw,2.35dvh),1.15rem)] xl:max-w-2xl">
                  Generasi Universal akan membantu kamu menemukan jurusan, mengenal bakat dan minat, serta memperoleh informasi kampus secara lengkap dalam satu platform.
                </p>
              </div>
              <div className="mt-5 flex flex-col items-start gap-2.5 sm:flex-row lg:mt-[3.6dvh] lg:flex-col lg:gap-[1.6dvh]">
                <Link
                  id="btn-hero-explore-majors"
                  href="/student/jurusan"
                  className="min-w-56 rounded-xl border-[2.5px] border-white px-6 py-2.5 text-center text-xs sm:text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-blue-900 hover:shadow-lg active:translate-y-0 lg:min-w-64 lg:py-[1.35dvh] lg:text-[clamp(0.85rem,min(1.1vw,2.1dvh),1.05rem)]"
                >
                  JELAJAHI JURUSAN
                </Link>
                <Link
                  id="btn-hero-riasec-test"
                  href="/student/riasec"
                  className="min-w-56 rounded-xl border-[2.5px] border-white px-6 py-2.5 text-center text-xs sm:text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-blue-900 hover:shadow-lg active:translate-y-0 lg:min-w-64 lg:py-[1.35dvh] lg:text-[clamp(0.85rem,min(1.1vw,2.1dvh),1.05rem)]"
                >
                  KENALI BAKAT MINATMU
                </Link>
              </div>
              <div className="mt-5 flex items-center gap-2 lg:mt-[3.4dvh]" role="group" aria-label="Pilih slide landing page">
                {landingSlides.map((_, index) => (
                  <button
                    key={index}
                    id={`btn-slide-indicator-${index + 1}`}
                    type="button"
                    onClick={() => setLandingSlide(index)}
                    aria-label={`Tampilkan slide ${index + 1}`}
                    aria-current={visibleLandingSlide === index ? 'true' : undefined}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${visibleLandingSlide === index ? 'w-7 bg-white' : 'w-2.5 bg-blue-950/40 hover:bg-white/60'
                      }`}
                  />
                ))}
              </div>
            </div>
            <div className="relative min-h-60 self-stretch sm:min-h-72 lg:static" aria-live="off">
              <div
                className="pointer-events-none absolute bottom-[-18%] right-[-24%] z-0 aspect-square w-[115%] rounded-full bg-[#ffe45c] sm:right-[-12%] sm:w-[95%] lg:bottom-[-24dvh] lg:right-[-12dvh] lg:h-[min(92dvh,48vw)] lg:w-[min(92dvh,48vw)]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute right-2 top-3 z-0 h-11 w-11 rounded-full bg-[#ffe45c] animate-float-slow lg:right-[6dvh] lg:top-[18dvh] lg:h-[7.5dvh] lg:w-[7.5dvh]"
                aria-hidden="true"
              />
              {landingSlides.map((slide, index) => (
                <img
                  key={index}
                  src={slide.image}
                  alt={slide.alt}
                  className={`pointer-events-none absolute bottom-0 right-[-8%] z-10 max-h-[95%] w-[105%] object-contain object-bottom transition-[opacity,transform] duration-700 ease-out sm:right-0 sm:w-[82%] lg:right-[-8dvh] lg:h-[min(74dvh,42vw)] lg:max-h-none lg:w-auto lg:max-w-none ${visibleLandingSlide === index ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-[0.98]'
                    }`}
                  aria-hidden={visibleLandingSlide !== index}
                />
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Webinar dan Pengumuman" className="pt-5 pb-3 lg:pt-6 lg:pb-3 bg-slate-50 px-5 md:px-10 lg:px-14">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up" duration={650}>
              <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md shadow-slate-200/50 border border-slate-100 relative overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <div
                  className="pointer-events-none absolute -top-12 -right-12 w-56 h-56 rounded-full bg-gradient-to-br from-amber-100/50 via-amber-50/20 to-transparent blur-2xl"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center relative z-10">
                  <div className="lg:col-span-7">
                    {serverWebinar ? (
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-2.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f87171] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            {serverWebinar.badge_label || 'LIVE WEBINAR'}
                          </span>
                          {serverWebinar.event_date && (
                            <span className="text-[11px] text-slate-500 font-medium inline-flex items-center gap-1">
                              <Calendar size={12} className="text-slate-400" />
                              {serverWebinar.event_date}
                            </span>
                          )}
                          {serverWebinar.event_time && (
                            <span className="text-[11px] text-slate-500 font-medium inline-flex items-center gap-1">
                              <Clock size={12} className="text-slate-400" />
                              {serverWebinar.event_time}
                            </span>
                          )}
                        </div>

                        <Link href={`/berita/${serverWebinar.slug}`} className="group block">
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#19355a] group-hover:text-blue-700 transition-colors tracking-tight leading-snug">
                            {serverWebinar.title}
                          </h2>
                        </Link>

                        {serverWebinar.excerpt && (
                          <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-xl line-clamp-2">
                            {serverWebinar.excerpt}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          {serverWebinar.event_link ? (
                            serverWebinar.event_link.startsWith('http://') || serverWebinar.event_link.startsWith('https://') ? (
                              <a
                                href={serverWebinar.event_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#284f7a] hover:bg-[#1d3d61] hover:-translate-y-0.5 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                              >
                                <Ticket size={14} />
                                <span>Daftar Event Gratis</span>
                                <ExternalLink size={12} />
                              </a>
                            ) : (
                              <Link
                                href={serverWebinar.event_link}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#284f7a] hover:bg-[#1d3d61] hover:-translate-y-0.5 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                              >
                                <Ticket size={14} />
                                <span>Daftar Event Gratis</span>
                              </Link>
                            )
                          ) : (
                            <Link
                              href={`/berita/${serverWebinar.slug}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#284f7a] hover:bg-[#1d3d61] hover:-translate-y-0.5 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                              <Ticket size={14} />
                              <span>Daftar Event Gratis</span>
                            </Link>
                          )}
                          <Link
                            href="/berita"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#284f7a] hover:underline group cursor-pointer"
                          >
                            <span>Lihat Berita Lainnya</span>
                            <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="py-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-2.5">
                          <Ticket size={12} className="text-slate-400" />
                          <span>Webinar Mendatang</span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-extrabold text-[#19355a] tracking-tight leading-snug">
                          Belum Ada Agenda Live Webinar
                        </h2>
                        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-xl">
                          Nantikan jadwal sesi webinar dan workshop interaktif seputar pemilihan jurusan dan persiapan kampus berikutnya di Gen-U.
                        </p>
                        <div className="mt-3.5 flex items-center gap-3">
                          <Link
                            href="/berita"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#284f7a] hover:underline group cursor-pointer"
                          >
                            <span>Lihat Berita Lainnya</span>
                            <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-5">
                    <div className="bg-[#f8fafc] rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#19355a] uppercase tracking-wider">
                          <Megaphone size={13} className="text-[#284f7a]" />
                          <span>PENGUMUMAN PENTING</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Diperbarui
                        </span>
                      </div>

                      {serverAnnouncements.length > 0 ? (
                        <div className="space-y-2 mt-2.5">
                          {serverAnnouncements.map((ann: any) => (
                            <Link
                              key={ann.id}
                              href={`/berita/${ann.slug}`}
                              className="block bg-white rounded-lg p-2.5 border border-slate-200/60 shadow-2xs hover:border-blue-300 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-1">
                                  {ann.title}
                                </h3>
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                                  {ann.badge_label || 'Penting'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                                {ann.excerpt || 'Klik untuk membaca detail pengumuman selengkapnya...'}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="py-5 text-center bg-white rounded-lg border border-slate-200/50 mt-2.5 p-3">
                          <p className="text-xs text-slate-400">Belum ada pengumuman baru saat ini.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="program" aria-labelledby="program-title" className="py-5 bg-slate-50/70 px-5 md:px-10 lg:px-14 lg:py-7 scroll-mt-14">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up" className="text-center mb-4">
              <span className="text-blue-600 font-extrabold text-[10px] tracking-widest uppercase">
                SOROTAN PROGRAM STUDI
              </span>
              <h2 id="program-title" className="mt-1 text-xl sm:text-2xl lg:text-[1.6rem] font-extrabold text-[#19355a] tracking-tight">
                Jelajahi Jurusan
              </h2>
              <p className="mt-1 text-slate-500 max-w-xl mx-auto text-xs sm:text-[13px] leading-relaxed">
                Temukan informasi lengkap mengenai berbagai program studi, mulai dari apa yang dipelajari hingga prospek kerjanya di masa depan.
              </p>
            </ScrollReveal>

            <div className="flex flex-wrap justify-center gap-3.5 lg:gap-4 items-stretch">
              {effectivePrograms.map((prog: any, idx: number) => {
                const ProgIcon = prog.icon
                return (
                  <ScrollReveal
                    key={prog.id}
                    direction="up"
                    delay={idx * 85}
                    className="w-full sm:w-[calc(50%-0.4375rem)] lg:w-[calc(25%-0.75rem)] flex"
                  >
                    <div
                      onClick={() => setSelectedProgram(prog)}
                      className={`w-full flex-1 rounded-xl p-4 flex flex-col items-center text-center justify-between transition-all duration-300 cursor-pointer group ${prog.isAvailable
                        ? 'bg-white shadow-sm shadow-slate-200/70 border-t-[3px] border-[#244b7a] border-x border-b border-slate-100 hover:-translate-y-1.5 hover:shadow-lg'
                        : 'bg-slate-50/80 border border-slate-200/70 relative hover:bg-white hover:-translate-y-1 hover:shadow-md'
                        }`}
                    >
                      {!prog.isAvailable && (
                        <span className="absolute top-2.5 right-2.5 text-[8px] font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          SEGERA HADIR
                        </span>
                      )}

                      <div className="w-full flex flex-col items-center pt-0.5">
                        {prog.iconUrl ? (
                          <img
                            src={prog.iconUrl}
                            alt={prog.name}
                            className={`${prog.isAvailable ? 'w-9 h-9' : 'w-8 h-8'
                              } rounded-full object-cover mb-2.5 transition-transform duration-300 group-hover:scale-110 shadow-2xs`}
                          />
                        ) : (
                          <div
                            className={`flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110 ${prog.isAvailable
                              ? 'w-9 h-9 rounded-full bg-[#244b7a] text-white shadow-2xs'
                              : 'w-8 h-8 rounded-full bg-slate-200/80 text-slate-400'
                              }`}
                          >
                            <ProgIcon size={prog.isAvailable ? 17 : 15} />
                          </div>
                        )}

                        <h3
                          className={`text-xs sm:text-sm font-bold mb-1 leading-snug ${prog.isAvailable
                            ? 'text-slate-900 group-hover:text-blue-700'
                            : 'text-slate-600'
                            } transition-colors duration-200`}
                        >
                          {prog.name}
                        </h3>

                        <p
                          className={`text-[11px] sm:text-xs leading-snug line-clamp-3 ${prog.isAvailable ? 'text-slate-500' : 'text-slate-400'
                            }`}
                        >
                          {prog.cardDesc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 w-full flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProgram(prog)
                          }}
                          className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold transition-all duration-200 ${prog.isAvailable
                            ? 'text-blue-700 group-hover:text-blue-900'
                            : 'text-slate-400 group-hover:text-blue-600'
                            }`}
                        >
                          <span>Lihat Detail</span>
                          <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>

        <section id="bakat-minat" aria-labelledby="bakat-minat-title" className="py-6 lg:py-7 bg-white px-5 md:px-10 lg:px-14 scroll-mt-14 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              <ScrollReveal direction="left" className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none group">
                <div
                  className="absolute -inset-1.5 sm:-inset-2 bg-[#fed24c] rounded-2xl sm:rounded-3xl -rotate-2 transform transition-transform duration-500 group-hover:rotate-0"
                  aria-hidden="true"
                />
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-4 border-white aspect-[4/3] max-h-[265px] w-full bg-slate-100">
                  <img
                    src={landingBakatMinat}
                    alt="Siswa sedang menulis dan menganalisis potensi bakat dan minat"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={100} className="lg:col-span-7">
                <h2 id="bakat-minat-title" className="text-xl sm:text-2xl lg:text-[1.6rem] font-extrabold text-[#19355a] tracking-tight leading-snug">
                  Mengenal Bakat &amp; Minat, Kunci Sukses Kuliah
                </h2>
                <p className="mt-1.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-xl">
                  Jangan sampai terjebak fenomena &quot;salah jurusan&quot;. Memahami perbedaan dan irisan antara bakat dan minat adalah langkah pertama menuju karir impian.
                </p>

                <div className="mt-3 space-y-2.5">
                  <div className="flex items-start gap-3 group/item">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 transition-transform duration-300 group-hover/item:scale-110">
                      <Star size={15} className="fill-blue-600 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                        Apa itu Bakat?
                      </h3>
                      <p className="text-xs text-slate-600 leading-snug mt-0.5">
                        Potensi bawaan atau kemampuan alami seseorang untuk menyerap, memahami, dan menguasai suatu keterampilan dengan lebih cepat dan mudah dibandingkan orang lain. <span className="italic">(What you are good at)</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 transition-transform duration-300 group-hover/item:scale-110">
                      <Heart size={15} className="fill-rose-500 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                        Apa itu Minat?
                      </h3>
                      <p className="text-xs text-slate-600 leading-snug mt-0.5">
                        Ketertarikan, keinginan, atau gairah yang kuat terhadap suatu bidang atau aktivitas tertentu yang menjadi sumber motivasi internal dalam belajar atau bekerja. <span className="italic">(What you love to do)</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 transition-transform duration-300 group-hover/item:scale-110">
                      <Target size={15} className="text-emerald-600 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                        Mengapa Sangat Penting?
                      </h3>
                      <p className="text-xs text-slate-600 leading-snug mt-0.5">
                        Memilih jurusan yang memadukan <strong>bakat (kemampuan)</strong> dan <strong>minat (ketertarikan)</strong> membuat proses perkuliahan lebih menyenangkan dan meningkatkan peluang sukses berkarir.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    id="btn-bakat-minat-test"
                    href="/student/riasec"
                    className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-[#2b527d] hover:bg-[#204064] hover:-translate-y-0.5 text-white font-bold text-xs sm:text-[13px] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    Ikuti Tes Bakat Minat Gen-U
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="features-title" className="py-6 lg:py-7 bg-[#f9fafb] px-5 md:px-10 lg:px-14 scroll-mt-14">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up" className="text-center mb-4">
              <h2 id="features-title" className="text-xl sm:text-2xl lg:text-[1.6rem] font-extrabold text-[#19355a] tracking-tight">
                Layanan Unggulan Kami
              </h2>
              <p className="mt-1 text-xs sm:text-[13px] text-slate-500 max-w-xl mx-auto leading-relaxed">
                Semua yang kamu butuhkan untuk merencanakan masa depan pendidikan dan karirmu ada di sini.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4 items-stretch">
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
              ].map((service, idx) => (
                <ScrollReveal key={service.id} direction="up" delay={idx * 85} className="h-full">
                  <div
                    id={service.id}
                    className="h-full bg-white rounded-xl p-4 border border-slate-200/60 shadow-2xs hover:shadow-lg hover:border-blue-200/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start group"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg ${service.iconBg} ${service.iconColor} flex items-center justify-center mb-2.5 shadow-2xs transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                    >
                      <service.icon size={18} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 transition-colors duration-200 group-hover:text-blue-800">
                      {service.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
                      {service.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="beasiswa" aria-labelledby="beasiswa-title" className="py-6 lg:py-7 bg-white px-5 md:px-10 lg:px-14 scroll-mt-14">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up" className="text-center mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#fdf5e6] text-[#b8860b] flex items-center justify-center mx-auto mb-1.5 shadow-2xs">
                <Medal size={16} />
              </div>
              <h2 id="beasiswa-title" className="text-xl sm:text-2xl lg:text-[1.6rem] font-extrabold text-[#19355a] tracking-tight">
                Peluang Beasiswa &amp; Bantuan Dana
              </h2>
              <p className="mt-1 text-xs sm:text-[13px] text-slate-500 max-w-xl mx-auto leading-relaxed">
                Wujudkan mimpimu tanpa hambatan biaya. Temukan ratusan peluang beasiswa dari pemerintah, swasta, dan kampus mitra kami.
              </p>
            </ScrollReveal>

            {effectiveScholarships.length === 0 ? (
              <ScrollReveal direction="zoom" className="bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 p-5 sm:p-6 text-center max-w-lg mx-auto shadow-2xs mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 border border-amber-100/80 shadow-2xs">
                  <Award size={20} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Belum Ada Program Beasiswa Aktif
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Informasi beasiswa terbaru sedang dipersiapkan oleh tim mitra dan penyelenggara kami. Silakan cek kembali dalam waktu dekat.
                </p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <Link
                    href="/beasiswa"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition"
                  >
                    <Search size={13} />
                    <span>Jelajahi Arsip Beasiswa</span>
                  </Link>
                </div>
              </ScrollReveal>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch mb-4">
                {effectiveScholarships.map((sch: any, idx: number) => {
                  const borderStyle = sch.border_color ? { borderLeftColor: sch.border_color } : {}
                  const displayImage = sch.image_url || sch.image || (idx === 0 ? landingBeasiswaOne : landingBeasiswaTwo)
                  const summaryList = parseScholarshipList(sch.summary_benefits).length > 0
                    ? parseScholarshipList(sch.summary_benefits)
                    : parseScholarshipList(sch.benefits).slice(0, 2)
                  const tagName = getScholarshipTag(sch)
                  const tagColor = getScholarshipTagColor(sch)

                  return (
                    <ScrollReveal
                      key={sch.id || idx}
                      direction="up"
                      delay={idx * 100}
                      className="h-full"
                    >
                      <div
                        style={borderStyle}
                        className="h-full group bg-white rounded-2xl p-4 sm:p-5 shadow-md shadow-slate-200/50 border border-slate-100 border-l-4 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                      >
                        <div>
                          <div className="flex flex-col sm:flex-row items-start gap-3.5">
                            <div className="w-full sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 aspect-video sm:aspect-square shadow-xs">
                              <img
                                src={displayImage}
                                alt={sch.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex-1 w-full">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                {tagName && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tagColor}`}>
                                    {tagName}
                                  </span>
                                )}
                                {sch.quota && (
                                  <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                                    <Users size={12} className="text-slate-400" />
                                    {sch.quota}
                                  </span>
                                )}
                              </div>

                              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1.5 mb-0.5 leading-snug group-hover:text-[#19355a] transition-colors">
                                {sch.name}
                              </h3>
                              <p className="text-[11px] text-slate-400 mb-2">
                                Oleh {sch.organizer}
                              </p>

                              {summaryList.length > 0 && (
                                <ul className="space-y-1 text-xs text-slate-600">
                                  {summaryList.map((b: string, i: number) => (
                                    <li key={i} className="flex items-center gap-1.5">
                                      <Check size={13} className="text-amber-500 shrink-0 stroke-[2.5]" />
                                      <span className="line-clamp-1">{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Batas Waktu:</span>
                            <span className="text-xs font-bold text-red-600">
                              {sch.deadline || 'Sesuai Ketentuan'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedScholarship(sch)}
                            className="px-4 py-1.5 rounded-lg bg-[#284f7a] hover:bg-[#1d3d61] hover:-translate-y-0.5 active:translate-y-0 text-white font-bold text-xs shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
                          >
                            Lihat Syarat
                          </button>
                        </div>
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>
            )}

            <ScrollReveal direction="up" delay={140} className="text-center">
              <Link
                href="/beasiswa"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg border-2 border-[#284f7a] text-[#284f7a] bg-white font-bold text-xs shadow-2xs hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>Cari Beasiswa Lainnya</span>
                <Search size={14} />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        <section id="berita" aria-labelledby="berita-title" className="py-6 bg-slate-50 px-5 md:px-10 lg:px-14 lg:py-7 scroll-mt-14">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up" className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-800">
                <Newspaper size={11} className="text-indigo-600" />
                Kabar &amp; Edukasi
              </span>
              <h2 id="berita-title" className="mt-1.5 text-xl sm:text-2xl lg:text-[1.6rem] font-extrabold text-slate-900 tracking-tight">
                Artikel &amp; Panduan Menuju Kampus
              </h2>
              <p className="mt-1 text-slate-600 max-w-xl mx-auto text-xs sm:text-[13px] leading-relaxed">
                Wawasan terkini seputar persiapan masuk perguruan tinggi, tips memilih peminatan, dan strategi karier masa depan.
              </p>
            </ScrollReveal>

            {effectiveNews.length === 0 ? (
              <ScrollReveal direction="zoom" className="bg-white rounded-2xl border border-dashed border-slate-200 p-5 text-center max-w-md mx-auto shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <Newspaper size={18} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Belum Ada Artikel Berita</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Artikel edukasi dan panduan terbaru akan segera dipublikasikan di sini.
                </p>
              </ScrollReveal>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {effectiveNews.map((article: any, idx: number) => {
                  const badgeColor = article.category?.badge_color || 'bg-blue-50 text-blue-700 border border-blue-100'
                  const categoryName = article.category?.name || 'Berita'
                  const displayDate = article.formatted_date || article.created_at || ''

                  return (
                    <ScrollReveal
                      key={article.id}
                      direction="up"
                      delay={idx * 95}
                      className="h-full"
                    >
                      <article className="h-full rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:-translate-y-1.5 hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                            <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${badgeColor}`}>
                              {categoryName}
                            </span>
                            {displayDate && (
                              <span className="flex items-center gap-1 font-medium">
                                <Calendar size={11} /> {displayDate}
                              </span>
                            )}
                          </div>
                          <Link href={`/berita/${article.slug}`}>
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-700 transition-colors mb-1.5 line-clamp-2">
                              {article.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                          <span>{article.read_time || '5 Menit Baca'}</span>
                          <Link
                            href={`/berita/${article.slug}`}
                            className="text-blue-700 group-hover:underline flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <span>Baca Artikel</span>
                            <ChevronRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </article>
                    </ScrollReveal>
                  )
                })}
              </div>
            )}

            <ScrollReveal direction="up" delay={140} className="text-center mt-4">
              <Link
                href="/berita"
                className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-lg border-2 border-[#284f7a] text-[#284f7a] bg-white font-bold text-xs shadow-2xs hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>Cari Berita Lainnya</span>
                <Search size={13} />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-blue-50 px-5 py-6 md:px-10 lg:px-14 lg:py-8 scroll-mt-14">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full border border-blue-200 animate-ring-pulse"
            aria-hidden="true"
          />
          <div className="mx-auto grid max-w-6xl items-center gap-6 lg:grid-cols-12 lg:gap-8">
            <ScrollReveal direction="left" className="relative order-2 pb-2 lg:order-1 lg:col-span-5 max-w-md mx-auto w-full lg:max-w-none group">
              <div className="absolute -bottom-1.5 -left-2.5 h-4/5 w-4/5 rounded-2xl bg-yellow-300 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-0.5" aria-hidden="true" />
              <div className="relative -rotate-1 group-hover:rotate-0 transition-transform duration-500 overflow-hidden rounded-2xl border-4 border-white shadow-md">
                <img
                  src={landingAboutCampus}
                  alt="Mahasiswa berbincang bersama di lingkungan kampus perkuliahan"
                  className="aspect-[16/10] max-h-[225px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="absolute -bottom-1 right-2 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-blue-900 shadow-md sm:right-4 transition-transform duration-300 group-hover:-translate-y-0.5">
                Mengenal diri. Menemukan arah.
              </span>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={100} className="order-1 lg:order-2 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-800">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                Tentang Kami
              </span>
              <h2 id="about-title" className="mt-2 text-xl font-extrabold leading-snug tracking-tight text-blue-950 sm:text-2xl lg:text-[1.65rem]">
                Gen-U, temanmu menuju kampus.
              </h2>
              <p className="mt-2 max-w-xl text-xs sm:text-[13px] leading-relaxed text-slate-600">
                Gen-U adalah platform interaktif yang dirancang untuk membantu siswa mengenali minat dan bakat, sekaligus menjelajahi kehidupan kampus. Temukan jurusan yang cocok, kenali dunia perkuliahan, dan melangkah menuju masa depan dengan lebih percaya diri.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-blue-900">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-2xs">
                  <Compass size={13} /> Kenali potensimu
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-2xs">
                  <GraduationCap size={13} /> Jelajahi dunia kampus
                </span>
              </div>
              <a
                id="btn-about-features"
                href="#features"
                onClick={(e) => scrollToSection(e, '#features')}
                className="group mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-800 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-blue-900 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              >
                Lihat fitur Gen-U <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </ScrollReveal>
          </div>
        </section>

        {testimonials.length > 0 && (
          <section aria-labelledby="testimonial-title" className="py-6 lg:py-8 bg-[#214a77] text-white px-5 md:px-10 lg:px-14 relative overflow-hidden">
            <div className="pointer-events-none absolute left-5 sm:left-10 top-3 font-serif text-[70px] sm:text-[95px] font-black text-white/10 select-none leading-none -translate-y-4 sm:-translate-y-5" aria-hidden="true">
              &ldquo;
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              <ScrollReveal direction="up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-5">
                <div>
                  <h2 id="testimonial-title" className="text-xl sm:text-2xl lg:text-[1.6rem] font-extrabold tracking-tight text-white">
                    Kata Mereka yang Sudah Bergabung
                  </h2>
                  <p className="mt-1 text-blue-100/90 text-xs sm:text-[13px] max-w-xl leading-relaxed">
                    Kisah sukses para siswa menemukan jalur yang tepat bersama Gen-U.
                  </p>
                </div>

                {testimonials.length > 3 && (
                  <div className="flex items-center gap-2 shrink-0 self-end">
                    <button
                      type="button"
                      onClick={() => setTestimonialPage((prev) => Math.max(0, prev - 1))}
                      disabled={testimonialPage === 0}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0 border border-white/20 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30 disabled:hover:translate-y-0 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Testimoni sebelumnya"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestimonialPage((prev) => Math.min(Math.ceil(testimonials.length / 3) - 1, prev + 1))}
                      disabled={testimonialPage >= Math.ceil(testimonials.length / 3) - 1}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0 border border-white/20 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30 disabled:hover:translate-y-0 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Testimoni selanjutnya"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                {testimonials.slice(testimonialPage * 3, testimonialPage * 3 + 3).map((item, idx) => (
                  <ScrollReveal
                    key={`${testimonialPage}-${item.id}`}
                    direction="up"
                    delay={idx * 90}
                    className="h-full"
                  >
                    <div className="animate-hero-enter bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 shadow-sm flex flex-col justify-between h-full hover:-translate-y-1 hover:bg-white/15 transition-all duration-300">
                      <div>
                        <div className="flex items-center gap-2.5">
                          {item.avatar || item.user?.avatar ? (
                            <img
                              src={(item.avatar || item.user?.avatar) as string}
                              alt={item.name}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-yellow-400/90 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-slate-900 font-extrabold text-[11px] flex items-center justify-center ring-2 ring-yellow-400/90 shadow-xs shrink-0 select-none">
                              {getInitials(item.name)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-white text-xs sm:text-sm leading-tight">{item.name}</h3>
                            <p className="text-[11px] text-blue-200/90">{item.role}</p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={10}
                                  className={
                                    star <= item.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-white/30 fill-white/10'
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-blue-100/95 leading-relaxed italic mt-2.5">
                          &quot;{item.content}&quot;
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {testimonials.length > 3 && (
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTestimonialPage(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${testimonialPage === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
                        }`}
                      aria-label={`Ke halaman ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      <footer id="narahubung" className="bg-[#283e5a] text-slate-300 relative scroll-mt-10">
        <div className="bg-gradient-to-b from-[#1b3d68] via-[#224773] to-[#283e5a] py-7 lg:py-9 px-5 text-center text-white">
          <ScrollReveal direction="zoom" className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-extrabold tracking-tight">
              Siap Menentukan Masa Depanmu?
            </h2>
            <p className="mt-1.5 text-blue-100/90 text-xs sm:text-[13px] max-w-lg mx-auto leading-relaxed">
              Bergabunglah dengan ribuan siswa lainnya yang telah menemukan jalan sukses mereka bersama Generasi Universal.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Link
                id="btn-cta-register"
                href="/register"
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#fcd34d] hover:bg-[#fbbf24] hover:-translate-y-0.5 active:translate-y-0 text-slate-900 font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200"
              >
                Buat Akun Gratis
              </Link>
              <a
                id="btn-cta-learn-more"
                href="#about"
                onClick={(e) => scrollToSection(e, '#about')}
                className="w-full sm:w-auto px-5 py-2 rounded-lg border border-white/80 hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 text-white font-bold text-xs transition-all duration-200 bg-[#294a73]/60 cursor-pointer"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </ScrollReveal>
        </div>

        <div className="max-w-6xl mx-auto pt-6 pb-5 px-5 md:px-10 lg:px-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 pb-5">
            <div className="md:col-span-5 space-y-2.5">
              <div className="flex items-center gap-2 text-white">
                <GraduationCap size={22} className="text-white" />
                <span className="text-lg font-bold tracking-tight">Gen-U</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Platform pendidikan terintegrasi yang membantu generasi muda Indonesia menemukan potensi sejati mereka dan merencanakan karir masa depan.
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-[#1c2c42] flex items-center justify-center text-white hover:-translate-y-0.5 hover:bg-white/20 transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-white stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
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
                  className="w-8 h-8 rounded-full bg-[#1c2c42] flex items-center justify-center text-white hover:-translate-y-0.5 hover:bg-white/20 transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-[#1c2c42] flex items-center justify-center text-white hover:-translate-y-0.5 hover:bg-white/20 transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-[#1c2c42] flex items-center justify-center text-white hover:-translate-y-0.5 hover:bg-white/20 transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2.5">
              <h3 className="text-white font-semibold text-xs sm:text-sm">Layanan</h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
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

            <div className="md:col-span-4 space-y-2.5">
              <h3 className="text-white font-semibold text-xs sm:text-sm">Hubungi Kami</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Paccerakkang, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90245
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <a href="mailto:halo@gen.univeral.ac.id" className="hover:text-white transition-colors">
                    halo@gen.univeral.ac.id
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <a href="tel:+6285299184832" className="hover:text-white transition-colors">
                    +62 852 9918 4832
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-600/40 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>&copy; 2026 Generasi Universal (Gen-U). All rights reserved.</p>
            <div className="flex items-center gap-5">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-sm animate-modal-backdrop"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col animate-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-5 pb-3.5 px-5 sm:px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="text-center sm:text-left w-full sm:w-auto">
                <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1">
                  Detail Program Studi
                </span>
                <h3 id="modal-program-title" className="text-lg sm:text-xl font-extrabold text-[#152e4d] tracking-tight">
                  Mengenal {selectedProgram.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                aria-label="Tutup Detail Program"
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200/70 shadow-2xs hover:border-blue-200 transition-colors flex-1">
                    {(selectedProgram as any).iconUrl ? (
                      <img
                        src={(selectedProgram as any).iconUrl}
                        alt={selectedProgram.name}
                        className="w-9 h-9 rounded-lg object-cover mb-2.5"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5 shadow-2xs">
                        <selectedProgram.icon size={18} />
                      </div>
                    )}
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                      Apa itu {selectedProgram.name}?
                    </h4>
                    {selectedProgram.about && selectedProgram.about.includes('<') ? (
                      <div
                        className="text-xs text-slate-600 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedProgram.about }}
                      />
                    ) : (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {selectedProgram.about}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200/70 shadow-2xs hover:border-amber-200 transition-colors flex-1">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 shadow-2xs">
                      <GraduationCap size={18} />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                      Gelar Akademik
                    </h4>
                    <div className="text-xs text-slate-600 leading-relaxed space-y-1.5">
                      <p>{selectedProgram.degree}</p>
                      {selectedProgram.degreeNote && <p>{selectedProgram.degreeNote}</p>}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-gradient-to-br from-[#274872] via-[#1f3a5e] to-[#172d4a] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-white/10">
                      <Briefcase size={18} className="text-amber-400" />
                      <h4 className="text-base sm:text-lg font-bold tracking-tight text-white">
                        Prospek Karir
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedProgram.careerProspects.map((cp: any, idx: number) => {
                        const CpIcon = cp.icon || Building2
                        return (
                          <div
                            key={idx}
                            className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all flex flex-col"
                          >
                            {cp.iconUrl ? (
                              <img
                                src={cp.iconUrl}
                                alt={cp.title}
                                className="w-7 h-7 rounded-md object-cover mb-2"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center mb-2">
                                <CpIcon size={14} />
                              </div>
                            )}
                            <h5 className="font-bold text-white text-xs sm:text-[13px] mb-1 leading-snug">
                              {cp.title}
                            </h5>
                            <p className="text-[11px] text-blue-100/80 leading-relaxed">
                              {cp.desc}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200/80">
                    <span>* Prospek kerja terhubung dengan jejaring alumni &amp; mitra industri</span>
                    <button
                      type="button"
                      onClick={() => setSelectedProgram(null)}
                      className="px-3.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors cursor-pointer"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-sm animate-modal-backdrop"
          onClick={() => setSelectedScholarship(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col animate-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-5 pb-3.5 px-5 sm:px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                {getScholarshipTag(selectedScholarship) && (
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1 ${getScholarshipTagColor(selectedScholarship)}`}>
                    {getScholarshipTag(selectedScholarship)}
                  </span>
                )}
                <h3 id="modal-scholarship-title" className="text-lg sm:text-xl font-extrabold text-[#152e4d] tracking-tight">
                  {typeof selectedScholarship.name === 'string' ? selectedScholarship.name : ''}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {typeof selectedScholarship.organizer === 'string' ? selectedScholarship.organizer : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScholarship(null)}
                aria-label="Tutup Syarat Beasiswa"
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {(() => {
                const benefits = parseScholarshipList(selectedScholarship.benefits)
                if (benefits.length === 0) return null
                return (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-600" />
                      Benefit &amp; Cakupan Dana
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
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
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">Persyaratan Umum:</h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
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
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">Dokumen yang Diperlukan:</h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
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

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
                <span>Batas Waktu Pendaftaran:</span>
                <strong className="text-red-600 font-bold">{selectedScholarship.deadline || 'Sesuai Ketentuan'}</strong>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
              {selectedScholarship.link_url ? (
                <a
                  href={selectedScholarship.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs"
                >
                  <span>Daftar / Info Resmi</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-lg bg-[#284f7a] hover:bg-[#1d3d61] text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  Daftar Sekarang
                </Link>
              )}
              <button
                type="button"
                onClick={() => setSelectedScholarship(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
