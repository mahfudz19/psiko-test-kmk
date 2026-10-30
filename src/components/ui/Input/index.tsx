'use client'
import { VariantProps } from 'class-variance-authority'
import { InputHTMLAttributes, JSX, Ref, RefObject, forwardRef, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { variantIsChoose, variantslabel, variantslabelActive } from '../TextField/FieldVariant'

interface MoreProps {
  label?: string | JSX.Element
  containerRef?: Ref<HTMLDivElement>
  helperText?: string | JSX.Element | boolean
  variant?: 'bordered' | 'underlined' | 'default'
  required?: boolean
  error?: boolean
  focused?: boolean
  startAdornment?: JSX.Element
  endAdornment?: JSX.Element
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default' | 'secondary'
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

interface LabelProps {
  inputRef: RefObject<HTMLInputElement | null>
  focus: boolean
  error?: boolean
  label?: string | JSX.Element
  required?: boolean
  classNamesLabel?: string
  color?: MoreProps['color']
  sizes: 'small' | 'medium' | 'large' | null | undefined
}
export const Label = (props: LabelProps) => {
  const { label, focus, error, classNamesLabel, sizes, color, required, inputRef } = props
  const [labelLeft, setLabelLeft] = useState(0)

  useEffect(() => {
    if (inputRef.current) setLabelLeft(inputRef.current.offsetLeft + 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!label || !labelLeft) return <></>
  return (
    <label
      className={twMerge(
        variantslabel({ sizes }),
        focus && variantslabelActive({ color }),
        error && 'text-error-main',
        classNamesLabel
      )}
      style={{
        left: focus ? '0.625rem' : labelLeft || '0.625rem',
        pointerEvents: 'none'
      }}
    >
      {label} {required && <span className='text-error-main'>*</span>}
    </label>
  )
}

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof variantIsChoose> & MoreProps

const Input = forwardRef<HTMLInputElement, TextFieldProps>((props: TextFieldProps, ref) => {
  let {
    label,
    error,
    helperText,
    startAdornment,
    endAdornment,
    fullWidth,
    placeholder,
    margin = 'none',
    color,
    variant = 'bordered',
    sizes,
    disabled,
    className,
    maxWidth,
    classNames,
    noFocusAnimation,
    required,
    focused,
    containerRef,
    ...rest
  } = props
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const focus = Boolean(
    focused
      ? focused
      : isFocused || inputRef.current?.value || rest.value || inputRef.current?.defaultValue || rest.defaultValue
  )
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
    <div className={twMerge(fieldClassName, classNames?.root)}>
      <div
        ref={containerRef}
        className={twMerge(
          'relative',
          'text-inherit',
          'inline-flex gap-2 items-center bg-inherit transition-transform duration-400 w-full',
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
          className={twMerge(fullWidth && 'w-full', classNames?.containerInput)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ minHeight: 'inherit' }}
        >
          {/* label */}
          <Label
            focus={focus}
            inputRef={inputRef}
            sizes={sizes}
            classNamesLabel={classNames?.label}
            color={color}
            error={error}
            label={label}
            required={required}
          />

          {/* input */}
          <input
            ref={el => {
              inputRef.current = el
              if (typeof ref === 'function') ref(el)
              else if (ref) ref.current = el
            }}
            placeholder={label && focus ? placeholder : label ? '' : placeholder}
            disabled={disabled}
            className={twMerge(
              fullWidth && 'w-full',
              classNames?.input,
              'bg-inherit focus:outline-none focus:ring-0',
              'placeholder:text-gray-400 placeholder:duration-200',
              rest.readOnly && 'cursor-default'
            )}
            style={{ maxWidth, minHeight: 'inherit' }}
            {...rest}
          />
        </div>

        {/* endAdornment */}
        {endAdornment && <>{endAdornment}</>}
      </div>
      {/* helperText */}
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

Input.displayName = 'Input'

export default Input
