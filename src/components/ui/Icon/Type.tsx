import { HTMLAttributes } from 'react'
import { color } from '@/components/ui/Type'

interface MoreProps {
  fontSize?: number
  color?: color
}

export type IconProps = MoreProps & HTMLAttributes<SVGSVGElement>
