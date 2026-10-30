import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconOrgChart = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
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
      <path d='M22,18V20H2V18H22M22,4H15A3,3 0 0,0 12,7A3,3 0 0,0 9,4H2V6H9A1,1 0 0,1 10,7A1,1 0 0,1 9,8H2V10H9A3,3 0 0,0 12,13A3,3 0 0,0 15,10H22V8H15A1,1 0 0,1 14,7A1,1 0 0,1 15,6H22V4Z' />
    </svg>
  )
})

IconOrgChart.displayName = 'IconOrgChart'

export default IconOrgChart
