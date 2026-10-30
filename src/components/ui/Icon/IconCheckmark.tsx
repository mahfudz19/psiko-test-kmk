import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconCheckmark = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
        strokeWidth='2'
      >
        <path d='M6 12.5111L9.92308 17.24L18 6.5'>
          <animate
            fill='freeze'
            attributeName='stroke-dashoffset'
            begin='0s'
            dur='0.3s'
            values='18;0'
            keyTimes='0;1'
            keySplines='0.4 0 0.2 1'
          />
        </path>
      </g>
    </svg>
  )
})

IconCheckmark.displayName = 'IconCheckmark'

export default IconCheckmark
