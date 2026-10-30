import React, { isValidElement, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useAccordionContext } from '.'
import Collapse from '../Collapse'
import IconChevronLeft from '../Icon/IconChevronLeft'
import Ripple from '../Ripple'

interface AccordionItemProps {
  value: string
  title: ReactNode
  children: ReactNode
  rippleEffect?: boolean
  className?: string
  classNames?: {
    root?: string
    trigger?: string
    transition?: string
    content?: string
  }
}

const AccordionItem: React.FC<AccordionItemProps> = props => {
  const { title, children, classNames, className, rippleEffect, value } = props
  const { openValues, toggleValue } = useAccordionContext()

  const isOpen = openValues.has(value)

  return (
    <div className={twMerge(classNames?.root)}>
      {/* trigger */}
      <button
        onClick={() => toggleValue(value)}
        className={twMerge(
          'relative overflow-hidden w-full text-left flex justify-between items-center focus:outline-none',
          classNames?.trigger
        )}
      >
        {isValidElement(title) ? title : <span className='font-medium'>{title}</span>}
        {rippleEffect && <Ripple color='white' opacity={0.25} />}
        <div>
          <IconChevronLeft fontSize={15} className={`duration-300 ${isOpen ? '-rotate-90' : ''}`} />
        </div>
      </button>
      {/* transition */}
      <Collapse isOpen={isOpen} className={twMerge(classNames?.transition)}>
        <div className={twMerge('p-1', className, classNames?.content)}>{children}</div>
      </Collapse>
    </div>
  )
}

export default AccordionItem
