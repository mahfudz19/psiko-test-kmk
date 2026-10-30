'use client'
import { forwardRef, HTMLAttributes, JSX, ReactNode, useState } from 'react'
import { formatCaseString } from '@/components/utility/formats'
import { twMerge } from 'tailwind-merge'
import Table from '..'
import Collapse from '../../Collapse'
import IconChevronDown from '../../Icon/IconChevronDown'
import Typography from '../../Typograph'
import TableBody from '../TableBody'
import TableCell from '../TableCell'
import TableRow from '../TableRow'

export interface TableMobileContentProps<T extends Record<string, ReactNode>>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  avatar?: JSX.Element
  number?: string | number | JSX.Element
  title: string | number | JSX.Element
  subTitle?: string | number | JSX.Element
  more?: T
  moreImage?: JSX.Element
  endContent?: JSX.Element
  hover?: boolean
  action?: JSX.Element
  classNames?: {
    root?: string
    container?: string
    'more-content'?: string
  }
}

// export type AvatarProps = HTMLAttributes<HTMLDivElement> & MoreProps

const TableMobileContent = forwardRef<HTMLDivElement, TableMobileContentProps<Record<string, ReactNode>>>(
  (props, ref) => {
    const { avatar, title, subTitle, more, action, moreImage, number, endContent, hover, classNames, ...rest } = props
    const [open, setOpen] = useState(false)

    return (
      // root
      <div
        ref={ref}
        className={twMerge(
          'p-1 text-sm border-b border-divider',
          hover && 'hover:bg-secondary-light/25 dark:hover:bg-secondary-light/25',
          classNames?.root
        )}
        {...rest}
      >
        {/* container */}
        <div
          className={twMerge('flex items-center gap-2 my-1 min-h-[2.75rem]', classNames?.container)}
          onClick={() => setOpen(p => !p)}
        >
          <div className='flex items-center gap-2 w-[calc(100%-25px)] overflow-x-hidden'>
            {number && <span className='self-start mt-2 mr-1'>{number}</span>}
            {avatar && <div onClick={e => e.stopPropagation()}>{avatar}</div>}
            <div>
              <Typography component='h3' variant='subtitle2' fontWeight='semibold'>
                {title}
              </Typography>
              {subTitle && (
                <Typography component='span' variant='body2'>
                  {subTitle}
                </Typography>
              )}
            </div>
            {endContent && <div>{endContent}</div>}
          </div>
          {more && Object.keys(more).length > 0 && (
            <IconChevronDown className={`transition-transform duration-300 ${!open && 'rotate-90'}`} />
          )}
        </div>
        {/* more-content */}
        {more && Object.keys(more).length > 0 && (
          <Collapse isOpen={open}>
            <div className={twMerge('overflow-x-auto', classNames?.['more-content'])}>
              <Table noRoot className='mb-1'>
                <TableBody>
                  {Object.entries(more).map(([key, value]) => (
                    <TableRow evenOdd='reverse' key={key}>
                      <TableCell className='px-2 py-1 font-semibold capitalize'>{formatCaseString(key)}</TableCell>
                      <TableCell className='px-2 py-1 text-right'>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {moreImage && <div className='flex justify-center my-1'>{moreImage}</div>}
            {action && <div className='flex justify-end gap-1 my-1'>{action}</div>}
          </Collapse>
        )}
      </div>
    )
  }
)

TableMobileContent.displayName = 'TableMobileContent'

export default TableMobileContent
