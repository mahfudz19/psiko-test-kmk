'use client'

import React from 'react'
import useMediaQuery from '@/components/utility/UI/useMediaQuery'
import { twMerge } from 'tailwind-merge'
import Button from '../Button'
import IconCheck from '../Icon/IconCheck'
import IconClose from '../Icon/IconClose'
import IconDownLine from '../Icon/IconDownLine'
import IconButton from '../IconButton'
import Input, { TextFieldProps } from '../Input'
import Popover from '../Popover'
import Typography from '../Typograph'
import { OptionProps } from './Option'

export interface SelectProps extends TextFieldProps {
  children?: React.ReactNode
  multiple?: boolean
  isClearable?: boolean
}

const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  ({ children, name, value, multiple, isClearable, onChange, disabled, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)

    let inputRef = React.useRef<HTMLInputElement>(null)
    let containerRef = React.useRef<HTMLDivElement>(null)
    let optionsRef = React.useRef<HTMLDivElement>(null)
    let optionsRefs = React.useRef<(HTMLElement | null)[]>([])

    const options = React.useMemo(
      () =>
        React.Children.toArray(children).length > 0
          ? React.Children.toArray(children)
              .filter(child => React.isValidElement(child))
              .map(child => child as React.ReactElement<OptionProps>)
          : [
              <div className='text-xs text-text-secondary text-center' key='no-option'>
                Tidak ada option...
              </div>
            ],
      [children]
    )

    let typevalue: string | number | readonly string[]
    value = props.defaultValue ?? value ?? ''

    // Menentukan tipe nilai awal
    if (Array.isArray(value)) typevalue = typeof value?.[0]
    else if (value !== undefined) typevalue = typeof value

    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      (Array.isArray(value) ? value : [value]).map(v => String(v)).filter(Boolean)
    )

    const selectedLabels = options
      .filter(option => selectedValues.includes(String(option.props.value)))
      .map(option => String(option.props.children))
      .join(', ')

    React.useEffect(() => {
      setSelectedValues((Array.isArray(value) ? value : [value]).map(v => String(v)).filter(Boolean))
    }, [props.defaultValue, value])

    const handleOpen = React.useCallback(
      (value?: boolean) => {
        if (props.readOnly || disabled) return
        if (value === true && !open) setOpen(true)
        else setOpen(p => !p)
        inputRef.current?.focus()
      },
      [disabled, open, props.readOnly]
    )

    const handleClose = React.useCallback(() => {
      setOpen(false)
      inputRef.current?.focus()
    }, [])

    const handleSelect = React.useCallback(
      (val?: string | number) => {
        if (props.readOnly || disabled) return
        if (val === undefined || val === null || val === '') {
          const newValue = multiple ? [] : undefined
          if (inputRef.current) inputRef.current.value = JSON.stringify(newValue)
          setSelectedValues(newValue || [])
          return onChange?.({ target: { name, value: newValue } } as unknown as React.ChangeEvent<HTMLInputElement>)
        }

        let newValue: string | number | string[] | number[]

        if (multiple) {
          const parsedValue = selectedValues
          newValue = parsedValue.includes(String(val))
            ? parsedValue.filter(v => v !== String(val))
            : [...parsedValue, String(val)]
        } else {
          newValue = String(val)
        }

        // **Gunakan `typevalue` untuk konversi kembali**
        if (typevalue === 'number') {
          if (Array.isArray(newValue)) newValue = newValue.map(v => Number(v)) as number[]
          else newValue = Number(newValue)
        }
        setSelectedValues((Array.isArray(newValue) ? newValue.map(String) : [`${newValue ?? ''}`]).filter(Boolean))
        if (inputRef.current) inputRef.current.value = JSON.stringify(newValue)
        onChange?.({ target: { name, value: newValue } } as React.ChangeEvent<HTMLInputElement>)
        if (!multiple) handleClose()
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [multiple, onChange, name, handleClose, selectedValues]
    )

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement | HTMLInputElement>) => {
        if (props.readOnly || disabled) return
        if (!open && ['Enter', ' '].includes(e.key)) {
          e.preventDefault()
          handleOpen(true)
          return
        }

        if (optionsRefs.current.length === 0) return

        const items = optionsRefs.current.filter(Boolean) as HTMLElement[]
        let currentIndex = items.findIndex(item => item === document.activeElement)

        if (items.length === 1) currentIndex = 0

        const findNextValidIndex = (startIndex: number, direction: 1 | -1) => {
          let newIndex = startIndex
          let attempt = 0
          const maxAttempts = items.length

          do {
            newIndex = (newIndex + direction + items.length) % items.length
            attempt++
          } while (
            items[newIndex]?.getAttribute('aria-disabled') === 'true' &&
            newIndex !== startIndex &&
            attempt <= maxAttempts
          )

          return attempt < maxAttempts ? newIndex : startIndex
        }

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            const nextIndex = findNextValidIndex(currentIndex !== -1 ? currentIndex : 0, 1)
            items[nextIndex]?.focus()
            break

          case 'ArrowUp':
            e.preventDefault()
            const prevIndex = findNextValidIndex(currentIndex !== -1 ? currentIndex : 0, -1)
            items[prevIndex]?.focus()
            break

          case 'Enter':
            e.preventDefault()
            if (currentIndex !== -1 && items[currentIndex]?.getAttribute('aria-disabled') !== 'true') {
              handleSelect(items[currentIndex].getAttribute('data-value') || '')
            }
            break

          case 'Escape':
            e.preventDefault()
            if (open) {
              e.stopPropagation()
              handleClose()
            }
            break

          case 'Tab':
            handleClose()
            break

          case 'Backspace':
            e.preventDefault()
            if (isClearable && selectedValues.length > 0 && !disabled) {
              e.stopPropagation()
              handleSelect()
            }
            break
        }
      },
      [props.readOnly, disabled, open, handleOpen, handleClose, isClearable, selectedValues.length, handleSelect]
    )

    const sm = !useMediaQuery('sm')

    return (
      <>
        <input type='hidden' name={name} value={selectedValues} />
        <Input
          {...props}
          focused={open}
          tabIndex={0}
          ref={el => {
            inputRef.current = el
            if (typeof ref === 'function') ref(el)
            else if (ref) ref.current = el
          }}
          autoComplete='off'
          containerRef={containerRef}
          value={selectedLabels}
          onClick={() => handleOpen()}
          onKeyDown={handleKeyDown}
          readOnly
          disabled={disabled}
          classNames={{ ...props.classNames, input: twMerge('cursor-default', props.classNames?.input) }}
          endAdornment={
            <>
              {props.endAdornment}

              <div className='flex items-center gap-1 h-full select-none'>
                {isClearable && selectedValues.length > 0 && !(props.readOnly || disabled) && (
                  <IconButton
                    sizes='small'
                    color='error'
                    variant='text'
                    type='button'
                    className='p-0.5'
                    tabIndex={-1}
                    onClick={e => {
                      e.stopPropagation()
                      handleSelect()
                    }}
                  >
                    <IconClose fontSize={13} />
                  </IconButton>
                )}
                <div className='border-l-2 border-divider h-full pl-1' onClick={() => handleOpen()}>
                  <IconDownLine fontSize={18} />
                </div>
              </div>
            </>
          }
        />
        <Popover
          anchorEl={containerRef.current}
          open={open}
          onClose={() => setOpen(false)}
          zIndex={50}
          anchor='bottom'
          className='duration-150 border border-divider overflow-hidden'
          style={sm ? { minWidth: '18rem', maxWidth: '18rem' } : undefined}
          followWidthAnchor
          noLastFocusedElement
          {...(sm ? { onlyShowCenterBody: true, showBackDropColor: true } : { onlyShowUpOrDown: true })}
        >
          {sm && (
            <Typography component='div' variant='caption' fontWeight='semibold' className='px-3 pt-3'>
              Select option:
            </Typography>
          )}
          <div
            ref={optionsRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className={twMerge(
              'outline-none flex flex-col gap-0.5 max-h-60 overflow-auto pb-3',
              sm ? 'px-3 pt-1' : 'p-3'
            )}
          >
            {options.map((option, index) => {
              const isSelected = selectedValues.includes(String(option.props.value))

              return React.cloneElement(
                option as React.ReactElement<OptionProps & { ref?: React.ForwardedRef<HTMLDivElement> }>,
                {
                  ...option.props,
                  ref: (el: HTMLDivElement | null) => {
                    optionsRefs.current[index] = el
                  },
                  onMouseDown: (e: React.MouseEvent) => {
                    e.preventDefault()
                    if (option.props.disabled) return
                    handleSelect(option.props.value)
                  },
                  children: (
                    <>
                      {option.props.children}
                      <span className='mt-0.5 inline-block w-[18px]'>{isSelected && <IconCheck fontSize={18} />}</span>
                    </>
                  )
                }
              )
            })}
          </div>
          {sm && multiple && (
            <div className='px-3 pt-1 pb-3 text-right'>
              <Button
                type='button'
                variant='outlined'
                sizes='small'
                onClick={() => setOpen(false)}
                disabled={selectedValues.length === 0}
              >
                Set
              </Button>
            </div>
          )}
        </Popover>
      </>
    )
  }
)

Select.displayName = 'Select'
export default Select
