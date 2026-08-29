'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BellRing,
  Check,
  CheckCheck,
  Clock3,
  Download,
  RotateCcw,
  Smartphone,
} from 'lucide-react'
import type { StaffCallRequest } from '@/lib/staff-call'
import {
  clearWaiterCalls,
  createWaiterCall,
  formatWaiting,
  readWaiterCalls,
  updateWaiterCall,
  waitingSeconds,
  type WaiterCall,
} from '@/lib/waiter-queue'
import {
  notificationSupport,
  registerWaiterServiceWorker,
  requestNotificationPermission,
  showWaiterAlert,
  type NotificationSupport,
} from '@/lib/waiter-alerts'
import { useWaiterQueue } from '@/hooks/useWaiterQueue'
import { siteConfig } from '@/config/site'
import { ReasonIcon } from '@/components/ui/ReasonIcon'
import styles from './waiter.module.css'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type WaiterPanelProps = {
  /** Chamado recebido pela rota, no formato /garcom?mesa=12&motivo=... */
  incoming: StaffCallRequest | null
  role: string
  tablePath: string
}

/** A permissão de notificação não emite eventos; só muda quando o usuário responde ao pedido. */
const subscribeToNothing = () => () => undefined
const unsupportedPermission = (): NotificationSupport => 'unsupported'

