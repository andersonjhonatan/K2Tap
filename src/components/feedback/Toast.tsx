import { Check, TriangleAlert, X } from 'lucide-react'
import type { ToastState } from '@/hooks/useToast'
import styles from '@/components/facilities/facilities.module.css'

type ToastProps = {
  toast: ToastState | null
  onDismiss: () => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null

  return (
    <div
      className={`${styles.toast} ${toast.variant === 'error' ? styles.toastError : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={styles.toastIcon}>
        {toast.variant === 'success' ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <TriangleAlert size={14} aria-hidden="true" />
        )}
      </div>
      <div className={styles.toastCopy}>
        <b>{toast.title}</b>
        <span>{toast.description}</span>
      </div>
      <button type="button" onClick={onDismiss} aria-label="Fechar aviso">
        <X size={13} />
      </button>
    </div>
  )
}
