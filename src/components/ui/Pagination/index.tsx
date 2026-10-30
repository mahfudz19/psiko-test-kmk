'use client'
import { VariantProps, cva } from 'class-variance-authority'
import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import IconChevronLeft from '@/components/ui/Icon/IconChevronLeft'
import IconChevronRight from '@/components/ui/Icon/IconChevronRight'
import useMediaQuery from '@/components/utility/UI/useMediaQuery'
import { twMerge } from 'tailwind-merge'
import { color } from '../Type'

interface MoreProps {
  totalCount: number
  currentPage: number
  onPageChange: (page: number) => void
  variant?: 'contained' | 'outlined'
}

export type PaginationProps = VariantProps<typeof variantsOutlinedPaginateButton> & MoreProps

const variantsOutlinedPrevNextButton = cva(
  [
    'flex items-center justify-center',
    'border',
    'rounded-lg',
    'text-center',
    'bg-inherit',
    'px-1',
    'py-1',
    'text-sm',
    'font-medium'
  ],
  {
    variants: {
      round: {
        circle: ['rounded-full'],
        rounded: ['rounded-lg']
      },
      color: {
        primary: [
          'border-primary-main/70',
          'text-primary-main/70',
          'disabled:text-primary-light/20',
          'disabled:border-primary-light/20'
        ],
        secondary: [
          'border-secondary-main/70',
          'text-secondary-main/70',
          'disabled:text-secondary-light/20',
          'disabled:border-secondary-light/20'
        ],
        success: [
          'border-success-main/70',
          'text-success-main/70',
          'disabled:text-success-light/20',
          'disabled:border-success-light/20'
        ],
        error: [
          'border-error-main/70',
          'text-error-main/70',
          'disabled:text-error-light/20',
          'disabled:border-error-light/20'
        ],
        warning: [
          'border-warning-main/70',
          'text-warning-main/70',
          'disabled:text-warning-light/20',
          'disabled:border-warning-light/20'
        ],
        info: [
          'border-info-main/70',
          'text-info-main/70',
          'disabled:text-warning-light/20',
          'disabled:border-info-light/20'
        ],
        white: ['border-white/70', 'text-white/70', 'disabled:text-white-light/20', 'disabled:border-white-light/20']
      },
      sizes: {
        small: ['w-8', 'h-8'],
        medium: ['w-10', 'h-10'],
        large: ['w-12', 'h-12']
      }
    },
    defaultVariants: {
      color: 'primary',
      sizes: 'medium',
      round: 'rounded'
    }
  }
)

const variantsContainedPrevNextButton = cva(
  [
    'flex items-center justify-center',
    'border',
    'rounded-lg',
    'text-center',
    'bg-inherit',
    'px-1',
    'py-1',
    'text-sm',
    'font-medium'
  ],
  {
    variants: {
      round: {
        circle: ['rounded-full'],
        rounded: ['rounded-lg']
      },
      color: {
        primary: [
          'text-primary-main',
          'border-primary-main/50',
          'disabled:border-primary-main/30',
          'disabled:text-primary-main/30'
        ],
        secondary: [
          'text-secondary-main',
          'border-secondary-main/50',
          'disabled:border-secondary-main/30',
          'disabled:text-secondary-main/30'
        ],
        success: [
          'text-success-main',
          'border-success-main/50',
          'disabled:border-success-main/30',
          'disabled:text-success-main/30'
        ],
        error: [
          'text-error-main',
          'border-error-main/50',
          'disabled:border-error-main/30',
          'disabled:text-error-main/30'
        ],
        warning: [
          'text-warning-main',
          'border-warning-main/50',
          'disabled:border-warning-main/30',
          'disabled:text-warning-main/30'
        ],
        info: ['text-info-main', 'border-info-main/50', 'disabled:border-info-main/30', 'disabled:text-info-main/30'],
        white: ['text-white', 'border-white/50', 'disabled:border-white/30', 'disabled:text-white/30']
      },
      sizes: {
        small: ['w-8', 'h-8'],
        medium: ['w-10', 'h-10'],
        large: ['w-12', 'h-12']
      }
    },
    defaultVariants: {
      color: 'primary',
      sizes: 'medium',
      round: 'rounded'
    }
  }
)

