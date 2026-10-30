'use client'

import type React from 'react'
import { forwardRef, HtmlHTMLAttributes, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import BackDrop from '@/components/utility/UI/BackDrop'
import HiddenTransisiton from '@/components/utility/UI/HiddenTransisiton'
import { twMerge } from 'tailwind-merge'

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => {
    refs.forEach(ref => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(node)
      } else {
        ;(ref as React.MutableRefObject<T | null>).current = node
      }
    })
  }
}

const calculatePosition = (
  anchor: AnchorPosition,
  anchorRect: DOMRect,
  popoverRect: DOMRect,
  scale = 1,
  gap = 0,
  onlyShowUpOrDown?: boolean,
  onlyShowCenterBody?: boolean // Tambahkan parameter baru
) => {
  const scrollX = window.scrollX || document.documentElement.scrollLeft
  const scrollY = window.scrollY || document.documentElement.scrollTop

  // Ensure popover stays within viewport
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const scaledWidth = popoverRect.width / scale
  const scaledHeight = popoverRect.height / scale

  let top: number | undefined
  let left = 0
  let bottom: number | undefined

  let maxHeight: number | undefined
  let transformOrigin: string | undefined

  if (onlyShowCenterBody) {
    let left = (viewportWidth - scaledWidth) / 2 + scrollX
    let top = (viewportHeight - scaledHeight) / 2 + scrollY

    if (left < scrollX) left = scrollX + 10
    else if (left + scaledWidth > scrollX + viewportWidth) left = scrollX + viewportWidth - scaledWidth - 10

    if (top < scrollY) top = scrollY + 10
    else if (top + scaledHeight > scrollY + viewportHeight) top = scrollY + viewportHeight - scaledHeight - 10

    return { top, left, transformOrigin: 'center center' }
  } else if (onlyShowUpOrDown) {
    const spaceBelow = viewportHeight - anchorRect.bottom
    const spaceAbove = anchorRect.top

    if (spaceBelow >= scaledHeight || spaceBelow >= spaceAbove) {
      top = anchorRect.bottom + scrollY + gap
      transformOrigin = getTransformOrigin('bottom')

      if (scaledHeight > spaceBelow) maxHeight = spaceBelow - gap
    } else {
      transformOrigin = getTransformOrigin('top')
      if (scaledHeight > spaceAbove) maxHeight = spaceAbove - gap

      bottom = viewportHeight - anchorRect.top - scrollY + gap
    }

    left = anchorRect.left + anchorRect.width / 2 - scaledWidth / 2 + scrollX

    if (left < scrollX) left = scrollX + 10
    else if (left + scaledWidth > scrollX + viewportWidth) left = scrollX + viewportWidth - scaledWidth - 10

    return { top, left, maxHeight, transformOrigin, bottom }
  } else {
    // Calculate position based on anchor value
    switch (anchor) {
      case 'top':
        top = anchorRect.top - scaledHeight + scrollY - gap
        left = anchorRect.left + anchorRect.width / 2 - scaledWidth / 2 + scrollX
        break
      case 'top-start':
        top = anchorRect.top - scaledHeight + scrollY - gap
        left = anchorRect.left + scrollX
        break
      case 'top-end':
        top = anchorRect.top - scaledHeight + scrollY - gap
        left = anchorRect.right - scaledWidth + scrollX
        break
      case 'bottom':
        top = anchorRect.bottom + scrollY + gap
        left = anchorRect.left + anchorRect.width / 2 - scaledWidth / 2 + scrollX
        break
      case 'bottom-start':
        top = anchorRect.bottom + scrollY + gap
        left = anchorRect.left + scrollX
        break
      case 'bottom-end':
        top = anchorRect.bottom + scrollY + gap
        left = anchorRect.right - scaledWidth + scrollX
        break
      case 'left':
        top = anchorRect.top + anchorRect.height / 2 - scaledHeight / 2 + scrollY
        left = anchorRect.left - scaledWidth + scrollX - gap
        break
      case 'left-start':
        top = anchorRect.top + scrollY
        left = anchorRect.left - scaledWidth + scrollX - gap
        break
      case 'left-end':
        top = anchorRect.bottom - scaledHeight + scrollY
        left = anchorRect.left - scaledWidth + scrollX - gap
        break
      case 'right':
        top = anchorRect.top + anchorRect.height / 2 - scaledHeight / 2 + scrollY
        left = anchorRect.right + scrollX + gap
        break
      case 'right-start':
        top = anchorRect.top + scrollY
        left = anchorRect.right + scrollX + gap
        break
      case 'right-end':
        top = anchorRect.bottom - scaledHeight + scrollY
        left = anchorRect.right + scrollX + gap
        break
      default:
        top = anchorRect.bottom + scrollY
        left = anchorRect.left + anchorRect.width / 2 - scaledWidth / 2 + scrollX
    }

    if (left < scrollX) left = scrollX + 10
    else if (left + scaledWidth > scrollX + viewportWidth) left = scrollX + viewportWidth - scaledWidth - 10

    if (top < scrollY) top = scrollY + 10
    else if (top + scaledHeight > scrollY + viewportHeight) top = scrollY + viewportHeight - scaledHeight - 10

    return { top, left }
  }
}

