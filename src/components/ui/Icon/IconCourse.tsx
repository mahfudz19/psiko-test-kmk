import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconCourse = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      xmlns='http://www.w3.org/2000/svg'
      width={`${fontSize}`}
      height={`${fontSize}`}
      viewBox='0 0 32 32'
    >
      <path
        fill='currentColor'
        d='M24 30H8a2.002 2.002 0 0 1-2-2V4a2.002 2.002 0 0 1 2-2h16a2.002 2.002 0 0 1 2 2v16.618l-5-2.5l-5 2.5V4H8v24h16v-4h2v4a2.003 2.003 0 0 1-2 2Zm-3-14.118l3 1.5V4h-6v13.382Z'
      />
    </svg>
  )
})

IconCourse.displayName = 'IconCourse'

export default IconCourse
