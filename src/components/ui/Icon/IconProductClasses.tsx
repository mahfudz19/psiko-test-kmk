import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconProductClasses = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
        d='M7 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1ZM5 21a2 2 0 1 1 2-2a2 2 0 0 1-2 2Zm2-9H3V3h4Z'
      />
      <circle cx='5.01' cy='19.01' r='1' fill='currentColor' />
      <path fill='currentColor' d='M10.01 2v9.01h5V2h-5zM17 2v9.01h5V2h-5zm-6.99 11v9h5v-9h-5zM17 13v9h5v-9h-5z' />
    </svg>
  )
})

IconProductClasses.displayName = 'IconProductClasses'

export default IconProductClasses
