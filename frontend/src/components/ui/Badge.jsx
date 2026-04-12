const VARIANTS = {
  volt:     'nb-badge-volt',
  mint:     'nb-badge-mint',
  rose:     'nb-badge-rose',
  sky:      'nb-badge-sky',
  lavender: 'nb-badge-lavender',
  peach:    'nb-badge-peach',
  ink:      'nb-badge-ink',
  white:    'nb-badge-white',
}

const DIFFICULTY_MAP = {
  easy:   { variant: 'mint',  label: 'Easy' },
  medium: { variant: 'peach', label: 'Medium' },
  hard:   { variant: 'rose',  label: 'Hard' },
  mixed:  { variant: 'sky',   label: 'Mixed' },
}

const STATUS_MAP = {
  draft: { variant: 'white',  label: 'Draft' },
  live:  { variant: 'mint',   label: 'Live' },
  done:  { variant: 'lavender', label: 'Done' },
}

export default function Badge({
  children,
  variant = 'volt',
  dot = false,
  icon = null,
  className = '',
}) {
  const base = VARIANTS[variant] ?? VARIANTS.volt

  return (
    <span className={`${base} ${className}`}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            variant === 'mint' ? 'bg-ink' :
            variant === 'rose' ? 'bg-ink' :
            'bg-ink'
          }`}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

export function DifficultyBadge({ difficulty }) {
  const config = DIFFICULTY_MAP[difficulty?.toLowerCase()] ?? DIFFICULTY_MAP.easy
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function StatusBadge({ status }) {
  const config = STATUS_MAP[status?.toLowerCase()] ?? STATUS_MAP.draft

  return (
    <Badge variant={config.variant} dot={status === 'live'}>
      {config.label}
    </Badge>
  )
}

export function ScoreBadge({ score, total }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const variant = pct >= 75 ? 'mint' : pct >= 50 ? 'peach' : 'rose'
  return <Badge variant={variant}>{pct}%</Badge>
}

export function RoleBadge({ role }) {
  const map = {
    teacher: { variant: 'lavender', label: 'Teacher' },
    student: { variant: 'sky',      label: 'Student' },
    admin:   { variant: 'volt',     label: 'Admin' },
  }
  const config = map[role?.toLowerCase()] ?? { variant: 'white', label: role }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function CountBadge({ count, max = 99 }) {
  const display = count > max ? `${max}+` : count
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 bg-rose text-ink font-mono text-xs font-700 border-2.5 border-ink rounded-full shadow-nb-sm">
      {display}
    </span>
  )
}