'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BellRing,
  Check,
  CheckCheck,
  CircleDot,
  Clock3,
  Download,
  GlassWater,
  Receipt,
  RotateCcw,
  Smartphone,
  UserRoundCheck,
} from 'lucide-react'
import {
  clearWaiterRequests,
  K2TAP_DEMO_EVENT,
  readWaiterRequests,
  updateWaiterRequest,
  type WaiterRequest,
  type WaiterRequestType,
} from '@/lib/k2tap-waiter-demo'
import styles from './page.module.css'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type ExtendedNotificationOptions = NotificationOptions & {
  renotify?: boolean
  requireInteraction?: boolean
  vibrate?: number[]
}

const ICONS: Record<WaiterRequestType, typeof BellRing> = {
  waiter: BellRing,
  soda: CircleDot,
  water: GlassWater,
  bill: Receipt,
}

const ALERT_VIBRATION = [350, 120, 350, 120, 700]

function formatTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function elapsed(value: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  return `${minutes} min`
}

async function showWaiterAlert(title: string, body: string, tag: string) {
  navigator.vibrate?.(ALERT_VIBRATION)

  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

  try {
    const registration = await navigator.serviceWorker?.ready
    const options: ExtendedNotificationOptions = {
      body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag,
      renotify: true,
      requireInteraction: true,
      silent: false,
      vibrate: ALERT_VIBRATION,
      data: { url: '/garcom' },
    }
    await registration?.showNotification(title, options)
  } catch {
    // The queue remains functional even if the OS blocks a notification enhancement.
  }
}

