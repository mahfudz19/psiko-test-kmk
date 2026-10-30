/* eslint-disable @next/next/no-img-element */
import { NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface ImageAttrs {
  src: string
  alt?: string
  title?: string
  width?: string
  height?: string
  mode?: 'inline' | 'freeMove'
  positionX?: number
  positionY?: number
  zPosition?: 'behind' | 'front'
  align?: 'left' | 'center' | 'right' | null
  wrap?: 'left' | 'right' | null
}

export function ImageNodeView(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props
  const attrs = node.attrs as ImageAttrs
  const {
    src,
    alt,
    title,
    width,
    height,
    mode = 'inline',
    positionX = 0,
    positionY = 0,
    zPosition = 'front',
    align = null,
    wrap = null
  } = attrs

  const [isResizing, setIsResizing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isDraggingPosition, setIsDraggingPosition] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isFreeMove = mode === 'freeMove'
  const isBehindText = isFreeMove && zPosition === 'behind'

  // Calculate z-index based on position
  const getZIndex = () => (isFreeMove ? 20 : 'auto')

  const getImagePointerEvents = () => {
    if (isResizing || isDraggingPosition) return 'none' // During interaction
    return isBehindText ? 'none' : 'auto' // Behind = pass through
  }

  const handleFreeMoveStart = useCallback(
    (e: React.MouseEvent) => {
      if (!isFreeMove) return
      if (
        (e.target as HTMLElement).closest('.resize-handle') ||
        (e.target as HTMLElement).closest('.resize-vertical-handle')
      )
        return

      e.preventDefault()
      e.stopPropagation()

      const startX = e.clientX
      const startY = e.clientY
      const startPosX = positionX || 0
      const startPosY = positionY || 0

      setIsDraggingPosition(true)

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        const deltaY = moveEvent.clientY - startY

        updateAttributes({ positionX: startPosX + deltaX, positionY: startPosY + deltaY })
      }

      const handleMouseUp = () => {
        setIsDraggingPosition(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [isFreeMove, positionX, positionY, updateAttributes]
  )

  const handleVerticalResizeStart = useCallback(
    (e: React.MouseEvent) => {
      // Prevent starting drag when resizing
      e.preventDefault()
      e.stopPropagation()

      const img = imageRef.current
      if (!img) return

      const rect = img.getBoundingClientRect()
      const startX = e.clientX
      const startWidth = rect.width
      const startHeight = rect.height
      const aspectRatio = startWidth / startHeight

      setIsResizing(true)

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        const newWidth = Math.max(50, startWidth + deltaX)
        const newHeight = Math.max(50, newWidth / aspectRatio)

        updateAttributes({ width: `${Math.round(newWidth)}px`, height: `${Math.round(newHeight)}px` })
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [updateAttributes]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsResizing(false)
      setIsDraggingPosition(false)
    }
  }, [])

  return (
    <NodeViewWrapper
      ref={containerRef}
      className='image-node-wrapper-container'
      data-mode={mode}
      data-z-position={zPosition}
      data-align={align}
      data-wrap={wrap}
      style={{
        position: 'relative',
        // If inline and an alignment is set, render container as block to allow alignment
        display: isFreeMove ? 'block' : align || wrap ? 'block' : 'inline-block',
        width: isFreeMove ? '100%' : 'auto',
        height: isFreeMove ? '0' : 'auto',
        minHeight: isFreeMove ? '0' : 'auto',
        overflow: isFreeMove ? 'visible' : 'visible',
        textAlign: !isFreeMove && align && !wrap ? align : undefined, // Only use textAlign when no wrap is set
        clear: !isFreeMove && wrap ? 'both' : undefined // Clear floats when wrap is active
      }}
    >
      <div
        ref={wrapperRef}
        className='image-node-wrapper'
        data-drag-handle={!isFreeMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={isFreeMove ? handleFreeMoveStart : undefined}
        style={{
          position: isFreeMove ? 'absolute' : 'relative',
          left: isFreeMove ? `${positionX}px` : 'auto',
          top: isFreeMove ? `${positionY}px` : 'auto',
          display: 'inline-block',
          maxWidth: isFreeMove ? 'none' : '100%',
          cursor: isResizing
            ? 'nwse-resize'
            : isDraggingPosition
              ? 'grabbing'
              : isFreeMove && (selected || isHovered)
                ? 'grab'
                : selected || isHovered
                  ? 'grab'
                  : 'default',
          zIndex: getZIndex(),
          pointerEvents: 'auto',
          float: !isFreeMove && wrap ? wrap : undefined,
          marginRight: !isFreeMove && wrap === 'left' ? '1rem' : undefined,
          marginLeft: !isFreeMove && wrap === 'right' ? '1rem' : undefined
        }}
      >
        <div
          style={{
            position: 'relative',
            display: isFreeMove ? 'inline-block' : 'block',
            maxWidth: '100%'
          }}
        >
          {/* Image */}
          <img
            ref={imageRef}
            src={src}
            alt={alt || ''}
            title={title || ''}
            draggable={false}
            style={{
              display: isFreeMove ? 'block' : 'inline-block',
              maxWidth: '100%',
              width: width || 'auto',
              height: height || 'auto',
              objectFit: 'contain',
              pointerEvents: getImagePointerEvents(),
              opacity: isBehindText && !selected && !isHovered ? 0.5 : 1,
              transition: 'opacity 0.2s ease'
            }}
          />

          {(selected || isHovered) && !isResizing && !isDraggingPosition && (
            <>
              {/* Selection Border */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: `2px solid ${isFreeMove ? '#f59e0b' : '#3b82f6'}`,
                  borderRadius: '4px',
                  pointerEvents: 'auto',
                  cursor: isFreeMove ? 'grab' : 'default',
                  backgroundColor: isBehindText ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                }}
              />

              {/* Mode indicator badge */}
              {isFreeMove && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-28px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: isBehindText ? '#ef4444' : '#f59e0b',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{isBehindText ? '📄' : '🔝'}</span>
                  {isBehindText ? 'BEHIND TEXT' : 'IN FRONT'}
                  {isBehindText && <span style={{ fontSize: '9px', opacity: 0.8 }}>(Click border to edit)</span>}
                </div>
              )}
              {/* Vertical right-edge resize bar (full height) */}
              <div
                className='resize-vertical-handle'
                onMouseDown={e => handleVerticalResizeStart(e)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: '-10px',
                  width: '12px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  cursor: 'ew-resize',
                  zIndex: 15,
                  pointerEvents: 'auto'
                }}
              >
                {/* Visible thin line to indicate the handle */}
                <div
                  style={{
                    width: '4px',
                    height: '50px',
                    background: isFreeMove ? '#f59e0b' : '#3b82f6',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  )
}
