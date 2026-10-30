import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconInstagram = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
        <path
          strokeDasharray='66'
          strokeDashoffset='66'
          d='M12 3H8C5.23858 3 3 5.23858 3 8V16C3 18.7614 5.23858 21 8 21H16C18.7614 21 21 18.7614 21 16V8C21 5.23858 18.7614 3 16 3z'
        >
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.6s' values='66;132' />
        </path>
        <path
          strokeDasharray='26'
          strokeDashoffset='26'
          d='M12 8C14.20914 8 16 9.79086 16 12C16 14.20914 14.20914 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8'
        >
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.7s' dur='0.4s' values='26;0' />
        </path>
      </g>
      <circle cx='17' cy='7' r='1.5' fill='currentColor' fillOpacity='0'>
        <animate fill='freeze' attributeName='fill-opacity' begin='1.1s' dur='0.4s' values='0;1' />
      </circle>
    </svg>
  )
})

IconInstagram.displayName = 'IconInstagram'

export default IconInstagram