export function WaiterPanel({ incoming, role, tablePath }: WaiterPanelProps) {
  const calls = useWaiterQueue()
  const [now, setNow] = useState(() => Date.now())
  const [askedPermission, setAskedPermission] = useState<NotificationSupport | null>(null)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const knownPending = useRef<Set<string> | null>(null)

  const detectedPermission = useSyncExternalStore(
    subscribeToNothing,
    notificationSupport,
    unsupportedPermission,
  )
  const permission = askedPermission ?? detectedPermission

  useEffect(() => {
    void registerWaiterServiceWorker()

    // Um chamado que chegou pelo QR Code entra na fila deste aparelho, para que
    // o handoff entre celulares diferentes termine em algo visível.
    if (incoming) {
      const open = readWaiterCalls().find(
        (call) =>
          call.table === incoming.table &&
          call.reasonId === incoming.reasonId &&
          call.status !== 'done',
      )
      if (!open) {
        createWaiterCall(incoming.table, {
          id: incoming.reasonId,
          label: incoming.reason,
          icon: 'bell',
        })
      }
    }
  }, [incoming])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)

    const handleInstall = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handleInstall)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('beforeinstallprompt', handleInstall)
    }
  }, [])

  // Avisa o aparelho a cada chamado novo. A primeira passagem só fotografa a
  // fila: alertar nela faria o painel tocar para chamados que já estavam abertos.
  useEffect(() => {
    const pendingIds = calls.filter((call) => call.status === 'pending').map((call) => call.id)

    if (knownPending.current) {
      const fresh = calls.find(
        (call) => call.status === 'pending' && !knownPending.current?.has(call.id),
      )
      if (fresh) {
        void showWaiterAlert(
          `🔔 Mesa ${fresh.table} · ${fresh.reason}`,
          `Nova solicitação da mesa ${fresh.table}. Toque para abrir o painel.`,
          `k2tap-${fresh.id}`,
        )
      }
    }

    knownPending.current = new Set(pendingIds)
  }, [calls])

  const enableAlerts = async () => {
    const granted = await requestNotificationPermission()
    setAskedPermission(granted ? 'granted' : notificationSupport())
    if (granted) {
      await showWaiterAlert(
        '✅ Alertas ativados',
        `Este celular está pronto para receber os chamados do salão.`,
        'k2tap-alerts-on',
      )
    }
  }

  const testAlert = () =>
    showWaiterAlert(
      '🔔 Teste de chamado',
      'É assim que a mesa vai chamar você: com notificação e vibração.',
      `k2tap-test-${Date.now()}`,
    )

  const installApp = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  const advance = (id: string, status: 'accepted' | 'done') => updateWaiterCall(id, status)

  const reset = () => {
    knownPending.current = new Set()
    clearWaiterCalls()
  }

  const pending = calls.filter((call) => call.status === 'pending')
  const accepted = calls.filter((call) => call.status === 'accepted')
  const done = calls.filter((call) => call.status === 'done')

  const renderCall = (call: WaiterCall, action: 'accept' | 'finish' | null) => (
    <article
      className={`${styles.call} ${styles[call.status]}`}
      key={call.id}
      aria-label={`Mesa ${call.table} — ${call.reason}`}
    >
      <div className={styles.callTable}>
        <small>MESA</small>
        <b>{call.table}</b>
      </div>
      <div className={styles.callCopy}>
        <span className={styles.callState}>
          {call.status === 'pending' && <span className={styles.dot} aria-hidden="true" />}
          <ReasonIcon name={call.icon} size={13} />
          {call.reason}
        </span>
        <b>
          {call.status === 'pending' && 'Aguardando atendimento'}
          {call.status === 'accepted' && 'Você está a caminho'}
          {call.status === 'done' && 'Atendimento concluído'}
        </b>
        <span className={styles.callTime}>
          <Clock3 size={13} aria-hidden="true" />
          {call.status === 'done' ? 'atendido em ' : 'esperando há '}
          {formatWaiting(waitingSeconds(call, now))}
        </span>
      </div>
      <div className={styles.callActions}>
        {action === 'accept' && (
          <button type="button" onClick={() => advance(call.id, 'accepted')}>
            <Check size={16} aria-hidden="true" />
            Atender
          </button>
        )}
        {action === 'finish' && (
          <button type="button" onClick={() => advance(call.id, 'done')}>
            <CheckCheck size={16} aria-hidden="true" />
            Concluir
          </button>
        )}
        {action === null && <span className={styles.doneTag}>Concluído</span>}
      </div>
    </article>
  )

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
          <BellRing size={15} aria-hidden="true" />
          <b>{pending.length + accepted.length}</b>
          <span>em aberto</span>
        </div>
      </header>

      <main className={styles.list}>
        <section className={styles.setup} aria-label="Preparar este aparelho">
          <div className={styles.setupCopy}>
            <Smartphone size={18} aria-hidden="true" />
            <div>
              <b>Deixe este celular pronto para receber</b>
              <span>
                Com os alertas ligados, o chamado chega com notificação e vibração mesmo fora da
                tela. Instale o painel para abrir como aplicativo.
              </span>
            </div>
          </div>
          <div className={styles.setupActions}>
            {permission === 'granted' ? (
              <button type="button" onClick={testAlert}>
                <BellRing size={15} aria-hidden="true" />
                Testar alerta
              </button>
            ) : (
              <button
                className={styles.setupPrimary}
                type="button"
                disabled={permission === 'unsupported'}
                onClick={enableAlerts}
              >
                <BellRing size={15} aria-hidden="true" />
                {permission === 'denied' ? 'Alertas bloqueados' : 'Ativar alertas'}
              </button>
            )}
            {installPrompt && (
              <button className={styles.setupPrimary} type="button" onClick={installApp}>
                <Download size={15} aria-hidden="true" />
                Instalar painel
              </button>
            )}
            <Link href={tablePath} target="_blank">
              Abrir a tela da mesa
            </Link>
          </div>
        </section>

        <div className={styles.group}>
          <div className={styles.groupHead}>
            <h2>Chamados pendentes</h2>
            <span>{pending.length}</span>
          </div>
          {pending.length === 0 ? (
            <div className={styles.empty}>
              <BellRing size={26} aria-hidden="true" />
              <b>Nenhuma mesa chamando</b>
              <span>
                Abra a tela da mesa em outra aba e faça um chamado: ele aparece aqui na hora.
              </span>
            </div>
          ) : (
            pending.map((call) => renderCall(call, 'accept'))
          )}
        </div>

        {accepted.length > 0 && (
          <div className={styles.group}>
            <div className={styles.groupHead}>
              <h2>Em atendimento</h2>
              <span>{accepted.length}</span>
            </div>
            {accepted.map((call) => renderCall(call, 'finish'))}
          </div>
        )}

        {done.length > 0 && (
          <div className={styles.group}>
            <div className={styles.groupHead}>
              <h2>Concluídos</h2>
              <span>{done.length}</span>
            </div>
            {done.slice(0, 5).map((call) => renderCall(call, null))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <button type="button" onClick={reset}>
          <RotateCcw size={13} aria-hidden="true" />
          Limpar demonstração
        </button>
        <span>
          A fila fica neste aparelho. Em produção, ela é compartilhada entre o salão e toda a
          equipe.
        </span>
      </footer>
    </div>
  )
}
