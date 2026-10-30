import React, { forwardRef, HtmlHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export type BoxProps = HtmlHTMLAttributes<HTMLElement> & {
  component?: React.ElementType
}

const Box = forwardRef<HTMLDivElement, BoxProps>(({ component: Comp = 'div', className, ...rest }, ref) => {
  return <Comp {...rest} ref={ref} className={twMerge('bg-inherit text-inherit rounded-[inherit]', className)} />
})

Box.displayName = 'Box'
export default Box
