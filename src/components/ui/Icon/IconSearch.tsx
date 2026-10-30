import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconSearch = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 20, ...rest } = props

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
        <path strokeDasharray='16' strokeDashoffset='16' d='M10.5 13.5L3 21'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.4s' dur='0.2s' values='16;0' />
        </path>
        <path
          strokeDasharray='40'
          strokeDashoffset='40'
          d='M10.7574 13.2426C8.41421 10.8995 8.41421 7.10051 10.7574 4.75736C13.1005 2.41421 16.8995 2.41421 19.2426 4.75736C21.5858 7.10051 21.5858 10.8995 19.2426 13.2426C16.8995 15.5858 13.1005 15.5858 10.7574 13.2426Z'
        >
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.4s' values='40;0' />
        </path>
      </g>
    </svg>
  )
})

IconSearch.displayName = 'IconSearch'

export default IconSearch
