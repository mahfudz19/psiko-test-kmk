'use client'
import type React from 'react'
import { forwardRef, Fragment, memo, useImperativeHandle, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { DateState } from '.'
import Calendar from '../Icon/IconCalendar'
import X from '../Icon/IconClose'
import IconButton from '../IconButton'
import { Label, TextFieldProps } from '../Input'
import { variantIsChoose } from '../TextField/FieldVariant'

const dateRegex = /^(\d{2}) ([A-Za-z]+) (\d{4})(?:\s+(\d{2}):(\d{2}))?$/
const rangeRegex = /^(\d{2} [A-Za-z]+ \d{4}(?:\s+\d{2}:\d{2})?)\s*-\s*(\d{2} [A-Zael]+ \d{4}(?:\s+\d{2}:\d{2})?)$/

// Format tanggal ke string lokal
function formatToLocal(monthNames: string[], date: Date | null) {
  if (!date) return ''
  const d = String(date.getDate()).padStart(2, '0')
  const m = monthNames[date.getMonth()] // gunakan nama bulan
  const y = date.getFullYear()
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  // Jika jam dan menit ingin ditampilkan
  return date.getHours() || date.getMinutes() ? `${d} ${m} ${y} ${h}:${min}` : `${d} ${m} ${y}`
}

const handleCopy = (
  e: React.ClipboardEvent<HTMLInputElement>,
  selectsRange: boolean,
  startDate: Date | null,
  endDate: Date | null,
  monthNames: string[]
) => {
  const val = selectsRange
    ? [formatToLocal(monthNames, startDate), formatToLocal(monthNames, endDate)].filter(Boolean).join(' - ')
    : formatToLocal(monthNames, startDate)
  e.preventDefault()
  e.clipboardData.setData('text/plain', val)
}
const handlePaste = (
  e: React.ClipboardEvent<HTMLInputElement>,
  monthNames: string[],
  showTimeSelect: boolean,
  showTimeInput: boolean,
  handleDateChange: (type: 'day' | 'month' | 'year', value: string, dateType: 'start' | 'end') => void,
  handleTimeChange: (value: string, type: 'hour' | 'minute', dateType: 'start' | 'end') => void,
  selectsRange: boolean // <-- tambahkan ini
) => {
  const text = e.clipboardData.getData('text').trim()
  let startDate: Date | null = null
  let endDate: Date | null = null

  if (rangeRegex.test(text)) {
    const [, startStr, endStr] = text.match(rangeRegex) || []
    startDate = parseLocalDate(startStr, monthNames)
    endDate = parseLocalDate(endStr, monthNames)
  } else if (dateRegex.test(text)) {
    startDate = parseLocalDate(text, monthNames)
  } else {
    // fallback: coba parse ISO
    const [start, end] = text.split('/')
    startDate = new Date(start)
    if (end) endDate = new Date(end)
  }

  // Selalu isi startDate
  if (startDate && !isNaN(startDate.getTime())) {
    handleDateChange('day', String(startDate.getDate()).padStart(2, '0'), 'start')
    handleDateChange('month', String(startDate.getMonth() + 1).padStart(2, '0'), 'start')
    handleDateChange('year', String(startDate.getFullYear()), 'start')
    if (showTimeSelect || showTimeInput) {
      handleTimeChange(String(startDate.getHours()).padStart(2, '0'), 'hour', 'start')
      handleTimeChange(String(startDate.getMinutes()).padStart(2, '0'), 'minute', 'start')
    }
  }
  // Isi endDate hanya jika selectsRange true
  if (selectsRange && endDate && !isNaN(endDate.getTime())) {
    handleDateChange('day', String(endDate.getDate()).padStart(2, '0'), 'end')
    handleDateChange('month', String(endDate.getMonth() + 1).padStart(2, '0'), 'end')
    handleDateChange('year', String(endDate.getFullYear()), 'end')
    if (showTimeSelect || showTimeInput) {
      handleTimeChange(String(endDate.getHours()).padStart(2, '0'), 'hour', 'end')
      handleTimeChange(String(endDate.getMinutes()).padStart(2, '0'), 'minute', 'end')
    }
  }
}

function parseLocalDate(str: string, monthNames: string[]): Date | null {
  // Cek format "08 Agustus 2025" atau "08 Agustus 2025 14:30"
  const match = str.match(/^(\d{2}) ([A-Za-z]+) (\d{4})(?:\s+(\d{2}):(\d{2}))?$/)
  if (!match) return null
  const [, d, m, y, h, min] = match
  // Cari index bulan dari monthNames
  const monthIndex = monthNames.findIndex(
    name => name.toLowerCase() === m.toLowerCase() || name.slice(0, 3).toLowerCase() === m.slice(0, 3).toLowerCase()
  )
  if (monthIndex === -1) return null
  return new Date(Number(y), monthIndex, Number(d), h ? Number(h) : 0, min ? Number(min) : 0)
}

const updateValue = (
  field: 'day' | 'month' | 'year' | 'hour' | 'minute',
  val: string,
  dateType: 'start' | 'end',
  handleDateChange: (type: 'day' | 'month' | 'year', value: string, dateType: 'start' | 'end') => void,
  handleTimeChange: (value: string, type: 'hour' | 'minute', dateType: 'start' | 'end') => void
) => {
  if (['day', 'month', 'year'].includes(field)) {
    handleDateChange(field as 'day' | 'month' | 'year', val, dateType)
  } else {
    handleTimeChange(val, field as 'hour' | 'minute', dateType)
  }
}

const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  index: number,
  fieldType: 'day' | 'month' | 'year' | 'hour' | 'minute',
  dateType: 'start' | 'end',
  inputs: {
    ref: React.RefObject<HTMLInputElement | null>
    placeholder: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLInputElement>
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>
    className: string
    fieldType: 'day' | 'month' | 'year' | 'hour' | 'minute'
    dateType: 'start' | 'end'
    disabled?: boolean
  }[],
  handleDateChange: (type: 'day' | 'month' | 'year', value: string, dateType: 'start' | 'end') => void,
  handleTimeChange: (value: string, type: 'hour' | 'minute', dateType: 'start' | 'end') => void,
  readOnly?: boolean,
  disabled?: boolean
) => {
  if (readOnly || disabled) return

  const target = e.currentTarget
  const value = target.value
  const numValue = Number.parseInt(value || '0', 10)

  // Navigasi antar input
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (index < inputs.length - 1) inputs[index + 1].ref.current?.focus()
    else target.setSelectionRange(0, target.value.length)
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (index > 0) inputs[index - 1].ref.current?.focus()
    else target.setSelectionRange(0, target.value.length)
  }

  // Naik/turun nilai numerik
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault()
    const delta = e.key === 'ArrowUp' ? 1 : -1
    const newVal = isNaN(numValue) ? 0 : numValue + delta
    let paddedValue = ''
    if (fieldType === 'year') {
      paddedValue = newVal > 1 ? newVal.toString().padStart(2, '0') : new Date().getFullYear().toString()
    } else if (fieldType === 'hour') {
      let boundedValue = newVal
      if (!value) boundedValue = 0
      else if (newVal > 23) boundedValue = 0
      else if (newVal < 0) boundedValue = 23

      paddedValue = boundedValue.toString().padStart(2, '0')
    } else if (fieldType === 'minute') {
      let boundedValue = newVal
      if (!value) boundedValue = 0
      else if (newVal > 59) boundedValue = 0
      else if (newVal < 0) boundedValue = 59

      paddedValue = boundedValue.toString().padStart(2, '0')
    } else if (fieldType === 'month') {
      let boundedValue = newVal
      if (newVal > 12) boundedValue = 1
      else if (newVal < 1) boundedValue = 12

      paddedValue = boundedValue.toString().padStart(2, '0')
    } else if (fieldType === 'day') {
      const yearStr =
        inputs.find(input => input.fieldType === 'year')?.ref.current?.value || new Date().getFullYear().toString()
      const monthStr = inputs.find(input => input.fieldType === 'month')?.ref.current?.value || '1'

      const year = parseInt(yearStr, 10)
      const month = parseInt(monthStr, 10)

      const maxDays = new Date(year, month, 0).getDate()

      let boundedValue = newVal
      if (newVal > maxDays) boundedValue = 1
      else if (newVal < 1) boundedValue = maxDays

      paddedValue = boundedValue.toString().padStart(2, '0')
    }

    updateValue(fieldType, paddedValue, dateType, handleDateChange, handleTimeChange)
  }

  // Hapus value
  if (e.key === 'Backspace') {
    ;(e.target as any).select?.()
    e.preventDefault()
    updateValue(fieldType, '', dateType, handleDateChange, handleTimeChange)
    if (value === '' && index > 0) inputs[index].ref.current?.focus()
  }
}

