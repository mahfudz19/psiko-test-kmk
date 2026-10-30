'use client'
import { HTMLAttributes, MutableRefObject, forwardRef, useCallback, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  isOpen: boolean
  duration?: number
  minCloseHeight?: number
  direction?: 'vertical' | 'horizontal'
}

export type CollapseProps = HTMLAttributes<HTMLDivElement> & MoreProps

const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
  ({ isOpen, duration = 300, className, children, minCloseHeight = 0, direction = 'vertical', ...rest }, ref) => {
    // DOM refs
    const outerRef = useRef<HTMLDivElement | null>(null)
    const childRef = useRef<HTMLDivElement | null>(null)

    // utility refs (no state)
    const observerRef = useRef<ResizeObserver | null>(null)
    const debounceRef = useRef<number | null>(null)

    // helper to set forwarded ref
    const setOuterRef = useCallback(
      (el: HTMLDivElement | null) => {
        outerRef.current = el
        if (!ref) return
        if (typeof ref === 'function') ref(el)
        else (ref as MutableRefObject<HTMLDivElement | null>).current = el
      },
      [ref]
    )

    const applyTransition = useCallback(() => {
      const outer = outerRef.current
      if (!outer) return
      // use inline transition to avoid tailwind dynamic class issues
      outer.style.transition = `max-height ${duration}ms ease-in-out, max-width ${duration}ms ease-in-out`
    }, [duration])

    const update = useCallback(
      (open: boolean) => {
        const outer = outerRef.current
        const child = childRef.current
        if (!outer || !child) return

        applyTransition()

        if (direction === 'vertical') {
          if (open) {
            const h = child.scrollHeight
            outer.style.maxHeight = `${h + 10}px`
          } else {
            outer.style.maxHeight = `${minCloseHeight}px`
          }
        } else {
          if (open) {
            outer.style.maxWidth = `100%`
          } else {
            outer.style.maxWidth = `${minCloseHeight}px`
          }
        }
      },
      [direction, minCloseHeight, applyTransition]
    )

    // observe child size changes but only update style, no state
    useEffect(() => {
      const child = childRef.current
      if (!child) return

      const debounced = () => {
        if (debounceRef.current) window.clearTimeout(debounceRef.current)
        debounceRef.current = window.setTimeout(() => {
          update(isOpen)
          debounceRef.current = null
        }, 80) as unknown as number
      }

      observerRef.current = new ResizeObserver(debounced)
      observerRef.current.observe(child)

      // initial apply
      // use rAF so layout is settled
      requestAnimationFrame(() => update(isOpen))

      return () => {
        observerRef.current?.disconnect()
        observerRef.current = null
        if (debounceRef.current) {
          window.clearTimeout(debounceRef.current)
          debounceRef.current = null
        }
      }
      // only re-run when update function changes
    }, [update, isOpen])

    // respond to isOpen changes immediately
    useEffect(() => {
      // schedule via rAF to allow DOM update before measuring
      requestAnimationFrame(() => update(isOpen))
    }, [isOpen, update])

    // respond to duration/minCloseHeight/direction changes (re-apply)
    useEffect(() => {
      applyTransition()
      requestAnimationFrame(() => update(isOpen))
    }, [duration, minCloseHeight, direction, applyTransition, update, isOpen])

    // sync styles directly on the element for isOpen / direction / minCloseHeight changes
    // (no state — directly mutate DOM so no extra re-renders)
    useEffect(() => {
      const outer = outerRef.current
      if (!outer) return

      // clear axis-specific styles to avoid conflicts
      if (direction === 'vertical') {
        outer.style.maxWidth = ''
      } else {
        outer.style.maxHeight = ''
      }

      if (direction === 'vertical') {
        outer.style.maxHeight = isOpen ? 'auto' : `${minCloseHeight}px`
      } else {
        outer.style.maxWidth = isOpen ? '100%' : `${minCloseHeight}px`
      }
    }, [isOpen, direction, minCloseHeight])

    return (
      <div {...rest} ref={setOuterRef} className={twMerge('overflow-hidden', className)}>
        <div ref={childRef}>{children}</div>
      </div>
    )
  }
)

Collapse.displayName = 'Collapse'

export default Collapse
