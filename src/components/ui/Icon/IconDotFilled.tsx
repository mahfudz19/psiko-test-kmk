import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconDotFilled = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      xmlns='http://www.w3.org/2000/svg'
      width={`${fontSize}`}
      height={`${fontSize}`}
      viewBox='0 0 15 15'
    >
      <path fill='currentColor' d='M9.875 7.5a2.375 2.375 0 1 1-4.75 0a2.375 2.375 0 0 1 4.75 0Z' />
    </svg>
  )
})

IconDotFilled.displayName = 'IconDotFilled'

export default IconDotFilled
