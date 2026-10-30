import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconHomeMD = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <path fill='currentColor' fillOpacity='0' d='M6 8L12 3L18 8V20H16V13L15 12H9L8 13V20H6V8Z'>
        <animate fill='freeze' attributeName='fill-opacity' begin='0.9s' dur='0.15s' values='0;0.3' />
      </path>
      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
        <path strokeDasharray='21' strokeDashoffset='21' d='M5 21H19'>
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.2s' values='21;0' />
        </path>
        <path strokeDasharray='15' strokeDashoffset='15' d='M5 21V8M19 21V8'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.2s' dur='0.2s' values='15;0' />
        </path>
        <path strokeDasharray='24' strokeDashoffset='24' d='M9 21V13H15V21'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.4s' dur='0.4s' values='24;0' />
        </path>
        <path strokeDasharray='26' strokeDashoffset='26' d='M2 10L12 2L22 10'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.5s' dur='0.4s' values='26;0' />
        </path>
      </g>
    </svg>
  )
})

IconHomeMD.displayName = 'IconHomeMD'

export default IconHomeMD
