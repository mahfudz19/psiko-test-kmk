'use client'

import { JSX, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Chip from '../Chip'
import CircularProgress from '../CircularProgress'
import IconCheck from '../Icon/IconCheck'
import IconClose from '../Icon/IconClose'
import IconCloseSmall from '../Icon/IconCloseSmall'
import IconDownLine from '../Icon/IconDownLine'
import IconButton from '../IconButton'
import Input, { TextFieldProps } from '../Input'
import Popover from '../Popover'

// Custom debounce hook
const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => callback(...args), delay)
    },
    [callback, delay]
  )
}

// WithId Interface
type WithId = { _id: string; disabled?: boolean; [key: string]: any }

// Value type for better type safety
type AutoCompleteValue<T extends WithId> = T | string
type AutoCompleteMultipleValue<T extends WithId> = AutoCompleteValue<T>[]

// Consolidated state interface
interface AutoCompleteState<T extends WithId> {
  open: boolean
  inputValue: string
  selectedValues: AutoCompleteMultipleValue<T>
  filteredOptions: T[]
  highlightedIndex: number
  loading: boolean
}

// Props AutoComplete
export interface AutoCompleteProps<T extends WithId> extends Omit<TextFieldProps, 'value' | 'defaultValue'> {
  name?: string
  fetch?: (query: string) => Promise<T[]>
  options?: T[]
  field?: T | T[] | string | string[]
  value?: T | T[] | string | string[]
  defaultValue?: T | T[] | string | string[]
  multiple?: boolean
  keyLabelSelect?: string
  isClearable?: boolean
  freeSolo?: boolean
  removeValue?: (valueToRemove: AutoCompleteValue<T>, index: number) => void
  setFieldValue?: (option?: T | T[] | string | null) => void
  renderOption?: (option: T, props: React.LiHTMLAttributes<HTMLLIElement> & { key: string }) => JSX.Element
  renderFieldArray?: (
    item: AutoCompleteValue<T>,
    props: { key: number; tabIndex: number; onDelete: () => void; noAction?: boolean }
  ) => JSX.Element
  classNames?: {
    root?: string
    ulRenderFieldArray?: string
    liRenderFieldArray?: string
    inputClassNames?: {
      root?: string
      container?: string
      containerInput?: string
      startAdornment?: string
      input?: string
      endAdornment?: string
      label?: string
      helperText?: string
    }
  }
  sortingFieldArray?: (items: AutoCompleteMultipleValue<T>) => AutoCompleteMultipleValue<T>
  lableSort?: (
    firstIndex: boolean,
    item: AutoCompleteValue<T>,
    prevItem: AutoCompleteValue<T>,
    lastIndex: boolean
  ) => ReactNode
}

