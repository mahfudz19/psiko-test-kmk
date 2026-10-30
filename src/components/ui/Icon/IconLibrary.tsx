import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconLibrary = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <path d='M12,8A3,3 0 0,0 9,11V15A3,3 0 0,0 12,18A3,3 0 0,0 15,15V11A3,3 0 0,0 12,8M12,16A1,1 0 0,1 11,15V11A1,1 0 0,1 12,10A1,1 0 0,1 13,11V15A1,1 0 0,1 12,16M19,10V15A7,7 0 0,1 12,22A7,7 0 0,1 5,15V10H3V15A9,9 0 0,0 12,24A9,9 0 0,0 21,15V10H19Z' />
    </svg>
  )
})

IconLibrary.displayName = 'IconLibrary'

export default IconLibrary
