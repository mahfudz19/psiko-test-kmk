import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconParkOutlinePage = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      xmlns='http://www.w3.org/2000/svg'
      width={`${fontSize}`}
      height={`${fontSize}`}
      viewBox='0 0 48 48'
    >
      <g fill='none' stroke='currentColor' strokeLinejoin='round' strokeWidth='4'>
        <rect width='36' height='36' x='6' y='6' rx='3' />
        <path strokeLinecap='round' d='M6 17h36M17 42V17' />
      </g>
    </svg>
  )
})

IconParkOutlinePage.displayName = 'IconParkOutlinePage'

export default IconParkOutlinePage
