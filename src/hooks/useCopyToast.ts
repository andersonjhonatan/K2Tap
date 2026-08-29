'use client'

import { useCallback } from 'react'
import { useClipboard } from './useClipboard'
import { useToast } from './useToast'

export type CopyFeedback = {
  title: string
  description: string
}

export type CopyHandler = (value: string, feedback?: CopyFeedback) => Promise<boolean>

/**
 * Copiar e avisar andam sempre juntos nesta aplicação: toda superfície que
 * oferece "Copiar" precisa do mesmo toast de sucesso e do mesmo fallback.
 */
export function useCopyToast() {
  const clipboard = useClipboard()
  const { toast, showToast, dismiss } = useToast()

  const copy = useCallback<CopyHandler>(
    async (value, feedback) => {
      const copied = await clipboard(value)
      showToast(
        copied
          ? {
              title: feedback?.title ?? 'Copiado com sucesso',
              description:
                feedback?.description ?? 'O conteúdo já está na sua área de transferência.',
              variant: 'success',
            }
          : {
              title: 'Não foi possível copiar',
              description: 'Toque e segure o conteúdo para copiar manualmente.',
              variant: 'error',
            },
      )
      return copied
    },
    [clipboard, showToast],
  )

  const notify = useCallback(
    (title: string, description: string) => showToast({ title, description, variant: 'success' }),
    [showToast],
  )

  return { toast, dismiss, copy, notify }
}
