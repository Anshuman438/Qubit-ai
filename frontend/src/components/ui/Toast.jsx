import { Toaster, toast } from 'react-hot-toast'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{ top: 24, right: 24 }}
      toastOptions={{
        duration: 4000,
        style: {
          background:   '#FFFFFF',
          color:        '#0D0D0D',
          border:       '2.5px solid #0D0D0D',
          borderRadius: '6px',
          boxShadow:    '4px 4px 0px #0D0D0D',
          fontFamily:   '"DM Sans", sans-serif',
          fontSize:     '14px',
          fontWeight:   '500',
          padding:      '12px 16px',
          maxWidth:     '380px',
        },
      }}
    />
  )
}

const iconMap = {
  success: <CheckCircle2  size={18} className="text-mint shrink-0" />,
  error:   <XCircle       size={18} className="text-rose shrink-0" />,
  warning: <AlertTriangle size={18} className="text-peach shrink-0" />,
  info:    <Info          size={18} className="text-sky shrink-0" />,
}

const accentMap = {
  success: '#5DCAA5',
  error:   '#F09595',
  warning: '#F0997B',
  info:    '#85B7EB',
}

function showToast(type, message, options = {}) {
  return toast.custom(
    (t) => (
      <div
        style={{
          background:    '#FFFFFF',
          border:        `2.5px solid #0D0D0D`,
          borderLeft:    `6px solid ${accentMap[type]}`,
          borderRadius:  '6px',
          boxShadow:     '4px 4px 0px #0D0D0D',
          padding:       '12px 16px',
          display:       'flex',
          alignItems:    'flex-start',
          gap:           '10px',
          maxWidth:      '380px',
          width:         '100%',
          opacity:        t.visible ? 1 : 0,
          transform:      t.visible ? 'translateX(0)' : 'translateX(60px)',
          transition:    'all 0.25s ease',
          fontFamily:    '"DM Sans", sans-serif',
        }}
      >
        {iconMap[type]}

        <div style={{ flex: 1, minWidth: 0 }}>
          {options.title && (
            <p style={{
              fontFamily:  '"Syne", sans-serif',
              fontWeight:  '700',
              fontSize:    '14px',
              color:       '#0D0D0D',
              marginBottom: '2px',
            }}>
              {options.title}
            </p>
          )}
          <p style={{
            fontSize:   '13px',
            color:      '#0D0D0D',
            lineHeight: '1.5',
            margin:     0,
          }}>
            {message}
          </p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            background:   'transparent',
            border:       'none',
            cursor:       'pointer',
            padding:      '2px',
            color:        'rgba(13,13,13,0.4)',
            shrink:       0,
            lineHeight:   1,
          }}
        >
          <X size={14} />
        </button>
      </div>
    ),
    { duration: options.duration ?? 4000, ...options }
  )
}

export const notify = {
  success: (message, options) => showToast('success', message, options),
  error:   (message, options) => showToast('error',   message, options),
  warning: (message, options) => showToast('warning', message, options),
  info:    (message, options) => showToast('info',    message, options),

  loading: (message) => toast.loading(message, {
    style: {
      background:   '#0D0D0D',
      color:        '#FFEC5C',
      border:       '2.5px solid #0D0D0D',
      borderRadius: '6px',
      boxShadow:    '4px 4px 0px #0D0D0D',
      fontFamily:   '"DM Sans", sans-serif',
      fontSize:     '14px',
      fontWeight:   '500',
    },
  }),

  dismiss: (id) => toast.dismiss(id),

  promise: (promise, messages) =>
    toast.promise(promise, messages, {
      style: {
        background:   '#FFFFFF',
        color:        '#0D0D0D',
        border:       '2.5px solid #0D0D0D',
        borderRadius: '6px',
        boxShadow:    '4px 4px 0px #0D0D0D',
        fontFamily:   '"DM Sans", sans-serif',
        fontSize:     '14px',
      },
    }),
}