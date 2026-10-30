import { JSX } from 'react'
import { cva } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

export const variantslabel = cva(
  ['absolute', 'text-neutral-300 dark:text-neutral-500', 'duration-200', 'select-none'],
  {
    variants: {
      sizes: {
        small: ['text-xs', 'top-[0.4rem]'],
        medium: ['text-base', 'top-[0.45rem]'],
        large: ['text-lg', 'top-[0.6rem]']
      }
    },
    defaultVariants: {
      sizes: 'medium'
    }
  }
)

export const variantslabelActive = cva(['text-xs', '-top-4', 'px-1 '], {
  variants: {
    color: {
      default: ['text-gray-400', 'dark:text-neutral-400'],
      primary: ['text-primary-main', 'dark:text-primary-light'],
      secondary: ['text-secondary-dark', 'dark:text-secondary-light'],
      success: ['text-success-dark', 'dark:text-success-light'],
      error: ['text-error-dark', 'dark:text-error-light'],
      warning: ['text-warning-dark', 'dark:text-warning-light'],
      info: ['text-info-dark', 'dark:text-info-light']
    },
    sizes: {
      small: ['left-2.5'],
      medium: ['left-2.5'],
      large: ['left-2.5']
    }
  },
  defaultVariants: {
    color: 'default',
    sizes: 'medium'
  }
})

// ------------------------- outline ------------------------- //
export const variantsInputOutline = cva(
  ['outline-2 outline', 'rounded-xl my-0.5', 'focus-within:outline focus-within:outline-2'],
  {
    variants: {
      color: {
        default: [
          'outline-gray-300 dark:outline-gray-500',
          'hover:outline-gray-400 dark:hover:outline-gray-400',
          'focus-within:outline-gray-400'
        ],
        primary: [
          'outline-primary-main dark:outline-primary-light',
          'hover:outline-primary-dark dark:hover:outline-primary-main',
          'focus-within:outline-primary-main'
        ],
        secondary: [
          'outline-secondary-main dark:outline-secondary-light',
          'hover:outline-secondary-dark dark:hover:outline-secondary-main',
          'focus-within:outline-secondary-main'
        ],
        success: [
          'outline-success-main dark:outline-success-light',
          'hover:outline-success-dark dark:hover:outline-success-main',
          'focus-within:outline-success-main'
        ],
        error: [
          'outline-error-main dark:outline-error-light',
          'hover:outline-error-dark dark:hover:outline-error-dark',
          'focus-within:outline-error-main'
        ],
        warning: [
          'outline-warning-main dark:outline-warning-light',
          'hover:outline-warning-dark dark:hover:outline-warning-main',
          'focus-within:outline-warning-main'
        ],
        info: [
          'outline-info-main dark:outline-info-light',
          'hover:outline-info-dark dark:hover:outline-info-main',
          'focus-within:outline-info-main'
        ]
      },
      sizes: {
        small: ['text-sm', 'min-h-[1.875rem]', 'px-2'],
        medium: ['min-h-[2.5rem]', 'px-2.5', 'leading-6'],
        large: ['text-lg', 'min-h-[3.125rem]', 'px-3']
      }
    },
    defaultVariants: {
      color: 'default',
      sizes: 'medium'
    }
  }
)
// ----------------------- end outline ----------------------- //

// ------------------------ default ------------------------- //
export const variantsInputDefault = cva(['rounded-xl', 'my-0.5'], {
  variants: {
    color: {
      default: ['bg-gray-300/20 dark:bg-gray-500'],
      primary: ['text-primary-main dark:text-primary-light', 'bg-primary-main/20 dark:bg-primary-light/20'],
      secondary: ['text-secondary-main dark:text-secondary-light', 'bg-secondary-main/20 dark:bg-secondary-light/20'],
      success: ['text-success-main dark:text-success-light', 'bg-success-main/20 dark:bg-success-light/20'],
      error: ['text-error-main dark:text-error-light', 'bg-error-main/20 dark:bg-error-light/20'],
      warning: ['text-warning-main dark:text-warning-light', 'bg-warning-main/20 dark:bg-warning-light/20'],
      info: ['text-info-main dark:text-info-light', 'bg-info-main/20 dark:bg-info-light/20']
    },
    sizes: {
      small: ['text-sm', 'min-h-[1.875rem]', 'px-2'],
      medium: ['min-h-[2.5rem]', 'px-2.5', 'leading-6'],
      large: ['text-lg', 'min-h-[3.125rem]', 'px-3']
    }
  },
  defaultVariants: {
    color: 'default',
    sizes: 'medium'
  }
})
// ---------------------- end default ----------------------- //