export default function WaiterPage() {
  const [requests, setRequests] = useState<WaiterRequest[]>([])
  const [now, setNow] = useState(Date.now())
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const knownPendingIds = useRef<Set<string>>(new Set())
  const initialized = useRef(false)

  useEffect(() => {
    let active = true

    navigator.serviceWorker?.register('/sw.js', { scope: '/garcom/' }).catch(() => undefined)

    const sync = async () => {
      if (!active) return
      const next = readWaiterRequests()
      const pending = next.filter((request) => request.status === 'pending')

      if (initialized.current) {
        const fresh = pending.find((request) => !knownPendingIds.current.has(request.id))
        if (fresh) {
          await showWaiterAlert(
            `🔔 Mesa ${fresh.table} · ${fresh.label}`,
            `Nova solicitação da Mesa ${fresh.table}. Toque para abrir o K2TAP Garçom.`,
            `k2tap-${fresh.id}`,
          )
        }
      }

      knownPendingIds.current = new Set(pending.map((request) => request.id))
      initialized.current = true
      setRequests(next)
    }

    sync()
    const timer = window.setInterval(() => setNow(Date.now()), 1000)

    window.addEventListener('storage', sync)
    window.addEventListener(K2TAP_DEMO_EVENT, sync)

    const handleInstall = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handleInstall)

    if (typeof Notification !== 'undefined') {
      setNotificationsEnabled(Notification.permission === 'granted')
    }

    return () => {
      active = false
      window.clearInterval(timer)
      window.removeEventListener('storage', sync)
      window.removeEventListener(K2TAP_DEMO_EVENT, sync)
      window.removeEventListener('beforeinstallprompt', handleInstall)
    }
  }, [])

  const pending = useMemo(
    () => requests.filter((request) => request.status === 'pending'),
    [requests, now],
  )
  const accepted = useMemo(
    () => requests.filter((request) => request.status === 'accepted'),
    [requests, now],
  )
  const doneToday = useMemo(
    () => requests.filter((request) => request.status === 'done').length,
    [requests],
  )

  async function enableNotifications() {
    if (typeof Notification === 'undefined') return
    const permission = await Notification.requestPermission()
    const granted = permission === 'granted'
    setNotificationsEnabled(granted)

    if (granted) {
      await showWaiterAlert(
        '✅ Alertas K2TAP ativados',
        'Este celular está pronto para receber chamadas de mesa.',
        'k2tap-alerts-enabled',
      )
    }
  }

  async function testAlert() {
    await showWaiterAlert(
      '🔔 K2TAP · Teste de chamada',
      'Mesa 12 está chamando o garçom. Vibração e alerta funcionando.',
      `k2tap-test-${Date.now()}`,
    )
  }

  async function installApp() {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  function update(id: string, status: 'accepted' | 'done') {
    updateWaiterRequest(id, status)
    setRequests(readWaiterRequests())
  }

  function resetDemo() {
    clearWaiterRequests()
    setRequests([])
  }

  return (
    <main className={styles.shell}>
      <section className={styles.app}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.logo}>K2</div>
            <div>
              <strong>K2TAP Garçom</strong>
              <span>Modo demonstração</span>
            </div>
          </div>
          <div className={styles.online}><span /> Online</div>
        </header>

        <div className={styles.hero}>
          <div>
            <span className={styles.kicker}>Painel de atendimento</span>
            <h1>Chamadas em tempo real</h1>
            <p>Receba a mesa e o motivo antes mesmo de chegar ao cliente.</p>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.secondaryButton} onClick={enableNotifications} type="button">
              <BellRing size={17} />
              {notificationsEnabled ? 'Alertas ativos' : 'Ativar alertas'}
            </button>
            {notificationsEnabled ? (
              <button className={styles.primaryButton} onClick={testAlert} type="button">
                <BellRing size={17} /> Testar alerta
              </button>
            ) : null}
            {installPrompt ? (
              <button className={styles.primaryButton} onClick={installApp} type="button">
                <Download size={17} /> Instalar PWA
              </button>
            ) : null}
          </div>
        </div>

        <div className={styles.stats}>
          <article><span>Pendentes</span><strong>{pending.length}</strong><small>aguardando</small></article>
          <article><span>Em atendimento</span><strong>{accepted.length}</strong><small>a caminho</small></article>
          <article><span>Finalizados</span><strong>{doneToday}</strong><small>nesta demo</small></article>
        </div>

        <div className={styles.demoHint}>
          <Smartphone size={19} />
          <div>
            <strong>Teste agora</strong>
            <span>Ative os alertas e use “Testar alerta” para validar notificação e vibração neste celular.</span>
          </div>
          <Link href="/demo/mesa/12" target="_blank">Abrir Mesa 12</Link>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <div><span>Fila</span><h2>Chamadas pendentes</h2></div>
            <div className={styles.counter}>{pending.length}</div>
          </div>

          <div className={styles.list}>
            {pending.length === 0 ? (
              <div className={styles.empty}>
                <BellRing size={28} />
                <strong>Nenhuma mesa chamando</strong>
                <span>As novas solicitações vão aparecer aqui.</span>
              </div>
            ) : (
              pending.map((request) => {
                const Icon = ICONS[request.type]
                return (
                  <article className={styles.request} key={request.id}>
                    <div className={styles.requestIcon}><Icon size={22} /></div>
                    <div className={styles.requestBody}>
                      <div className={styles.requestTop}>
                        <div><span>Mesa</span><strong>{request.table}</strong></div>
                        <small><Clock3 size={13} /> {elapsed(request.createdAt)}</small>
                      </div>
                      <h3>{request.label}</h3>
                      <p>Solicitado às {formatTime(request.createdAt)}</p>
                    </div>
                    <button className={styles.acceptButton} onClick={() => update(request.id, 'accepted')} type="button">
                      <Check size={18} /> Aceitar
                    </button>
                  </article>
                )
              })
            )}
          </div>
        </section>

        {accepted.length > 0 ? (
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <div><span>Em andamento</span><h2>Atendimentos aceitos</h2></div>
              <UserRoundCheck size={21} />
            </div>
            <div className={styles.list}>
              {accepted.map((request) => {
                const Icon = ICONS[request.type]
                return (
                  <article className={`${styles.request} ${styles.accepted}`} key={request.id}>
                    <div className={styles.requestIcon}><Icon size={22} /></div>
                    <div className={styles.requestBody}>
                      <div className={styles.requestTop}>
                        <div><span>Mesa</span><strong>{request.table}</strong></div>
                        <small>Aceito</small>
                      </div>
                      <h3>{request.label}</h3>
                      <p>Cliente já vê “garçom a caminho”.</p>
                    </div>
                    <button className={styles.doneButton} onClick={() => update(request.id, 'done')} type="button">
                      <CheckCheck size={18} /> Finalizar
                    </button>
                  </article>
                )
              })}
            </div>
          </section>
        ) : null}

        <footer className={styles.footer}>
          <button onClick={resetDemo} type="button"><RotateCcw size={14} /> Limpar demonstração</button>
          <span>K2TAP · K2 Tech</span>
        </footer>
      </section>
    </main>
  )
}
