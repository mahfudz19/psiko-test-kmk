'use client'

import React from 'react'
import styles from './scrollbar-hide.module.css'
import { twMerge } from 'tailwind-merge'
import IconChevronLeft from '../Icon/IconChevronLeft'
import IconChevronRight from '../Icon/IconChevronRight'
import IconChevronDown from '../Icon/IconChevronDown'
import Tab, { TabProps } from './Tab'
import { cva, VariantProps } from 'class-variance-authority'
import Box from '../Box'
import Ripple from '../Ripple'

const IsHorizontalz = (props: TabsProps) => {
  const {
    value,
    onChange,
    orientation = 'horizontal',
    children,
    variant,
    color,
    classNames,
    align,
    noRipple,
    hideScrollButtons // <-- 1. Destructure prop baru
  } = props
  const [showLeftControl, setShowLeftControl] = React.useState(false)
  const [showRightControl, setShowRightControl] = React.useState(false)

  const tabsRef = React.useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (tabsRef.current) tabsRef.current.scrollBy({ left: -200, behavior: 'smooth' })
  }
  const scrollRight = () => {
    if (tabsRef.current) tabsRef.current.scrollBy({ left: 200, behavior: 'smooth' })
  }

  const checkOverflow = React.useCallback(() => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
      setShowLeftControl(scrollLeft > 0)
      setShowRightControl(scrollLeft + clientWidth < scrollWidth - 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hook = TabsHook(tabsRef, children, checkOverflow, orientation, value, color, variant, noRipple, onChange, align)
  const { handleKeyDown, handleKeyUp, tabElements, activeTabRef } = hook

  const positionActiveTab = activeTabRef

  return (
    <>
      {/* 2. Bungkus tombol dengan conditional rendering */}
      {!hideScrollButtons && (
        <button
          type='button'
          className={twMerge(
            'transition-opacity duration-50 absolute left-0 top-0 bottom-0 w-5',
            'shadow-sm inline-flex justify-center items-center bg-inherit rounded-l-[inherit]',
            'group-hover:opacity-100 group-hover:z-[11]',
            !showLeftControl ? 'opacity-0 pointer-events-none' : 'z-[11] opacity-100 pointer-events-auto',
            classNames?.['button-start']
          )}
          style={{ boxShadow: '6px 0px 6px -3px rgba(0, 0, 0, 0.1)' }}
          tabIndex={-1}
          onClick={scrollLeft}
        >
          <IconChevronLeft className='h-4 w-4' />
        </button>
      )}

      <Box
        ref={tabsRef}
        className={twMerge(
          'group rounded-[inherit]',
          'flex flex-nowrap gap-2 overflow-x-auto relative h-full p-1',
          'focus-visible:outline-none',
          styles.scrollbarHide,
          classNames?.container
        )}
        role='tablist'
        aria-orientation='horizontal'
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* selector */}
        <Box
          className={twMerge('', variantSelectors({ variant, orientation, color }), classNames?.selector)}
          style={{
            bottom: `${positionActiveTab?.bottom}px`,
            top: `${positionActiveTab?.top}px`,
            left: `${positionActiveTab?.left}px`,
            width: `${positionActiveTab?.width}px`,
            right: `${positionActiveTab?.right}px`,
            height: `${positionActiveTab?.height}px`
          }}
        />
        {tabElements}
      </Box>

      {/* 2. Bungkus tombol dengan conditional rendering */}
      {!hideScrollButtons && (
        <button
          type='button'
          className={twMerge(
            'transition-opacity duration-50 absolute right-0 top-0 bottom-0 w-5',
            'shadow-sm inline-flex justify-center items-center bg-inherit rounded-r-[inherit]',
            'group-hover:opacity-100 group-hover:z-[11]',
            !showRightControl ? 'opacity-0 pointer-events-none' : 'z-[11] opacity-100 pointer-events-auto',
            classNames?.['button-end']
          )}
          style={{ boxShadow: '-5px 0px 5px -3px rgba(0, 0, 0, 0.1)' }}
          onClick={scrollRight}
          tabIndex={-1}
        >
          <IconChevronRight className='h-4 w-4' />
        </button>
      )}
    </>
  )
}

