export type ScoreLevel = 'high' | 'medium' | 'low'

export interface DimensionProfileContent {
  desc: string
  majors: string
}

export const getScoreLevel = (score: number): ScoreLevel => {
  if (score >= 20) return 'high'
  if (score >= 12) return 'medium'
  return 'low'
}

export const SCORE_BASED_DIMENSIONS: Record<string, Record<ScoreLevel, DimensionProfileContent>> = {
  R: {
    high: {
      desc: 'Memiliki minat sangat kuat pada pekerjaan praktis, manipulasi alat, pengoperasian mesin fisik, dan aktivitas langsung di luar ruangan.',
      majors: 'Teknik Mesin, Teknik Elektro, Teknik Sipil, Pertanian, Kehutanan, Logistik',
    },
    medium: {
      desc: 'Cukup nyaman dengan aktivitas berbasis fisik dan penerapan praktis saat dipadukan dengan pemikiran analitis atau manajerial.',
      majors: 'Arsitektur, Teknik Industri, Sistem Informasi Geografis, Pariwisata & Perhotelan',
    },
    low: {
      desc: 'Cenderung menghindari pekerjaan fisik langsung, perkakas mekanis berat, atau aktivitas luar ruangan yang intensif.',
      majors: 'Manajemen Layanan, Komunikasi, Administrasi, Kajian Teoretis',
    },
  },
  S: {
    high: {
      desc: 'Sangat berempati, menikmati interaksi sosial yang intensif, senang membimbing, mengajar, dan menolong perkembangan sesama.',
      majors: 'Bimbingan Konseling, Pendidikan/Keguruan, Psikologi, Keperawatan, Kesejahteraan Sosial',
    },
    medium: {
      desc: 'Mampu berkomunikasi dan bekerjasama dengan baik dalam tim, nyaman membangun relasi sosial yang kolaboratif.',
      majors: 'Hubungan Masyarakat (Humas), Manajemen SDM, Pelayanan Kesehatan Masyarakat, Komunikasi',
    },
    low: {
      desc: 'Lebih nyaman bekerja secara mandiri atau dengan data dan objek daripada pekerjaan yang menuntut interaksi sosial terus-menerus.',
      majors: 'Sains Terapan, Pemrograman Komputer, Analisis Data, Kearsipan Digital',
    },
  },
  I: {
    high: {
      desc: 'Rasa ingin tahu intelektual sangat tinggi, menyukai riset mendalam, pemecahan masalah analitis, dan observasi saintifik.',
      majors: 'Kedokteran & Sains Biomedis, Farmasi, Biologi, Kimia, Matematika, Sains Data',
    },
    medium: {
      desc: 'Mampu menganalisis masalah logis dan melakukan penelaahan data untuk mendukung pengambilan keputusan terukur.',
      majors: 'Teknik Informatika, Psikologi Terapan, Ekonomi Bisnis, Rekayasa Perangkat Lunak',
    },
    low: {
      desc: 'Cenderung lebih menyukai pendekatan praktis langsung yang aplikatif dibandingkan teori abstrak atau riset laboratorium panjang.',
      majors: 'Kewirausahaan, Pemasaran Praktis, Seni Rupa Terapan, Penyiaran',
    },
  },
  E: {
    high: {
      desc: 'Penuh inisiatif dan kepemimpinan tinggi, persuasif, menyukai tantangan target kompetitif, dan berani mengambil risiko bisnis.',
      majors: 'Manajemen Bisnis, Kewirausahaan, Hukum Bisnis, Pemasaran Digital, Hubungan Internasional',
    },
    medium: {
      desc: 'Cukup persuasif dan komunikatif dalam mengkoordinasikan kegiatan, mampu mengorganisasi tim kerja secara terstruktur.',
      majors: 'Administrasi Bisnis, Manajemen Komunikasi, Manajemen Acara (Event), Hubungan Masyarakat',
    },
    low: {
      desc: 'Cenderung menghindari peran persuasi penjualan agresif, negosiasi risiko tinggi, atau persaingan bisnis frontal.',
      majors: 'Kajian Ilmiah, Desain Visual, Kearsipan Dokumen, Kepustakaan',
    },
  },
  A: {
    high: {
      desc: 'Kreativitas dan imajinasi sangat menonjol, ekspresif, intuitif, dan nyaman mengeksplorasi gagasan inovatif tanpa batas baku.',
      majors: 'Desain Komunikasi Visual (DKV), Desain Produk, Animasi, Seni Musik/Pertunjukan, Sastra & Penulisan Kreatif',
    },
    medium: {
      desc: 'Mampu mengapresiasi estetika dan menuangkan sentuhan kreatif dalam penyampaian ide maupun perancangan karya.',
      majors: 'Arsitektur Interior, Desain Web/UI-UX, Komunikasi Media Massa, Desain Grafis Terapan',
    },
    low: {
      desc: 'Lebih menyukai pedoman kerja yang jelas, standar aturan pasti, dan kepastian struktural dibandingkan kebebasan artistik.',
      majors: 'Sistem Komputasi, Akuntansi, Rekayasa Standar Mutu, Administrasi Operasional',
    },
  },
  C: {
    high: {
      desc: 'Sangat teliti, sistematis, menyukai keteraturan data terperinci, taat prosedur, dan andal dalam menjaga akurasi operasional.',
      majors: 'Akuntansi & Auditing, Administrasi Fiskal/Perpajakan, Aktuaria, Manajemen Keuangan, Rekam Medis',
    },
    medium: {
      desc: 'Mampu menjaga kerapian dokumentasi dan alur kerja yang terencana dengan baik untuk kelancaran organisasi.',
      majors: 'Sistem Informasi Manajemen, Administrasi Bisnis, Manajemen Logistik & Operasional',
    },
    low: {
      desc: 'Cenderung cepat jenuh dengan rutinitas administratif monoton atau pencatatan berulang yang kaku.',
      majors: 'Jurnalisme Lapangan, Bidang Seni & Kreatif Bebas, Pemandu Wisata, Kewirausahaan Inovatif',
    },
  },
}

export const getDimensionDefaultContent = (code: string, score: number): DimensionProfileContent => {
  const upperCode = code.toUpperCase()
  const level = getScoreLevel(score)
  const profile = SCORE_BASED_DIMENSIONS[upperCode]?.[level]

  if (profile) {
    return profile
  }

  return {
    desc: 'Memiliki kecenderungan yang selaras dengan dimensi ini.',
    majors: 'Studi Eksplorasi Terkait',
  }
}
