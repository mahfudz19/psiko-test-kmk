import React from 'react'
import { usePage } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { guruMenuItems } from '../../config/navigation'
import NpsnFormCard from '../../components/NpsnFormCard'

export default function GuruProfile() {
  const { auth } = usePage<any>().props
  const user = auth?.user

  return (
    <PortalLayout role="guru" menuItems={guruMenuItems} activeId="profile">
      <NpsnFormCard user={user} role="guru" />
    </PortalLayout>
  )
}
