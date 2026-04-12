import { Loader2 } from 'lucide-react'

const VARIANTS = {
  volt:     'nb-btn-volt',
  ink:      'nb-btn-ink',
  white:    'nb-btn-white',
  mint:     'nb-btn-mint',
  rose:     'nb-btn-rose',
  sky:      'nb-btn-sky',
  lavender: 'nb-btn-lavender',
  ghost:    'nb-btn-ghost',
}

const SIZES = {
  sm: 'nb-btn-sm',
  md: '',
  lg: 'nb-btn-lg',
}

export default function Button({
  children,
  variant = 'volt',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const base = VARIANTS[variant] ?? VARIANTS.volt
  const sizeClass = SIZES[size] ?? ''
  const widthClass = fullWidth ? 'w-full' : ''

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${base} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin shrink-0" />
      ) : (
        icon && iconPosition === 'left' && (
          <span className="shrink-0">{icon}</span>
        )
      )}

      {children && <span>{children}</span>}

      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  )
}