export const getTransformOrigin = (anchor: AnchorPosition) => {
  switch (anchor) {
    case 'top':
      return 'bottom center'
    case 'top-start':
      return 'bottom left'
    case 'top-end':
      return 'bottom right'
    case 'bottom':
      return 'top center'
    case 'bottom-start':
      return 'top left'
    case 'bottom-end':
      return 'top right'
    case 'left':
      return 'center right'
    case 'left-start':
      return 'top right'
    case 'left-end':
      return 'bottom right'
    case 'right':
      return 'center left'
    case 'right-start':
      return 'top left'
    case 'right-end':
      return 'bottom left'
    default:
      return 'bottom center'
  }
}

const HandlePositioning = (
  popoverRef: React.RefObject<HTMLDivElement | null>,
  anchor: AnchorPosition,
  scale = 0.5,
  gap = 5,
  shouldRender: boolean,
  anchorEl: HTMLElement | null,
  onlyShowUpOrDown?: boolean,
  onlyShowCenterBody?: boolean
) => {
  useEffect(() => {
    const popover = popoverRef.current
    if (!anchorEl || !shouldRender || !popover) return

    const anchorRect = anchorEl.getBoundingClientRect()
    const popoverRect = popover.getBoundingClientRect()

    const position = calculatePosition(
      anchor,
      anchorRect,
      popoverRect,
      scale,
      gap,
      onlyShowUpOrDown,
      onlyShowCenterBody
    )
    const { left, top, maxHeight, transformOrigin, bottom } = position
    popover.style.left = `${left}px`
    if (typeof top === 'number') popover.style.top = `${top}px`
    if (typeof bottom === 'number') popover.style.bottom = `${bottom}px`
    if (typeof maxHeight === 'number') popover.style.maxHeight = `${maxHeight}px`
    if (transformOrigin) popover.style.transformOrigin = transformOrigin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorEl, shouldRender, anchor])
}

const HandleKey = (
  popoverRef: React.RefObject<HTMLDivElement | null>,
  shouldRender: boolean,
  anchorEl: HTMLElement | null,
  onClose: (() => void) | undefined,
  onCloseKey: string[]
) => {
  const handleEvent = (event: MouseEvent | KeyboardEvent) => {
    if (event instanceof MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      )
        onClose?.()
    }

    if (event instanceof KeyboardEvent && onCloseKey.includes(event.key)) onClose?.()
  }
  useEffect(() => {
    if (!shouldRender) return

    document.addEventListener('mousedown', handleEvent)
    document.addEventListener('keydown', handleEvent)

    return () => {
      document.removeEventListener('mousedown', handleEvent)
      document.removeEventListener('keydown', handleEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender, anchorEl])
}

const FocusTrap = (popoverRef: React.RefObject<HTMLDivElement | null>, open: boolean) => {
  useEffect(() => {
    if (!open) return

    const handleTabKey = (e: KeyboardEvent) => {
      if (!popoverRef.current) return

      const focusableElements = popoverRef.current.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      )

      const focusable = Array.from(focusableElements).filter(
        el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
      )

      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement || !popoverRef.current.contains(document.activeElement)) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement || !popoverRef.current.contains(document.activeElement)) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [open, popoverRef])
}

