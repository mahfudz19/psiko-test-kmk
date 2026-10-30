import React, { forwardRef } from 'react'
import { IconProps } from './Type'
import { twMerge } from 'tailwind-merge'
import variantsIcon from './variant'

const IconPaperclip = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      fill='currentColor'
    >
      <path d='M21.44 11.05L12.36 20.13a5 5 0 0 1-7.07-7.07l8.49-8.49a3.5 3.5 0 0 1 4.95 4.95l-8.49 8.49a1.5 1.5 0 0 1-2.12-2.12l7.07-7.07' />
    </svg>
  )
})

IconPaperclip.displayName = 'IconPaperclip'

export default IconPaperclip
