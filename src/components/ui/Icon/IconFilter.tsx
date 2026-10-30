import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconFilter = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
        fill='currentColor'
        d='M9 5a1 1 0 1 0 0 2a1 1 0 0 0 0-2M6.17 5a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 0 1 0-2zM15 11a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2zM9 17a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2z'
      />
    </svg>
  )
})

IconFilter.displayName = 'IconFilter'

export default IconFilter
