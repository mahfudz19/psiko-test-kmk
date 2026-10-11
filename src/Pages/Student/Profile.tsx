import React from 'react'
import { usePage } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { studentMenuItems } from '../../config/navigation'
import NpsnFormCard from '../../components/NpsnFormCard'

export default function StudentProfile() {
  const { auth } = usePage<any>().props
  const user = auth?.user

  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="profile">
      <NpsnFormCard user={user} role="siswa" />
    </PortalLayout>
  )
}
