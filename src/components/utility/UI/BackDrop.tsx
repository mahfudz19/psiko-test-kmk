import { useEffect, useRef } from 'react'

interface MoreOptions {
  disableisThereScrollbar?: boolean
}

let cachedScrollBarWidth: number | null = null

const getScrollBarWidth = () => {
  if (cachedScrollBarWidth !== null) return cachedScrollBarWidth

  const inner = document.createElement('p')
  inner.style.width = '100%'
  inner.style.height = '200px'

  const outer = document.createElement('div')
  outer.style.position = 'absolute'
  outer.style.top = '0px'
  outer.style.left = '0px'
  outer.style.visibility = 'hidden'
  outer.style.width = '200px'
  outer.style.height = '150px'
  outer.style.overflow = 'hidden'
  outer.appendChild(inner)

  document.body.appendChild(outer)
  const w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  let w2 = inner.offsetWidth
  if (w1 === w2) w2 = outer.clientWidth

  document.body.removeChild(outer)
  cachedScrollBarWidth = w1 - w2
  return cachedScrollBarWidth
}

const isBodyScrollbarVisible = () => document.body.scrollHeight > window.innerHeight
const isPresentationsScrollbarVisible = (element: HTMLElement) => element?.scrollHeight > window.innerHeight

const useBackDrop = (open: boolean, moreOptions?: MoreOptions) => {
  let lastPresentationRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const scrollbarWidth = getScrollBarWidth()
    const presentations = document.querySelectorAll<HTMLElement>('#presentation')
    lastPresentationRef.current = presentations[presentations.length - 2] || null

    if (open || presentations.length > 0) {
      document.body.style.overflow = 'hidden'
      if (isBodyScrollbarVisible() && !moreOptions?.disableisThereScrollbar) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
      if (
        lastPresentationRef.current &&
        isPresentationsScrollbarVisible(lastPresentationRef.current) &&
        !moreOptions?.disableisThereScrollbar
      ) {
        lastPresentationRef.current.style.overflow = 'hidden'
        lastPresentationRef.current.style.paddingRight = `${scrollbarWidth}px`
      }
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''

      presentations.forEach(presentation => {
        presentation.style.overflow = ''
        presentation.style.paddingRight = ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
}

export default useBackDrop