function getDateInputs({
  dateState,
  handleDateChange,
  handleTimeChange,
  showTimeSelect,
  showTimeInput,
  selectsRange,
  disabledTimeInput,
  dayRef,
  monthRef,
  yearRef,
  hourRef,
  minuteRef,
  dayRangeRef,
  monthRangeRef,
  yearRangeRef,
  hourRangeRef,
  minuteRangeRef,
  readOnly,
  disabled
}: {
  dateState: DateState
  handleDateChange: (type: 'day' | 'month' | 'year', value: string, dateType: 'start' | 'end') => void
  handleTimeChange: (value: string, type: 'hour' | 'minute', dateType: 'start' | 'end') => void
  showTimeSelect: boolean
  showTimeInput: boolean
  selectsRange: boolean
  disabledTimeInput: boolean
  dayRef: React.RefObject<HTMLInputElement | null>
  monthRef: React.RefObject<HTMLInputElement | null>
  yearRef: React.RefObject<HTMLInputElement | null>
  hourRef: React.RefObject<HTMLInputElement | null>
  minuteRef: React.RefObject<HTMLInputElement | null>
  dayRangeRef: React.RefObject<HTMLInputElement | null>
  monthRangeRef: React.RefObject<HTMLInputElement | null>
  yearRangeRef: React.RefObject<HTMLInputElement | null>
  hourRangeRef: React.RefObject<HTMLInputElement | null>
  minuteRangeRef: React.RefObject<HTMLInputElement | null>
  readOnly?: boolean
  disabled?: boolean
}) {
  const inputs: {
    ref: React.RefObject<HTMLInputElement | null>
    placeholder: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLInputElement>
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>
    className: string
    fieldType: 'day' | 'month' | 'year' | 'hour' | 'minute'
    dateType: 'start' | 'end'
    disabled?: boolean
  }[] = [
    {
      ref: dayRef,
      placeholder: 'dd',
      value: dateState.startDay,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleDateChange('day', e.target.value, 'start'),
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        const num = parseInt(e.target.value, 10)
        if (!isNaN(num)) {
          const formatted = num < 10 ? `0${num}` : `${num}`
          handleDateChange('day', formatted, 'start')
        }
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
        handleKeyDown(e, 0, 'day', 'start', inputs, handleDateChange, handleTimeChange, readOnly, disabled),
      className: 'min-h-[inherit] bg-inherit w-[2ch] outline-none text-center',
      dateType: 'start',
      fieldType: 'day' as const
    },
    {
      ref: monthRef,
      placeholder: 'mm',
      value: dateState.startMonth,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleDateChange('month', e.target.value, 'start'),
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        const num = parseInt(e.target.value, 10)
        if (!isNaN(num)) {
          const formatted = num < 10 ? `0${num}` : `${num}`
          handleDateChange('month', formatted, 'start')
        }
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
        handleKeyDown(e, 1, 'month', 'start', inputs, handleDateChange, handleTimeChange, readOnly, disabled),
      className: 'min-h-[inherit] bg-inherit w-[2ch] outline-none text-center',
      dateType: 'start',
      fieldType: 'month' as const
    },
    {
      ref: yearRef,
      placeholder: 'yyyy',
      value: dateState.startYear,
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '')
        if (raw.length === 4) {
          const num = parseInt(raw, 10)
          const currentYear = new Date().getFullYear()
          if (num >= 1900 && num <= currentYear + 20) handleDateChange('year', raw, 'start')
          else handleDateChange('year', '', 'start')
        } else {
          handleDateChange('year', '', 'start')
        }
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleDateChange('year', e.target.value, 'start'),
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
        handleKeyDown(e, 2, 'year', 'start', inputs, handleDateChange, handleTimeChange, readOnly, disabled),
      className: 'min-h-[inherit] bg-inherit w-[4ch] outline-none text-center',
      dateType: 'start',
      fieldType: 'year' as const
    }
  ]

  if (showTimeSelect || showTimeInput) {
    inputs.push(
      {
        ref: hourRef,
        placeholder: '--',
        value: dateState.startHour,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          e.preventDefault()
          handleTimeChange(e.target.value, 'hour', 'start')
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          const num = parseInt(e.target.value, 10)
          if (!isNaN(num)) {
            e.preventDefault()
            e.target.value = num < 10 ? `0${num}` : `${num}`
            handleTimeChange(e.target.value, 'hour', 'start')
          }
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
          handleKeyDown(e, 3, 'hour', 'start', inputs, handleDateChange, handleTimeChange, readOnly, disabled),
        className: 'min-h-[inherit] bg-inherit w-[2ch] outline-none text-center',
        dateType: 'start',
        fieldType: 'hour' as const,
        disabled: disabledTimeInput
      },
      {
        ref: minuteRef,
        placeholder: '--',
        value: dateState.startMinute,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          e.preventDefault()
          handleTimeChange(e.target.value, 'minute', 'start')
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          const num = parseInt(e.target.value, 10)
          if (!isNaN(num)) {
            e.preventDefault()
            e.target.value = num < 10 ? `0${num}` : `${num}`
            handleTimeChange(e.target.value, 'minute', 'start')
          }
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
          handleKeyDown(e, 4, 'minute', 'start', inputs, handleDateChange, handleTimeChange, readOnly, disabled),
        className: 'min-h-[inherit] bg-inherit w-[2ch] outline-none text-center',
        dateType: 'start',
        fieldType: 'minute' as const,
        disabled: disabledTimeInput
      }
    )
  }

  if (selectsRange) {
    inputs.push(
      {
        ref: dayRangeRef,
        placeholder: 'dd',
        value: dateState.endDay,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleDateChange('day', e.target.value, 'end'),
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          const num = parseInt(e.target.value, 10)
          if (!isNaN(num)) {
            const formatted = num < 10 ? `0${num}` : `${num}`
            handleDateChange('day', formatted, 'end')
          }
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
          handleKeyDown(e, 0, 'day', 'end', inputs, handleDateChange, handleTimeChange, readOnly, disabled),
        className: 'min-h-[inherit] bg-inherit w-[2ch] outline-none text-center',
        dateType: 'end',
        fieldType: 'day' as const
      },
      {
        ref: monthRangeRef,
        placeholder: 'mm',
        value: dateState.endMonth,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleDateChange('month', e.target.value, 'end'),
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          const num = parseInt(e.target.value, 10)
          if (!isNaN(num)) {
            const formatted = num < 10 ? `0${num}` : `${num}`
            handleDateChange('month', formatted, 'end')
          }
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
          handleKeyDown(e, 1, 'month', 'end', inputs, handleDateChange, handleTimeChange, readOnly, disabled),
        className: 'min-h-[inherit] bg-inherit w-[2ch] outline-none text-center',
        dateType: 'end',
        fieldType: 'month' as const
      },
      {
        ref: yearRangeRef,
        placeholder: 'yyyy',
        value: dateState.endYear,
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          const raw = e.target.value.replace(/\D/g, '')
          if (raw.length === 4) {
            const num = parseInt(raw, 10)
            const currentYear = new Date().getFullYear()
            if (num >= 1900 && num <= currentYear + 20) handleDateChange('year', raw, 'end')
            else handleDateChange('year', '', 'end')
          } else {
            handleDateChange('year', '', 'end')
          }
        },
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleDateChange('year', e.target.value, 'end'),
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
          handleKeyDown(e, 2, 'year', 'end', inputs, handleDateChange, handleTimeChange, readOnly, disabled),
        className: 'min-h-[inherit] bg-inherit w-[4ch] outline-none text-center',
        dateType: 'end',
        fieldType: 'year' as const
      }
    )
    if (showTimeSelect || showTimeInput) {
      inputs.push(
        {
          ref: hourRangeRef,
          placeholder: '--',
          value: dateState.endHour,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault()
            handleTimeChange(e.target.value, 'hour', 'end')
          },
          onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
            const num = parseInt(e.target.value, 10)
            if (!isNaN(num)) {
              e.preventDefault()
              e.target.value = num < 10 ? `0${num}` : `${num}`
              handleTimeChange(e.target.value, 'hour', 'end')
            }
          },
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
            handleKeyDown(e, 3, 'hour', 'end', inputs, handleDateChange, handleTimeChange, readOnly, disabled),
          className: 'min-h-[inherit] bg-inherit w-[2ch] outline-none text-center',
          dateType: 'end',
          fieldType: 'hour' as const,
          disabled: disabledTimeInput
        },
        {
          ref: minuteRangeRef,
          placeholder: '--',
          value: dateState.endMinute,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault()
            handleTimeChange(e.target.value, 'minute', 'end')
          },
          onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
            const num = parseInt(e.target.value, 10)
            if (!isNaN(num)) {
              e.preventDefault()
              e.target.value = num < 10 ? `0${num}` : `${num}`
              handleTimeChange(e.target.value, 'minute', 'end')
            }
          },
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
            handleKeyDown(e, 4, 'minute', 'end', inputs, handleDateChange, handleTimeChange, readOnly, disabled),
          className: 'min-h-[inherit] bg-inherit w-[2ch] outline-none text-center',
          dateType: 'end',
          fieldType: 'minute' as const,
          disabled: disabledTimeInput
        }
      )
    }
  }

  return inputs
}

