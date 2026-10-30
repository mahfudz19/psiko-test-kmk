import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconIndeterminate = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
        strokeDasharray='18'
        strokeDashoffset='18'
        strokeLinecap='round'
        strokeWidth='3'
      >
        <path d='M5 12h14'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.3s' dur='0.3s' values='18;0' />
        </path>
      </g>
    </svg>
  )
})

IconIndeterminate.displayName = 'IconIndeterminate'

export default IconIndeterminate
