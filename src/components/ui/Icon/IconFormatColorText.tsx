import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconFormatColorText = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      xmlns='http://www.w3.org/2000/svg'
      width={`${fontSize}`}
      height={`${fontSize}`}
      fill='#000000'
      version='1.1'
      id='Icons'
      viewBox='0 0 32 32'
    >
      <g>
        <path d='M29,27H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h26c0.6,0,1-0.4,1-1S29.6,27,29,27z' />
        <path
          d='M5,24h4c0.6,0,1-0.4,1-1s-0.4-1-1-1H8.6l1.9-4h11.1l1.9,4H23c-0.6,0-1,0.4-1,1s0.4,1,1,1h4c0.6,0,1-0.4,1-1s-0.4-1-1-1
		h-1.4L16.9,3.6C16.7,3.2,16.4,3,16,3s-0.7,0.2-0.9,0.6L6.4,22H5c-0.6,0-1,0.4-1,1S4.4,24,5,24z M16,6.3l4.6,9.7h-9.2L16,6.3z'
        />
      </g>
    </svg>
  )
})

IconFormatColorText.displayName = 'IconFormatColorText'

export default IconFormatColorText
