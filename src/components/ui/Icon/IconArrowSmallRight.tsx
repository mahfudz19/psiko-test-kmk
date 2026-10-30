import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconArrowSmallRight = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <g transform='translate(24 0) scale(-1 1)'>
        <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
          <path strokeDasharray='14' strokeDashoffset='14' d='M19 12H5.5'>
            <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.3s' values='14;0' />
          </path>
          <path strokeDasharray='8' strokeDashoffset='8' d='M5 12L10 17M5 12L10 7'>
            <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.3s' dur='0.2s' values='8;0' />
          </path>
        </g>
      </g>
    </svg>
  )
})

IconArrowSmallRight.displayName = 'IconArrowSmallRight'

export default IconArrowSmallRight
