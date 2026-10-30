import { HTMLProps, RefObject, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import Popover, { PopoverProps } from '../Popover'

interface MoreMenuProps {
  classNames?: {
    root?: HTMLProps<HTMLDivElement>['className']
    ul?: HTMLProps<HTMLDivElement>['className']
  }
  noAutoFocus?: boolean
}

export type MenuProps = PopoverProps & MoreMenuProps

const HookAutoFocus = (
  props: Omit<MenuProps, 'id' | 'children' | 'classNames' | 'className'> & {
    menuRef: RefObject<HTMLUListElement | null>
  }
) => {
  const { menuRef, open } = props
  useEffect(() => {
    if (!open) return
    const interval = setInterval(() => {
      if (menuRef.current) {
        menuRef.current?.focus?.()
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
}

const Menu = ({ id, children, classNames, className, noAutoFocus, ...rest }: MenuProps) => {
  const menuRef = useRef<HTMLUListElement>(null)
  if (!noAutoFocus) HookAutoFocus({ menuRef, ...rest })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const items = menuRef.current?.querySelectorAll('[role="menuitem"]')
    if (!items) return

    const currentIndex = Array.from(items).findIndex(item => item === document.activeElement)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % items.length
        ;(items[nextIndex] as HTMLElement).focus()
        break

      case 'ArrowUp':
        event.preventDefault()
        const prevIndex = (currentIndex - 1 + items.length) % items.length
        ;(items[prevIndex] as HTMLElement).focus()
        break

      case 'Enter':
        if (currentIndex !== -1) {
          ;(items[currentIndex] as HTMLElement).click()
        }
        break
    }
  }
  return (
    <Popover {...rest} className={classNames?.root} tabIndex={0}>
      <ul
        id={id}
        tabIndex={-1}
        ref={menuRef}
        onKeyDown={handleKeyDown}
        className={twMerge('p-2 text-sm text-gray-700 focus:outline-none focus:ring-0', className, classNames?.ul)}
      >
        {children}
      </ul>
    </Popover>
  )
}

export default Menu
