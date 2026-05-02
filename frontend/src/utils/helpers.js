export function formatDate(date, options = {}) {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
    ...options,
  })
}

export function formatDateTime(date) {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d)) return '—'
  return d.toLocaleString('en-IN', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function timeAgo(date) {
  if (!date) return '—'
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  const intervals = [
    { label: 'year',   seconds: 31536000 },
    { label: 'month',  seconds: 2592000  },
    { label: 'week',   seconds: 604800   },
    { label: 'day',    seconds: 86400    },
    { label: 'hour',   seconds: 3600     },
    { label: 'minute', seconds: 60       },
  ]
  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s)
    if (count >= 1) return `${count} ${label}${count !== 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  if (s === 0) return `${m}m`
  return `${m}m ${s}s`
}

export function formatTimer(seconds) {
  const m = Math.floor(Math.max(0, seconds) / 60)
  const s = Math.max(0, seconds) % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function truncate(str, max = 60) {
  if (!str) return ''
  return str.length <= max ? str : `${str.slice(0, max).trimEnd()}…`
}

export function slugify(str = '') {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function scoreColor(pct) {
  if (pct >= 75) return 'text-mint'
  if (pct >= 50) return 'text-peach'
  return 'text-rose'
}

export function scoreBg(pct) {
  if (pct >= 75) return 'bg-mint'
  if (pct >= 50) return 'bg-peach'
  return 'bg-rose'
}

export function calcScore(correct, total, negative = 0, wrong = 0) {
  const raw = correct - wrong * negative
  return Math.max(0, raw)
}

export function calcPercentage(score, total) {
  if (!total) return 0
  return Math.round((score / total) * 100)
}

export function groupBy(array, key) {
  return array.reduce((acc, item) => {
    const group = item[key] ?? 'unknown'
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {})
}

export function sortBy(array, key, dir = 'asc') {
  return [...array].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av == null) return 1
    if (bv == null) return -1
    if (typeof av === 'string') {
      return dir === 'asc'
        ? av.localeCompare(bv)
        : bv.localeCompare(av)
    }
    return dir === 'asc' ? av - bv : bv - av
  })
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href    = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }
  const el = document.createElement('textarea')
  el.value = text
  el.style.position = 'fixed'
  el.style.opacity  = '0'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  return Promise.resolve()
}

export function parseApiError(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    'Something went wrong'
  )
}

export function clsx(...classes) {
  return classes.filter(Boolean).join(' ')
}