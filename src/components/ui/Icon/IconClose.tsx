import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconClose = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge('text-inherit', variantsIcon({ color, className }))}
      xmlns='http://www.w3.org/2000/svg'
      width={`${fontSize}`}
      height={`${fontSize}`}
      viewBox='0 0 24 24'
    >
      <path
        fill='none'
        stroke='currentColor'
        strokeDasharray='12'
        strokeDashoffset='12'
        strokeLinecap='round'
        strokeWidth='2'
        d='M12 12L19 19M12 12L5 5M12 12L5 19M12 12L19 5'
      >
        <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.4s' values='12;0' />
      </path>
    </svg>
  )
})

IconClose.displayName = 'IconClose'

export default IconClose
