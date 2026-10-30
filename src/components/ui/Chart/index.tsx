'use client'

import type React from 'react'
import { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback, JSX } from 'react'

// Types
export interface LineStyleOptions {
  tension?: number // 0 = straight lines, 1 = very curved
  fill?: boolean
  gradient?: {
    enabled?: boolean
    colors?: {
      start: string
      end: string
    }
    opacity?: {
      start: number
      end: number
    }
  }
  point?: {
    radius?: number
    hoverRadius?: number
    borderWidth?: number
    backgroundColor?: string
    borderColor?: string
    hoverBackgroundColor?: string
    hoverBorderColor?: string
  }
}

export interface BarStyleOptions {
  borderRadius?: number // Rounded corners at tips
  borderWidth?: number // Border thickness (0 = no border)
  orientation?: 'vertical' | 'horizontal' // Bar orientation
}

export interface PieStyleOptions {
  gap?: number // Gap between slices in degrees
  borderWidth?: number // Border thickness (0 = no border)
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  hoverBackgroundColor?: string | string[]
  hoverBorderColor?: string | string[]
  lineStyle?: LineStyleOptions
  barStyle?: BarStyleOptions // Add this new property
  pieStyle?: PieStyleOptions // Add this new property
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface TooltipOptions {
  enabled?: boolean
  backgroundColor?: string
  titleColor?: string
  bodyColor?: string
  borderColor?: string
  borderWidth?: number
  cornerRadius?: number
  displayColors?: boolean
  callbacks?: {
    label?: (context: any) => string
    title?: (context: any[]) => string
  }
}

export interface TitleOptions {
  display?: boolean
  text?: string
  color?: string
  font?: {
    size?: number
    weight?: string
  }
  padding?: number
}

export interface LegendOptions {
  display?: boolean
  position?: 'top' | 'bottom' | 'left' | 'right'
  labels?: {
    color?: string
    font?: {
      size?: number
    }
    padding?: number
  }
}

export interface AnimationOptions {
  duration?: number
  easing?: 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic'
  delay?: number
}

export interface ChartOptions {
  responsive?: boolean
  maintainAspectRatio?: boolean
  aspectRatio?: number
  plugins?: {
    title?: TitleOptions
    legend?: LegendOptions
    tooltip?: TooltipOptions
  }
  animation?: AnimationOptions
  scales?: {
    x?: {
      display?: boolean
      grid?: {
        display?: boolean
        color?: string
      }
    }
    y?: {
      display?: boolean
      beginAtZero?: boolean
      grid?: {
        display?: boolean
        color?: string
      }
    }
  }
}

export interface ChartRef {
  update: (newData?: ChartData, newOptions?: ChartOptions) => void
  reset: () => void
  getCanvas: () => SVGSVGElement | null
}

interface ChartProps {
  type: 'bar' | 'line' | 'pie'
  data: ChartData
  options?: ChartOptions
  width?: number
  height?: number
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1)
}

// Default colors
const defaultColors = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#06B6D4',
  '#F97316',
  '#84CC16',
  '#EC4899',
  '#6B7280'
]

// Helper function to calculate the slope between two points
const calculateSlope = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  if (p2.x - p1.x === 0) return 0
  return (p2.y - p1.y) / (p2.x - p1.x)
}

// Helper function to calculate control points for natural curves
const calculateControlPoints = (points: { x: number; y: number; value: number }[], tension = 0.4, isClosed = false) => {
  const controlPoints: { cp1x: number; cp1y: number; cp2x: number; cp2y: number }[] = []

  // We need at least 3 points to calculate control points
  if (points.length < 3) {
    return controlPoints
  }

  // Calculate first and last control points separately to handle edge cases
  const firstPoint = points[0]
  // const secondPoint = points[1]
  const lastPoint = points[points.length - 1]
  // const secondLastPoint = points[points.length - 2]

  // For each segment between points (except first and last)
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i]
    const next = points[i + 1]

    // Get previous and next points for calculating control points
    const prev =
      i > 0
        ? points[i - 1]
        : isClosed
          ? lastPoint
          : { x: current.x - (next.x - current.x), y: current.y - (next.y - current.y) }
    const nextnext =
      i < points.length - 2
        ? points[i + 2]
        : isClosed
          ? firstPoint
          : { x: next.x + (next.x - current.x), y: next.y + (next.y - current.y) }

    // Calculate slopes for adaptive tension
    const slopePrev = calculateSlope(prev, next)
    const slopeNext = calculateSlope(current, nextnext)

    // Adjust tension based on slope changes for more natural curves
    let segmentTension = tension

    // If there's a sharp change in direction, reduce tension for that segment
    if (Math.sign(slopePrev) !== Math.sign(slopeNext) && Math.abs(slopePrev) > 0.1 && Math.abs(slopeNext) > 0.1) {
      segmentTension *= 0.5
    }

    // If the slopes are very different, adjust tension further
    const slopeDiff = Math.abs(slopePrev - slopeNext)
    if (slopeDiff > 1) {
      segmentTension *= 1 / (1 + slopeDiff * 0.2)
    }

    // Calculate control points with adaptive tension
    const cp1x = current.x + ((next.x - prev.x) * segmentTension) / 6
    const cp1y = current.y + ((next.y - prev.y) * segmentTension) / 6
    const cp2x = next.x - ((nextnext.x - current.x) * segmentTension) / 6
    const cp2y = next.y - ((nextnext.y - current.y) * segmentTension) / 6

    controlPoints.push({ cp1x, cp1y, cp2x, cp2y })
  }

  return controlPoints
}

