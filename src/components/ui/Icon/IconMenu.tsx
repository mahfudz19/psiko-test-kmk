import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconMenu = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      width={`${fontSize}`}
      height={`${fontSize}`}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      <g
        fill='none'
        stroke='currentColor'
        strokeDasharray='24'
        strokeDashoffset='24'
        strokeLinecap='round'
        strokeWidth='2'
      >
        <path d='M5 5H19'>
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.2s' values='24;0' />
        </path>
        <path d='M5 12H19'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.2s' dur='0.2s' values='24;0' />
        </path>
        <path d='M5 19H19'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.4s' dur='0.2s' values='24;0' />
        </path>
      </g>
    </svg>
  )
})

IconMenu.displayName = 'IconMenu'

export default IconMenu
