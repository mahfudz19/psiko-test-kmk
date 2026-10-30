import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconEducation = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
        d='M3.33 8L10 12l10-6l-10-6L0 6h10v2H3.33zM0 8v8l2-2.22V9.2L0 8zm10 12l-5-3l-2-1.2v-6l7 4.2l7-4.2v6L10 20z'
      />
    </svg>
  )
})

IconEducation.displayName = 'IconEducation'

export default IconEducation
