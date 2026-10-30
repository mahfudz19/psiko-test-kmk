import { cva } from 'class-variance-authority'

const variantsIcon = cva([], {
  variants: {
    color: {
      primary: ['text-primary-main'],
      secondary: ['text-secondary-main'],
      success: ['text-success-main'],
      error: ['text-error-main'],
      warning: ['text-warning-main'],
      info: ['text-info-main'],
      white: ['text-white']
    }
  }
})

export default variantsIcon
