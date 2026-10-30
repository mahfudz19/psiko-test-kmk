'use client'
import { HTMLAttributes } from 'react'
import BackDrop from '@/components/utility/UI/BackDrop'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  isOpen: boolean
  onClose: () => void
}

export type DrawerProps = HTMLAttributes<HTMLDivElement> & MoreProps

function Drawer(props: DrawerProps) {
  const { isOpen, onClose, children, className } = props
  BackDrop(isOpen)

  return (
    <div>
      {isOpen && <div className='fixed inset-0 z-40 bg-black bg-opacity-50' onClick={onClose} />}

      {/* Drawer */}
      <div
        className={twMerge(
          'fixed top-0 left-0 right-0 z-50',
          'max-h-[100dvh] bg-white transition-transform duration-300 shadow-lg',
          isOpen ? 'translate-y-0' : '-translate-y-full',
          className
        )}
      >
        {/* Isi drawer */}
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Drawer