// Komponen untuk input tanggal
interface DateInputContainerProps extends TextFieldProps {
  monthNames: string[]
  wrapperRef: React.RefObject<HTMLDivElement | null>
  selectsRange: boolean
  dateState: DateState
  formatToISOString: (date: Date | null) => string
  handleDateChange: (type: 'day' | 'month' | 'year', value: string, dateType: 'start' | 'end') => void
  handleTimeChange: (value: string, type: 'hour' | 'minute', dateType: 'start' | 'end') => void
  handleClear: (e: React.MouseEvent) => void
  handlerOpen: (isOpen?: boolean) => void
  setIsOpen: (value: React.SetStateAction<boolean>) => void
  sm: boolean
  isOpen: boolean
  showTimeSelect: boolean
  isClearable: boolean
  showTimeInput: boolean
  disabledTimeInput: boolean

  dayRef: React.RefObject<HTMLInputElement | null>
  monthRef: React.RefObject<HTMLInputElement | null>
  yearRef: React.RefObject<HTMLInputElement | null>
  hourRef: React.RefObject<HTMLInputElement | null>
  minuteRef: React.RefObject<HTMLInputElement | null>

  dayRangeRef: React.RefObject<HTMLInputElement | null>
  monthRangeRef: React.RefObject<HTMLInputElement | null>
  yearRangeRef: React.RefObject<HTMLInputElement | null>
  hourRangeRef: React.RefObject<HTMLInputElement | null>
  minuteRangeRef: React.RefObject<HTMLInputElement | null>
}

