import { useState, useEffect } from 'react'

const HiddenTransisiton = (open: boolean, moreAction?: { open?: () => void; close?: () => void }) => {
  const [isVisible, setIsVisible] = useState(open)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      const timer = setTimeout(() => setIsVisible(true), 10)
      moreAction?.open?.()
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setShouldRender(false), 200)
      moreAction?.close?.()
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return { isVisible, shouldRender }
}

export default HiddenTransisiton
