import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, JSX, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  variant?: 'contained' | 'outlined' | 'light'
  startIcon?: JSX.Element
  endIcon?: JSX.Element
}

const variantsLight = cva(['rounded-3xl', 'inline-block'], {
  variants: {
    color: {
      primary: ['bg-primary-light/30', 'text-primary-dark dark:text-primary-light'],
      secondary: ['bg-secondary-light/30', 'text-secondary-dark dark:text-secondary-light'],
      success: ['bg-success-light/30', 'text-success-dark dark:text-success-light'],
      error: ['bg-error-light/30', 'text-error-dark dark:text-error-light'],
      warning: ['bg-warning-light/30', 'text-warning-dark dark:text-warning-light'],
      info: ['bg-info-light/30', 'text-info-dark dark:text-info-light'],
      white: ['bg-gray-300/30', 'text-text-primary-main']
    },
    sizes: {
      small: ['px-2', 'text-xs'],
      medium: ['px-3', 'py-1', 'text-sm'],
      large: ['px-3.5', 'py-1.5']
    }
  },
  defaultVariants: {
    color: 'primary',
    sizes: 'medium'
  }
})

const variantsContained = cva(['rounded-3xl', 'inline-block'], {
  variants: {
    color: {
      primary: ['bg-gradient-to-br', 'from-teal-400', 'to-primary-dark', 'text-white'],
      secondary: ['bg-gradient-to-br', 'from-slate-400', 'to-secondary-dark', 'text-white'],
      success: ['bg-gradient-to-br', 'from-lime-400', 'to-success-dark', 'text-white'],
      error: ['bg-gradient-to-br', 'from-rose-400', 'to-error-dark', 'text-white'],
      warning: ['bg-gradient-to-br', 'from-amber-400', 'to-warning-dark', 'text-white'],
      info: ['bg-gradient-to-br', 'from-cyan-400', 'to-info-dark', 'text-white'],
      white: ['bg-white', 'text-primary-main']
    },
    sizes: {
      small: ['px-2', 'text-xs'],
      medium: ['px-3', 'py-1', 'text-sm'],
      large: ['px-3.5', 'py-1.5']
    }
  },
  defaultVariants: {
    color: 'primary',
    sizes: 'medium'
  }
})

const variantsOutlined = cva(['rounded-3xl', 'inline-block', 'border border-2'], {
  variants: {
    color: {
      primary: ['border-primary-main dark:border-primary-light', 'text-primary-dark dark:text-primary-light'],
      secondary: ['border-secondary-main dark:border-secondary-light', 'text-secondary-dark dark:text-secondary-light'],
      success: ['border-success-main dark:border-success-light', 'text-success-dark dark:text-success-light'],
      error: ['border-error-main dark:border-error-light', 'text-error-dark dark:text-error-light'],
      warning: ['border-warning-main dark:border-warning-light', 'text-warning-dark dark:text-warning-light'],
      white: ['border-text-primary-main dark:border-white', 'text-text-primary-main'],
      info: ['border-info-main dark:border-info-light', 'text-info-main dark:text-info-light']
    },
    sizes: {
      small: ['px-2', 'text-xs'],
      medium: ['px-3', 'py-1', 'text-sm'],
      large: ['px-3.5', 'py-1.5']
    }
  },
  defaultVariants: {
    color: 'primary',
    sizes: 'medium'
  }
})

export type ChipProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof variantsContained | typeof variantsOutlined> &
  MoreProps

const Chip = forwardRef<HTMLDivElement, ChipProps>((props: ChipProps, ref) => {
  const { className, variant, color, sizes, children, startIcon, endIcon, ...rest } = props
  let choseVariant
  switch (variant) {
    case 'light':
      choseVariant = variantsLight({ color, sizes, className })
      break

    case 'outlined':
      choseVariant = variantsOutlined({ color, sizes, className })
      break

    default:
      choseVariant = variantsContained({ color, sizes, className })
      break
  }

  return (
    <div
      {...rest}
      ref={ref}
      className={twMerge(choseVariant, startIcon || endIcon ? 'inline-flex gap-1.5 items-center' : undefined)}
    >
      {startIcon}
      {children}
      {endIcon}
    </div>
  )
})

Chip.displayName = 'Chip'

export default Chip
