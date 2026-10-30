import { JSX, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface TableMobileProps {
  children: ReactNode
  showOnAllDevices?: boolean
  title?: string | number | JSX.Element
  moreContent?: JSX.Element
  removeHeader?: boolean
}

function TableMobile({ children, showOnAllDevices, title, moreContent, removeHeader }: TableMobileProps) {
  const Title = () => {
    return moreContent ? (
      <div className='flex items-center justify-between p-2 rounded-xl bg-gray-400/10 border-inherit'>
        <div className='text-xs font-semibold uppercase align-middle text-text-secondary dark:text-gray-400'>
          {!title ? 'Table' : title}
        </div>
        {moreContent}
      </div>
    ) : (
      <div className='p-2 text-xs font-semibold uppercase align-middle rounded-xl bg-gray-400/10 border-inherit text-text-secondary dark:text-gray-400'>
        {!title ? 'Table' : title}
      </div>
    )
  }

  return (
    <div className={twMerge('px-4 py-2', !showOnAllDevices && 'sm:hidden')}>
      {!removeHeader && <Title />}
      <div>{children}</div>
    </div>
  )
}

export default TableMobile
