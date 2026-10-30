import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreMenuItemProps {
  ripple?: 'center' | 'onClick' | 'none'
  variant?: 'outlined' | 'contained'
  href?: string
  component?: any
}

export type CardProps = MoreMenuItemProps & VariantProps<typeof variants> & HTMLAttributes<HTMLDivElement>

const variants = cva(['rounded-2xl', 'w-full', 'bg-background-paper'], {
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

const Card = forwardRef<HTMLDivElement, CardProps>((props: CardProps, ref) => {
  const { shadow, className, component: Component = 'div', ...rest } = props

  return <Component ref={ref} className={twMerge(variants({ shadow, className }))} {...rest} />
})

Card.displayName = 'Card'

export default Card
