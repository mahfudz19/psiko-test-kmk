import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconDocumentReportTwotone = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
        <path strokeDasharray='64' strokeDashoffset='64' d='M13 3l6 6v12h-14v-18h8'>
          <animate fill='freeze' attributeName='stroke-dashoffset' dur='0.6s' values='64;0' />
        </path>
        <path strokeDasharray='14' strokeDashoffset='14' strokeWidth='1' d='M12.5 3v5.5h6.5'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.7s' dur='0.2s' values='14;0' />
        </path>
        <path strokeDasharray='4' strokeDashoffset='4' d='M9 17v-3'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='0.9s' dur='0.2s' values='4;0' />
        </path>
        <path strokeDasharray='6' strokeDashoffset='6' d='M12 17v-4'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='1.1s' dur='0.2s' values='6;0' />
        </path>
        <path strokeDasharray='6' strokeDashoffset='6' d='M15 17v-5'>
          <animate fill='freeze' attributeName='stroke-dashoffset' begin='1.3s' dur='0.2s' values='6;0' />
        </path>
      </g>
      <path fill='currentColor' fillOpacity='0' d='M5 3H12.5V8.5H19V21H5V3Z'>
        <animate fill='freeze' attributeName='fill-opacity' begin='1.6s' dur='0.15s' values='0;0.3' />
      </path>
    </svg>
  )
})

IconDocumentReportTwotone.displayName = 'IconDocumentReportTwotone'

export default IconDocumentReportTwotone
