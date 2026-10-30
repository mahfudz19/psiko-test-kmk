'use client'
import { cva } from 'class-variance-authority'
import { HTMLAttributes, ReactNode, RefObject, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import IconCloseSmall from '@/components/ui/Icon/IconCloseSmall'
import Typography from '@/components/ui/Typograph'
import BackDrop from '@/components/utility/UI/BackDrop'
import HiddenTransisiton from '@/components/utility/UI/HiddenTransisiton'
import { twMerge } from 'tailwind-merge'
import IconButton from '../IconButton'

interface MoreProps {
  open: boolean
  onClose?: () => void
  title?: string | ReactNode
  closeButtom?: boolean
  disabledClickAway?: boolean
  mobileClickAway?: boolean
  fullWidth?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  classNames?: { root?: string; title?: string; children?: string }
}

const useLastFocusedElement = (open: boolean) => {
  const lastFocusedElement = useRef<HTMLElement | null>(null)
  if (open) lastFocusedElement.current = document.activeElement as HTMLElement
  return () => setTimeout(() => lastFocusedElement.current?.focus(), 50)
}
// Omit native HTML `title` attribute (string) so our `title` prop can be ReactNode
export type DialogProps = MoreProps & Omit<HTMLAttributes<HTMLDivElement>, 'title'>

const variants = cva(['min-w-[19.375rem] my-8 align-middle transform rounded-xl shadow-xl bg-background-paper '], {
  variants: { maxWidth: { xs: 'max-w-md', sm: 'max-w-lg', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' } }
})

// ✅ Fokus pada elemen pertama dan looping fokus dalam dialog
const useFocusTrap = (
  shouldRender: boolean,
  focusableRefs: RefObject<HTMLElement[]>,
  dialogRef: RefObject<HTMLDivElement | null>,
  onClose?: () => void
) => {
  useEffect(() => {
    if (!shouldRender || !dialogRef.current) return

    // ✅ Ambil elemen yang bisa difokuskan hanya sekali
    focusableRefs.current = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        "button, [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex='-1'])"
      )
    )

    const firstElement = focusableRefs.current[0]
    const lastElement = focusableRefs.current[focusableRefs.current.length - 1]

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const dialogs = document.querySelectorAll("div[role='dialog']")
        if (dialogs.length > 0 && dialogs[dialogs.length - 1] === dialogRef.current) {
          event.preventDefault()
          onClose?.()
        }
      } else if (event.key === 'Tab' && focusableRefs.current.length > 0) {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // ✅ Fokus ke elemen pertama saat dialog dibuka
    setTimeout(() => firstElement?.focus(), 10)

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender])
}

const Dialog = (props: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const focusableRefs = useRef<HTMLElement[]>([]) // Menyimpan elemen fokusable
  const { open, onClose, title, children, className, closeButtom, maxWidth, disabledClickAway, fullWidth, classNames } =
    props

  const { isVisible, shouldRender } = HiddenTransisiton(open)
  const restoreFocus = useLastFocusedElement(open)

  BackDrop(shouldRender)

  useFocusTrap(shouldRender, focusableRefs, dialogRef, () => {
    restoreFocus()
    onClose?.()
  })
  const clickAway = disabledClickAway ? false : true

  if (!shouldRender) return null

  return createPortal(
    <div
      id='presentation'
      className={twMerge(
        'z-50 inset-0 overflow-y-auto overflow-x-hidden h-[100lvh] backdrop-blur-[0.125rem] bg-gray-500/25',
        'transition-opacity duration-200',
        'fixed top-0 bottom-0 right-0 left-0',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      {...(clickAway && { onClick: onClose })}
    >
      <div className='flex items-center justify-center min-h-screen'>
        {/* root */}
        <div
          ref={dialogRef}
          role='dialog'
          className={twMerge(
            'relative m-4',
            fullWidth && 'w-full',
            'text-left',
            'transition-all duration-200',
            variants({ maxWidth, className }),
            classNames?.root,
            isVisible ? 'scale-100' : 'scale-[1.025]'
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* Fallback fokus pertama */}
          <div tabIndex={0} className='absolute opacity-0' onFocus={() => focusableRefs.current[0]?.focus()} />
          {/* title */}
          {typeof title === 'string' ? (
            <Typography
              variant='h6'
              id='modal-headline'
              className={twMerge('p-4 mr-8', classNames?.title)}
              color='text-primary'
            >
              {title}
            </Typography>
          ) : (
            (title ?? <></>)
          )}
          {/* close button */}
          {closeButtom && (
            <IconButton
              tabIndex={-1}
              color='error'
              variant='text'
              sizes='small'
              className='absolute top-2 right-2 z-10 p-0.5 bg-error-main/50'
              onClick={onClose}
              noRipple
            >
              <IconCloseSmall fontSize={15} color='white' />
            </IconButton>
          )}
          {/* children */}
          <div className={classNames?.children}>{children}</div>
          {/* Fallback fokus terakhir */}
          <div tabIndex={0} className='absolute opacity-0' onFocus={() => focusableRefs.current[0]?.focus()} />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Dialog
