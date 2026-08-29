'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bell, Check, ConciergeBell, QrCode, Timer } from 'lucide-react'
import { siteConfig } from '@/config/site'
import styles from './waiter.module.css'

type CallState = 'new' | 'accepted' | 'done'

type WaiterCall = {
  id: string
  table: string
  reason: string
  /** Segundos de espera no momento em que o painel abriu. */
  waitingFrom: number
  state: CallState
  fromCustomer?: boolean
}

const seededCalls: WaiterCall[] = [
  { id: 'demo-7', table: '7', reason: 'Fazer o pedido', waitingFrom: 74, state: 'new' },
  { id: 'demo-3', table: '3', reason: 'Repor bebida', waitingFrom: 168, state: 'accepted' },
  { id: 'demo-15', table: '15', reason: 'Pedir a conta', waitingFrom: 320, state: 'done' },
]

const stateLabel: Record<CallState, string> = {
  new: 'Novo chamado',
  accepted: 'Em atendimento',
  done: 'Concluído',
}

function formatWaiting(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}min ${String(rest).padStart(2, '0')}s`
}

type WaiterPanelProps = {
  /** Chamado recebido pela rota, no formato /garcom?mesa=12&motivo=... */
  incoming: { table: string; reason: string } | null
  role: string
}

export function WaiterPanel({ incoming, role }: WaiterPanelProps) {
  const initialCalls = useMemo<WaiterCall[]>(() => {
    if (!incoming) return seededCalls
    return [
      {
        id: `mesa-${incoming.table}`,
        table: incoming.table,
        reason: incoming.reason,
        waitingFrom: 0,
        state: 'new',
        fromCustomer: true,
      },
      ...seededCalls,
    ]
  }, [incoming])

  const [calls, setCalls] = useState(initialCalls)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const advance = (id: string, state: CallState) => {
    setCalls((current) => current.map((call) => (call.id === id ? { ...call, state } : call)))
  }

  const pending = calls.filter((call) => call.state !== 'done').length

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <Link className={styles.back} href="/#experiencias">
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Voltar ao site</span>
        </Link>
        <div className={styles.headerCopy}>
          <small>PAINEL DA EQUIPE • {siteConfig.name}</small>
          <h1>Chamados do {role.toLowerCase()}</h1>
        </div>
        <div className={styles.counter} aria-live="polite">
          <Bell size={15} aria-hidden="true" />
          <b>{pending}</b>
          <span>em aberto</span>
        </div>
      </header>

      <main className={styles.list}>
        {incoming && (
          <p className={styles.incomingNote} role="status">
            <ConciergeBell size={15} aria-hidden="true" />
            Chamado recebido da mesa {incoming.table}. É assim que ele aparece no celular de quem
            está atendendo.
          </p>
        )}

        {calls.map((call) => (
          <article
            className={`${styles.call} ${styles[call.state]}`}
            key={call.id}
            aria-label={`Mesa ${call.table} — ${call.reason}`}
          >
            <div className={styles.callTable}>
              <small>MESA</small>
              <b>{call.table}</b>
            </div>
            <div className={styles.callCopy}>
              <span className={styles.callState}>
                {call.state === 'new' && <span className={styles.dot} aria-hidden="true" />}
                {stateLabel[call.state]}
                {call.fromCustomer && <em>enviado agora pela mesa</em>}
              </span>
              <b>{call.reason}</b>
              <span className={styles.callTime}>
                <Timer size={13} aria-hidden="true" />
                esperando há{' '}
                {formatWaiting(call.waitingFrom + (call.state === 'done' ? 0 : elapsed))}
              </span>
            </div>
            <div className={styles.callActions}>
              {call.state === 'new' && (
                <button type="button" onClick={() => advance(call.id, 'accepted')}>
                  Atender
                </button>
              )}
              {call.state === 'accepted' && (
                <button type="button" onClick={() => advance(call.id, 'done')}>
                  <Check size={14} aria-hidden="true" />
                  Concluir
                </button>
              )}
              {call.state === 'done' && <span className={styles.doneTag}>Concluído</span>}
            </div>
          </article>
        ))}
      </main>

      <footer className={styles.footer}>
        <QrCode size={14} aria-hidden="true" />
        <span>
          Demonstração: os chamados são fictícios e ficam apenas neste aparelho. Em produção, a fila
          é compartilhada entre o salão e a equipe.
        </span>
      </footer>
    </div>
  )
}
