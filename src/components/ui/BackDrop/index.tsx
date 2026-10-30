import { HTMLAttributes, ReactNode, forwardRef } from 'react'
import ReactDOM from 'react-dom'
import HiddenTransisiton from '@/components/utility/UI/HiddenTransisiton'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  open: boolean
  children?: ReactNode
  zIndex?: number
}

export type BackDropProps = MoreProps & HTMLAttributes<HTMLDivElement>

const BackDrop = forwardRef<HTMLDivElement, BackDropProps>((props: BackDropProps, ref) => {
  const { open, zIndex = 9999, ...rest } = props
  const { isVisible, shouldRender } = HiddenTransisiton(open)

  if (!shouldRender) return <></>

  return ReactDOM.createPortal(
    <div
      {...rest}
      ref={ref}
      className={twMerge(
        'bg-black/25',
        'transition-opacity duration-300',
        isVisible ? 'opacity-1' : 'opacity-0',
        'fixed top-0 bottom-0 right-0 left-0',
        'flex justify-center items-center',
        rest.className
      )}
      style={{ ...rest.style, zIndex }}
    />,
    document.body
  )
})

BackDrop.displayName = 'BackDrop'

export default BackDrop
