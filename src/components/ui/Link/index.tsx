'use client'
import NextLink, { LinkProps } from 'next/link'
import { AnchorHTMLAttributes, ReactNode, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import IconOpen from '../Icon/IconOpen'

type InternalLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode
    className?: string
    hover?: boolean
    hoverIcon?: boolean
  }

const Link = forwardRef<HTMLAnchorElement, InternalLinkProps>((props: InternalLinkProps, ref) => {
  const { children, className, hover, hoverIcon, ...restProps } = props

  return (
    <NextLink
      ref={ref}
      {...restProps}
      className={twMerge(
        'transition-colors duration-300',
        'outline-none',
        'ring-offset-2',
        'focus-visible:ring-2',
        'focus:ring-primary-main',
        !hover && 'text-primary-main',
        hover && 'hover:text-primary-main',
        hoverIcon && 'relative inline-flex gap-2 cursor-pointer group',
        className
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
      {hoverIcon && (
        <div>
          <IconOpen
            fontSize={15}
            className='self-start transition-opacity sm:opacity-0 group-hover:opacity-100'
            color='primary'
          />
        </div>
      )}
    </NextLink>
  )
})

Link.displayName = 'Link'

export default Link
