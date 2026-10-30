import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconDots = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      xmlns='http://www.w3.org/2000/svg'
      width={`${fontSize}`}
      height={`${fontSize}`}
      viewBox='0 0 20 20'
    >
      <g fill='currentColor'>
        <circle cx='10' cy='15' r='2' />
        <circle cx='10' cy='10' r='2' />
        <circle cx='10' cy='5' r='2' />
      </g>
    </svg>
  )
})

IconDots.displayName = 'IconDots'

export default IconDots