// ------------------------ default ------------------------- //
export const variantsInputUnderlined = cva(['border-b-2'], {
  variants: {
    color: {
      default: ['hover:border-gray-400 dark:hover:border-gray-200', 'border-gray-300 dark:border-gray-400'],
      primary: [
        'hover:border-primary-dark dark:hover:border-primary-main',
        'border-primary-main dark:border-primary-light'
      ],
      secondary: [
        'hover:border-secondary-dark dark:hover:border-secondary-main',
        'border-secondary-main dark:border-secondary-light'
      ],
      success: [
        'hover:border-success-dark dark:hover:border-success-main',
        'border-success-main dark:border-success-light'
      ],
      error: ['hover:border-error-dark dark:hover:border-error-dark', 'border-error-main dark:border-error-light'],
      warning: [
        'hover:border-warning-dark dark:hover:border-warning-main',
        'border-warning-main dark:border-warning-light'
      ],
      info: ['hover:border-info-dark dark:hover:border-info-main', 'border-info-main dark:border-info-light']
    },
    sizes: {
      small: ['text-sm', 'min-h-[1.875rem]', 'px-2'],
      medium: ['min-h-[2.5rem]', 'px-2.5', 'leading-6'],
      large: ['text-lg', 'min-h-[3.125rem]', 'px-3']
    }
  },
  defaultVariants: {
    color: 'default',
    sizes: 'medium'
  }
})
// ---------------------- end default ----------------------- //

interface Props {
  variant?: 'default' | 'bordered' | 'underlined'
  sizes?: 'small' | 'medium' | 'large' | null
  color?: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info' | 'secondary'
  error?: boolean
  disabled?: boolean
  focus?: boolean
  margin?: 'none' | 'dense' | 'normal'
  label?: string | JSX.Element
  helperText?: string | boolean | JSX.Element
  fullWidth?: boolean
  noFocusAnimation?: boolean
}

export const variantIsChoose = (props: Props) => {
  const {
    variant = 'bordered',
    sizes,
    color,
    error,
    disabled,
    focus,
    helperText,
    label,
    margin = 'none',
    fullWidth,
    noFocusAnimation
  } = props
  let variantChoose
  switch (variant) {
    case 'bordered':
      variantChoose = twMerge(
        variantsInputOutline({ sizes, color }),
        error && ' outline-error-main dark:outline-error-main ',
        disabled && ' outline-gray-100 hover:outline-gray-100 dark:outline-gray-700 hover:dark:outline-gray-700 ',
        !disabled && focus && !noFocusAnimation && ' -translate-y-[0.125rem] ',
        !disabled && focus && ' z-[1] '
      )
      break
    case 'underlined':
      variantChoose =
        variantsInputUnderlined({ sizes, color }) +
        (disabled && ' border-gray-100 hover:border-gray-100 dark:border-gray-700 hover:dark:border-gray-700 ')
      break

    default:
      variantChoose =
        variantsInputDefault({ sizes, color }) +
        (disabled && ' bg-gray-50/90 dark:bg-gray-700 ') +
        (focus && ' z-[1] ') +
        (focus && !noFocusAnimation && ' -translate-y-[0.125rem] ')
      break
  }
  return {
    variantChoose,
    fieldClassName: twMerge(
      'inline-flex items-center relative',
      fullWidth ? 'w-full' : '',
      margin === 'normal' && 'my-4',
      margin === 'dense' && 'my-2',
      margin === 'none' && 'my-0',
      label && 'mt-4',
      error && 'text-error-main',
      disabled && 'text-gray-300 dark:text-gray-500',
      helperText && 'mb-4'
    )
  }
}