const PrevNextButton = (
  props: VariantProps<typeof variantsOutlinedPrevNextButton | typeof variantsContainedPrevNextButton> & {
    variant: 'contained' | 'outlined'
  } & ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { className, color, sizes, round, variant, ...rest } = props
  let variantCVA
  if (variant === 'outlined') variantCVA = variantsOutlinedPrevNextButton({ color, sizes, round, className })
  if (variant === 'contained') variantCVA = variantsContainedPrevNextButton({ color, sizes, round, className })
  return (
    <button
      type='button'
      className={twMerge(variantCVA)}
      {...rest}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    />
  )
}

const variantsOutlinedPaginateButton = cva(
  ['border', 'text-center', 'bg-inherit', 'px-1', 'py-1', 'text-sm', 'font-medium'],
  {
    variants: {
      round: {
        circle: ['rounded-full'],
        rounded: ['rounded-lg']
      },
      color: {
        primary: ['border-primary-main', 'text-primary-main', 'disabled:bg-primary-light/20'],
        secondary: ['border-secondary-main', 'text-secondary-main', 'disabled:bg-secondary-light/20'],
        success: ['border-success-main', 'text-success-main', 'disabled:bg-success-light/20'],
        error: ['border-error-main', 'text-error-main', 'disabled:bg-error-light/20'],
        warning: ['border-warning-main', 'text-warning-main', 'disabled:bg-warning-light/20'],
        info: ['border-info-main', 'text-info-main', 'disabled:bg-info-light/20'],
        white: ['border-white', 'text-white', 'disabled:bg-white-light/20']
      },
      sizes: {
        small: ['w-8', 'h-8'],
        medium: ['w-10', 'h-10'],
        large: ['w-12', 'h-12']
      }
    },
    defaultVariants: {
      color: 'primary',
      sizes: 'medium',
      round: 'rounded'
    }
  }
)

const variantsContainedPaginateButton = cva(
  ['border', 'text-center', 'bg-inherit', 'px-1', 'py-1', 'text-sm', 'font-medium'],
  {
    variants: {
      round: {
        circle: ['rounded-full'],
        rounded: ['rounded-lg']
      },
      color: {
        primary: [
          'border-primary-main/50',
          'text-primary-main',
          'disabled:text-white',
          'disabled:border-0',
          'disabled:bg-gradient-to-br',
          'disabled:from-teal-400',
          'disabled:to-primary-dark'
        ],
        secondary: [
          'border-secondary-main/50',
          'text-secondary-main',
          'disabled:text-white',
          'disabled:border-0',
          'disabled:bg-gradient-to-br',
          'disabled:from-teal-400',
          'disabled:to-secondary-dark'
        ],
        success: [
          'border-success-main/50',
          'text-success-main',
          'disabled:text-white',
          'disabled:border-0',
          'disabled:bg-gradient-to-br',
          'disabled:from-lime-400',
          'disabled:to-success-dark'
        ],
        error: [
          'border-error-main/50',
          'text-error-main',
          'disabled:text-white',
          'disabled:border-0',
          'disabled:bg-gradient-to-br',
          'disabled:from-rose-400',
          'disabled:to-error-dark'
        ],
        warning: [
          'border-warning-main/50',
          'text-warning-main',
          'disabled:text-white',
          'disabled:border-0',
          'disabled:bg-gradient-to-br',
          'disabled:from-amber-400',
          'disabled:to-warning-dark'
        ],
        info: [
          'border-info-main/50',
          'text-info-main',
          'disabled:text-white',
          'disabled:border-0',
          'disabled:bg-gradient-to-br',
          'disabled:from-cyan-400',
          'disabled:to-info-dark'
        ],
        white: [
          'border-white-main/50',
          'text-white',
          'disabled:text-white',
          'disabled:border-0',
          'disabled:bg-gradient-to-br',
          'disabled:from-white-light',
          'disabled:to-white-dark'
        ]
      },
      sizes: {
        small: ['w-8', 'h-8'],
        medium: ['w-10', 'h-10'],
        large: ['w-12', 'h-12']
      }
    },
    defaultVariants: {
      color: 'primary',
      sizes: 'medium',
      round: 'rounded'
    }
  }
)

