'use client'

import { ArrowUpRight, Copy, ExternalLink, MapPin, Share2, ShieldCheck, Wifi } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { ProjectConfig } from '@/types/project'
import type { CustomerFacility } from '@/data/facilities'
import { getPixPresentation } from '@/lib/pix'
import { createWifiPayload } from '@/lib/wifi'
import type { CopyHandler } from '@/hooks/useCopyToast'
import { useShareLocation } from '@/hooks/useShareLocation'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { DemoReview } from './DemoReview'
import styles from './demo.module.css'

type DemoFacilityPanelProps = {
  facility: CustomerFacility
  project: ProjectConfig
  onCopy: CopyHandler
  onNotify: (title: string, description: string) => void
}

function WifiPanel({ project, onCopy }: Omit<DemoFacilityPanelProps, 'facility' | 'onNotify'>) {
  return (
    <div className={styles.splitCard}>
      <div className={styles.qrBox}>
        <QRCodeSVG
          value={createWifiPayload(project.wifi)}
          size={168}
          level="M"
          marginSize={2}
          role="img"
          aria-label={`QR Code da rede Wi-Fi ${project.wifi.ssid}`}
        />
      </div>
      <div className={styles.dataList}>
        <div className={styles.dataRow}>
          <span>Rede</span>
          <b>{project.wifi.ssid}</b>
          <button
            type="button"
            aria-label="Copiar nome da rede Wi-Fi"
            onClick={() => onCopy(project.wifi.ssid)}
          >
            <Copy size={13} aria-hidden="true" />
            Copiar
          </button>
        </div>
        <div className={styles.dataRow}>
          <span>Senha</span>
          <b>{project.wifi.password}</b>
          <button
            type="button"
            aria-label="Copiar senha do Wi-Fi"
            onClick={() => onCopy(project.wifi.password)}
          >
            <Copy size={13} aria-hidden="true" />
            Copiar
          </button>
        </div>
        <p className={styles.note}>
          <Wifi size={13} aria-hidden="true" />
          Em celulares compatíveis, escanear já entrega rede e senha prontas.
        </p>
      </div>
    </div>
  )
}

function PixPanel({ project, onCopy }: Omit<DemoFacilityPanelProps, 'facility' | 'onNotify'>) {
  const pix = getPixPresentation(project.pix)

  return (
    <div className={styles.splitCard}>
      <div className={styles.qrBox}>
        <QRCodeSVG
          value={pix.qrValue}
          size={168}
          level="M"
          marginSize={2}
          role="img"
          aria-label={`QR Code Pix demonstrativo de ${project.name}`}
        />
      </div>
      <div className={styles.dataList}>
        <div className={styles.dataRow}>
          <span>Recebedor</span>
          <b>{pix.receiver}</b>
        </div>
        <div className={styles.dataRow}>
          <span>Chave Pix</span>
          <b>{pix.key}</b>
          <button
            type="button"
            aria-label="Copiar chave Pix fictícia"
            onClick={() => onCopy(pix.key)}
          >
            <Copy size={13} aria-hidden="true" />
            Copiar
          </button>
        </div>
        <p className={`${styles.note} ${styles.noteWarning}`}>
          <ShieldCheck size={13} aria-hidden="true" />
          QR fictício desta demonstração: nenhuma cobrança real é criada.
        </p>
      </div>
    </div>
  )
}

function SocialPanel({ project }: { project: ProjectConfig }) {
  return (
    <div className={styles.socialList}>
      {project.socials.map((social) => (
        <a key={social.network} href={social.href} target="_blank" rel="noopener noreferrer">
          <span className={styles.socialIcon}>
            <SocialIcon network={social.network} size={18} />
          </span>
          <span>
            <b>{social.network}</b>
            <small>{social.handle}</small>
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
          <span className="srOnly">Abre em nova aba</span>
        </a>
      ))}
    </div>
  )
}

function LocationPanel({ project, onCopy, onNotify }: Omit<DemoFacilityPanelProps, 'facility'>) {
  const { shared, share, mapsUrl, mapEmbedUrl } = useShareLocation({ project, onCopy, onNotify })

  return (
    <div className={styles.mapCard}>
      <iframe
        className={styles.mapEmbed}
        title={`Mapa de ${project.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={mapEmbedUrl}
      />
      <div className={styles.mapActions}>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin size={14} aria-hidden="true" />
          Abrir rota
          <ExternalLink size={13} aria-hidden="true" />
        </a>
        <button type="button" onClick={share}>
          <Share2 size={14} aria-hidden="true" />
          Compartilhar
        </button>
        {shared && <span className={styles.shareFeedback}>Pronto para compartilhar ✓</span>}
      </div>
    </div>
  )
}

export function DemoFacilityPanel({ facility, project, onCopy, onNotify }: DemoFacilityPanelProps) {
  switch (facility) {
    case 'wifi':
      return <WifiPanel project={project} onCopy={onCopy} />
    case 'pix':
      return <PixPanel project={project} onCopy={onCopy} />
    case 'social':
      return <SocialPanel project={project} />
    case 'location':
      return <LocationPanel project={project} onCopy={onCopy} onNotify={onNotify} />
    case 'review':
      return <DemoReview projectName={project.name} />
  }
}
