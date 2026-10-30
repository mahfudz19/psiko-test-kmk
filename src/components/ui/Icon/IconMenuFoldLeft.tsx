import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconMenuFoldLeft = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeWidth='2'>
        <path strokeDasharray='10' strokeDashoffset='10' d='M7 9L4 12L7 15'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.6s' dur='0.2s' values='10;0' />
        </path>
        <path strokeDasharray='16' strokeDashoffset='16' d='M19 5H5'>
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.2s' values='16;0' />
        </path>
        <path strokeDasharray='12' strokeDashoffset='12' d='M19 12H10'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.2s' dur='0.2s' values='12;0' />
        </path>
        <path strokeDasharray='16' strokeDashoffset='16' d='M19 19H5'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.4s' dur='0.2s' values='16;0' />
        </path>
      </g>
    </svg>
  )
})

IconMenuFoldLeft.displayName = 'IconMenuFoldLeft'

export default IconMenuFoldLeft
