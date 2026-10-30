import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  gradian?: boolean
}

export type DividerProps = MoreProps & HTMLAttributes<HTMLDivElement>

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ children, className, gradian, ...rest }: DividerProps, ref) => {
    const gradiantheme =
      'border-t-0 w-full h-[0.05rem] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent'

    const gradianthemeLeft =
      'border-t-0 w-full h-[0.05rem] bg-gradient-to-r from-transparent to-gray-200 dark:to-gray-600'
    const gradianthemeRight =
      'border-t-0 w-full h-[0.05rem] bg-gradient-to-r from-gray-200 dark:from-gray-600 to-transparent'

    if (children) {
      return (
        <div ref={ref} className='flex items-center'>
          <div
            className={twMerge('flex-grow my-2 border-t border-t-divider', gradian && gradianthemeLeft, className)}
            {...rest}
          />
          <div className='mx-4'>{children}</div>
          <div
            className={twMerge('flex-grow my-2 border-t border-t-divider', gradian && gradianthemeRight, className)}
            {...rest}
          />
        </div>
      )
    }

    return <div className={twMerge('my-2 border-t border-t-divider', gradian && gradiantheme, className)} {...rest} />
  }
)

Divider.displayName = 'Divider'

export default Divider
