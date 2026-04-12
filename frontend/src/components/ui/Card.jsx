const VARIANTS = {
  white:    'nb-card',
  cream:    'nb-card-cream',
  volt:     'nb-card-volt',
  lavender: 'nb-card-lavender',
  mint:     'nb-card-mint',
}

export default function Card({
  children,
  variant = 'white',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
  ...props
}) {
  const base = VARIANTS[variant] ?? VARIANTS.white

  const paddingClass = {
    none: '',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-8',
  }[padding] ?? 'p-6'

  const hoverClass = hover
    ? 'cursor-pointer transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-hover active:translate-x-[3px] active:translate-y-[3px] active:shadow-none'
    : ''

  return (
    <div
      className={`${base} ${paddingClass} ${hoverClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  icon,
  accent = 'volt',
  className = '',
}) {
  const accentMap = {
    volt:     'bg-volt',
    mint:     'bg-mint',
    rose:     'bg-rose',
    sky:      'bg-sky',
    lavender: 'bg-lavender',
    peach:    'bg-peach',
  }

  const accentClass = accentMap[accent] ?? 'bg-volt'

  const isPositive = typeof delta === 'number' ? delta >= 0 : null

  return (
    <div className={`nb-card p-5 flex flex-col gap-3 ${className}`}>
      <div className="flex items-start justify-between">
        <span className="font-body text-sm font-600 text-ink/60">{label}</span>
        {icon && (
          <span
            className={`${accentClass} border-2.5 border-ink p-2 rounded-nb shadow-nb-sm`}
          >
            {icon}
          </span>
        )}
      </div>

      <span className="font-display text-4xl font-800 text-ink leading-none">
        {value}
      </span>

      {delta !== undefined && delta !== null && (
        <div className="flex items-center gap-1.5">
          <span
            className={`font-mono text-xs font-500 px-2 py-0.5 rounded border-2.5 border-ink ${
              isPositive ? 'bg-mint text-ink' : 'bg-rose text-ink'
            }`}
          >
            {isPositive ? '▲' : '▼'} {Math.abs(delta)}%
          </span>
          {deltaLabel && (
            <span className="font-body text-xs text-ink/50">{deltaLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg font-800 text-ink">{title}</h3>
        {subtitle && (
          <p className="font-body text-sm text-ink/60">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CardDivider() {
  return <div className="nb-divider my-4" />
}