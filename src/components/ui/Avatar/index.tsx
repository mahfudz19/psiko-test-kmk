'use client'
import { VariantProps, cva } from 'class-variance-authority'
import Image from 'next/image'
import { HTMLAttributes, ReactNode, forwardRef, useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { stringToColor } from '@/components/utility/formats'
import { twMerge } from 'tailwind-merge'
import CircularProgress from '../CircularProgress'

type MoreProps = {
  src?: string
  alt: string
  children?: ReactNode
  width?: number
  height?: number
  variant?: 'square' | 'rounded' | 'circle'
  noBgcolor?: boolean
  ImageComponent?: any
  disableViewImage?: boolean
  withPhotoView?: boolean
}

const variantsAvatar = cva([''], {
  variants: { variant: { square: ['rounded-none'], rounded: ['rounded-xl'], circle: ['rounded-full'] } },
  defaultVariants: { variant: 'circle' }
})

export type AvatarProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof variantsAvatar> & MoreProps
const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props: AvatarProps, ref) => {
  const { src, alt, children, variant, width, height, className, style, noBgcolor, disableViewImage, withPhotoView } =
    props

  const [imageError, setImageError] = useState(false)
  const handleImageError = () => setImageError(true)

  const getFallbackContent = (): ReactNode => {
    if (children) return children
    else return alt?.charAt(0)
  }

  return (
    <>
      <div
        className={twMerge(
          'flex items-center justify-center',
          Boolean(children) && 'overflow-hidden',
          'text-white',
          variantsAvatar({ variant, className })
        )}
        style={{
          height: height || 40,
          width: width || 40,
          backgroundColor: !noBgcolor ? stringToColor(alt) : undefined,
          ...style
        }}
      >
        {disableViewImage ? (
          !imageError && src ? (
            <>
              {withPhotoView ? (
                <PhotoView src={src}>
                  <Image
                    src={src}
                    alt={alt}
                    width={width || 40}
                    height={height || 40}
                    className={twMerge('object-cover w-full h-full', variantsAvatar({ variant, className }))}
                    onError={handleImageError}
                    {...ref}
                  />
                </PhotoView>
              ) : (
                <Image
                  src={src}
                  alt={alt}
                  width={width || 40}
                  height={height || 40}
                  className={twMerge('object-cover w-full h-full', variantsAvatar({ variant, className }))}
                  onError={handleImageError}
                  {...ref}
                />
              )}
            </>
          ) : (
            <span>{getFallbackContent()}</span>
          )
        ) : (
          <PhotoProvider loadingElement={<CircularProgress size={60} />}>
            {!imageError && src ? (
              <PhotoView src={src}>
                <Image
                  src={src}
                  alt={alt}
                  width={width || 40}
                  height={height || 40}
                  className={twMerge('object-cover w-full h-full', variantsAvatar({ variant, className }))}
                  onError={handleImageError}
                  {...ref}
                />
              </PhotoView>
            ) : (
              <span>{getFallbackContent()}</span>
            )}
          </PhotoProvider>
        )}
      </div>
    </>
  )
})

Avatar.displayName = 'Avatar'

export default Avatar
