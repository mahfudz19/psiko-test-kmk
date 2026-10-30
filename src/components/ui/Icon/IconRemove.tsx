import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconRemove = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <g
        fill='none'
        stroke='currentColor'
        strokeDasharray='22'
        strokeDashoffset='22'
        strokeLinecap='round'
        strokeWidth='2'
      >
        <path d='M19 5L5 19'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.3s' dur='0.3s' values='22;0' />
        </path>
        <path d='M5 5L19 19'>
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.3s' values='22;0' />
        </path>
      </g>
    </svg>
  )
})

IconRemove.displayName = 'IconRemove'

export default IconRemove
