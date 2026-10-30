// components/Progress.tsx
import React from 'react'

interface ProgressProps {
  value: number // dari 0 hingga 100
  className?: string
}

const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100) // memastikan value antara 0-100

  return (
    <div className={`w-full bg-gray-200 rounded ${className}`}>
      <div
        className='bg-secondary-main h-full rounded transition-all duration-300'
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  )
}

export default Progress
