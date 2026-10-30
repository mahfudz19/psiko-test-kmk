import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconCopyPaste = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      xmlns='http://www.w3.org/2000/svg'
      width={`${fontSize}`}
      height={`${fontSize}`}
      viewBox='0 0 14 14'
    >
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M1.625 2.125h.511A1.5 1.5 0 0 0 3.5 3h2a1.5 1.5 0 0 0 1.364-.875h.511c.207 0 .375.168.375.375v.875a.625.625 0 1 0 1.25 0V2.5C9 1.603 8.272.875 7.375.875h-.511A1.5 1.5 0 0 0 5.5 0h-2a1.5 1.5 0 0 0-1.364.875h-.511C.728.875 0 1.603 0 2.5v6.875C0 10.273.728 11 1.625 11h2.75a.625.625 0 1 0 0-1.25h-2.75a.375.375 0 0 1-.375-.375V2.5c0-.207.168-.375.375-.375M6 6.5A1.5 1.5 0 0 1 7.5 5h5A1.5 1.5 0 0 1 14 6.5v6a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 6 12.5zm2.5.875a.625.625 0 1 0 0 1.25h3a.625.625 0 1 0 0-1.25zM7.875 11c0-.345.28-.625.625-.625h3a.625.625 0 1 1 0 1.25h-3A.625.625 0 0 1 7.875 11'
        clipRule='evenodd'
      />
    </svg>
  )
})

IconCopyPaste.displayName = 'IconCopyPaste'

export default IconCopyPaste
