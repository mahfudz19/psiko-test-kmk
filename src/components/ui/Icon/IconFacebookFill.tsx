import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconFacebookFill = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeWidth='4'>
        <path strokeDasharray='24' strokeDashoffset='24' d='M17 4L15 4C12.5 4 11 5.5 11 8V20'>
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.4s' values='24;0' />
        </path>
        <path strokeDasharray='12' strokeDashoffset='12' d='M8 12H15'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.5s' dur='0.2s' values='12;0' />
        </path>
      </g>
    </svg>
  )
})

IconFacebookFill.displayName = 'IconFacebookFill'

export default IconFacebookFill
