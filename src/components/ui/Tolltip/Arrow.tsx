import { twMerge } from 'tailwind-merge'
import { MenuProps } from '../Menu'

interface ArrowProps {
  color?: string
  position?: MenuProps['anchor']
}

const Arrow = ({ position = 'right-start', color }: ArrowProps) => {
  if (position === 'top-start') {
    color = color || 'border-t-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          color,
          `border-r-transparent`,
          `border-b-transparent`,
          `border-l-transparent`
        )}
        style={{
          left: '12px',
          top: '100%',
          borderWidth: '6px',
          borderStyle: 'solid',
          transform: 'translateX(-50%)'
        }}
      ></div>
    )
  }
  if (position === 'top-end') {
    color = color || 'border-t-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          color,
          `border-r-transparent`,
          `border-b-transparent`,
          `border-l-transparent`
        )}
        style={{
          left: 'calc(100% - 12px)',
          top: '100%',
          borderWidth: '6px',
          borderStyle: 'solid',
          transform: 'translateX(-50%)'
        }}
      ></div>
    )
  }
  if (position === 'top') {
    color = color || 'border-t-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          color,
          `border-r-transparent`,
          `border-b-transparent`,
          `border-l-transparent`
        )}
        style={{
          left: '50%',
          top: '100%',
          borderWidth: '6px',
          borderStyle: 'solid',
          transform: 'translateX(-50%)'
        }}
      ></div>
    )
  }

  if (position === 'bottom-start') {
    color = color || 'border-b-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          `border-t-transparent`,
          `border-r-transparent`,
          color,
          `border-l-transparent`
        )}
        style={{
          left: '12px',
          bottom: '100%',
          borderWidth: '6px',
          borderStyle: 'solid',
          transform: 'translateX(-50%)'
        }}
      ></div>
    )
  }
  if (position === 'bottom-end') {
    color = color || 'border-b-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          `border-t-transparent`,
          `border-r-transparent`,
          color,
          `border-l-transparent`
        )}
        style={{
          left: 'calc(100% - 12px)',
          bottom: '100%',
          borderWidth: '6px',
          borderStyle: 'solid',
          transform: 'translateX(-50%)'
        }}
      ></div>
    )
  }
  if (position === 'bottom') {
    color = color || 'border-b-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          `border-t-transparent`,
          `border-r-transparent`,
          color,
          `border-l-transparent`
        )}
        style={{
          left: '50%',
          bottom: '100%',
          borderWidth: '6px',
          borderStyle: 'solid',
          transform: 'translateX(-50%)'
        }}
      ></div>
    )
  }

  if (position === 'right-start') {
    color = color || 'border-r-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          `border-t-transparent`,
          color,
          `border-b-transparent`,
          `border-l-transparent`
        )}
        style={{
          right: '100%',
          top: '6px',
          borderWidth: '6px',
          borderStyle: 'solid'
        }}
      ></div>
    )
  }
  if (position === 'right-end') {
    color = color || 'border-r-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          `border-t-transparent`,
          color,
          `border-b-transparent`,
          `border-l-transparent`
        )}
        style={{
          right: '100%',
          bottom: '6px',
          borderWidth: '6px',
          borderStyle: 'solid'
        }}
      ></div>
    )
  }
  if (position === 'right') {
    color = color || 'border-r-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          `border-t-transparent`,
          color,
          `border-b-transparent`,
          `border-l-transparent`
        )}
        style={{
          right: '100%',
          top: '50%',
          borderWidth: '6px',
          borderStyle: 'solid',
          transform: 'translateY(-50%)'
        }}
      ></div>
    )
  }

  if (position === 'left-start') {
    color = color || 'border-l-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          `border-t-transparent`,
          `border-r-transparent`,
          `border-b-transparent`,
          color
        )}
        style={{
          left: '100%',
          top: '6px',
          borderWidth: '6px',
          borderStyle: 'solid'
        }}
      ></div>
    )
  }
  if (position === 'left-end') {
    color = color || 'border-l-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          `border-t-transparent`,
          `border-r-transparent`,
          `border-b-transparent`,
          color
        )}
        style={{
          left: '100%',
          bottom: '6px',
          borderWidth: '6px',
          borderStyle: 'solid'
        }}
      ></div>
    )
  }
  if (position === 'left') {
    color = color || 'border-l-secondary-dark/80'
    return (
      <div
        className={twMerge(
          `absolute w-0 h-0`,
          `border-t-transparent`,
          `border-r-transparent`,
          `border-b-transparent`,
          color
        )}
        style={{
          left: '100%',
          top: '50%',
          borderWidth: '6px',
          borderStyle: 'solid',
          transform: 'translateY(-50%)'
        }}
      ></div>
    )
  }

  return <></>
}

export default Arrow
