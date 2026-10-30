export interface Testimonial {
  id: string
  name: string
  role: 'Siswa' | 'Mentor' | 'Guru' | string
  rating: number
  content: string
  avatar?: string
  isPublished: boolean
  createdAt: string
  userId?: string | number
}

const STORAGE_KEY = 'genu_testimonials'
const REVIEWED_STORAGE_PREFIX = 'genu_user_reviewed_'

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    role: 'Siswa',
    rating: 5,
    content: 'Aplikasi ini sangat membantu saya dalam menentukan jurusan yang tepat untuk kuliah. Fitur tes minat bakatnya akurat!',
    avatar: '/avatar-budi.png',
    isPublished: true,
    createdAt: '2026-10-20',
  },
  {
    id: '2',
    name: 'Dr. Sarah Wijaya',
    role: 'Mentor',
    rating: 4,
    content: 'Sistem dashboard bagi mentor cukup jelas. Mungkin bisa ditambahkan fitur direct message antara mentor dan siswa agar lebih interaktif.',
    avatar: '/avatar-sarah.png',
    isPublished: false,
    createdAt: '2026-10-20',
  },
  {
    id: '3',
    name: 'Sarah Amanda',
    role: 'Siswa',
    rating: 5,
    content: 'Dulu aku bingung banget mau milih Ilmu Komunikasi atau Psikologi. Setelah ikut tes di Gen-U dan baca database jurusannya, aku makin mantap pilih Psikologi. Valid banget!',
    avatar: '/avatar-sarah.png',
    isPublished: true,
    createdAt: '2026-10-18',
  },
  {
    id: '4',
    name: 'Dina Amelia',
    role: 'Siswa',
    rating: 5,
    content: 'Gak nyangka hasil tesnya seakurat itu nebak kepribadian aku. Konselor Gen-U juga ramah banget jelasin hasil tes dan kasih opsi jurusan yang sesuai dengan passing grade raporku.',
    avatar: '/avatar-dina.png',
    isPublished: true,
    createdAt: '2026-10-19',
  },
]

function emitUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('genu_testimonials_updated'))
  }
}

export function getTestimonials(): Testimonial[] {
  if (typeof window === 'undefined') {
    return DEFAULT_TESTIMONIALS
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS))
      return DEFAULT_TESTIMONIALS
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS))
      return DEFAULT_TESTIMONIALS
    }
    return parsed
  } catch {
    return DEFAULT_TESTIMONIALS
  }
}

export function getPublishedTestimonials(): Testimonial[] {
  return getTestimonials().filter((item) => item.isPublished)
}

export function saveTestimonial(
  data: Partial<Testimonial> & { name: string; role: string; rating: number; content: string }
): Testimonial {
  const list = getTestimonials()
  const nowStr = new Date().toISOString().split('T')[0]

  if (data.id) {
    const index = list.findIndex((item) => item.id === data.id)
    if (index !== -1) {
      const updated: Testimonial = {
        ...list[index],
        name: data.name,
        role: data.role,
        rating: data.rating,
        content: data.content,
        avatar: data.avatar || list[index].avatar,
        isPublished: data.isPublished !== undefined ? data.isPublished : list[index].isPublished,
      }
      list[index] = updated
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
        emitUpdate()
      }
      return updated
    }
  }

  const newId = String(Date.now())
  const newTestimonial: Testimonial = {
    id: newId,
    name: data.name,
    role: data.role,
    rating: data.rating,
    content: data.content,
    avatar: data.avatar || '',
    isPublished: data.isPublished !== undefined ? data.isPublished : false,
    createdAt: nowStr,
    userId: data.userId,
  }

  const updatedList = [newTestimonial, ...list]
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
    emitUpdate()
  }
  return newTestimonial
}

export function togglePublishTestimonial(id: string): Testimonial | null {
  const list = getTestimonials()
  const index = list.findIndex((item) => item.id === id)
  if (index === -1) return null

  list[index].isPublished = !list[index].isPublished
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    emitUpdate()
  }
  return list[index]
}

export function deleteTestimonial(id: string): boolean {
  const list = getTestimonials()
  const filtered = list.filter((item) => item.id !== id)
  if (filtered.length === list.length) return false

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    emitUpdate()
  }
  return true
}

export function hasUserReviewed(userId?: string | number | null): boolean {
  if (typeof window === 'undefined') return false
  const key = userId ? `${REVIEWED_STORAGE_PREFIX}${userId}` : `${REVIEWED_STORAGE_PREFIX}current`
  return localStorage.getItem(key) === 'true'
}

export function setUserReviewed(userId?: string | number | null): void {
  if (typeof window === 'undefined') return
  const key = userId ? `${REVIEWED_STORAGE_PREFIX}${userId}` : `${REVIEWED_STORAGE_PREFIX}current`
  localStorage.setItem(key, 'true')
}