const HandleLastFocusedElement = (open: boolean) => {
  const lastFocusedElement = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (open && !lastFocusedElement.current) lastFocusedElement.current = document.activeElement as HTMLElement
    else if (!open && lastFocusedElement.current) setTimeout(() => lastFocusedElement.current?.focus(), 50) // Kembalikan fokus setelah dialog tertutup
  }, [open])
}

type AnchorPosition =
  | 'top'
  | 'top-end'
  | 'top-start'
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'left-start'
  | 'left'
  | 'left-end'

interface MoreMenuProps {
  anchor?: AnchorPosition
  anchorEl: HTMLElement | null
  open: boolean
  onClose?: () => void
  children: React.ReactNode
  className?: string
  onCloseKey?: string[]
  zIndex?: number
  disableBackDrop?: boolean
  showBackDropColor?: boolean
  followWidthAnchor?: boolean
  onlyShowUpOrDown?: boolean
  onlyShowCenterBody?: boolean
  noLastFocusedElement?: boolean
  noHandleKey?: boolean
  focusTrap?: boolean
}

export type PopoverProps = HtmlHTMLAttributes<HTMLDivElement> & MoreMenuProps

const Popover = forwardRef<HTMLDivElement, PopoverProps>((props, forwardedRef) => {
  const {
    anchor = 'bottom',
    anchorEl,
    open,
    onClose,
    children,
    className,
    disableBackDrop,
    showBackDropColor,
    zIndex,
    style,
    onMouseEnter,
    onMouseLeave,
    followWidthAnchor,
    onlyShowUpOrDown,
    onlyShowCenterBody,
    noLastFocusedElement,
    noHandleKey,
    focusTrap,
    onCloseKey = ['Escape', 'Tab']
  } = props
  const popoverRef = useRef<HTMLDivElement>(null)

  const { isVisible, shouldRender } = HiddenTransisiton(open)
  if (!disableBackDrop) BackDrop(shouldRender)

  const scale = 0.5
  const gap = 10
  // Handle positioning
  HandlePositioning(popoverRef, anchor, scale, gap, shouldRender, anchorEl, onlyShowUpOrDown, onlyShowCenterBody)

  // Handle click outside & Escape key
  if (!noHandleKey) HandleKey(popoverRef, shouldRender, anchorEl, onClose, onCloseKey)

  // Handle achore focus
  if (!noLastFocusedElement) HandleLastFocusedElement(open)

  // Handle achore Focus Trap
  if (focusTrap) FocusTrap(popoverRef, open)

  if (!shouldRender) return null

  return createPortal(
    <>
      {/* Backdrop */}
      {showBackDropColor && (
        <div
          className={twMerge(
            'fixed inset-0 bg-black/50',
            'transition-opacity duration-300',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
          style={{ zIndex: 50 }}
        />
      )}
      <div
        id='presentation'
        ref={mergeRefs(popoverRef, forwardedRef)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={twMerge(
          'absolute transition-all duration-200',
          'bg-background-paper rounded-2xl shadow-lg',
          'max-h-[calc(100dvh-20px)] max-w-[calc(100dvw-20px)]',
          className
        )}
        style={{
          ...style,
          width: followWidthAnchor ? `${anchorEl?.offsetWidth || 0}px` : style?.width,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : `scale(${scale})`,
          ...(onlyShowUpOrDown ? {} : { transformOrigin: getTransformOrigin(anchor) }),
          zIndex: zIndex || style?.zIndex || 20
        }}
      >
        {children}
      </div>
    </>,
    document.body
  )
})

Popover.displayName = 'Popover'
export default Popover