// Tambahkan interface untuk ref
export interface DateInputRef {
  focus: () => void
}

const DateInput = memo(
  forwardRef<DateInputRef, DateInputContainerProps>((props, ref) => {
    let {
      id,
      monthNames,
      wrapperRef,
      showTimeSelect,
      isClearable,
      selectsRange,
      dateState,
      handleClear,
      formatToISOString,
      handleDateChange,
      handleTimeChange,
      handlerOpen,
      setIsOpen,
      isOpen,
      sm,
      onBlur,
      showTimeInput,
      disabledTimeInput,

      className,
      classNames,
      variant,
      color,
      error,
      sizes,
      disabled,
      required,
      margin,
      label,
      helperText,
      fullWidth,
      noFocusAnimation,
      startAdornment,
      endAdornment,
      dayRef,
      hourRef,
      minuteRef,
      monthRef,
      yearRef,

      dayRangeRef,
      monthRangeRef,
      yearRangeRef,
      hourRangeRef,
      minuteRangeRef,
      ...rest
    } = props
    const isThereValue = selectsRange ? Boolean(dateState.startDate || dateState.endDate) : Boolean(dateState.startDate)
    const [focus, setFocus] = useState(isThereValue)

    const inputs = getDateInputs({
      dateState,
      handleDateChange,
      handleTimeChange,
      showTimeSelect,
      showTimeInput,
      selectsRange,
      disabledTimeInput,
      dayRef,
      monthRef,
      yearRef,
      hourRef,
      minuteRef,
      dayRangeRef,
      monthRangeRef,
      yearRangeRef,
      hourRangeRef,
      minuteRangeRef,
      readOnly: rest?.readOnly,
      disabled
    })

    if (error) color = 'error'

    const { variantChoose, fieldClassName } = variantIsChoose({
      variant,
      sizes,
      color,
      error,
      disabled,
      focus,
      margin,
      label,
      helperText,
      fullWidth,
      noFocusAnimation
    })

    // Expose focus method
    useImperativeHandle(ref, () => ({ focus: () => dayRef.current?.focus() }), [dayRef])

    return (
      <div className={twMerge(fieldClassName, classNames?.root)} onClick={() => dayRef.current?.focus()}>
        <input
          id={id}
          name={rest.name}
          value={`${formatToISOString(dateState.startDate)}${dateState.endDate ? '/' + formatToISOString(dateState.endDate) : ''}`}
          type='text'
          style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
          tabIndex={-1}
          onFocus={() => dayRef.current?.focus()}
          readOnly
        />

        <div
          ref={wrapperRef}
          tabIndex={-1}
          onKeyDown={e => {
            if (e.key === ' ') {
              e.preventDefault()
              handlerOpen()
            }
            if (e.key === 'Enter' && isOpen) {
              e.preventDefault()
              setIsOpen(false)
            }
            if (e.key === 'Escape') {
              e.preventDefault()
              if (isOpen) {
                e.stopPropagation()
                setIsOpen(false)
              }
            }
          }}
          onClick={() => {
            if (sm) handlerOpen()
            else setIsOpen(false)
          }}
          className={twMerge(
            'relative text-inherit inline-flex gap-2 items-center bg-inherit transition-transform duration-400 w-full',
            (sizes === 'small' || sizes === 'large') && 'px-2',
            variantChoose,
            className,
            classNames?.container
          )}
        >
          {startAdornment}
          <div className={twMerge(fullWidth && 'w-full', 'min-h-[inherit]', classNames?.containerInput)}>
            <Label
              focus={true}
              inputRef={inputs[0].ref}
              sizes={sizes}
              classNamesLabel={classNames?.label}
              color={color}
              error={error}
              label={label}
              required={required}
            />
            <div className='min-h-[inherit] inline-block bg-inherit'>
              {inputs.map((v, i) => {
                const next = inputs[i + 1]
                let separator: null | React.JSX.Element = null

                if (next) {
                  switch (next.fieldType) {
                    case 'day':
                      separator = (
                        <span className='min-h-[inherit] mx-2 text-text-secondary font-semibold'>&ndash;</span>
                      )
                      break
                    case 'hour':
                      separator = <span className='min-h-[inherit] text-text-secondary'>,</span>
                      break
                    case 'minute':
                      separator = <span className='min-h-[inherit] text-text-secondary'>:</span>
                      break
                    default:
                      separator = <span className='min-h-[inherit] text-text-secondary mx-0.5'>/</span>
                      break
                  }
                }

                return (
                  <Fragment key={i}>
                    <input
                      type='text'
                      inputMode={sm ? 'none' : 'numeric'}
                      maxLength={v.fieldType === 'year' ? 4 : 2}
                      ref={v.ref}
                      placeholder={v.placeholder}
                      value={v.value}
                      disabled={v.disabled || disabled}
                      readOnly={rest.readOnly}
                      onFocus={e => (sm ? undefined : e.target.select())}
                      onCopy={e => {
                        if (disabled) {
                          e.preventDefault()
                          return
                        }
                        handleCopy(e, selectsRange, dateState.startDate, dateState.endDate, monthNames)
                      }}
                      onPaste={e => {
                        if (disabled || rest.readOnly) {
                          e.preventDefault()
                          return
                        }
                        handlePaste(
                          e,
                          monthNames,
                          showTimeSelect,
                          showTimeInput,
                          handleDateChange,
                          handleTimeChange,
                          selectsRange
                        )
                      }}
                      onMouseDown={e => {
                        if (sm) return
                        e.preventDefault() // cegah seleksi manual dengan mouse
                        const input = e.currentTarget
                        input.focus()
                        input.setSelectionRange(0, input.value.length) // selalu full block
                      }}
                      onClick={e => (sm ? null : e.stopPropagation())}
                      onChange={e => {
                        if (rest.readOnly || disabled) return
                        v.onChange(e)
                      }}
                      onFocusCapture={e => {
                        if (!isThereValue || !e.target.value) setFocus(true)
                      }}
                      onBlur={e => {
                        if (!isThereValue || !e.target.value) setFocus(false)
                        if (sm) return
                        v.onBlur(e)
                        onBlur?.({ ...e, target: { ...e.target, name: rest.name ?? '' } })
                      }}
                      onBeforeInput={(e) => {
                        if (sm) return
                        if (!/^\d$/.test(e.data ?? '')) e.preventDefault()
                      }}
                      onKeyDown={e =>
                        handleKeyDown(
                          e,
                          i,
                          v.fieldType,
                          v.dateType,
                          inputs,
                          handleDateChange,
                          handleTimeChange,
                          rest.readOnly,
                          disabled
                        )
                      }
                      className='min-h-[inherit] bg-inherit outline-none text-center cursor-default select-none disabled:opacity-50'
                      style={{
                        width:
                          v.fieldType === 'year'
                            ? '4ch'
                            : v.placeholder === 'mm' && !(v.value.length > 0)
                              ? '3ch'
                              : '2ch'
                      }}
                    />
                    {separator}
                  </Fragment>
                )
              })}
            </div>
          </div>
          <div className='inline-flex items-center min-h-[inherit]'>
            {endAdornment}
            {isClearable && dateState.startDate && (
              <IconButton
                type='button'
                variant='text'
                sizes='small'
                disabled={disabled || rest.readOnly}
                onClick={e => {
                  setFocus(false)
                  handleClear(e)
                }}
                color='error'
              >
                <X className='bg-inherit h-4 w-4' />
              </IconButton>
            )}
            <IconButton
              type='button'
              variant='text'
              sizes='small'
              disabled={disabled || rest.readOnly}
              onClick={e => {
                if (sm) return
                e.stopPropagation()

                handlerOpen(true)
              }}
            >
              <Calendar fontSize={16} />
            </IconButton>
          </div>
        </div>

        {helperText && (
          <div
            className={twMerge(
              'text-xs text-gray-500 absolute -bottom-4 left-3',
              classNames?.helperText,
              error && 'text-error-main'
            )}
          >
            {helperText}
          </div>
        )}
      </div>
    )
  })
)
DateInput.displayName = 'DateInput'

export default DateInput
