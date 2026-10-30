'use client'
import { ForwardedRef, ReactNode, useLayoutEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { TableCellProps } from '.'
import IconSortAsc from '../../Icon/IconSortAsc'
import IconSortDesc from '../../Icon/IconSortDesc'

interface HoverTableCellProps {
  children: ReactNode
  sortByActive?: string
  sortBy: string
  onClick: (sortBy: string, sort: 'ASC' | 'DESC') => void
  sort?: 'ASC' | 'DESC'
}

const HoverTableCell = ({ children, sortBy, sortByActive, onClick, sort }: HoverTableCellProps) => {
  const [enter, setEnter] = useState<{ show: boolean }>({
    show: false
  })

  useLayoutEffect(() => {
    setEnter(p => ({ ...p, show: sortByActive === sortBy ? true : false }))
  }, [sortByActive, sortBy])

  return (
    <div
      className='relative w-full'
      onMouseEnter={() => setEnter(p => ({ ...p, show: true }))}
      onMouseLeave={() => (sortByActive === sortBy ? null : setEnter(p => ({ ...p, show: false })))}
    >
      {children}
      <div className={`absolute top-1/2 -translate-y-1/2  -right-[15px] ${enter.show ? '' : 'opacity-0'}`}>
        {sort === 'ASC' && (
          <IconSortAsc
            fontSize={13}
            className='cursor-pointer'
            onClick={() => {
              setEnter(p => ({ ...p, sort: 'DESC' }))
              onClick(sortBy, 'DESC')
            }}
          />
        )}
        {sort === 'DESC' && (
          <IconSortDesc
            fontSize={13}
            className='cursor-pointer'
            onClick={() => {
              setEnter(p => ({ ...p, sort: 'ASC' }))
              onClick(sortBy, 'ASC')
            }}
          />
        )}
      </div>
    </div>
  )
}

type sort = {
  sort?: 'ASC' | 'DESC'
  sortBy: string
  sortByActive?: string
  onHover: (sortBy: string, sort: 'ASC' | 'DESC') => void
}

const TableCellClient = (props: TableCellProps & { sort: sort; ref: ForwardedRef<HTMLTableDataCellElement> }) => {
  const {
    component: Component = 'td',
    className,
    head,
    children,
    rounded = true,
    border,
    noPedding,
    sort,
    roundedHead,
    ref,
    ...rest
  } = props

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

  return (
    <Component ref={ref} className={classNameTwMerge} {...rest}>
      <HoverTableCell sortBy={sort.sortBy} onClick={sort.onHover} sortByActive={sort.sortByActive} sort={sort.sort}>
        {children}
      </HoverTableCell>
    </Component>
  )
}

export default TableCellClient
