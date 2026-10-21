import React from 'react'
import { usePage } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { studentMenuItems } from '../../config/navigation'
import NpsnFormCard from '../../components/NpsnFormCard'

interface StudentProfileProps {
  user: any
  mentors?: { id: number; name: string; school: string }[]
  currentMentor?: string
}

export default function StudentProfile({
  user,
  mentors = [],
  currentMentor,
}: StudentProfileProps) {
  const { auth } = usePage<any>().props
  const currentUser = user || auth?.user

  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="profile">
      <NpsnFormCard
        user={currentUser}
        role="siswa"
        mentors={mentors}
        currentMentor={currentMentor}
      />
    </PortalLayout>
  )
}
