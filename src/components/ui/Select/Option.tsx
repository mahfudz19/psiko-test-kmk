import React, { forwardRef, OptionHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export interface OptionProps extends OptionHTMLAttributes<HTMLDivElement> {
  value?: string | number
  children?: React.ReactNode
  disabled?: boolean
}

const Option = forwardRef<HTMLDivElement, OptionProps>(({ value, children, className, disabled, ...rest }, ref) => (
  <div
    ref={ref}
    data-value={value}
    tabIndex={disabled ? undefined : -1}
    aria-disabled={disabled}
    className={twMerge(
      'px-2 py-1 duration-300 flex justify-between sm:rounded-lg',
      'cursor-pointer outline-none',
      'focus-visible:ring-2 focus:rounded-lg focus-visible:ring-offset-2 focus-visible:ring-primary-main focus-visible:bg-secondary-light/25',
      disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-secondary-light/25',
      'last:border-none border-b border-gray-300 sm:border-0',
      className
    )}
    {...rest}
  >
    {children}
  </div>
))

Option.displayName = 'Option'
export default Option
