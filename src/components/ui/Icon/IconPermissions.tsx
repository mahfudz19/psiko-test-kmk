import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconPermissions = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      width={`${fontSize}`}
      height={`${fontSize}`}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 48 48'
    >
      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeWidth='4'>
        <path strokeLinejoin='round' d='M20 10H6a2 2 0 0 0-2 2v26a2 2 0 0 0 2 2h36a2 2 0 0 0 2-2v-2.5' />
        <path d='M10 23h8m-8 8h24' />
        <circle cx='34' cy='16' r='6' fill='currentColor' strokeLinejoin='round' />
        <path strokeLinejoin='round' d='M44 28.419C42.047 24.602 38 22 34 22s-5.993 1.133-8.05 3' />
      </g>
    </svg>
  )
})

IconPermissions.displayName = 'IconPermissions'

export default IconPermissions
