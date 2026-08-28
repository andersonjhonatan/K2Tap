'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type ToastState = {
  id: number
  title: string
  description: string
  variant: 'success' | 'error'
}

export function useToast(duration = 2600) {
  const [toast, setToast] = useState<ToastState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setToast(null)
  }, [])

  const showToast = useCallback(
    (next: Omit<ToastState, 'id'>) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setToast({ ...next, id: Date.now() })
      timerRef.current = setTimeout(() => setToast(null), duration)
    },
    [duration],
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { toast, showToast, dismiss }
}
