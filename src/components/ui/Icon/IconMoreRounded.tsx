import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconMoreRounded = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      width={`${fontSize}`}
      height={`${fontSize}`}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
        <path
          fill='currentColor'
          d='M9.525 13q.425 0 .713-.288t.287-.712q0-.425-.288-.713T9.526 11q-.425 0-.713.288T8.525 12q0 .425.288.713t.712.287Zm3.5 0q.425 0 .713-.288t.287-.712q0-.425-.288-.713T13.026 11q-.425 0-.713.288t-.287.712q0 .425.288.713t.712.287Zm3.5 0q.425 0 .713-.288t.287-.712q0-.425-.287-.713T16.524 11q-.425 0-.712.288t-.288.712q0 .425.288.713t.712.287Zm-7.5 6q-.5 0-.938-.225t-.712-.625l-3.525-5q-.375-.525-.375-1.15t.375-1.15l3.525-5q.275-.4.713-.625T9.024 5h10q.825 0 1.413.588T21.024 7v10q0 .825-.587 1.413T19.025 19h-10Z'
        />
      </svg>
    </svg>
  )
})

IconMoreRounded.displayName = 'IconMoreRounded'

export default IconMoreRounded
