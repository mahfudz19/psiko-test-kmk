import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {}

export type TableProps = HTMLAttributes<HTMLTableSectionElement> & MoreProps

const TableBody = forwardRef<HTMLTableSectionElement, TableProps>(({ className, ...rest }, ref) => {
  return (
    <tbody
      ref={ref}
      className={twMerge('table-row-group align-middle border-inherit text-text-primary dark:text-gray-200', className)}
      {...rest}
    />
  )
})

TableBody.displayName = 'TableBody'

export default TableBody
