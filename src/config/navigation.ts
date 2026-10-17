import {
  LayoutDashboard,
  Compass,
  BookOpen,
  CheckSquare,
  GraduationCap,
  Calendar,
  Users,
  User,
  PlusCircle,
  Database,
} from 'lucide-react'
import { MenuItem } from '../Layouts/PortalLayout'

export const studentMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dasbor', icon: LayoutDashboard, href: '/student/dashboard' },
  { id: 'minat_bakat', label: 'Tes Minat Bakat', icon: Compass, href: '/student/riasec' },
  { id: 'jurusan', label: 'Jelajahi Jurusan', icon: BookOpen, href: '/student/jurusan' },
  { id: 'simulasi_pmb', label: 'Simulasi PMB', icon: CheckSquare, href: '/student/simulasi-pmb' },
  { id: 'simulasi_kuliah', label: 'Simulasi Kuliah', icon: GraduationCap, href: '/student/simulasi-kuliah' },
  { id: 'booking', label: 'Mentor Pemesanan', icon: Calendar, href: '/student/booking' },
]

export const guruMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dasbor', icon: LayoutDashboard, href: '/guru/dashboard' },
  { id: 'monitoring', label: 'Memantau Minat Bakat', icon: Compass, href: '/guru/monitoring' },
  { id: 'sesi', label: 'Sesi Mentoring', icon: Users, href: '/guru/sesi-mentoring' },
]

export const adminMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
  { id: 'users', label: 'Monitoring Pengguna', icon: Users, href: '/admin/users' },
  { id: 'input_test', label: 'Input Tes Minat Bakat', icon: CheckSquare, href: '/admin/input-test' },
  { id: 'input_jurusan', label: 'Input Jelajahi Jurusan', icon: Database, href: '/admin/input-jurusan' },
  { id: 'monitoring_tes', label: 'Monitoring Tes', icon: Users, href: '/admin/monitoring-tes' },
]
