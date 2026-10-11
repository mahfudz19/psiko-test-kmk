export type Dimension = {
  code: string
  name: string
  subtitle: string
  description: string
  subjects: string
  programs: string
  color: string
  light: string
  items: [number, string][]
}

export const dimensions: Dimension[] = [
  {
    code: 'R',
    name: 'Realistic',
    subtitle: 'Praktis & teknis',
    description: 'Senang bekerja dengan alat, benda nyata, dan kegiatan di luar ruangan.',
    subjects: 'Fisika, Prakarya, PJOK',
    programs: 'Teknik, Pertanian, Konstruksi, Pariwisata',
    color: 'bg-teal-600',
    light: 'bg-teal-50 text-teal-700',
    items: [
      [1, 'Aku suka mengulik peralatan'],
      [3, 'Aku suka bekerja mandiri (dengan tangan/alat)'],
      [7, 'Aku suka menyusun balok / LEGO'],
      [14, 'Aku suka memelihara binatang'],
      [21, 'Aku suka mencari tahu cara kerja sebuah alat'],
      [22, 'Aku suka merangkaikan atau merakit benda'],
      [37, 'Aku suka berkegiatan di luar ruangan'],
    ],
  },
  {
    code: 'I',
    name: 'Investigative',
    subtitle: 'Analitis & ingin tahu',
    description: 'Senang mengamati, meneliti, dan memecahkan persoalan.',
    subjects: 'Biologi, Kimia, Matematika, Fisika',
    programs: 'Kedokteran, Biologi, Kimia, Psikologi',
    color: 'bg-blue-600',
    light: 'bg-blue-50 text-blue-700',
    items: [
      [2, 'Aku suka mengerjakan puzzle'],
      [11, 'Aku suka melakukan percobaan / eksperimen'],
      [18, 'Aku suka sains'],
      [19, 'Aku suka mendapatkan tantangan baru'],
      [26, 'Aku suka mencari tahu penyebab suatu kejadian'],
      [32, 'Aku suka mempraktikkan hal-hal yang aku pelajari'],
      [33, 'Aku suka mengerjakan soal matematika atau grafik'],
    ],
  },
  {
    code: 'A',
    name: 'Artistic',
    subtitle: 'Kreatif & ekspresif',
    description: 'Senang mencipta, berimajinasi, dan mengekspresikan ide.',
    subjects: 'Seni Budaya, Bahasa Indonesia, Bahasa Inggris',
    programs: 'Desain Komunikasi Visual, Seni, Sastra, Arsitektur',
    color: 'bg-violet-600',
    light: 'bg-violet-50 text-violet-700',
    items: [
      [8, 'Aku suka membaca buku tentang seni dan musik'],
      [17, 'Aku suka membuat karya berbentuk tulisan'],
      [20, 'Aku suka menghibur teman'],
      [23, 'Aku adalah orang yang kreatif'],
      [27, 'Aku suka memainkan alat musik atau bernyanyi'],
      [31, 'Aku suka bermain peran / drama'],
      [41, 'Aku suka menggambar'],
    ],
  },
  {
    code: 'S',
    name: 'Social',
    subtitle: 'Peduli & kolaboratif',
    description: 'Senang berinteraksi, membantu, dan mengajar orang lain.',
    subjects: 'Sosiologi, Antropologi, PPKn, Sejarah',
    programs: 'Konseling, Keperawatan, Pendidikan, Public Relation',
    color: 'bg-rose-500',
    light: 'bg-rose-50 text-rose-700',
    items: [
      [4, 'Aku suka bekerja dalam kelompok'],
      [12, 'Aku suka menjelaskan sesuatu kepada teman'],
      [13, 'Aku suka membantu orang lain memecahkan persoalan'],
      [28, 'Aku suka mempelajari budaya berbagai daerah'],
      [34, 'Aku suka mendiskusikan hal-hal yang terjadi di sekitarku'],
      [38, 'Aku suka berkegiatan di dalam ruangan dengan meja-kursi'],
      [40, 'Aku suka menolong orang'],
    ],
  },
  {
    code: 'E',
    name: 'Enterprising',
    subtitle: 'Pemimpin & penggerak',
    description: 'Senang memimpin, meyakinkan orang lain, dan membangun usaha.',
    subjects: 'Ekonomi, Geografi, Sosiologi',
    programs: 'Bisnis, Pemasaran, Hukum, Perbankan',
    color: 'bg-amber-500',
    light: 'bg-amber-50 text-amber-800',
    items: [
      [5, 'Aku suka membuat target untuk diriku sendiri'],
      [10, 'Aku suka meyakinkan teman untuk mengikuti caraku'],
      [15, 'Aku tidak berkeberatan bekerja melebihi waktu yang ditentukan'],
      [16, 'Aku suka menjual sesuatu'],
      [29, 'Aku ingin membuka usaha sendiri suatu saat nanti'],
      [36, 'Aku suka memimpin kelompok atau kelas'],
      [42, 'Aku suka berbicara di depan umum'],
    ],
  },
  {
    code: 'C',
    name: 'Conventional',
    subtitle: 'Rapi & terstruktur',
    description: 'Senang mengatur, memperhatikan detail, dan bekerja dengan data.',
    subjects: 'Matematika, Ekonomi, Informatika',
    programs: 'Akuntansi, Administrasi, Asuransi, Pengolahan Data',
    color: 'bg-slate-600',
    light: 'bg-slate-100 text-slate-700',
    items: [
      [6, 'Aku suka merapikan barang-barang (buku, alat tulis, kamar)'],
      [9, 'Aku suka mengerjakan hal-hal dengan instruksi yang jelas'],
      [24, 'Aku suka memperhatikan detail'],
      [25, 'Aku suka merapikan catatan atau LKS'],
      [35, 'Aku suka merapikan kamarku'],
      [38, 'Aku suka berkegiatan di dalam ruangan dengan meja-kursi'],
      [39, 'Aku suka menghitung'],
    ],
  },
]

export const choices = [
  { value: 1, short: 'STS', label: 'Sangat tidak suka' },
  { value: 2, short: 'TS', label: 'Tidak suka' },
  { value: 3, short: 'S', label: 'Suka' },
  { value: 4, short: 'SS', label: 'Sangat suka' },
]

export function category(score: number): string {
  if (score >= 25) return 'Sangat tinggi'
  if (score >= 19) return 'Tinggi'
  if (score >= 13) return 'Sedang'
  return 'Rendah'
}

export interface StudentIdentity {
  name: string
  school: string
  className: string
  attendance: string
  mentor: string
}
