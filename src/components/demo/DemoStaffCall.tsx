'use client'

import { useEffect, useState } from 'react'
import { Check, ConciergeBell, ExternalLink, Smartphone } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { StaffCall } from '@/types/project'
import { buildStaffUrl } from '@/lib/staff-call'
import styles from './demo.module.css'

type DemoStaffCallProps = {
  staffCall: StaffCall
  /** Mesa que veio da rota, quando a demonstração abre direto de uma peça de mesa. */
  table?: string
}

type CallStatus = 'idle' | 'sending' | 'sent'

const SENDING_MS = 900

export function DemoStaffCall({ staffCall, table }: DemoStaffCallProps) {
  const [status, setStatus] = useState<CallStatus>('idle')
  const [reason, setReason] = useState(staffCall.reasons[0] ?? '')
  const [staffUrl, setStaffUrl] = useState('')

  const spot = table ? `Mesa ${table}` : staffCall.spot
  const call = table ? { ...staffCall, table } : staffCall

  useEffect(() => {
    if (status !== 'sending') return
    const timer = window.setTimeout(() => {
      setStaffUrl(buildStaffUrl(call, { reason }))
      setStatus('sent')
    }, SENDING_MS)
    return () => window.clearTimeout(timer)
    // O link é montado no cliente para funcionar em localhost, preview e domínio final.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <section className={styles.staffSection} id="chamar" aria-labelledby="staff-title">
      <div className={styles.staffCard}>
        <div className={styles.staffSpot}>
          <span className={styles.staffPulse} aria-hidden="true" />
          {spot}
        </div>
        <h2 id="staff-title">{staffCall.headline}</h2>
        <p>{staffCall.description}</p>

        <fieldset className={styles.reasonGroup} disabled={status !== 'idle'}>
          <legend>Motivo do chamado</legend>
          <div className={styles.reasonList}>
            {staffCall.reasons.map((item) => (
              <label
                className={`${styles.reasonChip} ${reason === item ? styles.reasonChipOn : ''}`}
                key={item}
              >
                <input
                  type="radio"
                  name="demo-staff-reason"
                  value={item}
                  checked={reason === item}
                  onChange={() => setReason(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          className={styles.staffButton}
          type="button"
          disabled={status !== 'idle'}
          onClick={() => setStatus('sending')}
        >
          <ConciergeBell size={18} aria-hidden="true" />
          {status === 'idle' && staffCall.actionLabel}
          {status === 'sending' && 'Enviando chamado...'}
          {status === 'sent' && 'Chamado enviado'}
        </button>

        {status === 'sent' && (
          <div className={styles.staffResult} role="status">
            <div className={styles.staffResultHead}>
              <span className={styles.staffResultMark} aria-hidden="true">
                <Check size={16} />
              </span>
              <div>
                <b>
                  {staffCall.role} a caminho da {spot.toLowerCase()}
                </b>
                <span>Motivo enviado: {reason}.</span>
              </div>
            </div>

            <div className={styles.staffHandoff}>
              <div className={styles.staffHandoffCopy}>
                <small>
                  <Smartphone size={12} aria-hidden="true" /> CELULAR DO{' '}
                  {staffCall.role.toUpperCase()}
                </small>
                <b>É esta a tela que abre para quem atende.</b>
                <span>
                  Escaneie o QR Code com outro celular ou abra o painel para ver o chamado da{' '}
                  {spot.toLowerCase()} na fila.
                </span>
                <a href={staffUrl} target="_blank" rel="noopener noreferrer">
                  Abrir painel do {staffCall.role.toLowerCase()}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
              {staffUrl && (
                <div className={styles.staffQr}>
                  <QRCodeSVG
                    value={staffUrl}
                    size={104}
                    level="M"
                    marginSize={2}
                    role="img"
                    aria-label={`QR Code do painel do ${staffCall.role.toLowerCase()}`}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
