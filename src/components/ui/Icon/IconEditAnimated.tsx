import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconEditAnimated = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
        <path strokeDasharray='20' strokeDashoffset='20' d='M3 21H21'>
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.3s' values='20;0' />
        </path>
        <path strokeDasharray='44' strokeDashoffset='44' d='M7 17V13L17 3L21 7L11 17H7'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.4s' dur='0.6s' values='44;0' />
        </path>
        <path strokeDasharray='8' strokeDashoffset='8' d='M14 6L18 10'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='1s' dur='0.2s' values='8;0' />
        </path>
      </g>
    </svg>
  )
})

IconEditAnimated.displayName = 'IconEditAnimated'

export default IconEditAnimated
