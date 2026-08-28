'use client'

import { ExternalLink, MapPin, Share2 } from 'lucide-react'
import { useState } from 'react'
import type { ProjectConfig } from '@/types/project'
import type { CopyHandler } from './types'
import styles from './facilities.module.css'

type LocationPanelProps = {
  project: ProjectConfig
  onCopy: CopyHandler
  onNotify: (title: string, description: string) => void
}

export function LocationPanel({ project, onCopy, onNotify }: LocationPanelProps) {
  const [shared, setShared] = useState(false)
  const encodedQuery = encodeURIComponent(project.location.mapQuery)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodedQuery}&output=embed`

  const shareLocation = async () => {
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
  }

  return (
    <div className={styles.panel}>
      <p className={styles.intro}>
        Visualize o endereço, abra a rota ou compartilhe a localização com outra pessoa.
      </p>
      <div className={styles.mapCard}>
        <iframe
          className={styles.mapEmbed}
          title={`Mapa de ${project.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapEmbedUrl}
        />
        <div className={styles.mapInfo}>
          <small>
            <MapPin size={11} aria-hidden="true" /> Endereço
          </small>
          <b>{project.location.address}</b>
          <div className={styles.locationActions}>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Abrir rota
              <ExternalLink size={12} aria-hidden="true" />
            </a>
            <button type="button" onClick={shareLocation}>
              Compartilhar
              <Share2 size={12} aria-hidden="true" />
            </button>
          </div>
          {shared && (
            <div className={styles.shareFeedback}>Localização pronta para compartilhar ✓</div>
          )}
        </div>
      </div>
    </div>
  )
}