const IsVertical = (props: TabsProps) => {
  const {
    value,
    onChange,
    orientation = 'horizontal',
    children,
    color,
    variant,
    classNames,
    noRipple,
    hideScrollButtons // <-- 1. Destructure prop baru
  } = props
  const [showTopControl, setShowTopControl] = React.useState(false)
  const [showBottomControl, setShowBottomControl] = React.useState(false)

  const tabsRef = React.useRef<HTMLDivElement>(null)

  const scrollUp = () => {
    if (tabsRef.current) tabsRef.current.scrollBy({ top: -200, behavior: 'smooth' })
  }

  const scrollDown = () => {
    if (tabsRef.current) tabsRef.current.scrollBy({ top: 200, behavior: 'smooth' })
  }

  const checkOverflow = React.useCallback(() => {
    if (tabsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tabsRef.current
      setShowTopControl(scrollTop > 0)
      setShowBottomControl(scrollTop + clientHeight < scrollHeight - 1) // -1 for rounding errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hook = TabsHook(tabsRef, children, checkOverflow, orientation, value, color, variant, noRipple, onChange)
  const { handleKeyDown, handleKeyUp, tabElements, activeTabRef } = hook

  const positionActiveTab = activeTabRef

  return (
    <>
      {/* 2. Bungkus tombol dengan conditional rendering */}
      {!hideScrollButtons && (
        <button
          type='button'
          className={twMerge(
            'transition-opacity duration-50 absolute left-0 top-0 right-0 h-5',
            'shadow-sm inline-flex justify-center items-center bg-inherit rounded-t-[inherit]',
            'group-hover:opacity-100 group-hover:z-[11]',
            !showTopControl ? 'opacity-0 pointer-events-none' : 'z-[11] opacity-100 pointer-events-auto',
            classNames?.['button-start']
          )}
          style={{ boxShadow: '0px 3px 6px -3px rgba(0, 0, 0, 0.1)' }}
          onClick={scrollUp}
          tabIndex={-1}
        >
          <IconChevronDown className='h-4 w-4 rotate-180' />
        </button>
      )}
      <Box
        ref={tabsRef}
        className={twMerge(
          'group rounded-[inherit]',
          'flex flex-col overflow-y-auto relative p-1',
          'focus-visible:outline-none',
          styles.scrollbarHide,
          classNames?.container
        )}
        role='tablist'
        aria-orientation='vertical'
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* selector */}
        <Box
          className={twMerge(variantSelectors({ variant, orientation, color }), classNames?.selector)}
          style={{
            bottom: `${positionActiveTab?.bottom}px`,
            top: `${positionActiveTab?.top}px`,
            left: `${positionActiveTab?.left}px`,
            width: `${positionActiveTab?.width}px`,
            right: `${positionActiveTab?.right}px`,
            height: `${positionActiveTab?.height}px`
          }}
        />
        {tabElements}
      </Box>
      {/* 2. Bungkus tombol dengan conditional rendering */}
      {!hideScrollButtons && (
        <button
          type='button'
          className={twMerge(
            'transition-opacity duration-50 absolute left-0 bottom-0 right-0 h-5',
            'shadow-sm inline-flex justify-center items-center bg-inherit rounded-b-[inherit]',
            'group-hover:opacity-100 group-hover:z-[11]',
            !showBottomControl ? 'opacity-0 pointer-events-none' : 'z-[11] opacity-100 pointer-events-auto',
            classNames?.['button-end']
          )}
          style={{ boxShadow: '0px -3px 6px -3px rgba(0, 0, 0, 0.1)' }}
          onClick={scrollDown}
          tabIndex={-1}
        >
          <IconChevronDown className='h-4 w-4' />
        </button>
      )}
    </>
  )
}

const TabsHook = (
  tabsRef: React.RefObject<HTMLDivElement | null>,
  children: React.ReactNode,
  checkOverflow: () => void,
  orientation: 'vertical' | 'horizontal',
  value: string,
  color: VariantProps<typeof variants>['color'] = 'white',
  variant: VariantProps<typeof variants>['variant'] = 'light',
  noRipple?: boolean,
  onChange?: (event: React.SyntheticEvent, newValue: string) => void,
  align: 'right' | 'left' | undefined = 'left'
) => {
  let tabRefs = React.useRef<(HTMLDivElement | null)[]>([])
  let firstLoadRefs = React.useRef<boolean>(true)
  let [activeTabRef, setActiveTabRef] = React.useState<{
    left: number
    top: number
    width: number
    height: number
    x: number
    y: number
    bottom: number
    right: number
    toJSON(): any
  } | null>(null)

  const tabsArray = React.Children.toArray(children).filter(
    child => React.isValidElement(child) && child.type === Tab
  ) as React.ReactElement<TabProps>[]
  const activeIndex = tabsArray.findIndex(tab => tab.props.value === value)

  const findNextFocusableIndex = (currentIndex: number, direction: 'next' | 'prev') => {
    const total = tabsArray.length
    let nextIndex = currentIndex
    let attempts = 0

    while (attempts < total) {
      attempts++
      if (direction === 'next') nextIndex = (nextIndex + 1) % total
      else nextIndex = (nextIndex - 1 + total) % total

      if (!tabsArray[nextIndex].props.disabled) return nextIndex
    }

    return currentIndex
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusedElement = document.activeElement as HTMLElement
    const items = tabRefs.current.filter(Boolean) as HTMLElement[]

    const focusedIndex = items.findIndex(el => el === focusedElement)

    // ✅ Jika pengguna menekan Shift + Tab pada tab pertama, biarkan keluar dari tablist
    if (e.key === 'Tab' && e.shiftKey && focusedIndex === 0) return

    // ✅ Jika pengguna menekan Tab pada tab terakhir, biarkan keluar dari tablist
    if (e.key === 'Tab' && !e.shiftKey && focusedIndex === items.length - 1) return

    if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault()
      const prevIndex = findNextFocusableIndex(focusedIndex !== -1 ? focusedIndex : activeIndex, 'prev')
      if (items[prevIndex]) items[prevIndex].focus()
    } else if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
      e.preventDefault()
      const nextIndex = findNextFocusableIndex(focusedIndex !== -1 ? focusedIndex : activeIndex, 'next')
      if (items[nextIndex]) items[nextIndex].focus()
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusedElement = document.activeElement as HTMLElement
    const items = tabRefs.current.filter(Boolean) as HTMLElement[]

    const focusedIndex = items.findIndex(el => el === focusedElement)

    // ✅ Jika pengguna menekan Shift + Tab pada tab pertama, biarkan keluar dari tablist
    if (e.key === 'Tab' && e.shiftKey && focusedIndex === 0) return

    // ✅ Jika pengguna menekan Tab pada tab terakhir, biarkan keluar dari tablist
    if (e.key === 'Tab' && !e.shiftKey && focusedIndex === items.length - 1) return

    if (e.key === 'Enter' || e.key === ' ') {
      if (focusedElement && focusedElement.getAttribute('role') === 'tab') {
        getActiveTabPosition(tabRefs.current[focusedIndex] || null)
        const value = focusedElement.getAttribute('data-value')
        if (value) onChange?.(e, value)
      }
    }
  }

  React.useEffect(() => {
    if (activeIndex !== -1 && tabsRef.current) {
      const activeTab = tabRefs.current[activeIndex]
      const container = tabsRef.current // Container dengan overflow
      getActiveTabPosition(activeTab)

      if (activeTab && container) {
        // Hitung posisi relatif dalam container
        const tabTop = activeTab.offsetTop
        const tabBottom = tabTop + activeTab.offsetHeight
        const tabLeft = activeTab.offsetLeft
        const tabRight = tabLeft + activeTab.offsetWidth

        const containerTop = container.scrollTop
        const containerBottom = containerTop + container.clientHeight
        const containerLeft = container.scrollLeft
        const containerRight = containerLeft + container.clientWidth

        const scrollOptions: ScrollToOptions = {}

        // Cek apakah perlu scroll secara vertikal
        if (tabTop < containerTop) {
          scrollOptions.top = tabTop
        } else if (tabBottom > containerBottom) {
          scrollOptions.top = tabBottom - container.clientHeight + 48
        }

        // Cek apakah perlu scroll secara horizontal
        if (tabLeft < containerLeft) {
          scrollOptions.left = tabLeft
        } else if (tabRight > containerRight) {
          scrollOptions.left = tabRight - container.clientWidth + 48
        }

        container.scrollTo(scrollOptions)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Initial check and on resize
  React.useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [checkOverflow])

  const debounceCheckOverflow = React.useRef<NodeJS.Timeout | null>(null)

  const handleScrollResize = () => {
    if (debounceCheckOverflow.current) clearTimeout(debounceCheckOverflow.current)
    debounceCheckOverflow.current = setTimeout(() => {
      checkOverflow()
    }, 100) // Delay 100ms
  }

  // Check on scroll
  React.useEffect(() => {
    if (!tabsRef.current) return

    const currentTabsRef = tabsRef.current
    window.addEventListener('resize', handleScrollResize)
    currentTabsRef.addEventListener('scroll', handleScrollResize)

    return () => {
      window.removeEventListener('resize', handleScrollResize)
      currentTabsRef.removeEventListener('scroll', handleScrollResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkOverflow, tabsRef])

  // Force check when orientation changes
  React.useEffect(() => checkOverflow(), [orientation, checkOverflow])

  // Focus management for keyboard navigation
  React.useEffect(() => {
    const handleTabFocus = (e: FocusEvent) => {
      if (tabsRef.current && tabsRef.current.contains(e.target as Node)) checkOverflow()
    }

    document.addEventListener('focusin', handleTabFocus)
    return () => document.removeEventListener('focusin', handleTabFocus)
  }, [checkOverflow, tabsRef])

  const getActiveTabPosition = (activeTab: HTMLDivElement | null) => {
    const theFunction = () => {
      if (!activeTab || !tabsRef.current) return null
      const parentRect = tabsRef.current.getBoundingClientRect()
      const rect = activeTab.getBoundingClientRect()

      // ✅ Pastikan posisi 'left' mempertimbangkan scroll horizontal
      const scrollTop = tabsRef.current.scrollTop
      const scrollLeft = tabsRef.current.scrollLeft

      const left = rect.left - parentRect.left + scrollLeft
      const top = rect.top - parentRect.top + scrollTop
      const width = rect.width
      const height = rect.height
      setActiveTabRef({ ...rect, left, top, width, height })
      firstLoadRefs.current = false
    }
    if (firstLoadRefs.current) setTimeout(theFunction, 200)
    else theFunction()
  }

  const tabElements = React.useMemo(
    () =>
      React.Children.map(children, (child, index) => {
        let alignClass = ''
        if (index === 0) alignClass = align === 'right' ? 'ml-auto' : ''

        if (React.isValidElement(child) && child.type === Tab) {
          const childValue = (child as React.ReactElement<TabProps>).props.value
          const isActive = childValue === value
          const defClass = isActive && color !== 'white' && ['contained', 'light'].includes(variant as any)

          return React.cloneElement(
            child as React.ReactElement<TabProps & { ref?: React.ForwardedRef<HTMLDivElement> }>,
            {
              ...(child as React.ReactElement<TabProps>).props,
              orientation,
              ref: (el: HTMLDivElement | null) => (tabRefs.current[index] = el),
              isActive,
              label: (
                <>
                  {(child as React.ReactElement<TabProps>).props.label}
                  {!noRipple && (
                    <Ripple color={defClass ? undefined : (color ?? 'white')} opacity={defClass ? undefined : 0.25} />
                  )}
                </>
              ),
              className: twMerge(
                alignClass,
                defClass ? 'text-white hover:text-gray-200' : '',
                (child as React.ReactElement<TabProps>).props.className
              ),
              onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                getActiveTabPosition(tabRefs.current[index])
                onChange?.(e, childValue)
              }
            }
          )
        }
        return child
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children, value, onChange]
  )

  return { handleKeyDown, handleKeyUp, tabElements, tabRefs, activeTabRef }
}

const variantSelectors = cva(
  ['absolute transition-all duration-300 rounded-[inherit] border-[0.5px] z-0 border-gray-200 dark:border-gray-600'],
  {
    variants: {
      color: {
        primary: ['bg-primary-main', 'border-primary-main'],
        secondary: ['bg-secondary-main', 'border-secondary-main'],
        success: ['bg-success-main', 'border-success-main'],
        error: ['bg-error-main', 'border-error-main'],
        warning: ['bg-warning-main', 'border-warning-main'],
        info: ['bg-info-main', 'border-info-main'],
        white: ['bg-background-paper']
      },
      orientation: {
        horizontal: 'border-b-2 border-l-0',
        vertical: 'border-b-0 border-l-2'
      },
      variant: {
        contained: ['shadow-sm'],
        underlined: ['border-t-0 bg-inherit dark:bg-inherit border-r-0 rounded-none'],
        outlined: ['border-2 bg-inherit dark:bg-inherit shadow-sm'],
        light: ['shadow-sm']
      }
    },
    defaultVariants: {
      color: 'white',
      variant: 'light',
      orientation: 'horizontal'
    }
  }
)

const variants = cva(['relative w-full'], {
  variants: {
    color: {
      primary: ['bg-primary-main', 'ring-primary-main'],
      secondary: ['bg-secondary-main', 'ring-secondary-main'],
      success: ['bg-success-main', 'ring-success-main'],
      error: ['bg-error-main', 'ring-error-main'],
      warning: ['bg-warning-main', 'ring-warning-main'],
      info: ['bg-info-main', 'ring-info-main'],
      white: ['']
    },
    variant: {
      contained: ['bg-background-default'],
      underlined: ['bg-inherit'],
      outlined: ['ring ring-2 ring-divider bg-inherit'],
      light: ['bg-inherit']
    },
    radius: {
      full: ['rounded-full'],
      lg: ['rounded-xl'],
      md: ['rounded-lg'],
      sm: ['rounded-md'],
      none: ['rounded-none']
    },
    orientation: {
      horizontal: 'flex flex-col',
      vertical: 'flex flex-row'
    }
  },
  defaultVariants: {
    color: 'white',
    variant: 'light',
    radius: 'lg',
    orientation: 'horizontal'
  }
})

interface MoreProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string
  onChange?: (event: React.SyntheticEvent, newValue: string) => void
  orientation?: 'horizontal' | 'vertical'
  children: React.ReactNode
  align?: 'right' | 'left'
  noRipple?: boolean
  hideScrollButtons?: boolean // <-- 3. Tambahkan prop baru di sini
  classNames?: {
    root?: string
    container?: string
    selector?: string
    'button-start'?: string
    'button-end'?: string
  }
}
export type TabsProps = VariantProps<typeof variants> & MoreProps

export default function Tabs(props: TabsProps) {
  const isHorizontal = props.orientation === 'vertical'
  const { variant, radius, className, color, classNames } = props

  return (
    <Box className={twMerge(variants({ variant, color, radius, className }), classNames?.root)}>
      {!isHorizontal ? <IsHorizontalz {...props} /> : <IsVertical {...props} />}
    </Box>
  )
}
