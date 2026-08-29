'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  Camera,
  Copy,
  ExternalLink,
  MapPin,
  MessageCircle,
  Music2,
  Share2,
  ShieldCheck,
  Wifi,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { ProjectConfig } from '@/types/project'
import { getPixPresentation } from '@/lib/pix'
import { createWifiPayload } from '@/lib/wifi'
import { DemoReview } from './DemoReview'
import styles from './demo.module.css'

const socialIcons = {
  Instagram: Camera,
  WhatsApp: MessageCircle,
  TikTok: Music2,
} as const

type DemoFacilitiesProps = {
  project: ProjectConfig
  onCopy: (value: string, title?: string, description?: string) => Promise<boolean>
  onNotify: (title: string, description: string) => void
}

export function DemoFacilities({ project, onCopy, onNotify }: DemoFacilitiesProps) {
  const [shared, setShared] = useState(false)
  const wifiPayload = createWifiPayload(project.wifi)
  const pix = getPixPresentation(project.pix)
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

    const copied = await onCopy(
      `${project.location.address} — ${mapsUrl}`,
      'Localização copiada',
      'O endereço e o link do mapa foram copiados.',
    )
    if (copied) setShared(true)
  }

  return (
    <>
      <section className={styles.block} id="wifi" aria-labelledby="wifi-title">
        <div className={styles.blockHead}>
          <small>WI-FI DA CASA</small>
          <h2 id="wifi-title">Conecte sem pedir a senha.</h2>
        </div>
        <div className={styles.splitCard}>
          <div className={styles.qrBox}>
            <QRCodeSVG
              value={wifiPayload}
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
      </section>

      <section className={styles.block} id="pix" aria-labelledby="pix-title">
        <div className={styles.blockHead}>
          <small>PAGAMENTO</small>
          <h2 id="pix-title">Aponte a câmera e pague.</h2>
        </div>
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
      </section>

      <section className={styles.block} id="redes" aria-labelledby="social-title">
        <div className={styles.blockHead}>
          <small>REDES SOCIAIS</small>
          <h2 id="social-title">Todos os canais em um lugar só.</h2>
        </div>
        <div className={styles.socialList}>
          {project.socials.map((social) => {
            const Icon = socialIcons[social.network]
            return (
              <a key={social.network} href={social.href} target="_blank" rel="noopener noreferrer">
                <span className={styles.socialIcon}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <b>{social.network}</b>
                  <small>{social.handle}</small>
                </span>
                <ArrowUpRight size={16} aria-hidden="true" />
                <span className="srOnly">Abre em nova aba</span>
              </a>
            )
          })}
        </div>
      </section>

      <section className={styles.block} id="mapa" aria-labelledby="map-title">
        <div className={styles.blockHead}>
          <small>COMO CHEGAR</small>
          <h2 id="map-title">{project.location.address}</h2>
        </div>
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
            <button type="button" onClick={shareLocation}>
              <Share2 size={14} aria-hidden="true" />
              Compartilhar
            </button>
            {shared && <span className={styles.shareFeedback}>Pronto para compartilhar ✓</span>}
          </div>
        </div>
      </section>

      <section className={styles.block} id="opiniao" aria-labelledby="review-title">
        <div className={styles.blockHead}>
          <small>SUA OPINIÃO</small>
          <h2 id="review-title">Como foi sua experiência?</h2>
        </div>
        <DemoReview projectName={project.name} />
      </section>
    </>
  )
}
