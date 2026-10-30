'use client'

import {
  ChangeEvent,
  ChangeEventHandler,
  forwardRef,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import useMediaQuery from '@/components/utility/UI/useMediaQuery'
import { twMerge } from 'tailwind-merge'
import Button from '../Button'
import IconClock from '../Icon/IconClock'
import IconTimeOut from '../Icon/IconTimeOut'
import IconButton from '../IconButton'
import { Label, TextFieldProps } from '../Input'
import Popover from '../Popover'
import { variantIsChoose } from '../TextField/FieldVariant'
import Typography from '../Typograph'

type TimeState = { h?: number; m?: number; p?: 'AM' | 'PM' }

const useTimeState = (initial?: string, name?: string, onChange?: ChangeEventHandler<HTMLInputElement>) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [is24HourFormat, setIs24HourFormat] = useState(false)
  const [time, setTime] = useState<TimeState>({ p: 'AM' })

  const safeSetTime = useCallback((updater: (prev: TimeState) => TimeState) => {
    setTime(prev => {
      const next = updater(prev)
      if (prev.h === next.h && prev.m === next.m && prev.p === next.p) return prev
      return next
    })
  }, [])

  const formattedValue = useMemo(() => {
    const { h, m } = time
    return typeof h === 'number' && typeof m === 'number'
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      : ''
  }, [time])

  const notifyChange = useCallback(
    (newTime: TimeState) => {
      if (!onChange) return

      const { h, m } = newTime
      const newVal =
        typeof h === 'number' && typeof m === 'number'
          ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          : ''

      onChange({
        target: { name: name ?? inputRef.current?.name ?? '', value: newVal }
      } as ChangeEvent<HTMLInputElement>)
    },
    [name, onChange]
  )

  // ✅ Hanya trigger onChange jika BUKAN dari sync initial
  useEffect(() => {
    if (initial === formattedValue) return

    if (!initial) {
      setTime({ p: 'AM', h: undefined, m: undefined })
      return
    }

    const [t, meridiem] = initial.split(' ')
    const [hStr, mStr] = t.split(':')
    const h = parseInt(hStr, 10)
    const m = parseInt(mStr, 10)

    if (isNaN(h) || isNaN(m)) {
      setTime({ p: 'AM', h: undefined, m: undefined })
      return
    }

    const hour24 = meridiem === 'PM' && h < 12 ? h + 12 : meridiem === 'AM' && h === 12 ? 0 : h
    setTime({ h: hour24, m, p: hour24 >= 12 ? 'PM' : 'AM' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  const toggleActiveInput = useCallback((selected: 'minute' | 'hour') => {
    if (selected === 'minute') {
      const select = document.getElementById('minute-select')
      if (select) {
        select.classList.add('ring-2', 'ring-offset-2', 'ring-primary-main')
      }
      // remove class ring to #hour-select
      const hourSelect = document.getElementById('hour-select')
      if (hourSelect) {
        hourSelect.classList.remove('ring-2', 'ring-offset-2', 'ring-primary-main')
      }
    }
    if (selected === 'hour') {
      // add class ring to #hour-select
      const hourSelect = document.getElementById('hour-select')
      if (hourSelect) {
        hourSelect.classList.add('ring-2', 'ring-offset-2', 'ring-primary-main')
      }
      // remove class ring to #hour-select
      const select = document.getElementById('minute-select')
      if (select) {
        select.classList.remove('ring-2', 'ring-offset-2', 'ring-primary-main')
      }
    }
  }, [])

  const setHours = useCallback(
    (h?: number) => {
      const hour24 = h !== undefined ? ((h % 24) + 24) % 24 : undefined
      safeSetTime(prev => {
        const next = {
          ...prev,
          h: hour24,
          p: is24HourFormat ? undefined : (hour24 ?? 0) >= 12 ? ('PM' as const) : ('AM' as const)
        }
        notifyChange(next)
        return next
      })
      toggleActiveInput('hour')
    },
    [is24HourFormat, safeSetTime, toggleActiveInput, notifyChange]
  )

  const setMinutes = useCallback(
    (m?: number) => {
      const minute = m !== undefined ? ((m % 60) + 60) % 60 : undefined
      safeSetTime(prev => {
        const next = {
          ...prev,
          m: minute,
          p: is24HourFormat ? undefined : (prev.h ?? 0) >= 12 ? ('PM' as const) : ('AM' as const)
        }
        notifyChange(next)
        return next
      })
      toggleActiveInput('minute')
    },
    [is24HourFormat, safeSetTime, toggleActiveInput, notifyChange]
  )

  const toggleFormat = useCallback(() => {
    setIs24HourFormat(prev => {
      setTime(prevTime => {
        const { h, p } = prevTime
        if (typeof h !== 'number') return prevTime
        if (prev) {
          return { ...prevTime, p: h >= 12 ? 'PM' : 'AM' }
        } else {
          const hour24 = p === 'PM' ? (h % 12) + 12 : h === 12 ? 0 : h
          return { ...prevTime, h: hour24, p: undefined }
        }
      })
      return !prev
    })
  }, []) // Format toggle doesn't change value, no notify needed

  const togglePeriod = useCallback(() => {
    setTime(prev => {
      const h = prev.h
      if (typeof h !== 'number') return prev
      const isAM = prev.p === 'AM'
      const newH = isAM ? (h < 12 ? h + 12 : h) : h >= 12 ? h - 12 : h
      const next = { ...prev, h: newH, p: isAM ? 'PM' : ('AM' as 'AM' | 'PM') }
      notifyChange(next)
      return next
    })
  }, [notifyChange])

  return {
    ...time,
    is24HourFormat,
    formattedValue,
    setHours,
    setMinutes,
    togglePeriod,
    toggleFormat,
    inputRef,
    isOpen,
    setIsOpen,
    toggleActiveInput
  }
}

interface ClockButtonProps {
  x: number
  y: number
  label?: string
  minute?: number
  active: boolean
  long?: boolean
  onClick: () => void
}
const ClockButton = ({ x, y, label, minute, active, long, onClick }: ClockButtonProps) => {
  return typeof minute === 'number' ? (
    <button
      onClick={onClick}
      tabIndex={-1}
      className={twMerge('absolute -ml-1.5 z-10 p-1')}
      style={{
        top: '50%',
        left: '50%',
        transform: `translate(${x}px, ${y}px) rotate(${minute * 6}deg)`,
        transformOrigin: 'top center',
        opacity: long ? 1 : 0.5
      }}
    >
      <div
        className={`duration-200 ${active ? 'bg-primary-main' : 'bg-text-primary'}`}
        style={{ width: active ? '4px' : '1px', height: long ? '10px' : '5px' }}
      />
    </button>
  ) : (
    <button
      type='button'
      tabIndex={-1}
      className={twMerge(
        'duration-200 absolute h-6 w-6 -ml-3 -mt-3 rounded-full flex items-center justify-center text-xs z-10',
        active ? 'bg-primary-main text-white' : 'hover:bg-primary-main/25 text-text-primary'
      )}
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

interface AnalogClockProps {
  hours?: number
  minutes?: number
  is24HourFormat: boolean
  period?: 'AM' | 'PM'
  onSelectHour: (hour: number) => void
  onSelectMinute: (minute: number) => void
  togglePeriod: () => void
  handleClear: () => void
}
const AnalogClock = memo((props: AnalogClockProps) => {
  const { hours, minutes, is24HourFormat, period, onSelectHour, onSelectMinute, togglePeriod, handleClear } = props
  const innerHours = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1
      const angle = (hour * 30 - 90) * (Math.PI / 180)
      return { hour, x: Math.cos(angle) * 75, y: Math.sin(angle) * 75 }
    })
  }, [])

  const outerHours = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 13
      const angle = ((hour === 24 ? 0 : hour) * 30 - 90) * (Math.PI / 180)
      return { hour: hour === 24 ? 0 : hour, x: Math.cos(angle) * 55, y: Math.sin(angle) * 55 }
    })
  }, [])

  const ticks = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const angle = (i * 6 - 90) * (Math.PI / 180)
        return {
          minute: i,
          x: Math.cos(angle) * 100,
          y: Math.sin(angle) * 100,
          long: i % 5 === 0
        }
      }),
    []
  )

  const actualHour = (hour: number) =>
    is24HourFormat ? hour : period === 'PM' ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour

  return (
    <div className='relative h-[200px] w-[200px] mx-auto rounded-full'>
      <IconButton
        type='button'
        variant='text'
        tabIndex={-1}
        sizes='small'
        onClick={handleClear}
        color='error'
        className='absolute top-0 z-10 px-2 text-xs'
      >
        <IconTimeOut fontSize={15} />
      </IconButton>

      {!is24HourFormat && (
        <Button
          type='button'
          variant='text'
          tabIndex={-1}
          sizes='small'
          onClick={togglePeriod}
          color='success'
          className='absolute top-0 right-0 z-10 px-2'
        >
          {period}
        </Button>
      )}

      {[...innerHours, ...(is24HourFormat ? outerHours : [])].map(({ hour, x, y }) => (
        <ClockButton
          key={`hour-${hour}`}
          x={x}
          y={y}
          label={String(hour).padStart(2, '0')}
          active={hours === actualHour(hour)}
          onClick={() => onSelectHour(actualHour(hour))}
        />
      ))}

      {ticks.map(({ minute, x, y, long }) => (
        <ClockButton
          key={`tick-${minute}`}
          x={x}
          y={y}
          minute={minute}
          long={long}
          active={minutes === minute}
          onClick={() => onSelectMinute(minute)}
        />
      ))}

      {/* Clock hands */}
      <div className='absolute inset-0 z-5 flex justify-center items-center'>
        <div className='bg-text-primary w-2 h-2 rounded-full' />
        <div
          className='absolute top-1/2 left-1/2 bg-text-primary rounded-full transition-transform'
          style={{
            height: '2px',
            width: '33px',
            transformOrigin: '0 50%',
            transform: `translate(0, -50%) rotate(${(((hours ?? 0) % 12) + (minutes ?? 0) / 60) * 30 - 90}deg)`
          }}
        />
        <div
          className='absolute top-1/2 left-1/2 bg-text-primary rounded-full transition-transform'
          style={{
            height: '1px',
            width: '45px',
            transformOrigin: '0 50%',
            transform: `translate(0, -50%) rotate(${(minutes ?? 0) * 6 - 90}deg)`
          }}
        />
      </div>
    </div>
  )
})

