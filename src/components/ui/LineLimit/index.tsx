import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export type LineLimit = HTMLAttributes<HTMLElement> & {
  line?: number
  Component?: any
  ellipsis?: boolean
}

export default function LineLimit({ line = 1, Component = 'span', ellipsis, className, ...rest }: LineLimit) {
  return (
    <Component
      className={twMerge(className)}
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: line,
        ...(ellipsis ? { textOverflow: 'ellipsis' } : {}),
        overflow: 'hidden'
      }}
      {...rest}
    />
  )
}
