import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconChevronLeft = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      xmlns='http://www.w3.org/2000/svg'
      width={`${fontSize}`}
      height={`${fontSize}`}
      viewBox='0 0 24 24'
    >
      <path
        fill='none'
        stroke='currentColor'
        strokeDasharray='10'
        strokeDashoffset='10'
        strokeLinecap='round'
        strokeWidth='2'
        d='M8 12L15 5M8 12L15 19'
      >
        <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.3s' values='10;0' />
      </path>
    </svg>
  )
})

IconChevronLeft.displayName = 'IconChevronLeft'

export default IconChevronLeft
