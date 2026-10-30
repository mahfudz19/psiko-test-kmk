import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconHeadingH1 = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      xmlns='http://www.w3.org/2000/svg'
      width={`${fontSize}`}
      height={`${fontSize}`}
      version='1.1'
      id='Icons'
      viewBox='0 0 24 24'
      fill='none'
    >
      <g id='Edit / Heading_H1'>
        <path
          id='Vector'
          d='M16 10L19 9L19 19M3 5V12M3 12V19M3 12H11M11 5V12M11 12V19'
          stroke='#000000'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
    </svg>
  )
})

IconHeadingH1.displayName = 'IconHeadingH1'

export default IconHeadingH1