// Helper function to generate intermediate points for smoother curves
const generateIntermediatePoints = (points: { x: number; y: number; value: number }[], subdivisions = 1) => {
  if (subdivisions <= 0 || points.length < 2) return points

  const result: { x: number; y: number; value: number }[] = []

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i]
    const next = points[i + 1]

    result.push(current)

    // Add intermediate points
    for (let j = 1; j <= subdivisions; j++) {
      const t = j / (subdivisions + 1)
      const x = current.x + (next.x - current.x) * t
      const y = current.y + (next.y - current.y) * t
      const value = current.value + (next.value - current.value) * t
      result.push({ x, y, value })
    }
  }

  // Add the last point
  result.push(points[points.length - 1])

  return result
}

const Chart = forwardRef<ChartRef, ChartProps>(({ type, data, options = {}, width, height }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: width || 400, height: height || 300 })
  const [animationProgress, setAnimationProgress] = useState(0)
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    content: string
    title: string
  }>({ visible: false, x: 0, y: 0, content: '', title: '' })
  const [hoveredBar, setHoveredBar] = useState<{ datasetIndex: number; dataIndex: number } | null>(null)

  // Default options
  const defaultOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      title: {
        display: false,
        text: '',
        color: '#374151',
        font: { size: 16, weight: 'bold' },
        padding: 20
      },
      legend: {
        display: data.datasets.length > 1,
        position: 'bottom',
        labels: {
          color: '#374151',
          font: { size: 12 },
          padding: 10
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(0, 0, 0, 0.8)',
        borderWidth: 1,
        cornerRadius: 4,
        displayColors: true
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutCubic',
      delay: 0
    },
    scales: {
      x: {
        display: true,
        grid: { display: true, color: '#E5E7EB' }
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: { display: true, color: '#E5E7EB' }
      }
    }
  }

  const mergedOptions = { ...defaultOptions, ...options }
  if (options.plugins) {
    mergedOptions.plugins = {
      ...defaultOptions.plugins,
      ...options.plugins,
      title: { ...defaultOptions.plugins!.title, ...options.plugins.title },
      legend: { ...defaultOptions.plugins!.legend, ...options.plugins.legend },
      tooltip: { ...defaultOptions.plugins!.tooltip, ...options.plugins.tooltip }
    }
  }

  // Responsive behavior
  useEffect(() => {
    if (!mergedOptions.responsive) return

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0]
      if (entry) {
        const { width: containerWidth, height: containerHeight } = entry.contentRect
        const aspectRatio = mergedOptions.aspectRatio || 2

        const newWidth = containerWidth
        const newHeight = mergedOptions.maintainAspectRatio
          ? containerWidth / aspectRatio
          : containerHeight || containerWidth / aspectRatio

        setDimensions({ width: newWidth, height: newHeight })
      }
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [mergedOptions.responsive, mergedOptions.aspectRatio, mergedOptions.maintainAspectRatio])

  // Animation
  const startAnimation = useCallback(() => {
    setAnimationProgress(0)

    const duration = mergedOptions.animation?.duration || 1000
    const easing = mergedOptions.animation?.easing || 'easeOutCubic'
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easingFunctions[easing](progress)

      setAnimationProgress(easedProgress)

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [mergedOptions.animation])

  useEffect(() => {
    startAnimation()
  }, [data, startAnimation])

  // Calculate chart dimensions and positions
  const padding = { top: 40, right: 40, bottom: 60, left: 60 }

  // Adjust padding for title
  if (mergedOptions.plugins?.title?.display) {
    padding.top += (mergedOptions.plugins.title.font?.size || 16) + (mergedOptions.plugins.title.padding || 20)
  }

  // Adjust padding for legend
  if (mergedOptions.plugins?.legend?.display) {
    const legendHeight = 40
    if (mergedOptions.plugins.legend.position === 'bottom') {
      padding.bottom += legendHeight
    } else if (mergedOptions.plugins.legend.position === 'top') {
      padding.top += legendHeight
    }
  }

  const chartWidth = dimensions.width - padding.left - padding.right
  const chartHeight = dimensions.height - padding.top - padding.bottom

  // Calculate data ranges
  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data))
  const minValue = mergedOptions.scales?.y?.beginAtZero
    ? 0
    : Math.min(...data.datasets.flatMap(dataset => dataset.data))
  const valueRange = maxValue - minValue

  // Bar chart calculations
  const barWidth = ((chartWidth / data.labels.length) * 0.8) / data.datasets.length
  const barSpacing = (chartWidth / data.labels.length) * 0.2
  const groupWidth = chartWidth / data.labels.length

  // Handle mouse events
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!mergedOptions.plugins?.tooltip?.enabled) return

    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return

    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    // Check if mouse is over a bar/point
    let foundElement: { datasetIndex: number; dataIndex: number; type: string } | null = null

    if (type === 'bar') {
      // Bar chart hover detection
      for (let labelIndex = 0; labelIndex < data.labels.length; labelIndex++) {
        for (let datasetIndex = 0; datasetIndex < data.datasets.length; datasetIndex++) {
          const x = padding.left + labelIndex * groupWidth + datasetIndex * barWidth + barSpacing / 2
          const value = data.datasets[datasetIndex].data[labelIndex]
          const barHeight = (value / valueRange) * chartHeight * animationProgress
          const y = padding.top + chartHeight - barHeight

          if (mouseX >= x && mouseX <= x + barWidth && mouseY >= y && mouseY <= y + barHeight) {
            foundElement = { datasetIndex, dataIndex: labelIndex, type: 'bar' }

            const tooltipContent = mergedOptions.plugins?.tooltip?.callbacks?.label
              ? mergedOptions.plugins.tooltip.callbacks.label({
                  dataset: data.datasets[datasetIndex],
                  dataIndex: labelIndex,
                  raw: value
                })
              : `${data.datasets[datasetIndex].label}: ${value}`

            const tooltipTitle = mergedOptions.plugins?.tooltip?.callbacks?.title
              ? mergedOptions.plugins.tooltip.callbacks.title([{ label: data.labels[labelIndex] }])
              : data.labels[labelIndex]

            // Position tooltip above the bar
            setTooltip({
              visible: true,
              x: rect.left + x + barWidth / 2, // Center of bar
              y: rect.top + y - 10, // Above the bar
              content: tooltipContent,
              title: tooltipTitle
            })
            break
          }
        }
        if (foundElement) break
      }
    } else if (type === 'line') {
      // Line chart hover detection
      const pointRadius = 6
      for (let labelIndex = 0; labelIndex < data.labels.length; labelIndex++) {
        for (let datasetIndex = 0; datasetIndex < data.datasets.length; datasetIndex++) {
          const x = padding.left + (labelIndex * chartWidth) / (data.labels.length - 1)
          const value = data.datasets[datasetIndex].data[labelIndex]
          const y = padding.top + chartHeight - (value / valueRange) * chartHeight * animationProgress

          const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2))

          if (distance <= pointRadius + 5) {
            foundElement = { datasetIndex, dataIndex: labelIndex, type: 'line' }

            const tooltipContent = mergedOptions.plugins?.tooltip?.callbacks?.label
              ? mergedOptions.plugins.tooltip.callbacks.label({
                  dataset: data.datasets[datasetIndex],
                  dataIndex: labelIndex,
                  raw: value
                })
              : `${data.datasets[datasetIndex].label}: ${value}`

            const tooltipTitle = mergedOptions.plugins?.tooltip?.callbacks?.title
              ? mergedOptions.plugins.tooltip.callbacks.title([{ label: data.labels[labelIndex] }])
              : data.labels[labelIndex]

            // Position tooltip above the point
            setTooltip({
              visible: true,
              x: rect.left + x, // Center of point
              y: rect.top + y - 10, // Above the point
              content: tooltipContent,
              title: tooltipTitle
            })
            break
          }
        }
        if (foundElement) break
      }
    } else if (type === 'pie') {
      // Pie chart hover detection
      const centerX = padding.left + chartWidth / 2
      const centerY = padding.top + chartHeight / 2
      const radius = Math.min(chartWidth, chartHeight) / 2 - 20

      const mouseAngle = Math.atan2(mouseY - centerY, mouseX - centerX)
      const mouseDistance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))

      if (mouseDistance <= radius) {
        const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0)
        let currentAngle = -Math.PI / 2 // Start from top

        for (let i = 0; i < data.labels.length; i++) {
          const value = data.datasets[0].data[i]
          const sliceAngle = (value / total) * 2 * Math.PI * animationProgress
          const endAngle = currentAngle + sliceAngle

          let normalizedMouseAngle = mouseAngle
          if (normalizedMouseAngle < -Math.PI / 2) {
            normalizedMouseAngle += 2 * Math.PI
          }

          if (normalizedMouseAngle >= currentAngle && normalizedMouseAngle <= endAngle) {
            foundElement = { datasetIndex: 0, dataIndex: i, type: 'pie' }

            const percentage = ((value / total) * 100).toFixed(1)
            const tooltipContent = mergedOptions.plugins?.tooltip?.callbacks?.label
              ? mergedOptions.plugins.tooltip.callbacks.label({
                  dataset: data.datasets[0],
                  dataIndex: i,
                  raw: value
                })
              : `${data.labels[i]}: ${value} (${percentage}%)`

            const tooltipTitle = mergedOptions.plugins?.tooltip?.callbacks?.title
              ? mergedOptions.plugins.tooltip.callbacks.title([{ label: data.labels[i] }])
              : data.labels[i]

            // Position tooltip at the center of the slice
            const midAngle = currentAngle + sliceAngle / 2
            const tooltipX = centerX + Math.cos(midAngle) * (radius * 0.7)
            const tooltipY = centerY + Math.sin(midAngle) * (radius * 0.7)

            setTooltip({
              visible: true,
              x: rect.left + tooltipX,
              y: rect.top + tooltipY,
              content: tooltipContent,
              title: tooltipTitle
            })
            break
          }
          currentAngle = endAngle
        }
      }
    }

    setHoveredBar(foundElement)

    if (!foundElement) {
      setTooltip(prev => ({ ...prev, visible: false }))
    }
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }))
    setHoveredBar(null)
  }

  // Imperative API
  useImperativeHandle(ref, () => ({
    update: (newData?: ChartData) => {
      if (newData) {
        // Update data and restart animation
        startAnimation()
      }
    },
    reset: () => {
      setAnimationProgress(0)
      startAnimation()
    },
    getCanvas: () => svgRef.current
  }))

  // Render bars
  const renderBars = () => {
    const bars: JSX.Element[] = []
    const isHorizontal = data.datasets[0]?.barStyle?.orientation === 'horizontal'

    for (let labelIndex = 0; labelIndex < data.labels.length; labelIndex++) {
      for (let datasetIndex = 0; datasetIndex < data.datasets.length; datasetIndex++) {
        const dataset = data.datasets[datasetIndex]
        const value = dataset.data[labelIndex]
        const barStyle = dataset.barStyle || {}

        const isHovered = hoveredBar?.datasetIndex === datasetIndex && hoveredBar?.dataIndex === labelIndex

        let fillColor = dataset.backgroundColor || defaultColors[datasetIndex % defaultColors.length]
        if (Array.isArray(fillColor)) {
          fillColor = fillColor[labelIndex] || fillColor[0]
        }

        if (isHovered && dataset.hoverBackgroundColor) {
          fillColor = Array.isArray(dataset.hoverBackgroundColor)
            ? dataset.hoverBackgroundColor[labelIndex] || dataset.hoverBackgroundColor[0]
            : dataset.hoverBackgroundColor
        }

        const borderWidth = barStyle.borderWidth !== undefined ? barStyle.borderWidth : dataset.borderWidth || 0
        const borderRadius = barStyle.borderRadius || 0

        if (isHorizontal) {
          // Horizontal bar chart
          const y = padding.top + labelIndex * groupWidth + datasetIndex * barWidth + barSpacing / 2
          const maxBarLength = chartWidth - borderRadius * 2 // Kurangi space untuk border radius
          const barLength = Math.min((value / valueRange) * chartWidth * animationProgress, maxBarLength)
          const x = padding.left
          const barHeight = barWidth

          if (borderRadius > 0) {
            // Rounded horizontal bar (rounded pada ujung kanan)
            const effectiveBarLength = Math.min(barLength, chartWidth - borderRadius)
            const pathData = [
              `M ${x} ${y}`,
              `L ${x + effectiveBarLength - borderRadius} ${y}`,
              `Q ${x + effectiveBarLength} ${y} ${x + effectiveBarLength} ${y + borderRadius}`,
              `L ${x + effectiveBarLength} ${y + barHeight - borderRadius}`,
              `Q ${x + effectiveBarLength} ${y + barHeight} ${x + effectiveBarLength - borderRadius} ${y + barHeight}`,
              `L ${x} ${y + barHeight}`,
              `Z`
            ].join(' ')

            bars.push(
              <path
                key={`${datasetIndex}-${labelIndex}`}
                d={pathData}
                fill={fillColor}
                stroke={
                  borderWidth > 0
                    ? (Array.isArray(dataset.borderColor)
                        ? dataset.borderColor[labelIndex] || dataset.borderColor[0]
                        : dataset.borderColor) || 'transparent'
                    : 'none'
                }
                strokeWidth={borderWidth}
                opacity={isHovered ? 0.8 : 1}
                transform={isHovered ? `scale(1.05)` : 'scale(1)'}
                style={{
                  transition: 'all 0.2s ease',
                  transformOrigin: `${x + barLength / 2}px ${y + barHeight / 2}px`
                }}
              />
            )
          } else {
            // Regular horizontal bar
            bars.push(
              <rect
                key={`${datasetIndex}-${labelIndex}`}
                x={x}
                y={y}
                width={barLength}
                height={barHeight}
                fill={fillColor}
                stroke={borderWidth > 0 ? dataset.borderColor?.toString() || 'transparent' : 'none'}
                strokeWidth={borderWidth}
                opacity={isHovered ? 0.8 : 1}
                transform={isHovered ? `scale(1.05)` : 'scale(1)'}
                style={{
                  transition: 'all 0.2s ease',
                  transformOrigin: `${x + barLength / 2}px ${y + barHeight / 2}px`
                }}
              />
            )
          }
        } else {
          // Vertical bar chart (existing logic with enhancements)
          const x = padding.left + labelIndex * groupWidth + datasetIndex * barWidth + barSpacing / 2
          const barHeight = (value / valueRange) * chartHeight * animationProgress
          const y = padding.top + chartHeight - barHeight

          if (borderRadius > 0) {
            // Rounded vertical bar (rounded hanya pada bagian atas)
            const pathData = [
              `M ${x} ${padding.top + chartHeight}`, // Mulai dari dasar bar
              `L ${x} ${y + borderRadius}`, // Naik ke titik radius
              `Q ${x} ${y} ${x + borderRadius} ${y}`, // Kurva sudut kiri atas
              `L ${x + barWidth - borderRadius} ${y}`, // Garis horizontal atas
              `Q ${x + barWidth} ${y} ${x + barWidth} ${y + borderRadius}`, // Kurva sudut kanan atas
              `L ${x + barWidth} ${padding.top + chartHeight}`, // Turun ke dasar bar
              `Z` // Tutup path
            ].join(' ')

            bars.push(
              <path
                key={`${datasetIndex}-${labelIndex}`}
                d={pathData}
                fill={fillColor}
                stroke={
                  borderWidth > 0
                    ? (Array.isArray(dataset.borderColor)
                        ? dataset.borderColor[labelIndex] || dataset.borderColor[0]
                        : dataset.borderColor) || 'transparent'
                    : 'none'
                }
                strokeWidth={borderWidth}
                opacity={isHovered ? 0.8 : 1}
                transform={isHovered ? `scale(1.05)` : 'scale(1)'}
                style={{ transition: 'all 0.2s ease', transformOrigin: `${x + barWidth / 2}px ${y + barHeight / 2}px` }}
              />
            )
          } else {
            // Regular vertical bar
            bars.push(
              <rect
                key={`${datasetIndex}-${labelIndex}`}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={fillColor}
                stroke={
                  borderWidth > 0
                    ? (Array.isArray(dataset.borderColor)
                        ? dataset.borderColor[labelIndex] || dataset.borderColor[0]
                        : dataset.borderColor) || 'transparent'
                    : 'none'
                }
                strokeWidth={borderWidth}
                opacity={isHovered ? 0.8 : 1}
                transform={isHovered ? `scale(1.05)` : 'scale(1)'}
                style={{ transition: 'all 0.2s ease', transformOrigin: `${x + barWidth / 2}px ${y + barHeight / 2}px` }}
              />
            )
          }
        }
      }
    }

    return bars
  }

  // Render grid lines
  const renderGrid = () => {
    const lines: JSX.Element[] = []

    // Horizontal grid lines (Y-axis)
    if (mergedOptions.scales?.y?.grid?.display) {
      const gridLines = 5
      for (let i = 0; i <= gridLines; i++) {
        const y = padding.top + (chartHeight / gridLines) * i
        lines.push(
          <line
            key={`h-grid-${i}`}
            x1={padding.left}
            y1={y}
            x2={padding.left + chartWidth}
            y2={y}
            stroke={mergedOptions.scales.y.grid.color || '#E5E7EB'}
            strokeWidth={1}
          />
        )
      }
    }

    // Vertical grid lines (X-axis)
    if (mergedOptions.scales?.x?.grid?.display) {
      for (let i = 0; i < data.labels.length; i++) {
        const x = padding.left + i * groupWidth + groupWidth / 2
        lines.push(
          <line
            key={`v-grid-${i}`}
            x1={x}
            y1={padding.top}
            x2={x}
            y2={padding.top + chartHeight}
            stroke={mergedOptions.scales.x.grid.color || '#E5E7EB'}
            strokeWidth={1}
          />
        )
      }
    }

    return lines
  }

  // Render axes
  const renderAxes = () => {
    const axes: JSX.Element[] = []
    const isHorizontal = data.datasets[0]?.barStyle?.orientation === 'horizontal'

    if (isHorizontal && type === 'bar') {
      // Horizontal bar chart axes
      // Y-axis (now shows labels)
      if (mergedOptions.scales?.y?.display) {
        axes.push(
          <line
            key='y-axis'
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartHeight}
            stroke='#374151'
            strokeWidth={2}
          />
        )

        // Y-axis labels (categories)
        data.labels.forEach((label, index) => {
          const y = padding.top + index * groupWidth + groupWidth / 2
          axes.push(
            <text
              key={`y-label-${index}`}
              x={padding.left - 10}
              y={y + 4}
              textAnchor='end'
              fill='#374151'
              fontSize='12'
            >
              {label}
            </text>
          )
        })
      }

      // X-axis (now shows values)
      if (mergedOptions.scales?.x?.display) {
        axes.push(
          <line
            key='x-axis'
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight}
            stroke='#374151'
            strokeWidth={2}
          />
        )

        // X-axis labels (values)
        const gridLines = 5
        for (let i = 0; i <= gridLines; i++) {
          const value = (maxValue / gridLines) * i
          const x = padding.left + (chartWidth / gridLines) * i
          axes.push(
            <text
              key={`x-label-${i}`}
              x={x}
              y={padding.top + chartHeight + 20}
              textAnchor='middle'
              fill='#374151'
              fontSize='12'
            >
              {Math.round(value)}
            </text>
          )
        }
      }
    } else {
      // Vertical bar chart or other chart types (existing logic)
      // X-axis
      if (mergedOptions.scales?.x?.display) {
        axes.push(
          <line
            key='x-axis'
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight}
            stroke='#374151'
            strokeWidth={2}
          />
        )

        // X-axis labels
        data.labels.forEach((label, index) => {
          const x = padding.left + index * groupWidth + groupWidth / 2
          axes.push(
            <text
              key={`x-label-${index}`}
              x={x}
              y={padding.top + chartHeight + 20}
              textAnchor='middle'
              fill='#374151'
              fontSize='12'
            >
              {label}
            </text>
          )
        })
      }

      // Y-axis
      if (mergedOptions.scales?.y?.display) {
        axes.push(
          <line
            key='y-axis'
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartHeight}
            stroke='#374151'
            strokeWidth={2}
          />
        )

        // Y-axis labels
        const gridLines = 5
        for (let i = 0; i <= gridLines; i++) {
          const value = (maxValue / gridLines) * (gridLines - i)
          const y = padding.top + (chartHeight / gridLines) * i
          axes.push(
            <text key={`y-label-${i}`} x={padding.left - 10} y={y + 4} textAnchor='end' fill='#374151' fontSize='12'>
              {Math.round(value)}
            </text>
          )
        }
      }
    }

    return axes
  }

  // Render title
  const renderTitle = () => {
    if (!mergedOptions.plugins?.title?.display || !mergedOptions.plugins.title.text) return null

    return (
      <text
        x={dimensions.width / 2}
        y={mergedOptions.plugins.title.padding || 20}
        textAnchor='middle'
        fill={mergedOptions.plugins.title.color || '#374151'}
        fontSize={mergedOptions.plugins.title.font?.size || 16}
        fontWeight={mergedOptions.plugins.title.font?.weight || 'bold'}
      >
        {mergedOptions.plugins.title.text}
      </text>
    )
  }

  // Render legend
  const renderLegend = () => {
    if (!mergedOptions.plugins?.legend?.display) return null

    const legendItems: JSX.Element[] = []
    const itemWidth = 100
    const totalWidth = data.datasets.length * itemWidth
    const startX = (dimensions.width - totalWidth) / 2

    data.datasets.forEach((dataset, index) => {
      const x = startX + index * itemWidth
      const y = dimensions.height - 30

      const color = dataset.backgroundColor || defaultColors[index % defaultColors.length]
      const fillColor = Array.isArray(color) ? color[0] : color

      legendItems.push(
        <g key={`legend-${index}`}>
          <rect x={x} y={y - 6} width={12} height={12} fill={fillColor} />
          <text
            x={x + 20}
            y={y + 4}
            fill={mergedOptions.plugins?.legend?.labels?.color || '#374151'}
            fontSize={mergedOptions.plugins?.legend?.labels?.font?.size || 12}
          >
            {dataset.label}
          </text>
        </g>
      )
    })

    return legendItems
  }

  // Render lines for line chart
  const renderLines = () => {
    if (type !== 'line') return null

    const lines: JSX.Element[] = []
    const areas: JSX.Element[] = []

    data.datasets.forEach((dataset, datasetIndex) => {
      const points: { x: number; y: number; value: number }[] = []
      const lineStyle = dataset.lineStyle || {}

      // Calculate points
      for (let i = 0; i < data.labels.length; i++) {
        const x = padding.left + (i * chartWidth) / (data.labels.length - 1)
        const value = dataset.data[i]
        const y = padding.top + chartHeight - (value / valueRange) * chartHeight * animationProgress
        points.push({ x, y, value })
      }

      let strokeColor = dataset.borderColor || defaultColors[datasetIndex % defaultColors.length]
      if (Array.isArray(strokeColor)) {
        strokeColor = strokeColor[0]
      }

      // Create gradient definition if enabled
      const gradientId = `gradient-${datasetIndex}`
      if (lineStyle.gradient?.enabled) {
        const gradientColors = lineStyle.gradient.colors || { start: strokeColor, end: '#ffffff' }
        const gradientOpacity = lineStyle.gradient.opacity || { start: 0.5, end: 0 }

        areas.push(
          <defs key={`gradient-def-${datasetIndex}`}>
            <linearGradient id={gradientId} x1='0%' y1='0%' x2='0%' y2='100%'>
              <stop offset='0%' stopColor={gradientColors.start} stopOpacity={gradientOpacity.start} />
              <stop offset='100%' stopColor={gradientColors.end} stopOpacity={gradientOpacity.end} />
            </linearGradient>
          </defs>
        )
      }

      // Generate intermediate points for smoother curves
      const subdivisions = 2 // Add 2 intermediate points between each pair of data points
      const enhancedPoints = generateIntermediatePoints(points, subdivisions)

      // Calculate control points for natural curves
      const tension = lineStyle.tension !== undefined ? lineStyle.tension : 0.5
      const controlPoints = calculateControlPoints(enhancedPoints, tension)

      // Create smooth curve path
      let pathData = ''

      if (enhancedPoints.length > 0) {
        // Start path at first point
        pathData = `M ${enhancedPoints[0].x} ${enhancedPoints[0].y}`

        if (tension > 0 && enhancedPoints.length > 1) {
          // Use control points to create smooth curves
          for (let i = 0; i < enhancedPoints.length - 1; i++) {
            const current = enhancedPoints[i]
            const next = enhancedPoints[i + 1]

            if (i < controlPoints.length) {
              const { cp1x, cp1y, cp2x, cp2y } = controlPoints[i]
              pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`
            } else {
              // Fallback to simple curve if control points are not available
              const cpx = (current.x + next.x) / 2
              const cpy = (current.y + next.y) / 2
              pathData += ` Q ${cpx} ${cpy}, ${next.x} ${next.y}`
            }
          }
        } else {
          // Straight lines
          for (let i = 1; i < enhancedPoints.length; i++) {
            pathData += ` L ${enhancedPoints[i].x} ${enhancedPoints[i].y}`
          }
        }
      }

      // Render filled area if gradient is enabled
      if (lineStyle.gradient?.enabled && lineStyle.fill !== false) {
        const areaPath =
          pathData +
          ` L ${enhancedPoints?.[enhancedPoints.length - 1]?.x || 0} ${padding.top + chartHeight}` +
          ` L ${enhancedPoints?.[0]?.x || 0} ${padding.top + chartHeight} Z`

        areas.push(
          <path key={`area-${datasetIndex}`} d={areaPath} fill={`url(#${gradientId})`} opacity={animationProgress} />
        )
      }

      // Animate line drawing
      const pathLength = enhancedPoints.length > 1 ? (enhancedPoints.length - 1) * 100 : 0
      const strokeDasharray = pathLength
      const strokeDashoffset = pathLength * (1 - animationProgress)

      lines.push(
        <path
          key={`line-${datasetIndex}`}
          d={pathData}
          fill='none'
          stroke={strokeColor}
          strokeWidth={dataset.borderWidth || 2}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.1s ease' }}
        />
      )
    })

    return [...areas, ...lines]
  }

  // Render points for line chart
  const renderPoints = () => {
    if (type !== 'line') return null

    const points: JSX.Element[] = []

    data.datasets.forEach((dataset, datasetIndex) => {
      const lineStyle = dataset.lineStyle || {}
      const pointStyle = lineStyle.point || {}

      for (let i = 0; i < data.labels.length; i++) {
        const x = padding.left + (i * chartWidth) / (data.labels.length - 1)
        const value = dataset.data[i]
        const y = padding.top + chartHeight - (value / valueRange) * chartHeight * animationProgress

        const isHovered = hoveredBar?.datasetIndex === datasetIndex && hoveredBar?.dataIndex === i

        const radius = isHovered ? pointStyle.hoverRadius || pointStyle.radius || 6 : pointStyle.radius || 4

        let fillColor =
          pointStyle.backgroundColor || dataset.backgroundColor || defaultColors[datasetIndex % defaultColors.length]
        let borderColor =
          pointStyle.borderColor || dataset.borderColor || defaultColors[datasetIndex % defaultColors.length]

        if (Array.isArray(fillColor)) {
          fillColor = fillColor[i] || fillColor[0]
        }
        if (Array.isArray(borderColor)) {
          borderColor = borderColor[i] || borderColor[0]
        }

        if (isHovered) {
          fillColor = pointStyle.hoverBackgroundColor || fillColor
          borderColor = pointStyle.hoverBorderColor || borderColor
        }

        // Add glow effect for hovered points
        if (isHovered) {
          points.push(
            <circle
              key={`point-glow-${datasetIndex}-${i}`}
              cx={x}
              cy={y}
              r={radius + 4}
              fill={borderColor}
              opacity={0.3}
              style={{ transition: 'all 0.2s ease' }}
            />
          )
        }

        points.push(
          <circle
            key={`point-${datasetIndex}-${i}`}
            cx={x}
            cy={y}
            r={radius}
            fill={fillColor}
            stroke={borderColor}
            strokeWidth={pointStyle.borderWidth || 2}
            opacity={animationProgress}
            style={{ transition: 'all 0.2s ease' }}
          />
        )
      }
    })

    return points
  }

  // Render pie chart
  const renderPie = () => {
    if (type !== 'pie') return null

    const centerX = padding.left + chartWidth / 2
    const centerY = padding.top + chartHeight / 2
    const radius = Math.min(chartWidth, chartHeight) / 2 - 20

    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0)
    const slices: JSX.Element[] = []
    let currentAngle = -Math.PI / 2 // Start from top

    const pieStyle = data.datasets[0].pieStyle || {}
    const gapInRadians = ((pieStyle.gap || 0) * Math.PI) / 180 // Convert degrees to radians
    const borderWidth = pieStyle.borderWidth !== undefined ? pieStyle.borderWidth : data.datasets[0].borderWidth || 2

    data.datasets[0].data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI * animationProgress - gapInRadians
      const endAngle = currentAngle + sliceAngle

      const isHovered = hoveredBar?.dataIndex === index

      let fillColor = data.datasets[0].backgroundColor || defaultColors[index % defaultColors.length]
      if (Array.isArray(fillColor)) {
        fillColor = fillColor[index] || fillColor[0]
      }

      if (isHovered && data.datasets[0].hoverBackgroundColor) {
        fillColor = Array.isArray(data.datasets[0].hoverBackgroundColor)
          ? data.datasets[0].hoverBackgroundColor[index] || data.datasets[0].hoverBackgroundColor[0]
          : data.datasets[0].hoverBackgroundColor
      }

      // Calculate path for pie slice with gap
      const x1 = centerX + Math.cos(currentAngle + gapInRadians / 2) * radius
      const y1 = centerY + Math.sin(currentAngle + gapInRadians / 2) * radius
      const x2 = centerX + Math.cos(endAngle + gapInRadians / 2) * radius
      const y2 = centerY + Math.sin(endAngle + gapInRadians / 2) * radius

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ')

      slices.push(
        <path
          key={`slice-${index}`}
          d={pathData}
          fill={fillColor}
          stroke={borderWidth > 0 ? data.datasets[0].borderColor?.toString() || '#ffffff' : 'none'}
          strokeWidth={borderWidth}
          opacity={isHovered ? 0.8 : 1}
          transform={isHovered ? `scale(1.05)` : 'scale(1)'}
          style={{ transition: 'all 0.2s ease', transformOrigin: `${centerX}px ${centerY}px` }}
        />
      )

      currentAngle = endAngle + gapInRadians
    })

    return slices
  }

  return (
    <div ref={containerRef} className='w-full'>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className='overflow-visible'
      >
        <defs>
          <clipPath id='chart-clip'>
            <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} />
          </clipPath>
        </defs>
        {type !== 'pie' && renderGrid()}
        {type !== 'pie' && renderAxes()}
        <g clipPath='url(#chart-clip)'>{type === 'bar' && renderBars()}</g>
        {type === 'line' && renderLines()}
        {type === 'line' && renderPoints()}
        {type === 'pie' && renderPie()}
        {renderTitle()}
        {renderLegend()}
      </svg>

      {/* Tooltip */}
      <div
        className='fixed pointer-events-none transition-all z-50 px-3 py-2 text-sm rounded shadow-lg transform -translate-x-1/2 -translate-y-full'
        style={{
          opacity: tooltip.visible ? '1' : '0',
          left: tooltip.x,
          top: tooltip.y,
          backgroundColor: mergedOptions.plugins?.tooltip?.backgroundColor || 'rgba(0, 0, 0, 0.8)',
          color: mergedOptions.plugins?.tooltip?.bodyColor || '#ffffff',
          borderColor: mergedOptions.plugins?.tooltip?.borderColor || 'rgba(0, 0, 0, 0.8)',
          borderWidth: mergedOptions.plugins?.tooltip?.borderWidth || 1,
          borderRadius: mergedOptions.plugins?.tooltip?.cornerRadius || 4
        }}
      >
        <div style={{ color: mergedOptions.plugins?.tooltip?.titleColor || '#ffffff', fontWeight: 'bold' }}>
          {tooltip.title}
        </div>
        <div>{tooltip.content}</div>
      </div>
    </div>
  )
})

Chart.displayName = 'Chart'

export default Chart
