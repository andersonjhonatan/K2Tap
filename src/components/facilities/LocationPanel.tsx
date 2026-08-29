'use client'

import { ExternalLink, MapPin, Share2 } from 'lucide-react'
import type { ProjectConfig } from '@/types/project'
import { useShareLocation } from '@/hooks/useShareLocation'
import type { CopyHandler } from '@/hooks/useCopyToast'
import styles from './facilities.module.css'

type LocationPanelProps = {
  project: ProjectConfig
  onCopy: CopyHandler
  onNotify: (title: string, description: string) => void
}

export function LocationPanel({ project, onCopy, onNotify }: LocationPanelProps) {
  const { shared, share, mapsUrl, mapEmbedUrl } = useShareLocation({ project, onCopy, onNotify })

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
            <button type="button" onClick={share}>
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
