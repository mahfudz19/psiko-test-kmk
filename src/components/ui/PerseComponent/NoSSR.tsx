import parse from 'html-react-parser'
import style from './unreset.module.css'
import { twMerge } from 'tailwind-merge'

function NoSSR({ data, unresetTailwind, className }: { data: string; unresetTailwind?: boolean; className?: string }) {
  return <div className={twMerge(unresetTailwind && style.unreset, className)}>{parse(data as string)}</div>
}

export default NoSSR
