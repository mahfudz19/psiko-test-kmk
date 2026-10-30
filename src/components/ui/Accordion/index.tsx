import { FC, HTMLAttributes, ReactNode, createContext, forwardRef, useContext, useState, useEffect } from 'react'

interface AccordionContextProps {
  openValues: Set<string>
  toggleValue: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextProps | undefined>(undefined)

export const useAccordionContext = () => {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('useAccordionContext must be used within an AccordionProvider')
  return context
}

interface AccordionProviderProps {
  children: ReactNode
  type?: 'single' | 'multiple'
  defaultOpen?: string[]
}

const AccordionProvider: FC<AccordionProviderProps> = ({ children, type = 'multiple', defaultOpen }) => {
  // initialize from defaultOpen prop; keep as Set for O(1) lookups
  const initial = (() => {
    if (!defaultOpen || defaultOpen.length === 0) return new Set<string>()
    if (type === 'single') return new Set([defaultOpen[0]])
    return new Set(defaultOpen)
  })()

  const [openValues, setOpenValues] = useState<Set<string>>(initial)
  useEffect(() => {
    if (!defaultOpen) return
    setOpenValues(prev => {
      const newSet = new Set(prev)
      // replace entirely with new defaults while preserving single/multiple rules
      newSet.clear()
      if (type === 'single') {
        if (defaultOpen.length > 0) newSet.add(defaultOpen[0])
      } else {
        defaultOpen.forEach(v => newSet.add(v))
      }
      return newSet
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleValue = (value: string) => {
    setOpenValues(prev => {
      const newValues = new Set(prev)
      if (type === 'single') {
        if (newValues.has(value)) {
          newValues.clear()
        } else {
          newValues.clear()
          newValues.add(value)
        }
      } else {
        if (newValues.has(value)) newValues.delete(value)
        else newValues.add(value)
      }
      return newValues
    })
  }

  return <AccordionContext.Provider value={{ openValues, toggleValue, type }}>{children}</AccordionContext.Provider>
}

interface MoreProps {
  children: ReactNode
  type?: 'single' | 'multiple'
  defaultOpen?: string[]
}

export type AccordionProps = HTMLAttributes<HTMLDivElement> & MoreProps

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, type = 'multiple', defaultOpen, ...props }: AccordionProps, ref) => {
    return (
      <AccordionProvider type={type} defaultOpen={defaultOpen}>
        <div {...props} ref={ref}>
          {children}
        </div>
      </AccordionProvider>
    )
  }
)

Accordion.displayName = 'Accordion'

export default Accordion
