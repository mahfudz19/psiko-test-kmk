import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import TableCellClient from './client'

interface MoreProps {
  roundedHead?: 'top-none' | 'bottom-none' | 'all-none'
  component?: 'th' | 'td'
  colSpan?: number
  rowSpan?: number
  head?: boolean
  rounded?: boolean
  border?: boolean
  sort?: {
    sort?: 'ASC' | 'DESC'
    sortBy: string
    sortByActive?: string
    onHover: (sortBy: string, sort: 'ASC' | 'DESC') => void
  }
  noPedding?: boolean
}

export type TableCellProps = HTMLAttributes<HTMLTableDataCellElement> & MoreProps

const TableCell = forwardRef<HTMLTableDataCellElement, TableCellProps>((props, ref) => {
  const { component, className, head, children, rounded = true, border, noPedding, sort, roundedHead, ...rest } = props

  const Component = component ? component : head ? 'th' : 'td'

  const classNameTwMerge = twMerge(
    'table-cell align-[inherit]',
    !noPedding && 'px-6 py-3',
    border ? 'border border-divider' : 'border-inherit',
    rounded && 'first:rounded-l-xl last:rounded-r-xl',
    head &&
      'bg-gray-50 dark:bg-gray-700 relative after:block last:after:hidden after:content-[""] after:w-[0.0625rem] after:h-[calc(100%-1rem)] after:bg-gray-300 after:dark:bg-gray-600 after:absolute after:right-0 after:top-0 after:bottom-0 after:m-auto',
    roundedHead === 'top-none' && 'first:rounded-tl-none last:rounded-tr-none',
    roundedHead === 'bottom-none' && 'first:rounded-bl-none last:rounded-br-none',
    roundedHead === 'all-none' &&
      'first:rounded-bl-none last:rounded-br-none first:rounded-tl-none last:rounded-tr-none',
    className
  )

  if (sort) return <TableCellClient {...props} sort={sort} ref={ref} />

  return (
    <Component ref={ref} className={classNameTwMerge} {...rest}>
      {children}
    </Component>
  )
})

TableCell.displayName = 'TableCell'

export default TableCell
