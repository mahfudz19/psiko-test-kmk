'use client'

import Image from 'next/image'
import { createContext, RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Lightbox from './Lightbox'

// Types
type PhotoItem = { src: string; alt?: string; width?: number; height?: number }
type ThumbnailPosition = { width: number; height: number; left: number; top: number }
interface PhotoContextType {
  photos: PhotoItem[]
  currentIndex: number
  isOpen: boolean
  elementRef: RefObject<(HTMLElement | null)[]>
  openPhoto: (index: number, element?: HTMLElement) => void
  closePhoto: () => void
  nextPhoto: (sourceElement?: HTMLElement) => void
  prevPhoto: (sourceElement?: HTMLElement) => void
  thumbnailPosition: ThumbnailPosition | null
}

// Context
const PhotoContext = createContext<PhotoContextType | null>(null)

// Hook untuk menggunakan context
export const usePhoto = () => {
  const context = useContext(PhotoContext)
  if (!context) throw new Error('usePhoto must be used within PhotoProvider')

  return context
}

// PhotoProvider Component
type PhotoProviderProps = { children: React.ReactNode; photos?: PhotoItem[] }
export function PhotoProvider({ children, photos: initialPhotos = [] }: PhotoProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const photos = useRef<PhotoItem[]>(initialPhotos)?.current
  const thumbnailPosition = useRef<ThumbnailPosition | null>(null)
  const elementRef = useRef<(HTMLElement | null)[]>([])

  const openPhoto = useCallback((index: number, element?: HTMLElement) => {
    const rect = element?.getBoundingClientRect()
    if (rect) thumbnailPosition.current = { width: rect.width, height: rect.height, left: rect.left, top: rect.top }
    else thumbnailPosition.current = null

    setCurrentIndex(index)
    setIsOpen(true)
  }, [])

  const closePhoto = useCallback(() => setIsOpen(false), [])

  const nextPhoto = useCallback(() => {
    setCurrentIndex(prev => {
      const nextIndex = (prev + 1) % photos.length
      const nextElement = elementRef.current[nextIndex]
      const rect = nextElement?.getBoundingClientRect()
      if (rect) thumbnailPosition.current = { width: rect.width, height: rect.height, left: rect.left, top: rect.top }
      else thumbnailPosition.current = null
      return nextIndex
    })
  }, [photos.length, elementRef])

  const prevPhoto = useCallback(() => {
    setCurrentIndex(prev => {
      const prevIndex = (prev - 1 + photos.length) % photos.length
      const prevElement = elementRef.current[prevIndex]
      const rect = prevElement?.getBoundingClientRect()
      if (rect) thumbnailPosition.current = { width: rect.width, height: rect.height, left: rect.left, top: rect.top }
      else thumbnailPosition.current = null
      return prevIndex
    })
  }, [photos.length, elementRef])

  // Cleanup thumbnail position when lightbox closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => (thumbnailPosition.current = null), 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const value: PhotoContextType = {
    photos,
    currentIndex,
    isOpen,
    openPhoto,
    elementRef,
    closePhoto,
    nextPhoto,
    prevPhoto,
    thumbnailPosition: thumbnailPosition.current
  }

  return (
    <PhotoContext.Provider value={value}>
      {children}
      {isOpen && <Lightbox />}
    </PhotoContext.Provider>
  )
}

// PhotoView Component
interface PhotoViewProps {
  src: string
  alt?: string
  width?: number
  height?: number
  index?: number
  className?: string
  children?: React.ReactNode
}
export function PhotoView({ src, alt, width, height, index, className, children }: PhotoViewProps) {
  const { openPhoto, elementRef } = usePhoto()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const photoIndex = index ?? 0
    if (photoIndex !== -1) {
      const clickedElement = e.currentTarget as HTMLElement
      openPhoto(photoIndex, clickedElement)
    }
  }

  // Callback ref to assign element to elementRef.current[index]
  const setRef = (el: HTMLElement | null) => {
    if (index !== undefined && elementRef.current) elementRef.current[index] = el
  }

  if (children) {
    return (
      <div ref={setRef} onClick={handleClick} className={`cursor-pointer ${className || ''}`}>
        {children}
      </div>
    )
  }

  return (
    <Image
      ref={setRef}
      src={src || '/placeholder.svg'}
      alt={alt ?? 'placeholder'}
      width={width ?? 800}
      height={height ?? 600}
      className={`cursor-pointer transition-opacity hover:opacity-80 ${className || ''}`}
      onClick={handleClick}
    />
  )
}
