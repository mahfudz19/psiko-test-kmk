import { VariantProps, cva } from 'class-variance-authority'
import { HtmlHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type PaperProps = HtmlHTMLAttributes<HTMLElement> &
  VariantProps<typeof variants> & {
    component?: React.ElementType
  }

const variants = cva(['border-divider', 'outline-divider', 'bg-background-paper', 'rounded-2xl'], {
  variants: {
    shadow: {
      transparent: ['shadow-transparent'],
      current: ['shadow-current'],
      inherit: ['shadow-inherit'],
      none: ['shadow-none'],
      inner: ['shadow-inner'],
      '2xl': ['shadow-2xl'],
      xl: ['shadow-xl'],
      lg: ['shadow-lg'],
      md: ['shadow-md'],
      sm: ['shadow-sm'],
      shadow: ['shadow']
    }
  },
  defaultVariants: {
    shadow: 'shadow'
  }
})

const Paper = forwardRef<HTMLDivElement, PaperProps>((props: PaperProps, ref) => {
  const {
    shadow,
    component: Component = 'div',

    className,
    ...rest
  } = props

  return <Component ref={ref} className={twMerge(variants({ shadow, className }))} {...rest} />
})

Paper.displayName = 'Paper'

export default Paper
