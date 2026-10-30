import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconConfirm = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <path
        fill='none'
        stroke='currentColor'
        strokeDasharray='24'
        strokeDashoffset='24'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M5 11L11 17L21 7'
      >
        <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.4s' values='24;0' />
      </path>
    </svg>
  )
})

IconConfirm.displayName = 'IconConfirm'

export default IconConfirm
