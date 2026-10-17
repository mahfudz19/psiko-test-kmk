import React, { useEffect, useState } from 'react'
import { Head, Link } from '@inertiajs/react'
const landingPersonOne = '/landing-person-1.png'
const landingPersonTwo = '/landing-person-2.png'
const landingPersonThree = '/landing-person-3.png'
const landingAboutCampus = '/landing-about-campus.jpg'
import {
  GraduationCap,
  Compass,
  BookOpen,
  CheckSquare,
  ChevronRight,
  Lock,
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

export default function Landing() {
  const [landingSlide, setLandingSlide] = useState(0)
  const visibleLandingSlide = landingSlide % landingSlides.length

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setLandingSlide((prev) => (prev % landingSlides.length + 1) % landingSlides.length)
      }
    }, 5500)
    return () => window.clearInterval(timer)
  }, [])

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
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Head>
        <title>Gen-U - Platform Tes Minat Bakat RIASEC &amp; Eksplorasi Jurusan Kuliah</title>
        <meta
          name="description"
          content="Kenali potensi, minat, dan bakat masa depanmu bersama Gen-U. Akses tes psikometri RIASEC, eksplorasi 50+ program studi, simulasi PMB, dan bimbingan karier terpadu."
        />
        <meta
          name="keywords"
          content="tes minat bakat, tes riasec, asesmen psikometri, jurusan kuliah, simulasi pmb, bimbingan konseling, universitas indonesia, gen-u"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gen-U - Kenali Passionmu, Tentukan Masa Depanmu" />
        <meta
          property="og:description"
          content="Platform interaktif asesmen minat bakat RIASEC, panduan jurusan kuliah, dan bimbingan karier siswa menuju kampus impian."
        />
        <meta property="og:image" content={landingAboutCampus} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gen-U - Kenali Passionmu, Tentukan Masa Depanmu" />
        <meta
          name="twitter:description"
          content="Platform edukasi terpadu untuk asesmen minat bakat, panduan program studi, dan bimbingan karier siswa."
        />
        <meta name="twitter:image" content={landingAboutCampus} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <header id="landing-header" className="absolute top-0 z-20 w-full px-6 py-6 text-white md:px-12 lg:px-16">
        <nav id="landing-navbar" aria-label="Navigasi Utama" className="flex items-center justify-between">
          <Link href="/" id="brand-logo" className="flex items-center gap-2">
            <div className="rounded-lg p-2 text-white">
              <GraduationCap size={24} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Gen-U</span>
          </Link>
          <div className="hidden items-center gap-8 font-medium md:flex">
            <a href="#home" id="nav-link-home" className="hover:text-yellow-200 transition-colors">
              Home
            </a>
            <a href="#about" id="nav-link-about" className="hover:text-yellow-200 transition-colors">
              Tentang Kami
            </a>
            <a href="#features" id="nav-link-features" className="hover:text-yellow-200 transition-colors">
              Fitur
            </a>
          </div>
          <div className="flex gap-3">
            <Link
              id="btn-login"
              href="/login"
              className="rounded-lg px-3 py-2 font-semibold transition-colors hover:bg-white/10 sm:px-5"
            >
              Masuk
            </Link>
            <Link
              id="btn-register"
              href="/register"
              className="rounded-lg border-2 border-white px-3 py-2 font-semibold transition-colors hover:bg-white hover:text-blue-900 sm:px-5"
            >
              Daftar
            </Link>
          </div>
        </nav>
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
                    className={`h-3.5 w-3.5 rounded-full transition-colors ${
                      visibleLandingSlide === index ? 'bg-white' : 'bg-blue-950/40 hover:bg-white/60'
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
                  className={`absolute bottom-0 right-[-12%] w-[120%] object-contain object-bottom transition-opacity duration-500 sm:right-[-5%] sm:w-full lg:right-[-28%] lg:w-[155%] lg:max-w-none ${
                    visibleLandingSlide === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden={visibleLandingSlide !== index}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-blue-50 px-6 py-20 md:px-12 lg:py-28">
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
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-900"
              >
                Lihat fitur Gen-U <ChevronRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="features-title" className="py-20 bg-white px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 id="features-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Fitur Unggulan Gen-U
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Satu portal terintegrasi untuk segala kebutuhan persiapan kuliah dan penentuan karier masa depanmu.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: 'feature-riasec',
                  icon: Compass,
                  title: 'Tes Minat Bakat RIASEC',
                  desc: 'Ketahui kecenderungan karir menggunakan metode asesmen psikometri Holland terpercaya.',
                  color: 'purple',
                  colorBg: 'bg-purple-100 text-purple-600',
                },
                {
                  id: 'feature-majors',
                  icon: BookOpen,
                  title: 'Eksplorasi Jurusan',
                  desc: 'Database lengkap info jurusan, jalur vokasi-sarjana-profesi, kegiatan perkuliahan, dan prospek kerja.',
                  color: 'blue',
                  colorBg: 'bg-blue-100 text-blue-600',
                },
                {
                  id: 'feature-pmb',
                  icon: CheckSquare,
                  title: 'Simulasi PMB',
                  desc: 'Latihan mengisi form penerimaan Mahasiswa Baru dan memahami alur proses registrasi kampus.',
                  color: 'orange',
                  colorBg: 'bg-amber-100 text-amber-600',
                },
              ].map((f) => (
                <article
                  key={f.id}
                  id={f.id}
                  className="p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl transition-all group"
                >
                  <div
                    className={`w-14 h-14 rounded-xl ${f.colorBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <f.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="landing-footer" className="bg-slate-900 py-8 px-6 text-center text-slate-400 relative">
        <p>&copy; 2026 Gen-U Platform Edukasi. All rights reserved.</p>
        <Link
          id="link-admin-access"
          href="/admin/dashboard"
          className="absolute bottom-4 right-4 text-slate-800 hover:text-slate-600 transition-colors"
          title="Admin Access"
          aria-label="Admin Access"
        >
          <Lock size={12} />
        </Link>
      </footer>
    </div>
  )
}
