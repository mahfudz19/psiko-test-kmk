'use client'
import { Children, ReactNode, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type BreadcrumbsProps = {
  children: ReactNode
  className?: string
}

const Breadcrumbs = forwardRef<HTMLDivElement, BreadcrumbsProps>(({ children, className }: BreadcrumbsProps, ref) => {
  if (children) {
    return (
      <nav ref={ref} className={twMerge('inline-flex items-center text-sm', className)}>
        <ol className='flex flex-wrap list-none'>
          {Children.map(children, (child, index) => (
            <>
              {index !== 0 && (
                <li className='mx-1' key={`${index + 1}`}>
                  <span className='text-gray-400'>/</span>
                </li>
              )}
              <li className='mx-1' key={`${index + 2}`}>
                {child}
              </li>
            </>
          ))}
        </ol>
      </nav>
    )
  }

  return <div className='my-2 border-t border-t-divider' />
})

Breadcrumbs.displayName = 'Breadcrumbs'

export default Breadcrumbs
