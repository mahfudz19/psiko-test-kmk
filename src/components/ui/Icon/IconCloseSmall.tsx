import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconCloseSmall = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
        strokeDasharray='16'
        strokeDashoffset='16'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='3'
      >
        <path d='M7 7l10 10'>
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.4s' values='16;0' />
        </path>
        <path d='M17 7l-10 10'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.4s' dur='0.4s' values='16;0' />
        </path>
      </g>
    </svg>
  )
})

IconCloseSmall.displayName = 'IconCloseSmall'

export default IconCloseSmall
