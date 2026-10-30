import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type MoreProps = {
  total?: number
  max?: number
  children: ReactNode[]
}

const variantsAvatar = cva([''], {
  variants: {
    variant: {
      square: ['rounded-none'],
      rounded: ['rounded'],
      circle: ['rounded-full']
    }
  },
  defaultVariants: {
    variant: 'circle'
  }
})

export type AvatarGroupProps = VariantProps<typeof variantsAvatar> & MoreProps & HTMLAttributes<HTMLDivElement>

const AvatarGroup = ({ total, max, variant, className, children }: AvatarGroupProps) => {
  const visibleAvatars = children.slice(0, max)
  const overflowCount = (total || 0) - (max || 0)

  return (
    <div className='relative flex flex-row-reverse justify-end mr-1'>
      {overflowCount > 0 && (
        <div
          className={twMerge('-ml-2 bg-white border-2 border-white', 'z-[1]', variantsAvatar({ variant, className }))}
        >
          <div
            className={twMerge(
              'w-10 h-10',
              'flex items-center justify-center',
              'bg-gray-200',
              variantsAvatar({ variant, className })
            )}
          >
            +{overflowCount}
          </div>
        </div>
      )}
      {visibleAvatars.map((avatar, index) => (
        <div
          key={`${index}`}
          className={twMerge(
            'z-[1]',
            '-ml-2 border-2 border-white',
            index !== 0 && '-ml-3',
            variantsAvatar({ variant, className })
          )}
        >
          {avatar}
        </div>
      ))}
    </div>
  )
}

export default AvatarGroup
