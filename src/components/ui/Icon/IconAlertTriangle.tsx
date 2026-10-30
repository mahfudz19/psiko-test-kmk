import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconAlertTriangle = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      fill='inherit'
    >
      <path
        d='M12 9v4m0 4h.01M10.29 3.86l-8.4 14.54A1 1 0 003 20h18a1 1 0 00.85-1.53L13.71 3.86a1 1 0 00-1.71 0z'
        stroke='white'
        strokeWidth={2.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
})

IconAlertTriangle.displayName = 'IconAlertTriangle'

export default IconAlertTriangle
