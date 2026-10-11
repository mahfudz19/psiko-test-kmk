import React, { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import landingPersonOne from '../imports/landing-person-1.png'
import landingPersonTwo from '../imports/landing-person-2.png'
import landingPersonThree from '../imports/landing-person-3.png'
import landingAboutCampus from '../imports/landing-about-campus.jpg'
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
    alt: 'Beragam profesional muda menyatukan tangan',
  },
  {
    title: (
      <>
        MASIH BINGUNG<br />DENGAN BAKAT<br />&amp; MINATMU?
      </>
    ),
    image: landingPersonTwo,
    alt: 'Siswa sedang memikirkan bakat dan minatnya',
  },
  {
    title: (
      <>
        YUK.....!<br />KENALI LEBIH<br />DALAM PASSIONMU
      </>
    ),
    image: landingPersonThree,
    alt: 'Siswa antusias menjelajahi minatnya',
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <nav className="absolute top-0 z-20 flex w-full items-center justify-between px-6 py-6 text-white md:px-12 lg:px-16">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-2 text-white">
            <GraduationCap size={24} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">Gen-U</span>
        </div>
        <div className="hidden items-center gap-8 font-medium md:flex">
          <a href="#home" className="hover:text-yellow-200 transition-colors">
            Home
          </a>
          <a href="#about" className="hover:text-yellow-200 transition-colors">
            Tentang Kami
          </a>
          <a href="#features" className="hover:text-yellow-200 transition-colors">
            Fitur
          </a>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 font-semibold transition-colors hover:bg-white/10 sm:px-5"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-lg border-2 border-white px-3 py-2 font-semibold transition-colors hover:bg-white hover:text-blue-900 sm:px-5"
          >
            Daftar
          </Link>
        </div>
      </nav>

      <section
        id="home"
        aria-label="Sorotan Gen-U"
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
                href="/student/jurusan"
                className="min-w-64 rounded-xl border-[3px] border-white px-5 py-2.5 text-center text-lg font-extrabold transition-colors hover:bg-white hover:text-blue-900"
              >
                JELAJAHI JURUSAN
              </Link>
              <Link
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
                alt="Mahasiswa berbincang bersama di lingkungan kampus"
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
              href="#features"
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-900"
            >
              Lihat fitur Gen-U <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan Gen-U</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Satu portal terintegrasi untuk segala kebutuhan persiapan kuliahmu.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: 'Tes Minat Bakat',
                desc: 'Ketahui kecenderungan karir menggunakan metode asesmen terpercaya.',
                color: 'purple',
              },
              {
                icon: BookOpen,
                title: 'Eksplorasi Jurusan',
                desc: 'Database lengkap info jurusan, kegiatan perkuliahan dan prospek kerja.',
                color: 'blue',
              },
              {
                icon: CheckSquare,
                title: 'Simulasi PMB',
                desc: 'Latihan mengisi form penerimaan Mahasiswa Baru dan memahami proses registrasi.',
                color: 'orange',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-${f.color}-100 text-${f.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-8 px-6 text-center text-slate-400 relative">
        <p>&copy; 2026 Gen-U Platform Edukasi. All rights reserved.</p>
        <Link
          href="/admin/dashboard"
          className="absolute bottom-4 right-4 text-slate-800 hover:text-slate-600 transition-colors"
          title="Admin Access"
        >
          <Lock size={12} />
        </Link>
      </footer>
    </div>
  )
}
