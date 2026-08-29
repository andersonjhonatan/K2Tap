'use client'

import { useEffect, useState } from 'react'
import type { StaffCall, StaffCallReason } from '@/types/project'

export type StaffCallStatus = 'idle' | 'sending' | 'sent'

/** Pausa curta antes de confirmar, para o envio não parecer instantâneo demais. */
const SENDING_MS = 800

type UseStaffCallOptions = {
  staffCall: StaffCall
  /** Chamado no fim do envio, com o motivo escolhido. */
  onSent?: (reason: StaffCallReason) => void
}

export function useStaffCall({ staffCall, onSent }: UseStaffCallOptions) {
  const [reason, setReason] = useState<StaffCallReason>(staffCall.reasons[0])
  const [status, setStatus] = useState<StaffCallStatus>('idle')

  useEffect(() => {
    if (status !== 'sending') return
    const timer = window.setTimeout(() => {
      onSent?.(reason)
      setStatus('sent')
    }, SENDING_MS)
    return () => window.clearTimeout(timer)
    // O envio dispara uma vez por transição; motivo e callback são lidos no momento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return {
    reason,
    setReason,
    status,
    send: () => setStatus('sending'),
    reset: () => setStatus('idle'),
  }
}
