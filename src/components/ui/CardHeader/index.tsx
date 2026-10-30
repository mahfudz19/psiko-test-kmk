import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>

const CardHeader = (props: CardHeaderProps) => {
  return <div className={twMerge('rounded-t-lg overflow-hidden', props.className)} {...props} />
}

export default CardHeader
