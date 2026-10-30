'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'

function PulseBarApp() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const barRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const completeTimer = useRef<number | null>(null)
  const prevPath = useRef<string | null>(null)
  const startedByUser = useRef(false)

  const setBar = (v: number) => {
    progressRef.current = v
    if (barRef.current) barRef.current.style.width = `${v}%`
  }

  const startIncrement = () => {
    setBar(3)
    const tick = () => {
      const next = Math.min(90, progressRef.current + 3 + Math.random() * 4)
      setBar(next)
      if (next < 90) rafRef.current = requestAnimationFrame(tick)
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }

  const start = () => {
    if (completeTimer.current) {
      clearTimeout(completeTimer.current)
      completeTimer.current = null
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    startedByUser.current = true
    setVisible(true)
    requestAnimationFrame(() => startIncrement())
  }

  const complete = (delay = 450) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setBar(100)
    completeTimer.current = window.setTimeout(() => {
      setVisible(false)
      setBar(0)
      startedByUser.current = false
      completeTimer.current = null
    }, delay)
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a')
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (!href || (href.startsWith('http') && !href.startsWith(location.origin))) return
      if (a.getAttribute('target') === '_blank') return
      try {
        const next = new URL(href, location.href)
        if (next.pathname !== location.pathname) start()
      } catch {}
    }
    const onPop = () => start()
    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPop)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname
      return
    }
    if (pathname !== prevPath.current) {
      if (!startedByUser.current) start()
      const t = window.setTimeout(() => complete(), 700)
      prevPath.current = pathname
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (completeTimer.current) clearTimeout(completeTimer.current)
    },
    []
  )

  if (!visible) return null

  return (
    <div
      ref={barRef}
      aria-hidden
      className='fixed top-0 left-0 h-[3px] bg-primary-main z-50'
      style={{ width: '0%', transition: 'width 300ms ease-out' }}
    />
  )
}

function PulseBarPages() {
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  const [progress, setProgress] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)
  const animationTimer = useRef<NodeJS.Timeout | null>(null)

  // Naikkan progress secara incremental ke max 90%
  const startIncrement = () => {
    setProgress(0)

    const step = () => {
      setProgress(prev => {
        const next = prev + Math.random() * 10
        if (next < 90) {
          animationTimer.current = setTimeout(step, 200)
          return next
        } else {
          return prev
        }
      })
    }

    step()
  }

  const start = () => {
    clearAllTimers()
    setVisible(true)
    startIncrement()
  }

  const complete = () => {
    clearAllTimers()
    setProgress(100)

    // Delay untuk memberi waktu transisi animasi selesai
    setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 600)
  }

  const clearAllTimers = () => {
    if (animationTimer.current) clearTimeout(animationTimer.current)
  }

  useEffect(() => {
    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', complete)
    router.events.on('routeChangeError', complete)

    return () => {
      clearAllTimers()
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', complete)
      router.events.off('routeChangeError', complete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  if (!visible) return null

  return (
    <div
      ref={barRef}
      className='fixed top-0 left-0 h-[3px] bg-primary-main z-50 transition-all duration-300 ease-out'
      style={{ width: `${progress}%` }}
    />
  )
}

export default function RoutePulseBar({ router = 'app' }: { router?: 'app' | 'pages' }) {
  const isApp = router === 'app'
  return isApp ? <PulseBarApp /> : <PulseBarPages />
}
