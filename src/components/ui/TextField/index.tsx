'use client'
import {
  ChangeEvent,
  ForwardedRef,
  InputHTMLAttributes,
  JSX,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  useEffect,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'
import Input, { TextFieldProps } from '../Input'
import { variantIsChoose, variantslabel, variantslabelActive } from './FieldVariant'

interface MoreProps {
  label?: string | JSX.Element
  value?: string | number | readonly string[] | undefined
  placeholder?: string
  helperText?: string | JSX.Element | boolean
  multiline?: boolean
  variant?: 'bordered' | 'underlined' | 'default'
  error?: boolean
  readOnly?: boolean
  select?: boolean
  options?: any[]
  startAdornment?: JSX.Element
  endAdornment?: JSX.Element
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default' | 'secondary'
  type?: string
  autoCompleteMenu?: JSX.Element
  maxWidth?: number
  classNames?: {
    root?: string
    container?: string
    containerInput?: string
    input?: string
    label?: string
    helperText?: string
  }
  noFocusAnimation?: boolean
}

export type Props = (
  | InputHTMLAttributes<HTMLInputElement>
  | TextareaHTMLAttributes<HTMLTextAreaElement>
  | SelectHTMLAttributes<HTMLSelectElement>
) &
  TextFieldProps &
  MoreProps

const OtherComponentInput = (
  props: Props & { ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> }
) => {
  let {
    label,
    type,
    error,
    value: intialValue,
    onChange,
    helperText,
    multiline,
    select,
    options,
    startAdornment,
    endAdornment,
    fullWidth,
    placeholder,
    margin = 'none',
    color,
    variant = 'bordered',
    sizes,
    className,
    classNames,
    children,
    disabled,
    autoCompleteMenu,
    maxWidth,
    noFocusAnimation,
    required,
    ref,
    ...rest
  } = props
  const [value, setValue] = useState(
    rest.defaultValue
      ? rest.defaultValue === 0
        ? true
        : rest.defaultValue
          ? true
          : false
      : intialValue === 0
        ? true
        : intialValue
          ? true
          : false
  )
  const [isFocused, setIsFocused] = useState(false)

  const inputClasses = twMerge(fullWidth && 'w-full', 'bg-inherit', 'focus:outline-none', 'focus:ring-0')

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (!intialValue) {
      if (!event.target.value) setValue(false)
      else setValue(true)
    }

    if (onChange) onChange(event as any)
  }

  useEffect(() => {
    const check = rest.defaultValue
      ? rest.defaultValue === 0
        ? true
        : rest.defaultValue
          ? true
          : false
      : intialValue === 0
        ? true
        : intialValue
          ? true
          : false
    if (!check) setValue(false)
    else setValue(true)
  }, [intialValue, rest.defaultValue])

  const focus = isFocused || value
  if (!!error) color = 'error'
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

  return (
    <>
      <div className={twMerge('text-inherit', fieldClassName, classNames?.root)}>
        <div
          className={twMerge(
            'relative',
            'inline-flex gap-2 items-center bg-inherit transition-transform duration-400 w-full',
            'text-inherit',
            (sizes === 'small' || sizes === 'large') && 'px-2',
            variantChoose,
            className,
            classNames?.container
          )}
        >
          {/* startAdornment */}
          {startAdornment && <>{startAdornment}</>}

          {/* input container */}
          <div
            className={twMerge(classNames?.containerInput, fullWidth && 'w-full')}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {/* label */}
            {label && (
              <div
                className={twMerge(
                  variantslabel({ sizes }),
                  classNames?.label,
                  focus && variantslabelActive({ sizes, color }),
                  startAdornment && focus && '-translate-x-8',
                  error && 'text-error-main'
                )}
                style={{ pointerEvents: 'none' }}
              >
                {label} {required && <span className='text-error-main'>*</span>}
              </div>
            )}

            {/* input */}
            {select ? (
              <select
                ref={ref as Ref<HTMLSelectElement>}
                // placeholder={label && focus ? placeholder : label ? '' : placeholder}
                className={twMerge(
                  classNames?.input,
                  (sizes === 'medium' || sizes == undefined) && 'py-2',
                  sizes === 'large' && 'py-3',
                  rest.readOnly && 'cursor-default',
                  inputClasses
                )}
                style={{ maxWidth }}
                value={intialValue}
                disabled={disabled}
                onChange={onChange as (e: ChangeEvent<HTMLSelectElement>) => void}
                {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
              >
                {children ||
                  options?.map(option => (
                    <option className='rounded-md' key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            ) : multiline ? (
              <textarea
                ref={ref as Ref<HTMLTextAreaElement>}
                placeholder={label && focus ? placeholder : label ? '' : placeholder}
                className={twMerge(classNames?.input, inputClasses, 'py-1', rest.readOnly && 'cursor-default')}
                value={intialValue}
                disabled={disabled}
                onChange={handleChange}
                rows={4}
                style={{ maxWidth }}
                {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
              />
            ) : (
              <input
                ref={ref as Ref<HTMLInputElement>}
                placeholder={label && focus ? placeholder : label ? '' : placeholder}
                type={multiline ? 'textarea' : type}
                className={twMerge(classNames?.input, inputClasses, rest.readOnly && 'cursor-default')}
                value={intialValue}
                onChange={handleChange}
                disabled={disabled}
                {...(rest as InputHTMLAttributes<HTMLInputElement>)}
              />
            )}
          </div>

          {/* endAdornment */}
          {endAdornment && <>{endAdornment}</>}
        </div>
        {/* helperText */}
        {helperText && (
          <p
            className={twMerge(
              'text-xs text-gray-500 absolute -bottom-4 left-3',
              'text-text-secondary',
              classNames?.helperText,
              error && 'text-error-main'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
      {autoCompleteMenu}
    </>
  )
}

const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, Props>((props: Props, ref) => {
  if (!props.select && !props.multiline) return <Input {...props} ref={ref as Ref<HTMLInputElement> | undefined} />

  return <OtherComponentInput {...props} ref={ref} />
})

TextField.displayName = 'TextField'

export default TextField
