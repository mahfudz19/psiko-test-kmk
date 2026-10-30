import { useCallback, useEffect, useRef, useState } from 'react'
import IconButton from '../IconButton'
import IconZoomOut from '../Icon/IconZoomOut'
import IconZoomIn from '../Icon/IconZoomIn'
import IconRotateCcw from '../Icon/IconRotateCcw'
import IconClose from '../Icon/IconClose'
import IconChevronLeft from '../Icon/IconChevronLeft'
import IconChevronRight from '../Icon/IconChevronRight'
import Image from 'next/image'
import { usePhoto } from '.'

// Animation utilities
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)
const easeInCubic = (t: number): number => t * t * t
const lerp = (start: number, end: number, progress: number): number => start + (end - start) * progress

// Lightbox Component dengan useRef untuk animation states
export default function Lightbox() {
  const { photos, currentIndex, closePhoto, nextPhoto, prevPhoto, thumbnailPosition } = usePhoto()
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  // UI
  const headerRef = useRef<HTMLDivElement>(null)
  const previousRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const debugRef = useRef<HTMLDivElement>(null)

  // Touch and gesture states
  const touchStart = useRef({ x: 0, y: 0 })
  const touchCurrent = useRef({ x: 0, y: 0 })

  // Touch gestures
  const initialDistance = useRef(0)
  const initialScale = useRef(1)

  // Use useRef for animation states to avoid re-renders
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const isAnimatingRef = useRef(true)
  const isClosingRef = useRef(false)
  const isClosingInProgressRef = useRef(false)
  const isDragClosingRef = useRef(false)
  const animationProgressRef = useRef(0)
  const backgroundOpacityRef = useRef(0)
  const uiOpacityRef = useRef(0)
  const dragCloseProgressRef = useRef(0)

  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // Force re-render function
  const [, forceUpdate] = useState({})
  const triggerUpdate = useCallback(() => forceUpdate({}), [])

  const currentPhoto = photos[currentIndex]

  // Animation parameters
  const ANIMATION_DURATION = 800
  const CLOSE_ANIMATION_DURATION = 600
  const UI_DELAY = 500
  const DRAG_CLOSE_THRESHOLD = 100

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  // Start opening animation
  const startAnimation = useCallback(() => {
    isAnimatingRef.current = true
    isClosingRef.current = false
    animationProgressRef.current = 0
    backgroundOpacityRef.current = 0
    uiOpacityRef.current = 0
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
      const easedProgress = easeOutCubic(progress)

      animationProgressRef.current = easedProgress
      backgroundOpacityRef.current = easedProgress

      if (elapsed > UI_DELAY) {
        const uiProgress = Math.min((elapsed - UI_DELAY) / (ANIMATION_DURATION - UI_DELAY), 1)
        uiOpacityRef.current = easeOutCubic(uiProgress)
      }

      triggerUpdate() // Force re-render

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        isAnimatingRef.current = false
        triggerUpdate()
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [triggerUpdate])

  // Reset transformations when photo changes
  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
    isClosingInProgressRef.current = false

    // Start animation for navigation
    if (currentIndex >= 0) {
      isAnimatingRef.current = true
      isClosingRef.current = false
      animationProgressRef.current = 0
      backgroundOpacityRef.current = 0
      uiOpacityRef.current = 0
      startAnimation()
    }
  }, [currentIndex, startAnimation])

  // Start closing animation
  const startCloseAnimation = useCallback(() => {
    if (!thumbnailPosition) return closePhoto()

    isClosingRef.current = true
    isAnimatingRef.current = true
    uiOpacityRef.current = 0
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / CLOSE_ANIMATION_DURATION, 1)
      const easedProgress = easeInCubic(progress)

      animationProgressRef.current = 1 - easedProgress
      backgroundOpacityRef.current = 1 - easedProgress

      triggerUpdate()

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        isAnimatingRef.current = false
        closePhoto()
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [thumbnailPosition, closePhoto, triggerUpdate])

  // Handle close with animation
  const handleClose = useCallback(() => {
    if (isClosingInProgressRef.current) return

    isClosingInProgressRef.current = true

    if (thumbnailPosition) startCloseAnimation()
    else closePhoto()

    setTimeout(() => (isClosingInProgressRef.current = false), CLOSE_ANIMATION_DURATION + 100)
  }, [thumbnailPosition, startCloseAnimation, closePhoto])

  // Start animation on mount
  useEffect(() => {
    startAnimation()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [startAnimation])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current && !isClosingRef.current) return

      switch (e.key) {
        case 'Escape':
          handleClose()
          break
        case 'ArrowLeft':
          prevPhoto()
          break
        case 'ArrowRight':
          nextPhoto()
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case '0':
          handleReset()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose, nextPhoto, prevPhoto])

  // Zoom functions
  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 5))
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.1))
  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)

    if (containerRef.current) containerRef.current.style.cursor = 'default'
  }

  // Toggle UI visibility
  const toggleUI = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDraggingRef.current) return
    const refs = [headerRef, previousRef, nextRef, infoRef, debugRef]
    refs.forEach(ref => {
      if (ref.current) {
        const currentOpacity = ref.current.style.opacity
        ref.current.style.opacity = currentOpacity === '0' ? '1' : '0'
        ref.current.style.pointerEvents = currentOpacity === '0' ? 'auto' : 'none'
      }
    })
  }

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (isAnimatingRef.current) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale(prev => Math.min(Math.max(prev * delta, 0.1), 5))
  }

  // Mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimatingRef.current || scale <= 1) return
    isDraggingRef.current = true

    if (containerRef.current) {
      if (!isAnimatingRef.current && scale > 1) containerRef.current.style.cursor = 'grabbing'
      else containerRef.current.style.cursor = 'default'
    }
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current && scale > 1 && !isAnimatingRef.current)
      setPosition({ x: e.clientX - dragStart.current!.x, y: e.clientY - dragStart.current!.y })
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
    if (containerRef.current) {
      if (!isAnimatingRef.current && scale > 1) containerRef.current.style.cursor = 'grab'
      else containerRef.current.style.cursor = 'default'
    }
  }

  const getDistance = (touch1: React.Touch, touch2: React.Touch) =>
    Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2))

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    if (isAnimatingRef.current) return

    const touchList = Array.from(e.touches)

    if (touchList.length === 2) {
      const distance = getDistance(touchList[0], touchList[1])
      initialDistance.current = distance
      initialScale.current = scale
    } else if (touchList.length === 1) {
      const touch = touchList[0]
      touchStart.current = { x: touch.clientX, y: touch.clientY }
      touchCurrent.current = { x: touch.clientX, y: touch.clientY }

      if (scale > 1) {
        isDraggingRef.current = true
        dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y }
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (isAnimatingRef.current) return

    const touchList = Array.from(e.touches)

    if (touchList.length === 2 && initialDistance.current > 0) {
      const distance = getDistance(touchList[0], touchList[1])
      const newScale = (distance / initialDistance.current) * initialScale.current
      setScale(Math.min(Math.max(newScale, 0.1), 5))
    } else if (touchList.length === 1) {
      const touch = touchList[0]
      touchCurrent.current = { x: touch.clientX, y: touch.clientY }

      if (scale > 1 && isDraggingRef.current) {
        setPosition({ x: touch.clientX - dragStart.current.x, y: touch.clientY - dragStart.current.y })
      } else if (scale === 1) {
        const deltaY = touch.clientY - touchStart.current.y
        const deltaX = touch.clientX - touchStart.current.x

        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
          isDragClosingRef.current = true
          const progress = Math.min(Math.abs(deltaY) / DRAG_CLOSE_THRESHOLD, 1)
          dragCloseProgressRef.current = progress

          setPosition({ x: deltaX * 0.3, y: deltaY })
          triggerUpdate()
        }
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()

    isDraggingRef.current = false
    initialDistance.current = 0

    if (isDragClosingRef.current) {
      const deltaY = touchCurrent.current.y - touchStart.current.y

      if (Math.abs(deltaY) > DRAG_CLOSE_THRESHOLD) {
        handleClose()
      } else {
        setPosition({ x: 0, y: 0 })
        isDragClosingRef.current = false
        dragCloseProgressRef.current = 0
      }
    }

    setTimeout(() => {
      isDragClosingRef.current = false
      dragCloseProgressRef.current = 0
      triggerUpdate()
    }, 300)
  }

  // Calculate image style with all animations
  const getImageStyle = () => {
    const baseTransform = `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`

    if (!thumbnailPosition || (!isAnimatingRef.current && !isClosingRef.current)) {
      return {
        transform: baseTransform,
        opacity: isDragClosingRef.current ? 1 - dragCloseProgressRef.current * 0.5 : 1
      }
    }

    if (!thumbnailPosition.width || !thumbnailPosition.height) return { transform: baseTransform, opacity: 1 }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const viewportCenterX = viewportWidth / 2
    const viewportCenterY = viewportHeight / 2

    const thumbnailCenterX = thumbnailPosition.left + thumbnailPosition.width / 2
    const thumbnailCenterY = thumbnailPosition.top + thumbnailPosition.height / 2

    const startX = thumbnailCenterX - viewportCenterX
    const startY = thumbnailCenterY - viewportCenterY
    const endX = position.x
    const endY = position.y

    const maxImageWidth = viewportWidth * 0.9
    const maxImageHeight = viewportHeight * 0.9

    let finalImageWidth = maxImageWidth
    let finalImageHeight = maxImageHeight

    if (currentPhoto.width && currentPhoto.height) {
      const aspectRatio = currentPhoto.width / currentPhoto.height
      if (aspectRatio > 1) finalImageHeight = finalImageWidth / aspectRatio
      else finalImageWidth = finalImageHeight * aspectRatio
    }

    const startScaleX = thumbnailPosition.width / finalImageWidth
    const startScaleY = thumbnailPosition.height / finalImageHeight
    const startScale = Math.max(startScaleX, startScaleY)
    const endScale = scale

    const currentX = lerp(startX, endX, animationProgressRef.current)
    const currentY = lerp(startY, endY, animationProgressRef.current)
    const currentScale = lerp(startScale, endScale, animationProgressRef.current)
    const currentOpacity = lerp(0.3, 1, animationProgressRef.current)

    return {
      transform: `translate(${currentX}px, ${currentY}px) scale(${currentScale}) rotate(${rotation}deg)`,
      opacity: currentOpacity
    }
  }

  if (!currentPhoto) return null

  return (
    <div
      id='presentation'
      role='dialog'
      className='fixed inset-0 z-50 flex items-center justify-center'
      style={{
        backgroundColor: `rgba(0, 0, 0, ${backgroundOpacityRef.current * 0.9 * (1 - dragCloseProgressRef.current * 0.5)})`,
        touchAction: 'none'
      }}
    >
      {/* Header */}
      <div
        className='absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent transition-opacity duration-300'
        ref={headerRef}
      >
        <div className='text-white text-sm'>
          {currentIndex + 1} / {photos.length}
        </div>
        <div className='flex items-center gap-2'>
          <IconButton
            onClick={handleZoomOut}
            variant='text'
            color='white'
            className='p-1 text-white hover:bg-white/20 w- rounded-full transition-colors'
            title='Zoom Out'
            disabled={isAnimatingRef.current}
          >
            <IconZoomOut fontSize={28} />
          </IconButton>
          <IconButton
            onClick={handleZoomIn}
            variant='text'
            color='white'
            className='p-1 text-white hover:bg-white/20 rounded-full transition-colors'
            title='Zoom In'
            disabled={isAnimatingRef.current}
          >
            <IconZoomIn fontSize={28} />
          </IconButton>
          <IconButton
            onClick={handleReset}
            variant='text'
            color='white'
            className='p-2 text-white hover:bg-white/20 rounded-full transition-colors'
            title='Reset'
            disabled={isAnimatingRef.current}
          >
            <IconRotateCcw fontSize={20} />
          </IconButton>
          <IconButton
            onClick={handleClose}
            variant='text'
            color='white'
            className='p-2 text-white hover:bg-white/20 rounded-full transition-colors'
            title='Close'
          >
            <IconClose fontSize={20} />
          </IconButton>
        </div>
      </div>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <IconButton
            onClick={() => prevPhoto()}
            variant='text'
            color='white'
            className='absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/20 rounded-full transition-colors z-10'
            title='Previous'
            disabled={isAnimatingRef.current}
            ref={previousRef}
          >
            <IconChevronLeft fontSize={24} />
          </IconButton>
          <IconButton
            onClick={() => nextPhoto()}
            variant='text'
            color='white'
            className='absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/20 rounded-full transition-colors z-10'
            title='Next'
            disabled={isAnimatingRef.current}
            ref={nextRef}
          >
            <IconChevronRight fontSize={24} />
          </IconButton>
        </>
      )}

      {/* Image Container */}
      <div
        ref={containerRef}
        className='relative w-full h-full flex items-center justify-center overflow-hidden'
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClose}
      >
        <Image
          ref={imageRef}
          src={currentPhoto.src || '/placeholder.svg'}
          alt={currentPhoto.alt ?? 'placeholder'}
          width={imgSize.width || 800}
          height={imgSize.height || 600}
          onLoadingComplete={img => setImgSize({ width: img.naturalWidth, height: img.naturalHeight })}
          style={{ objectFit: 'contain', ...getImageStyle() }}
          className='max-w-[90vw] max-h-[90vh] object-contain select-none'
          draggable={false}
          onClick={toggleUI}
        />
      </div>

      {/* Bottom Info */}
      {currentPhoto.alt && (
        <div
          className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300'
          ref={infoRef}
        >
          <p className='text-white text-center'>{currentPhoto.alt}</p>
        </div>
      )}

      {/* Debug Info */}
      {process.env.PRODUCTION === 'true' && (
        <div
          className='absolute top-20 left-4 text-white text-xs bg-black/50 p-2 rounded transition-opacity duration-300'
          ref={debugRef}
        >
          <div>Progress: {Math.round(animationProgressRef.current * 100)}%</div>
          <div>Animating: {isAnimatingRef.current ? 'Yes' : 'No'}</div>
          <div>Closing: {isClosingRef.current ? 'Yes' : 'No'}</div>
          <div>Background: {Math.round(backgroundOpacityRef.current * 100)}%</div>
          <div>Drag Close: {Math.round(dragCloseProgressRef.current * 100)}%</div>
        </div>
      )}

      {/* Drag to close indicator */}
      {isDragClosingRef.current && (
        <div
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm bg-black/70 px-4 py-2 rounded-full'
          style={{ opacity: dragCloseProgressRef.current }}
        >
          Release to close
        </div>
      )}
    </div>
  )
}
