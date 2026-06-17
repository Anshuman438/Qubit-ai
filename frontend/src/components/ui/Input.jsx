import { useState, useRef } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  success,
  disabled = false,
  required = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  inputClassName = '',
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

  const stateClass = error
    ? 'nb-input-error'
    : success
    ? 'nb-input border-mint shadow-[3px_3px_0px_#5DCAA5]'
    : 'nb-input'

  const hasLeftIcon = Boolean(icon) && iconPosition === 'left'
  const hasRightContent = (Boolean(icon) && iconPosition === 'right') || isPassword

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="nb-label">
          {label}
          {required && <span className="text-rose ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {hasLeftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none flex items-center">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            ${stateClass}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${inputClassName}
          `}
          style={{
            paddingLeft:  hasLeftIcon ? '40px' : undefined,
            paddingRight: hasRightContent ? '40px' : undefined,
          }}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors flex items-center"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {!isPassword && icon && iconPosition === 'right' && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none flex items-center">
            {icon}
          </span>
        )}
      </div>

      {error && (
        <span className="flex items-center gap-1.5 font-body text-xs text-rose font-500">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </span>
      )}

      {success && !error && (
        <span className="flex items-center gap-1.5 font-body text-xs text-mint font-500">
          <CheckCircle2 size={12} className="shrink-0" />
          {success}
        </span>
      )}

      {hint && !error && !success && (
        <span className="font-body text-xs text-ink/50">{hint}</span>
      )}
    </div>
  )
}

export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  className = '',
  id,
  ...props
}) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="nb-label">
          {label}
          {required && <span className="text-rose ml-1">*</span>}
        </label>
      )}

      <select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          nb-input appearance-none cursor-pointer
          bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230D0D0D' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")]
          bg-no-repeat bg-[right_14px_center]
          ${error ? 'border-rose shadow-[3px_3px_0px_#F09595]' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{ paddingRight: '40px' }}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="flex items-center gap-1.5 font-body text-xs text-rose font-500">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </span>
      )}
    </div>
  )
}

export function OTPInput({ length = 6, value = '', onChange, error }) {
  const inputs = useRef([])

  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  const handleChange = (index, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next = digits.map((d, i) => (i === index ? char : d))
    onChange(next.join(''))
    if (char && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = digits.map((d, i) => (i === index ? '' : d))
        onChange(next.join(''))
      } else if (index > 0) {
        inputs.current[index - 1]?.focus()
        const next = digits.map((d, i) => (i === index - 1 ? '' : d))
        onChange(next.join(''))
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) inputs.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, '').slice(0, length))
    const focusIndex = Math.min(pasted.length, length - 1)
    inputs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`
              w-12 h-14 text-center
              font-mono text-xl font-700
              border-2.5 border-ink rounded-nb
              bg-white text-ink
              transition-all duration-100
              focus:outline-none focus:shadow-nb focus:translate-x-[-1px] focus:translate-y-[-1px]
              ${digit ? 'shadow-nb bg-volt' : 'shadow-nb-sm'}
              ${error ? 'border-rose' : 'border-ink'}
            `}
          />
        ))}
      </div>

      {error && (
        <span className="flex items-center gap-1.5 font-body text-xs text-rose font-500">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </span>
      )}
    </div>
  )
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  rows = 4,
  disabled = false,
  required = false,
  className = '',
  id,
  ...props
}) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="nb-label">
          {label}
          {required && <span className="text-rose ml-1">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`
          nb-input resize-none
          ${error ? 'border-rose shadow-[3px_3px_0px_#F09595]' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        {...props}
      />

      {error && (
        <span className="flex items-center gap-1.5 font-body text-xs text-rose font-500">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </span>
      )}

      {hint && !error && (
        <span className="font-body text-xs text-ink/50">{hint}</span>
      )}
    </div>
  )
}