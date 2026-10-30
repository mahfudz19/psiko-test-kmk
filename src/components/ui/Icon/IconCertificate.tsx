import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconCertificate = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <path d='M4,3C2.89,3 2,3.89 2,5V15C2,16.11 2.89,17 4,17H12V22L14,21L16,22V17H20C21.11,17 22,16.11 22,15V5C22,3.89 21.11,3 20,3H4M4,5H20V15H16V19L14,18.5L12,19V15H4V5Z' />
    </svg>
  )
})

IconCertificate.displayName = 'IconCertificate'

export default IconCertificate