AnalogClock.displayName = 'AnalogClock'

const InputTime = forwardRef<HTMLInputElement, TextFieldProps & { value?: string; defaultValue?: string }>(
  (propd, ref) => {
    let {
      label,
      error,
      helperText,
      startAdornment,
      endAdornment,
      fullWidth,
      margin = 'none',
      color,
      variant = 'bordered',
      sizes,
      disabled,
      className,
      onChange,
      onBlur,
      classNames,
      noFocusAnimation,
      required,
      value,
      defaultValue,
      ...rest
    } = propd
    const wrapperRef = useRef<HTMLDivElement>(null)
    const hourRef = useRef<HTMLInputElement>(null)
    const minuteRef = useRef<HTMLInputElement>(null)

    const {
      h,
      m,
      p,
      is24HourFormat,
      formattedValue,
      setHours,
      setMinutes,
      togglePeriod,
      toggleFormat,
      inputRef,
      isOpen,
      setIsOpen,
      toggleActiveInput
    } = useTimeState(value ?? defaultValue, rest.name, onChange)

    if (error) color = 'error'

    const { variantChoose, fieldClassName } = variantIsChoose({
      variant,
      sizes,
      color,
      error,
      disabled,
      focus: false,
      margin,
      label,
      helperText,
      fullWidth,
      noFocusAnimation
    })

    const sm = !useMediaQuery('sm')

    return (
      <>
        <div className={twMerge(fieldClassName, classNames?.root)}>
          <div
            ref={wrapperRef}
            tabIndex={-1}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === ' ') {
                e.preventDefault()
                setIsOpen(true)
              }
              if (e.key === 'Enter' && isOpen) {
                e.preventDefault()
                if (h === undefined) setHours(0)
                if (m === undefined) setMinutes(0)
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
              hourRef.current?.focus()
              if (sm) {
                setIsOpen(true)
              } else {
                setIsOpen(false)
              }
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
            {/* hidden input for form */}
            <input
              {...rest}
              ref={el => {
                if (!el || inputRef.current === el) return
                inputRef.current = el
                if (typeof ref === 'function') ref(el)
                else if (ref) (ref as any).current = el
              }}
              type='hidden'
              value={formattedValue}
            />

            <div className={twMerge(fullWidth && 'w-full', 'min-h-[inherit]', classNames?.containerInput)}>
              <Label
                focus={true}
                inputRef={inputRef}
                sizes={sizes}
                classNamesLabel={classNames?.label}
                color={color}
                error={error}
                label={label}
                required={required}
              />
              <input
                ref={hourRef}
                type='text'
                inputMode='none'
                placeholder='--'
                tabIndex={0}
                value={h !== undefined ? String(h).padStart(2, '0') : ''}
                onClick={e => (!sm ? e.stopPropagation() : undefined)}
                onChange={e => {
                  const value = e.target.value
                  if (/^\d*$/.test(value)) setHours(Number(value))
                }}
                onFocus={e => (!sm ? e.target.select() : undefined)}
                onBlur={e => (onBlur ? onBlur({ ...e, target: { ...e.target, name: rest.name ?? '' } }) : undefined)}
                onKeyDown={e => {
                  if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    if (isOpen) setHours((h ?? 0) - 1)
                    else setHours((h ?? 0) + 1)
                  }
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    if (isOpen) setHours((h ?? 0) + 1)
                    else setHours((h ?? 0) - 1)
                  }
                  if (e.key === 'ArrowRight') {
                    e.preventDefault()
                    minuteRef.current?.focus()
                    toggleActiveInput('minute')
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    if (isOpen) {
                      e.stopPropagation()
                      setIsOpen(false)
                    }
                  }

                  if (e.key === 'Backspace') {
                    if (document.activeElement === hourRef.current) {
                      e.preventDefault()
                      e.stopPropagation()
                      setHours(undefined)
                    }
                  }
                }}
                className={twMerge(
                  'bg-inherit text-center min-h-[inherit] outline-none w-6 appearance-none no-spinner',
                  classNames?.input
                )}
              />
              <span>:</span>
              <input
                ref={minuteRef}
                type='text'
                inputMode='none'
                placeholder='--'
                tabIndex={-1}
                value={m !== undefined ? String(m).padStart(2, '0') : ''}
                onClick={e => (!sm ? e.stopPropagation() : undefined)}
                onChange={e => {
                  const value = e.target.value
                  if (/^\d*$/.test(value)) setMinutes(Number(value))
                }}
                onFocus={e => (!sm ? e.target.select() : undefined)}
                onBlur={e => (onBlur ? onBlur({ ...e, target: { ...e.target, name: rest.name ?? '' } }) : undefined)}
                onKeyDown={e => {
                  if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    if (isOpen) setMinutes((m ?? 0) - 1)
                    else setMinutes((m ?? 0) + 1)
                  }
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    if (isOpen) setMinutes((m ?? 0) + 1)
                    else setMinutes((m ?? 0) - 1)
                  }
                  if (e.key === 'ArrowLeft') {
                    e.preventDefault()
                    hourRef.current?.focus()
                    toggleActiveInput('hour')
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    if (isOpen) {
                      e.stopPropagation()
                      setIsOpen(false)
                    }
                  }

                  if (e.key === 'Backspace') {
                    if (document.activeElement === minuteRef.current) {
                      e.preventDefault()
                      e.stopPropagation()
                      setMinutes(undefined)
                    }
                  }
                }}
                className={twMerge(
                  'bg-inherit text-center min-h-[inherit] outline-none w-6 appearance-none no-spinner',
                  classNames?.input
                )}
              />
            </div>

            {endAdornment}
            <IconButton
              type='button'
              variant='text'
              tabIndex={-1}
              sizes='small'
              onClick={e => {
                hourRef.current?.focus()
                if (sm) return
                e.stopPropagation()
                setIsOpen(p => !p)
              }}
            >
              <IconClock fontSize={16} />
            </IconButton>
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

        {/* Popover */}
        <Popover
          anchorEl={wrapperRef.current}
          open={isOpen}
          onClose={() => {
            setIsOpen(false)
            hourRef.current?.focus()
          }}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              e.preventDefault()
              if (isOpen) {
                e.stopPropagation()
                setIsOpen(false)
              }
            }
          }}
          zIndex={50}
          anchor='bottom'
          className='duration-150 border border-divider overflow-hidden p-2.5 min-w-[14rem]'
          followWidthAnchor
          noLastFocusedElement
          {...(sm ? { onlyShowCenterBody: true, showBackDropColor: true } : { onlyShowUpOrDown: true })}
        >
          <div>
            <div className='flex justify-between items-center mb-2'>
              <Typography component='div' variant='subtitle1' fontWeight='semibold'>
                Select Time
              </Typography>
              <Button
                type='button'
                variant='text'
                sizes='small'
                onClick={() => {
                  toggleFormat()
                  hourRef.current?.focus()
                }}
                className='px-1.5'
              >
                {is24HourFormat ? '24H' : 'AM/PM'}
              </Button>
            </div>

            <div className='flex items-center justify-center gap-2 mb-4'>
              <select
                value={h ?? ''}
                id='hour-select'
                onChange={e => {
                  setHours(Number(e.target.value))
                  hourRef.current?.focus()
                }}
                className={twMerge(
                  'w-12 rounded-md outline outline-divider text-sm',
                  'ring-2 ring-offset-2 ring-primary-main',
                  h === undefined && 'bg-error-main/50'
                )}
              >
                {(is24HourFormat
                  ? Array.from({ length: 24 }, (_, i) => i)
                  : Array.from({ length: 12 }, (_, i) => (p === 'AM' ? i : i + 12))
                ).map(h => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span className='text-lg'>:</span>
              <select
                value={m ?? ''}
                id='minute-select'
                onChange={e => {
                  setMinutes(Number(e.target.value))
                  minuteRef.current?.focus()
                }}
                className={twMerge(
                  'w-12 rounded-md outline outline-divider text-sm',
                  m === undefined && 'bg-error-main/50'
                )}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option value={i} key={i}>
                    {i.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            <AnalogClock
              hours={h}
              minutes={m}
              is24HourFormat={is24HourFormat}
              period={p}
              handleClear={() => {
                setMinutes(undefined)
                setHours(undefined)
                if (sm) setIsOpen(false)
                hourRef.current?.focus()
              }}
              onSelectHour={val => {
                setHours(val)
                hourRef.current?.focus()
              }}
              onSelectMinute={val => {
                setMinutes(val)
                minuteRef.current?.focus()
              }}
              togglePeriod={() => {
                togglePeriod()
                hourRef.current?.focus()
              }}
            />
            {sm && (
              <div className='text-right'>
                <Button
                  type='button'
                  variant='outlined'
                  tabIndex={-1}
                  sizes='small'
                  onClick={() => {
                    if (h === undefined) setHours(0)
                    if (m === undefined) setMinutes(0)
                    setIsOpen(false)
                    hourRef.current?.focus()
                  }}
                >
                  Set
                </Button>
              </div>
            )}
          </div>
        </Popover>
      </>
    )
  }
)

InputTime.displayName = 'InputTime'
export default InputTime
