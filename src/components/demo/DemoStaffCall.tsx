'use client'

import { useEffect, useState } from 'react'
import { Check, Clock3, ConciergeBell, ExternalLink, Smartphone } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { StaffCall, StaffCallReason } from '@/types/project'
import { buildStaffUrl } from '@/lib/staff-call'
import { createWaiterCall } from '@/lib/waiter-queue'
import { useWaiterQueue } from '@/hooks/useWaiterQueue'
import { ReasonIcon } from '@/components/ui/ReasonIcon'
import styles from './demo.module.css'

type DemoStaffCallProps = {
  staffCall: StaffCall
  /** Mesa que veio da rota, quando a demonstração abre direto de uma peça de mesa. */
  table?: string
}

export function DemoStaffCall({ staffCall, table }: DemoStaffCallProps) {
  const [reason, setReason] = useState<StaffCallReason>(staffCall.reasons[0])
  const [sending, setSending] = useState(false)
  const [callId, setCallId] = useState<string | null>(null)
  const [staffUrl, setStaffUrl] = useState('')

  const spot = table ? `Mesa ${table}` : staffCall.spot
  const spotTable = table ?? staffCall.table

  const calls = useWaiterQueue()
  const call = callId ? (calls.find((item) => item.id === callId) ?? null) : null

  useEffect(() => {
    if (!sending) return
    const timer = window.setTimeout(() => {
      const created = createWaiterCall(spotTable, reason)
      setStaffUrl(buildStaffUrl({ ...staffCall, table: spotTable }, reason))
      setCallId(created.id)
      setSending(false)
    }, 700)
    return () => window.clearTimeout(timer)
    // O chamado é criado uma vez, no momento em que o envio começa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sending])

  const status = call?.status ?? null
  const busy = sending || status === 'pending' || status === 'accepted'

  const callAgain = () => {
    setCallId(null)
    setStaffUrl('')
  }

  return (
    <section className={styles.staffSection} id="chamar" aria-labelledby="staff-title">
      <div className={styles.staffCard}>
        <div className={styles.staffSpot}>
          <span className={styles.staffPulse} aria-hidden="true" />
          {spot}
        </div>
        <h2 id="staff-title">{staffCall.headline}</h2>
        <p>{staffCall.description}</p>

        <fieldset className={styles.reasonGroup} disabled={busy}>
          <legend>Motivo do chamado</legend>
          <div className={styles.reasonList}>
            {staffCall.reasons.map((item) => (
              <label
                className={`${styles.reasonChip} ${reason.id === item.id ? styles.reasonChipOn : ''}`}
                key={item.id}
              >
                <input
                  type="radio"
                  name="demo-staff-reason"
                  value={item.id}
                  checked={reason.id === item.id}
                  onChange={() => setReason(item)}
                />
                <ReasonIcon name={item.icon} size={15} />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        {status === 'done' ? (
          <button className={styles.staffButton} type="button" onClick={callAgain}>
            <ConciergeBell size={18} aria-hidden="true" />
            Chamar de novo
          </button>
        ) : (
          <button
            className={styles.staffButton}
            type="button"
            disabled={busy}
            onClick={() => setSending(true)}
          >
            <ConciergeBell size={18} aria-hidden="true" />
            {!sending && !status && staffCall.actionLabel}
            {sending && 'Enviando chamado...'}
            {status === 'pending' && 'Chamado enviado'}
            {status === 'accepted' && `${staffCall.role} a caminho`}
          </button>
        )}

        {call && (
          <div className={styles.staffResult} role="status">
            <div className={styles.staffResultHead}>
              <span className={styles.staffResultMark} aria-hidden="true">
                {call.status === 'pending' ? <Clock3 size={16} /> : <Check size={16} />}
              </span>
              <div>
                <b>
                  {call.status === 'pending' && `Chamado enviado da ${spot.toLowerCase()}`}
                  {call.status === 'accepted' &&
                    `${staffCall.role} a caminho da ${spot.toLowerCase()}`}
                  {call.status === 'done' && 'Atendimento concluído'}
                </b>
                <span>
                  {call.status === 'pending' && `Motivo: ${call.reason}. Aguardando a equipe.`}
                  {call.status === 'accepted' &&
                    `${call.reason} — a equipe confirmou e está indo até você.`}
                  {call.status === 'done' && `${call.reason} — atendido pela equipe.`}
                </span>
              </div>
            </div>

            {call.status !== 'done' && (
              <div className={styles.staffHandoff}>
                <div className={styles.staffHandoffCopy}>
                  <small>
                    <Smartphone size={12} aria-hidden="true" /> CELULAR DO{' '}
                    {staffCall.role.toUpperCase()}
                  </small>
                  <b>É esta a tela que abre para quem atende.</b>
                  <span>
                    Abra o painel em outra aba ou escaneie o QR Code com outro celular: o chamado da{' '}
                    {spot.toLowerCase()} aparece na fila, e ao tocar em Atender o status aqui muda
                    sozinho.
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
            )}
          </div>
        )}
      </div>
    </section>
  )
}