const PaginateButton = (
  props: VariantProps<typeof variantsOutlinedPaginateButton | typeof variantsContainedPaginateButton> & {
    variant: 'contained' | 'outlined'
  } & ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { className, color, sizes, round, variant, ...rest } = props
  let variantCVA
  if (variant === 'outlined') variantCVA = variantsOutlinedPaginateButton({ color, round, sizes, className })
  if (variant === 'contained') variantCVA = variantsContainedPaginateButton({ color, round, sizes, className })
  return (
    <button
      type='button'
      className={twMerge(variantCVA)}
      {...rest}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    />
  )
}

const Pagination: FC<PaginationProps> = ({
  totalCount,
  currentPage: page,
  onPageChange,
  color,
  round,
  sizes,
  variant = 'outlined'
}) => {
  const sm = useMediaQuery('sm')

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage)
  }

  const renderButton = (pageNum: number) => {
    const key = `PaginateButton-${pageNum}-${page}-${totalCount}`
    return (
      <PaginateButton
        key={key}
        onClick={() => handlePageChange(pageNum)}
        disabled={page === pageNum}
        color={color as color}
        round={round}
        sizes={sizes}
        variant={variant}
      >
        {pageNum}
      </PaginateButton>
    )
  }

  const renderSpan = (key: string) => {
    key = `PaginateButton-${key}...-${page}-${totalCount}`
    return (
      <span key={key} className='w-8 px-1 py-1 text-sm font-medium text-center text-gray-700 bg-inherit'>
        ...
      </span>
    )
  }

  const renderButtonsAndSpans = () => {
    const buttonsAndSpans: ReactNode[] = []

    if (totalCount <= 7) {
      for (let i = 1; i <= totalCount; i++) {
        buttonsAndSpans.push(renderButton(i))
      }
    } else {
      buttonsAndSpans.push(renderButton(1))
      if (page <= 3) {
        buttonsAndSpans.push(renderButton(2))
        sm && buttonsAndSpans.push(renderButton(3))
        buttonsAndSpans.push(renderButton(4))
        sm && buttonsAndSpans.push(renderButton(5))
        buttonsAndSpans.push(renderSpan('1'))
      } else if (page >= totalCount - 2) {
        buttonsAndSpans.push(renderSpan('1'))
        sm && buttonsAndSpans.push(renderButton(totalCount - 4))
        buttonsAndSpans.push(renderButton(totalCount - 3))
        sm && buttonsAndSpans.push(renderButton(totalCount - 2))
        buttonsAndSpans.push(renderButton(totalCount - 1))
      } else {
        buttonsAndSpans.push(renderSpan('1'))
        sm && buttonsAndSpans.push(renderButton(page - 1))
        buttonsAndSpans.push(renderButton(page))
        sm && buttonsAndSpans.push(renderButton(page + 1))
        buttonsAndSpans.push(renderSpan('2'))
      }
      buttonsAndSpans.push(renderButton(totalCount))
    }

    return buttonsAndSpans
  }

  return (
    <nav className='relative z-0 inline-flex flex-wrap gap-0.5 sm:gap-1'>
      <PrevNextButton
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        color={color as color}
        round={round}
        sizes={sizes}
        variant={variant}
      >
        <IconChevronLeft fontSize={18} />
      </PrevNextButton>
      {renderButtonsAndSpans()}
      <PrevNextButton
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalCount}
        color={color as color}
        round={round}
        sizes={sizes}
        variant={variant}
      >
        <IconChevronRight fontSize={18} />
      </PrevNextButton>
    </nav>
  )
}

export default Pagination
