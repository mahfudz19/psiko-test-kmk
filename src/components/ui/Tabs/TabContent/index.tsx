import { cloneElement, forwardRef, HTMLAttributes, isValidElement, ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  value: string
  state: string
  lazyLoad?: boolean
}

export type TabContentProps = HTMLAttributes<HTMLElement> &
  MoreProps & {
    children: ReactElement<any> // Pastikan hanya satu elemen React yang diterima
  }

const TabContent = forwardRef<HTMLElement, TabContentProps>((props, ref) => {
  const { value, state, lazyLoad, children, ...rest } = props

  if (!isValidElement(children)) return <></>

  const isActive = state === value

  if (lazyLoad && !isActive) return <></>

  return cloneElement(children, {
    ...rest,
    ref, // Forward ref to the child
    className: twMerge(children.props.className, isActive ? '' : 'hidden'),
    role: 'tabpanel',
    id: children.props.id || 'profile',
    'aria-labelledby': children.props['aria-labelledby'] || 'profile-tab'
  })
})

TabContent.displayName = 'TabContent'

export default TabContent
