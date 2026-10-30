import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconUndo = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
        d='M8.53 6.53a.75.75 0 0 0-1.06-1.06zM5 9l-.53-.53a.75.75 0 0 0 0 1.06zm2.47 3.53a.75.75 0 0 0 1.06-1.06zM5 16.25a.75.75 0 0 0 0 1.5zM7.47 5.47l-3 3l1.06 1.06l3-3zm-3 4.06l3 3l1.06-1.06l-3-3zm.53.22h11v-1.5H5zM19.25 13A3.25 3.25 0 0 1 16 16.25v1.5A4.75 4.75 0 0 0 20.75 13zM16 9.75A3.25 3.25 0 0 1 19.25 13h1.5A4.75 4.75 0 0 0 16 8.25zm-11 8h11v-1.5H5z'
      />
    </svg>
  )
})

IconUndo.displayName = 'IconUndo'

export default IconUndo
