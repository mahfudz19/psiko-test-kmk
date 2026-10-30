import { HTMLAttributes } from 'react'

export type CardContentProps = HTMLAttributes<HTMLDivElement>

const CardContent = (props: CardContentProps) => {
  return <div className='p-2' {...props} />
}

export default CardContent
