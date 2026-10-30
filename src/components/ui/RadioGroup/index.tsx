import React, { ReactNode } from 'react'
import { RadioProps } from '../Radio'

interface RadioGroupProps {
  children: ReactNode
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  name: string
}

const RadioGroup = ({ children, ...rest }: RadioGroupProps) => {
  return (
    <div>
      {React.Children.map(children, child => {
        if (React.isValidElement<RadioProps>(child)) {
          return React.cloneElement(child, {
            ...rest, // Spread props dari RadioGroupProps
            ...child.props // Spread props bawaan dari child
          })
        }
        return child
      })}
    </div>
  )
}

export default RadioGroup
