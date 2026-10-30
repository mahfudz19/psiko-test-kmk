'use client'
import { ReactNode, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { MenuProps } from '../Menu'
import MenuHoverHook from '../Menu/MenuHoverHook'
import Popover from '../Popover'
import Arrow from './Arrow'

export interface TooltipProps {
  title: string | ReactNode
  open?: boolean
  anchor?: MenuProps['anchor']
  arrow?: boolean | string
  classNames?: { button?: string; menu?: string }
  noCursorInTooltip?: boolean
  children: ReactNode
  onClose?: () => void
}

const TooltipContent = ({
  title,
  anchor,
  arrow,
  classNames
}: Pick<TooltipProps, 'title' | 'anchor' | 'arrow' | 'classNames'>) => {
  const arrowColor = typeof arrow === 'string' ? arrow : ''
  return (
    <div
      className={twMerge(
        'text-sm relative',
        'rounded-lg p-1 min-w-[10rem]',
        'bg-secondary-dark/80 border-0 text-white min-w-fit',
        classNames?.menu
      )}
    >
      {title}
      {arrow !== undefined ? <Arrow position={anchor} color={arrowColor} /> : <></>}
    </div>
  )
}

const TooltipHover = (props: TooltipProps) => {
  let { title, children, anchor, classNames, noCursorInTooltip, arrow, ...rest } = props

  const { button, menu } = MenuHoverHook()
  if (noCursorInTooltip) {
    delete (menu as any).onMouseEnter
    delete (menu as any).onMouseLeave
  }

  return (
    <>
      <div {...button} className={twMerge('inline', classNames?.button)}>
        {children}
      </div>

      <Popover zIndex={50} {...menu} anchor={anchor} disableBackDrop {...rest} noLastFocusedElement>
        <TooltipContent title={title} anchor={anchor} arrow={arrow} classNames={classNames} />
      </Popover>
    </>
  )
}

const TooltipOpen = (props: TooltipProps & { open: boolean }) => {
  const { title, children, anchor, classNames, arrow, open, onClose, ...rest } = props
  const anchorRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div ref={anchorRef} className={twMerge('inline', classNames?.button)}>
        {children}
      </div>

      <Popover
        zIndex={50}
        open={anchorRef.current ? open : false}
        onClose={onClose}
        anchorEl={anchorRef.current}
        anchor={anchor}
        disableBackDrop
        noLastFocusedElement
        {...rest}
      >
        <TooltipContent title={title} anchor={anchor} arrow={arrow} classNames={classNames} />
      </Popover>
    </>
  )
}

const Tooltip = (props: TooltipProps) => {
  if (typeof props.open !== 'undefined') return <TooltipOpen {...props} open={props.open} />
  return <TooltipHover {...props} />
}

export default Tooltip
