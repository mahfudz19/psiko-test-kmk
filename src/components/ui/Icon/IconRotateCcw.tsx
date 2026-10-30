import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconRotateCcw = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
        <path d='M3 12a9 9 0 1 0 9-9a9.75 9.75 0 0 0-6.74 2.74L3 8' />
        <path d='M3 3v5h5' />
      </g>
    </svg>
  )
})

IconRotateCcw.displayName = 'IconRotateCcw'

export default IconRotateCcw
