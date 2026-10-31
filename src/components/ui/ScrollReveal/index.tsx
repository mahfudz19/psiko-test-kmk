import React, { useEffect, useRef, useState } from 'react'

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade'

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: RevealDirection
  delay?: number
  duration?: number
  className?: string
  threshold?: number
  once?: boolean
}

const hiddenTransformMap: Record<RevealDirection, string> = {
  up: 'opacity-0 translate-y-7',
  down: 'opacity-0 -translate-y-7',
  left: 'opacity-0 -translate-x-8',
  right: 'opacity-0 translate-x-8',
  zoom: 'opacity-0 scale-95',
  fade: 'opacity-0',
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 650,
  className = '',
  threshold = 0.14,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsVisible(true)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(node)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -36px 0px',
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once, threshold])

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`transition-[opacity,transform] will-change-[opacity,transform] ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : hiddenTransformMap[direction]
      } ${className}`}
    >
      {children}
    </div>
  )
}

