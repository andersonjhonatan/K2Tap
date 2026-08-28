'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Bell,
  CheckCircle2,
  CircleDot,
  Clock3,
  GlassWater,
  Receipt,
} from 'lucide-react'
import {
  createWaiterRequest,
  K2TAP_DEMO_EVENT,
  K2TAP_DEMO_STORAGE_KEY,
  readWaiterRequests,
  type WaiterRequest,
  type WaiterRequestType,
} from '@/lib/k2tap-waiter-demo'
import styles from './page.module.css'

const ACTIONS: Array<{
  type: WaiterRequestType
  title: string
  description: string
  icon: typeof Bell
}> = [
  {
    type: 'waiter',
    title: 'Chamar garçom',
    description: 'Preciso de atendimento na mesa',
    icon: Bell,
  },
  {
    type: 'soda',
    title: 'Refrigerante',
    description: 'Quero pedir um refrigerante',
    icon: CircleDot,
  },
  {
    type: 'water',
    title: 'Água',
    description: 'Quero pedir água',
    icon: GlassWater,
  },
  {
    type: 'bill',
    title: 'Pedir a conta',
    description: 'Pode trazer a conta, por favor',
    icon: Receipt,
  },
]

function formatTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function TableDemoPage() {
  const params = useParams<{ mesa: string }>()
  const table = useMemo(() => {
    const value = Array.isArray(params.mesa) ? params.mesa[0] : params.mesa
    return decodeURIComponent(value || '12').replace(/^mesa[-\s]?/i, '')
  }, [params.mesa])

  const [requests, setRequests] = useState<WaiterRequest[]>([])
  const [sentId, setSentId] = useState<string | null>(null)

  useEffect(() => {
    const sync = () => setRequests(readWaiterRequests())
    sync()

    window.addEventListener('storage', sync)
    window.addEventListener(K2TAP_DEMO_EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(K2TAP_DEMO_EVENT, sync)
    }
  }, [])

  const current = requests.find((request) => request.table === table && request.status !== 'done')

  function sendRequest(type: WaiterRequestType) {
    if (current?.status === 'pending' || current?.status === 'accepted') return

    const request = createWaiterRequest(table, type)
    setSentId(request.id)
    setRequests(readWaiterRequests())

    window.setTimeout(() => setSentId(null), 1800)
  }

  return (
    <main className={styles.shell}>
      <section className={styles.phone}>
        <header className={styles.header}>
          <div className={styles.brandRow}>
            <div className={styles.logoMark}>K2</div>
            <div>
              <strong>K2TAP</strong>
              <span>Atendimento inteligente</span>
            </div>
          </div>
          <div className={styles.tableBadge}>Mesa {table}</div>
        </header>

        <div className={styles.hero}>
          <span className={styles.eyebrow}>Bem-vindo</span>
          <h1>O que você precisa?</h1>
          <p>Toque em uma opção. O garçom receberá a mesa e o motivo da chamada.</p>
        </div>

        {current ? (
          <div className={`${styles.statusCard} ${current.status === 'accepted' ? styles.accepted : ''}`}>
            <div className={styles.statusIcon}>
              {current.status === 'accepted' ? <CheckCircle2 size={22} /> : <Clock3 size={22} />}
            </div>
            <div>
              <span>{current.status === 'accepted' ? 'Garçom a caminho' : 'Solicitação enviada'}</span>
              <strong>{current.label}</strong>
              <small>{formatTime(current.createdAt)} · Mesa {table}</small>
            </div>
          </div>
        ) : null}

        <div className={styles.actions}>
          {ACTIONS.map((action) => {
            const Icon = action.icon
            const disabled = Boolean(current)
            return (
              <button
                className={styles.action}
                disabled={disabled}
                key={action.type}
                onClick={() => sendRequest(action.type)}
                type="button"
              >
                <span className={styles.actionIcon}><Icon size={24} /></span>
                <span className={styles.actionCopy}>
                  <strong>{action.title}</strong>
                  <small>{action.description}</small>
                </span>
                <span className={styles.actionArrow}>›</span>
              </button>
            )
          })}
        </div>

        {sentId ? <div className={styles.toast}>Enviado para o garçom ✓</div> : null}

        <footer className={styles.footer}>
          <span>Experiência demonstrativa</span>
          <strong>K2TAP · K2 Tech</strong>
        </footer>
      </section>
    </main>
  )
}
