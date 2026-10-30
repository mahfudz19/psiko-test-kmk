import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconSort = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
        strokeWidth='2'
        d='M7 3h15M7 9h9m-9 6h15M2 2h2v2H2zm0 6h2v2H2zm0 6h2v2H2zm0 6h2v2H2zm5 1h9'
      />
    </svg>
  )
})

IconSort.displayName = 'IconSort'

export default IconSort
