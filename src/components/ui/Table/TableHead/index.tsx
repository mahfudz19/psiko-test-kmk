import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {}

export type TableProps = HTMLAttributes<HTMLTableSectionElement> & MoreProps

const TableHead = forwardRef<HTMLTableSectionElement, TableProps>(({ className, ...rest }, ref) => {
  return (
    <thead
      ref={ref}
      className={twMerge(
        'table-header-group uppercase text-xs align-middle border-inherit text-text-secondary dark:text-gray-400',
        className
      )}
      {...rest}
    />
  )
})

TableHead.displayName = 'TableHead'

export default TableHead
