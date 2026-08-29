'use client'

import { useEffect, useState } from 'react'
import { Check, ConciergeBell, Copy, ExternalLink, Smartphone, UserRound } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { StaffCall } from '@/types/project'
import { buildCustomerUrl, buildStaffUrl } from '@/lib/staff-call'
import type { CopyHandler } from './types'
import styles from './facilities.module.css'

type StaffCallPanelProps = {
  staffCall: StaffCall
  onCopy: CopyHandler
}

type CallStatus = 'idle' | 'sending' | 'sent'

const SENDING_MS = 900

const shortUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    return `${parsed.hostname}${parsed.pathname}`
  } catch {
    return url
  }
}

export function StaffCallPanel({ staffCall, onCopy }: StaffCallPanelProps) {
  const [status, setStatus] = useState<CallStatus>('idle')
  const [reason, setReason] = useState(staffCall.reasons[0] ?? '')

  useEffect(() => {
    if (status !== 'sending') return
    const timer = window.setTimeout(() => setStatus('sent'), SENDING_MS)
    return () => window.clearTimeout(timer)
  }, [status])

  // Os links só aparecem depois da confirmação, já no cliente, então a origem
  // resolvida aqui acompanha localhost, preview e domínio final.
  const links =
    status === 'sent'
      ? [
          {
            id: 'customer',
            eyebrow: 'TELA DO CLIENTE',
            title: `${staffCall.spot} • quem encosta o celular`,
            description: 'É esta a página que abre depois do Tap na peça da mesa.',
            url: buildCustomerUrl(staffCall),
            Icon: UserRound,
          },
          {
            id: 'staff',
            eyebrow: `CELULAR DO ${staffCall.role.toUpperCase()}`,
            title: 'Painel de chamados da equipe',
            description: `O ${staffCall.role.toLowerCase()} recebe o chamado aqui, com mesa e motivo.`,
            url: buildStaffUrl(staffCall, { reason }),
            Icon: Smartphone,
          },
        ]
      : []

  return (
    <div className={styles.panel}>
      <p className={styles.intro}>{staffCall.description}</p>

      <div className={styles.callCard}>
        <div className={styles.callSpot}>
          <span className={styles.callPulse} aria-hidden="true" />
          {staffCall.spot}
        </div>
        <h4>{staffCall.headline}</h4>

        <fieldset className={styles.reasonGroup} disabled={status !== 'idle'}>
          <legend>Motivo do chamado</legend>
          {staffCall.reasons.map((item) => (
            <label
              className={`${styles.reasonChip} ${reason === item ? styles.reasonChipActive : ''}`}
              key={item}
            >
              <input
                type="radio"
                name="staff-call-reason"
                value={item}
                checked={reason === item}
                onChange={() => setReason(item)}
              />
              {item}
            </label>
          ))}
        </fieldset>

        <button
          className={styles.callButton}
          type="button"
          disabled={status !== 'idle'}
          onClick={() => setStatus('sending')}
        >
          <ConciergeBell size={15} aria-hidden="true" />
          {status === 'idle' && staffCall.actionLabel}
          {status === 'sending' && 'Enviando chamado...'}
          {status === 'sent' && 'Chamado enviado'}
        </button>

        {status === 'sent' && (
          <div className={styles.callStatus} role="status">
            <span className={styles.callMark} aria-hidden="true">
              <Check size={14} />
            </span>
            <b>
              {staffCall.role} a caminho da {staffCall.spot.toLowerCase()}
            </b>
            <span>
              Motivo enviado: {reason}. O chamado apareceu na hora no celular de quem está
              atendendo.
            </span>
          </div>
        )}
      </div>

      {links.length > 0 && (
        <div className={styles.linkList}>
          {links.map(({ id, eyebrow, title, description, url, Icon }) => (
            <article className={styles.linkCard} key={id}>
              <div className={styles.linkHead}>
                <span className={styles.linkIcon}>
                  <Icon size={14} aria-hidden="true" />
                </span>
                <div>
                  <small>{eyebrow}</small>
                  <b>{title}</b>
                </div>
              </div>
              <p>{description}</p>
              <div className={styles.linkQr}>
                <QRCodeSVG
                  value={url}
                  size={96}
                  level="M"
                  marginSize={2}
                  role="img"
                  aria-label={`QR Code para abrir ${title}`}
                />
                <span>{shortUrl(url)}</span>
              </div>
              <div className={styles.linkActions}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Abrir link
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
                <button
                  type="button"
                  aria-label={`Copiar link — ${title}`}
                  onClick={() =>
                    onCopy(url, {
                      title: 'Link copiado',
                      description: 'Abra em outro celular para ver as duas pontas do chamado.',
                    })
                  }
                >
                  Copiar
                  <Copy size={12} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className={`${styles.tip} ${status === 'sent' ? '' : styles.warning}`}>
        <ConciergeBell size={13} aria-hidden="true" />
        {status === 'sent'
          ? 'Abra os dois links em celulares diferentes para ver o chamado saindo da mesa e chegando na equipe.'
          : 'Demonstração: nenhum chamado real é enviado. Confirme para ver os dois lados do fluxo.'}
      </div>
    </div>
  )
}
