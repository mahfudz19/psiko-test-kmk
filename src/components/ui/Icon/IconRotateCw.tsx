import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconRotateCw = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 20, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      width={`${fontSize}`}
      height={`${fontSize}`}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
        <path d='M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8' />
        <path d='M21 3v5h-5' />
      </g>
    </svg>
  )
})

IconRotateCw.displayName = 'IconRotateCw'

export default IconRotateCw
