'use client'

import { useCallback, useState } from 'react'
import type { ProjectConfig } from '@/types/project'
import { getMapUrls } from '@/lib/maps'
import type { CopyHandler } from './useCopyToast'

type ShareLocationOptions = {
  project: ProjectConfig
  onCopy: CopyHandler
  onNotify: (title: string, description: string) => void
}

/**
 * Compartilha pela Web Share API quando o aparelho oferece e cai para a área de
 * transferência quando não. Desistir do menu nativo não conta como falha.
 */
export function useShareLocation({ project, onCopy, onNotify }: ShareLocationOptions) {
  const [shared, setShared] = useState(false)
  const { mapsUrl, mapEmbedUrl } = getMapUrls(project.location)

  const share = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Localização • ${project.name}`,
          text: project.location.address,
          url: mapsUrl,
        })
        setShared(true)
        onNotify('Localização pronta', 'Agora é só escolher com quem compartilhar.')
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    const copied = await onCopy(`${project.location.address} — ${mapsUrl}`, {
      title: 'Localização copiada',
      description: 'O endereço e o link do mapa foram copiados.',
    })
    if (copied) setShared(true)
  }, [mapsUrl, onCopy, onNotify, project.location.address, project.name])

  return { shared, share, mapsUrl, mapEmbedUrl }
}
