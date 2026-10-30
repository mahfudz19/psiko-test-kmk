import { VariantProps, cva } from 'class-variance-authority'
import React, { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type MoreProps = {
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'div' | 'li'
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption'
  color?: 'text-primary' | 'text-secondary' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'
  gutterBottom?: boolean
  fontWeight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  textAlign?: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end'
}

const variantsText = cva([], {
  variants: {
    variant: {
      h1: ['text-5xl', 'md:text-6xl', 'leading-none'],
      h2: ['text-4xl', 'md:text-5xl', 'leading-tight'],
      h3: ['text-3xl', 'md:text-4xl', 'leading-none'],
      h4: ['text-2xl', 'md:text-3xl', 'leading-tight'],
      h5: ['text-xl', 'md:text-2xl', 'leading-snug'],
      h6: ['text-lg', 'md:text-xl', 'leading-tight'],
      subtitle1: ['text-base', 'leading-7'],
      subtitle2: ['text-sm', 'leading-6'],
      body1: ['text-base', 'leading-6'],
      body2: ['text-sm', 'leading-5'],
      caption: ['text-xs']
    },
    color: {
      'text-primary': ['text-text-primary', 'dark:text-gray-200'],
      'text-secondary': ['text-text-secondary', 'dark:text-gray-400'],
      primary: ['text-primary-main'],
      secondary: ['text-secondary-main'],
      info: ['text-info-main'],
      success: ['text-success-main'],
      warning: ['text-warning-main'],
      error: ['text-error-main']
    },
    fontWeight: {
      thin: ['font-thin'],
      extralight: ['font-extralight'],
      light: ['font-light'],
      normal: ['font-normal'],
      medium: ['font-medium'],
      semibold: ['font-semibold'],
      bold: ['font-bold'],
      extrabold: ['font-extrabold'],
      black: ['font-black']
    },
    textAlign: {
      left: ['text-left'],
      center: ['text-center'],
      right: ['text-right'],
      justify: ['text-justify'],
      start: ['text-start'],
      end: ['text-end']
    }
  }
})

export type TypographyProps = HTMLAttributes<HTMLElement> & VariantProps<typeof variantsText> & MoreProps

const Typography = (props: TypographyProps) => {
  const { component: Component = 'h1', gutterBottom, variant, color, className, fontWeight, textAlign, ...rest } = props
  let marginButton: string = ''
  if (gutterBottom) marginButton = 'mb-3'

  return (
    <Component
      {...rest}
      className={twMerge(marginButton, variantsText({ variant, color, fontWeight, textAlign, className }))}
    />
  )
}

export default Typography