function AutoComplete<T extends WithId>(props: AutoCompleteProps<T>) {
  const {
    options = [],
    fetch,
    name,
    field = null,
    value: controlledValue,
    defaultValue,
    multiple = false,
    onChange,
    isClearable = false,
    keyLabelSelect = 'name',
    setFieldValue,
    renderOption,
    renderFieldArray,
    removeValue,
    classNames,
    sortingFieldArray,
    lableSort,
    freeSolo = false,
    ...rest
  } = props

  // Memoized values
  const currentValue = useMemo(() => (field !== undefined ? field : controlledValue), [field, controlledValue])
  const isControlled = useMemo(() => field !== undefined || controlledValue !== undefined, [field, controlledValue])

  // Consolidated state
  const [state, setState] = useState<AutoCompleteState<T>>(() => {
    const initialValue = isControlled ? currentValue : defaultValue
    const normalizedValue = normalizeValue(initialValue) as AutoCompleteMultipleValue<T>

    return {
      open: false,
      inputValue: !multiple && normalizedValue.length > 0 ? getDisplayValue(normalizedValue[0], keyLabelSelect) : '',
      selectedValues: normalizedValue,
      filteredOptions: options,
      highlightedIndex: -1,
      loading: false
    }
  })

  const inputRef = useRef<HTMLDivElement>(null)
  const prevValueRef = useRef(currentValue)

  // Helper functions (memoized)
  const isOptionSelected = useCallback(
    (option: T) => {
      return state.selectedValues.some(val => typeof val === 'object' && val._id === option._id)
    },
    [state.selectedValues]
  )

  useEffect(() => {
    if (fetch) return
    const newFiltered = state.inputValue.trim()
      ? options.filter(option =>
          getDisplayValue(option, keyLabelSelect).toLowerCase().includes(state.inputValue.toLowerCase())
        )
      : options
    if (JSON.stringify(newFiltered) === JSON.stringify(state.filteredOptions)) return
    setState(prev => ({ ...prev, filteredOptions: newFiltered }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, keyLabelSelect])

  // Update state when controlled value changes
  useEffect(() => {
    if (isControlled && prevValueRef.current !== currentValue) {
      const normalizedValue = normalizeValue(currentValue) as AutoCompleteMultipleValue<T>

      setState(prev => ({
        ...prev,
        selectedValues: normalizedValue,
        inputValue: !multiple && normalizedValue.length > 0 ? getDisplayValue(normalizedValue[0], keyLabelSelect) : ''
      }))

      prevValueRef.current = currentValue
    }
  }, [currentValue, isControlled, multiple, keyLabelSelect])

  // Debounced fetch
  const debouncedFetch = useDebounce(
    useCallback(
      async (query: string) => {
        if (fetch && query) {
          setState(prev => ({ ...prev, loading: true }))
          try {
            const data = await fetch(query)
            setState(prev => ({ ...prev, filteredOptions: data, loading: false, open: true }))
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
            setState(prev => ({ ...prev, loading: false }))
          }
        } else {
          const filtered = query.trim()
            ? options.filter(option =>
                getDisplayValue(option, keyLabelSelect).toLowerCase().includes(query.toLowerCase())
              )
            : options
          setState(prev => ({ ...prev, filteredOptions: filtered, open: true }))
        }
      },
      [fetch, options, keyLabelSelect]
    ),
    500
  )

  // Event handlers (memoized)
  const handleValueChange = useCallback(
    (newValue: AutoCompleteValue<T> | AutoCompleteMultipleValue<T> | null) => {
      if (rest.disabled || rest.readOnly) return

      let finalValue: AutoCompleteValue<T> | AutoCompleteMultipleValue<T> | null

      if (multiple) {
        finalValue = Array.isArray(newValue) ? newValue : newValue ? [newValue] : []
        setState(prev => ({
          ...prev,
          selectedValues: finalValue as AutoCompleteMultipleValue<T>,
          inputValue: ''
        }))
      } else {
        finalValue = Array.isArray(newValue) ? newValue[0] || null : newValue
        const normalizedValue = finalValue ? [finalValue] : []
        setState(prev => ({
          ...prev,
          selectedValues: normalizedValue,
          inputValue: finalValue
            ? getDisplayValue(Array.isArray(finalValue) ? finalValue[0] : finalValue, keyLabelSelect)
            : ''
        }))
      }

      prevValueRef.current =
        finalValue === null
          ? undefined
          : Array.isArray(finalValue)
            ? (finalValue as T[] | string[])
            : (finalValue as T | string)

      // Callbacks
      setFieldValue?.(finalValue as T | T[] | string | null)

      if (!isControlled) {
        const event = { target: { name: name, value: finalValue } } as React.ChangeEvent<HTMLInputElement>
        onChange?.(event)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [multiple, keyLabelSelect, setFieldValue, onChange, isControlled, name]
  )

  const handleSelectOption = useCallback(
    (option: T) => {
      if (multiple) {
        const isSelected = isOptionSelected(option)
        const newValues = isSelected
          ? state.selectedValues.filter(val => !(typeof val === 'object' && val._id === option._id))
          : [...state.selectedValues, option]
        handleValueChange(newValues)
      } else {
        handleValueChange(option)
      }
      setState(prev => ({ ...prev, open: false }))
    },
    [multiple, isOptionSelected, state.selectedValues, handleValueChange]
  )

  const handleSelectFreeSolo = useCallback(() => {
    if (!freeSolo || !state.inputValue.trim()) return

    const trimmedValue = state.inputValue.trim()
    const alreadySelected = state.selectedValues.some(
      val => getDisplayValue(val, keyLabelSelect).toLowerCase() === trimmedValue.toLowerCase()
    )

    if (alreadySelected) return

    if (multiple) {
      const newValues = [...state.selectedValues, trimmedValue]
      handleValueChange(newValues)
    } else {
      handleValueChange(trimmedValue)
      setState(prev => ({ ...prev, open: false }))
    }
  }, [freeSolo, state.inputValue, state.selectedValues, keyLabelSelect, multiple, handleValueChange])

  const handleRemoveValue = useCallback(
    (valueToRemove: AutoCompleteValue<T>, index: number) => {
      removeValue?.(valueToRemove, index)
      const newValues = state.selectedValues.filter(val => {
        if (typeof val === 'string' && typeof valueToRemove === 'string') return val !== valueToRemove
        if (typeof val === 'object' && typeof valueToRemove === 'object') return val._id !== valueToRemove._id
        return true
      })
      handleValueChange(multiple ? newValues : null)
    },
    [removeValue, state.selectedValues, handleValueChange, multiple]
  )

  const handleClear = useCallback(() => handleValueChange(null), [handleValueChange])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (rest.disabled || rest.readOnly) return
      const newValue = e.target.value
      setState(prev => ({ ...prev, inputValue: newValue }))
      if (!multiple && !freeSolo && state.selectedValues.length > 0) handleValueChange(null)
      debouncedFetch(newValue)
    },
    [rest.disabled, rest.readOnly, multiple, freeSolo, state.selectedValues.length, handleValueChange, debouncedFetch]
  )

  const navigateOptions = (direction: 1 | -1) => {
    if (state.filteredOptions.length === 0) return
    const newIndex = (state.highlightedIndex + direction + state.filteredOptions.length) % state.filteredOptions.length

    setState(prev => ({ ...prev, highlightedIndex: newIndex }))
    scrollToHighlightedOption(newIndex)
  }

  const scrollToHighlightedOption = (index: number) => {
    setTimeout(() => {
      const popover = document.querySelector('.custom-popover > div.overflow-y-auto') as HTMLDivElement | null
      if (!popover) return

      const optionElements = popover.querySelectorAll('[role="option"]') as NodeListOf<HTMLDivElement>
      if (optionElements.length === 0) return

      const highlightedElement = optionElements[index]
      if (!highlightedElement) return

      const { offsetTop, offsetHeight } = highlightedElement
      const { scrollTop, clientHeight } = popover

      if (offsetTop < scrollTop) popover.scrollTop = offsetTop
      else if (offsetTop + offsetHeight > scrollTop + clientHeight)
        popover.scrollTop = offsetTop + offsetHeight - clientHeight
    }, 10)
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (rest.disabled || rest.readOnly) return

      if (!state.open && e.key === 'Enter') {
        e.preventDefault()
        setState(prev => ({ ...prev, open: true }))
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          navigateOptions(1)
          break

        case 'ArrowUp':
          e.preventDefault()
          navigateOptions(-1)
          break

        case 'Enter':
          e.preventDefault()
          if (state.highlightedIndex !== -1 && state.filteredOptions[state.highlightedIndex]) {
            const option = state.filteredOptions[state.highlightedIndex]
            if (!option.disabled) handleSelectOption(option)
          } else if (freeSolo && state.inputValue.trim()) {
            handleSelectFreeSolo()
          }
          break
        case 'Escape':
          e.preventDefault()
          setState(prev => ({ ...prev, open: false }))
          break
        case 'Backspace':
          if (multiple && !state.inputValue && state.selectedValues.length > 0) {
            e.preventDefault()
            const newValues = state.selectedValues.slice(0, -1)
            handleValueChange(newValues)
          }
          break
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      rest.disabled,
      rest.readOnly,
      state.open,
      state.filteredOptions,
      state.highlightedIndex,
      state.inputValue,
      state.selectedValues,
      handleSelectOption,
      handleSelectFreeSolo,
      freeSolo,
      multiple,
      handleValueChange
    ]
  )

  // Memoized computed values
  const displayValues = useMemo(() => {
    return sortingFieldArray && Array.isArray(state.selectedValues)
      ? sortingFieldArray(state.selectedValues)
      : state.selectedValues
  }, [state.selectedValues, sortingFieldArray])

  const containerClassName = useMemo(
    () =>
      twMerge(
        'flex flex-wrap gap-y-0 pt-0.5 pr-12',
        rest.error && 'border-error-main focus-within:border-error-main focus-within:ring-error-main'
      ),
    [rest.error]
  )

  const inputClassNames = useMemo(
    () => ({
      input: 'cursor-text',
      container: containerClassName,
      containerInput: multiple ? 'w-auto' : undefined,
      ...classNames?.inputClassNames
    }),
    [containerClassName, multiple, classNames?.inputClassNames]
  )

  // Memoized render functions
  const renderSelectedChips = useMemo(() => {
    if (!multiple || state.selectedValues.length === 0 || renderFieldArray) return null

    return state.selectedValues.map((value, index) => (
      <Chip
        key={`chip-${index}`}
        variant='light'
        color='primary'
        sizes='small'
        className='my-1'
        endIcon={
          <IconButton
            sizes='small'
            color='error'
            variant='text'
            type='button'
            className='ml-0.5'
            tabIndex={-1}
            disabled={rest.disabled || rest.readOnly}
            onClick={e => {
              e.stopPropagation()
              handleRemoveValue(value, index)
            }}
          >
            <IconClose fontSize={13} />
          </IconButton>
        }
      >
        {getDisplayValue(value, keyLabelSelect)}
        {typeof value === 'string' && <IconCheck fontSize={12} color='success' className='ml-1' />}
      </Chip>
    ))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiple, state.selectedValues, rest.disabled, rest.readOnly, handleRemoveValue, keyLabelSelect])

  const renderFreeSoloIndicator = useMemo(() => {
    if (multiple || !freeSolo || state.selectedValues.length === 0) return null

    const value = state.selectedValues[0]
    if (typeof value === 'string') {
      return <IconCheck fontSize={12} color='success' className='absolute top-0.5 left-2.5' />
    }
    return null
  }, [multiple, freeSolo, state.selectedValues])

  // Focus management
  useEffect(() => {
    if (state.open) setTimeout(() => inputRef.current?.querySelector('input')?.focus(), 50)
  }, [state.open])

  return (
    <div>
      <div
        onClick={() => (!(rest.disabled || rest.readOnly) ? setState(p => ({ ...p, open: !p.open })) : null)}
        className={twMerge('relative', classNames?.root)}
      >
        <Input
          containerRef={inputRef}
          name={name}
          focused={state.open || state.selectedValues.length > 0}
          autoComplete='off'
          value={state.inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={rest.placeholder || 'Ketik di sini...'}
          classNames={inputClassNames}
          startAdornment={
            <>
              {renderSelectedChips}
              {renderFreeSoloIndicator}
            </>
          }
          endAdornment={
            <>
              {rest.endAdornment}
              <div className='flex justify-end gap-0.5 h-full py-2 absolute top-0 right-2 bottom-0 w-10'>
                {isClearable && state.selectedValues.length > 0 && !(rest.disabled || rest.readOnly) && (
                  <div className='flex items-center justify-center' onClick={e => e.stopPropagation()}>
                    <IconButton
                      sizes='small'
                      color='error'
                      variant='text'
                      type='button'
                      className='p-0.5'
                      tabIndex={-1}
                      onClick={handleClear}
                    >
                      <IconCloseSmall fontSize={16} />
                    </IconButton>
                  </div>
                )}
                {state.loading && (
                  <div className='flex items-center justify-center' onClick={e => e.stopPropagation()}>
                    <CircularProgress size={16} color='primary' />
                  </div>
                )}
                <div className='flex items-center justify-center border-l-2 border-gray-300 h-full pl-1'>
                  <IconDownLine fontSize={18} />
                </div>
              </div>
            </>
          }
          {...rest}
        />
      </div>
      {multiple && renderFieldArray && (
        <ul className={twMerge('p-1 overflow-auto text-sm max-h-64 mt-1', classNames?.ulRenderFieldArray)}>
          {displayValues.map((item, i) => (
            <li key={`field-array-${i}`} className={classNames?.liRenderFieldArray}>
              {lableSort && lableSort(i === 0, item, displayValues[i - 1], i === displayValues.length - 1)}
              {renderFieldArray?.(item, {
                key: i,
                tabIndex: -1,
                onDelete: () => !(rest.disabled || rest.readOnly) && handleRemoveValue(item, i),
                noAction: rest.disabled || rest.readOnly
              })}
            </li>
          ))}
        </ul>
      )}

      <Popover
        anchorEl={inputRef.current}
        open={state.open}
        onClose={() => setState(prev => ({ ...prev, open: false }))}
        zIndex={50}
        anchor='bottom'
        followWidthAnchor
        className='custom-popover duration-150 border border-divider overflow-hidden'
        onlyShowUpOrDown
        noLastFocusedElement
      >
        <div tabIndex={-1} className='outline-none p-2 flex flex-col gap-0.5 max-h-60 overflow-y-auto'>
          {state.filteredOptions.length > 0 ? (
            state.filteredOptions.map((option, index) => {
              const isSelected = isOptionSelected(option)
              const isDisabled = option.disabled ?? false
              const className = twMerge(
                'px-2 py-1 duration-300 flex justify-between rounded-lg',
                isDisabled ? 'opacity-50 cursor-not-allowed' : '',
                state.highlightedIndex === index
                  ? isDisabled
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'ring-2 ring-offset-1 ring-primary-main bg-secondary-light/25'
                  : 'hover:bg-secondary-light/25  hover:outline-none',
                isSelected && renderOption && "justify-between after:content-['✓'] after:block"
              )

              const props = {
                key: option?._id,
                role: 'option',
                'aria-disabled': isDisabled,
                className: className,
                onMouseEnter: () => {
                  if (!isDisabled) setState(prev => ({ ...prev, highlightedIndex: index }))
                },
                onClick: (e: any) => {
                  e?.preventDefault()
                  if (!isDisabled) handleSelectOption(option)
                }
              }

              if (renderOption) return renderOption(option, props)
              return (
                <div {...props} key={option?._id}>
                  <span>{getDisplayValue(option, keyLabelSelect)}</span>
                  {isSelected && !isDisabled && (
                    <span className='mt-0.5'>
                      <IconCheck fontSize={18} />
                    </span>
                  )}
                </div>
              )
            })
          ) : freeSolo && state.inputValue.trim() ? (
            (() => {
              const trimmedQuery = state.inputValue.trim()
              const isAlreadySelected = state.selectedValues.some(
                val => getDisplayValue(val, keyLabelSelect).toLowerCase() === trimmedQuery.toLowerCase()
              )
              const className = twMerge(
                `px-2 py-1 text-sm cursor-pointer rounded-md flex items-center justify-between`,
                isAlreadySelected
                  ? 'text-success-dark bg-success-light/25'
                  : 'text-primary-dark hover:bg-primary-light/25'
              )

              const optionProps = {
                role: 'option',
                className,
                onMouseEnter: () => {
                  setState(prev => ({ ...prev, highlightedIndex: 0 }))
                },
                onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                  e.preventDefault()
                  handleSelectFreeSolo()
                }
              }

              return (
                <div key='free-solo-option' {...optionProps}>
                  <span>
                    {isAlreadySelected ? (
                      <>Sudah dipilih: &quot;{trimmedQuery}&quot;</>
                    ) : (
                      <>Tambahkan &quot;{trimmedQuery}&quot;</>
                    )}
                  </span>
                  {isAlreadySelected && <IconCheck fontSize={14} />}
                </div>
              )
            })()
          ) : (
            <div className='text-xs text-text-secondary text-center'>Tidak ada option...</div>
          )}
        </div>
      </Popover>
    </div>
  )
}

function normalizeValue<T extends WithId>(val: any): AutoCompleteMultipleValue<T> {
  if (!val) return []
  if (Array.isArray(val)) return val as AutoCompleteMultipleValue<T>
  return [val] as AutoCompleteMultipleValue<T>
}

function getDisplayValue<T extends WithId>(val: T | string, keyLabelSelect: string): string {
  if (typeof val === 'string') return val
  return val[keyLabelSelect] || ''
}

export default AutoComplete
