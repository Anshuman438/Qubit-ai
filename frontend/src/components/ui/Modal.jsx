import { useEffect, useRef , useState } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  showClose = true,
  className = '',
}) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const sizeClass = {
    sm:   'max-w-sm',
    md:   'max-w-lg',
    lg:   'max-w-2xl',
    xl:   'max-w-4xl',
    full: 'max-w-[95vw]',
  }[size] ?? 'max-w-lg'

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === overlayRef.current) onClose?.()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(13,13,13,0.6)' }}
    >
      <div
        className={`
          nb-card w-full ${sizeClass}
          flex flex-col
          animate-slide-in-up
          ${className}
        `}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4 p-6 pb-4">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 className="font-display text-xl font-800 text-ink">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="font-body text-sm text-ink/60">{subtitle}</p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="shrink-0 p-1 rounded-nb border-2.5 border-transparent hover:border-ink hover:bg-cream transition-all duration-100"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div className="px-6 pb-4 flex-1 overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div className="px-6 pb-6 pt-2 border-t-2.5 border-ink mt-2">
            <div className="flex items-center justify-end gap-3 pt-4">
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'rose',
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {message && (
        <p className="font-body text-sm text-ink/70 leading-relaxed">
          {message}
        </p>
      )}
    </Modal>
  )
}

export function AlertModal({
  open,
  onClose,
  title,
  message,
  type = 'info',
}) {
  const typeConfig = {
    info:    { bg: 'bg-sky/20',     border: 'border-sky',     icon: 'ℹ' },
    success: { bg: 'bg-mint/20',    border: 'border-mint',    icon: '✓' },
    warning: { bg: 'bg-peach/20',   border: 'border-peach',   icon: '⚠' },
    error:   { bg: 'bg-rose/20',    border: 'border-rose',    icon: '✕' },
  }[type] ?? { bg: 'bg-sky/20', border: 'border-sky', icon: 'ℹ' }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <Button variant="ink" onClick={onClose}>
          Got it
        </Button>
      }
    >
      {message && (
        <div className={`${typeConfig.bg} ${typeConfig.border} border-2.5 rounded-nb p-4`}>
          <p className="font-body text-sm text-ink leading-relaxed">
            {typeConfig.icon} {message}
          </p>
        </div>
      )}
    </Modal>
  )
}

import { useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(null)

  const openModal  = (payload = null) => { setData(payload); setOpen(true) }
  const closeModal = () => { setOpen(false); setData(null) }
  const toggle     = () => setOpen((v) => !v)

  return { open, data, openModal, closeModal, toggle }
}