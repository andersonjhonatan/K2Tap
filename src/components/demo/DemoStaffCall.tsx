'use client'

import { useEffect, useState } from 'react'
import {
  Check,
  Clock3,
  ConciergeBell,
  ExternalLink,
  ListOrdered,
  ShieldCheck,
  Smartphone,
  Timer,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { StaffCall, StaffCallReason } from '@/types/project'
import { cn } from '@/lib/cn'
import { buildStaffUrl } from '@/lib/staff-call'
import {
  createWaiterCall,
  estimatedWaitMinutes,
  formatWaiting,
  responseSeconds,
  waiterQueuePosition,
  waitingSeconds,
  type WaiterCall,
} from '@/lib/waiter-queue'
import { useStaffCall } from '@/hooks/useStaffCall'
import { useWaiterQueue } from '@/hooks/useWaiterQueue'
import { ReasonIcon } from '@/components/ui/ReasonIcon'
import styles from './demo.styles'

type DemoStaffCallProps = {
  staffCall: StaffCall
  /** Mesa que veio da rota, quando a demonstração abre direto de uma peça de mesa. */
  table?: string
}

function CustomerQueueStatus({
  call,
  calls,
  role,
}: {
  call: WaiterCall
  calls: WaiterCall[]
  role: string
}) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (call.status === 'done') return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [call.status])

  const position = waiterQueuePosition(calls, call.id)
  const tablesAhead = position === null ? 0 : Math.max(0, position - 1)
  const elapsed = formatWaiting(waitingSeconds(call, now))
  const response = responseSeconds(call)

  if (call.status === 'pending' && position !== null) {
    return (
      <div className={styles.customerQueue} aria-label={`Posição ${position} na fila`}>
        <span className={styles.customerPosition}>
          <strong>{position}º</strong>
          <small>na fila</small>
        </span>
        <div className={styles.customerQueueCopy}>
          <small>
            <ListOrdered size={13} aria-hidden="true" /> ORDEM DE ATENDIMENTO
          </small>
          <b>
            {position === 1
              ? 'Sua mesa é a próxima a ser atendida.'
              : `Sua mesa está em ${position}º lugar.`}
          </b>
          <span>
            {tablesAhead === 0
              ? 'Não há outra mesa aguardando antes de você.'
              : `${tablesAhead} ${tablesAhead === 1 ? 'mesa está' : 'mesas estão'} antes de você.`}
          </span>
          <div className={styles.customerQueueMetrics}>
            <span>
              <Clock3 size={13} aria-hidden="true" /> Aguardando há <b>{elapsed}</b>
            </span>
            <span>
              <Timer size={13} aria-hidden="true" /> Previsão de até{' '}
              <b>{estimatedWaitMinutes(position)} min</b>
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(styles.customerQueue, styles.customerQueueAnswered)}>
      <span className={styles.customerPosition}>
        <Check size={22} aria-hidden="true" />
        <small>{call.status === 'done' ? 'concluído' : 'sua vez'}</small>
      </span>
      <div className={styles.customerQueueCopy}>
        <small>
          <ShieldCheck size={13} aria-hidden="true" /> ATUALIZAÇÃO DO ATENDIMENTO
        </small>
        <b>
          {call.status === 'done'
            ? `Atendimento finalizado em ${elapsed}.`
            : `${role} confirmou sua chamada.`}
        </b>
        <span>
          {call.status === 'done'
            ? 'O tempo ficou registrado no sistema. Obrigado pela compreensão.'
            : `Sua espera na fila terminou${response === null ? '' : ` após ${formatWaiting(response)}`}. A equipe está indo até a mesa.`}
        </span>
      </div>
    </div>
  )
}

export function DemoStaffCall({ staffCall, table }: DemoStaffCallProps) {
  const [callId, setCallId] = useState<string | null>(null)
  const [staffUrl, setStaffUrl] = useState('')
  const [note, setNote] = useState('')

  const spot = table ? `Mesa ${table}` : staffCall.spot
  const spotTable = table ?? staffCall.table

  // Confirmar não só encena: o chamado entra na fila e a equipe pode aceitá-lo.
  const enqueue = (chosen: StaffCallReason) => {
    setStaffUrl(buildStaffUrl({ ...staffCall, table: spotTable }, chosen, note))
    setCallId(createWaiterCall(spotTable, chosen, note).id)
  }

  const {
    reason,
    setReason,
    status: sendStatus,
    send,
    reset,
  } = useStaffCall({
    staffCall,
    onSent: enqueue,
  })

  const calls = useWaiterQueue()
  const call = callId ? (calls.find((item) => item.id === callId) ?? null) : null
  const sending = sendStatus === 'sending'

  const status = call?.status ?? null
  const busy = sending || status === 'pending' || status === 'accepted'

  const callAgain = () => {
    setCallId(null)
    setStaffUrl('')
    reset()
  }

  return (
    <section className={styles.staffSection} id="chamar" aria-labelledby="staff-title">
      <div className={styles.staffCard}>
        {/* Na rota de mesa o topo da página já anuncia onde o cliente está. */}
        {!table && (
          <div className={styles.staffSpot}>
            <span className={styles.staffPulse} aria-hidden="true" />
            {spot}
          </div>
        )}
        <h2 id="staff-title">{staffCall.headline}</h2>
        <p>{staffCall.description}</p>

        <div className={styles.staffFairness}>
          <ShieldCheck size={21} aria-hidden="true" />
          <div>
            <b>Vamos atender por ordem de chamada.</b>
            <span>
              O sistema registra o horário de cada mesa, mostra sua posição e atualiza a fila
              automaticamente. Assim, ninguém perde a vez.
            </span>
          </div>
        </div>

        <fieldset className={styles.reasonGroup} disabled={busy}>
          <legend>Motivo do chamado</legend>
          <div className={styles.reasonList}>
            {staffCall.reasons.map((item) => (
              <label
                className={cn(styles.reasonChip, reason.id === item.id && styles.reasonChipOn)}
                key={item.id}
              >
                <input
                  className="srOnly"
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

        <label className={styles.staffNote}>
          <span>
            Observação <small>(opcional)</small>
          </span>
          <textarea
            value={note}
            disabled={busy}
            maxLength={160}
            rows={3}
            placeholder="Ex.: estamos com uma criança ou precisamos de uma cadeira extra"
            onChange={(event) => setNote(event.target.value)}
          />
          <small>{note.length}/160</small>
        </label>

        {status === 'done' ? (
          <button className={styles.staffButton} type="button" onClick={callAgain}>
            <ConciergeBell size={18} aria-hidden="true" />
            Chamar de novo
          </button>
        ) : (
          <button className={styles.staffButton} type="button" disabled={busy} onClick={send}>
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
                {call.note && <em>Observação: {call.note}</em>}
              </div>
            </div>

            <CustomerQueueStatus call={call} calls={calls} role={staffCall.role} />

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
