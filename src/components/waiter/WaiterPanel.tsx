'use client'

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BellRing,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  Download,
  Grid3X3,
  LayoutDashboard,
  ListChecks,
  Minus,
  Plus,
  RotateCcw,
  Settings2,
  ShoppingBag,
  Smartphone,
  UtensilsCrossed,
} from 'lucide-react'
import type { StaffCallRequest } from '@/lib/staff-call'
import {
  clearWaiterCalls,
  createWaiterCall,
  formatWaiting,
  readWaiterCalls,
  sortPendingWaiterCalls,
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
import {
  addDemoSalonOrder,
  advanceSalonOrder,
  resetSalonOrders,
  type SalonOrderStatus,
} from '@/lib/salon-orders'
import { MAX_TABLE_COUNT, normalizeTableCount, writeSalonTableCount } from '@/lib/salon-settings'
import { cn } from '@/lib/cn'
import { useWaiterQueue } from '@/hooks/useWaiterQueue'
import { useSalonOrders } from '@/hooks/useSalonOrders'
import { useSalonTableCount } from '@/hooks/useSalonTableCount'
import { siteConfig } from '@/config/site'
import { ReasonIcon } from '@/components/ui/ReasonIcon'
import styles from './waiter.styles'

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

type PanelView = 'tables' | 'orders'

const ORDER_COLUMNS: {
  status: SalonOrderStatus
  title: string
  description: string
  action: string | null
}[] = [
  {
    status: 'waiting',
    title: 'Aguardando',
    description: 'Novos pedidos',
    action: 'Iniciar preparo',
  },
  {
    status: 'preparing',
    title: 'Em produção',
    description: 'Na cozinha',
    action: 'Marcar como pronto',
  },
  {
    status: 'ready',
    title: 'Saiu / pronto',
    description: 'Aguardando entrega',
    action: 'Entregar pedido',
  },
  {
    status: 'delivered',
    title: 'Entregue',
    description: 'Finalizados',
    action: null,
  },
]

/** A permissão de notificação não emite eventos; só muda quando o usuário responde ao pedido. */
const subscribeToNothing = () => () => undefined
const unsupportedPermission = (): NotificationSupport => 'unsupported'

function CallWaiting({ call }: { call: WaiterCall }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <span className={styles.callTime}>
      <Clock3 size={13} aria-hidden="true" />
      {formatWaiting(waitingSeconds(call, now))}
    </span>
  )
}

export function WaiterPanel({ incoming, role, tablePath }: WaiterPanelProps) {
  const calls = useWaiterQueue()
  const orders = useSalonOrders()
  const tableCount = useSalonTableCount()
  const [view, setView] = useState<PanelView>('tables')
  const [selectedTable, setSelectedTable] = useState<string | null>(incoming?.table ?? null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [askedPermission, setAskedPermission] = useState<NotificationSupport | null>(null)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const knownPending = useRef<Set<string> | null>(null)
  const tableDetailRef = useRef<HTMLElement | null>(null)

  const detectedPermission = useSyncExternalStore(
    subscribeToNothing,
    notificationSupport,
    unsupportedPermission,
  )
  const permission = askedPermission ?? detectedPermission

  useEffect(() => {
    void registerWaiterServiceWorker()

    // Um chamado que chegou por link entra na fila deste painel e abre a mesa certa.
    if (incoming) {
      const open = readWaiterCalls().find(
        (call) =>
          call.table === incoming.table &&
          call.reasonId === incoming.reasonId &&
          call.status !== 'done',
      )
      if (!open) {
        createWaiterCall(
          incoming.table,
          { id: incoming.reasonId, label: incoming.reason, icon: 'bell' },
          incoming.note,
        )
      }
    }
  }, [incoming])

  useEffect(() => {
    const handleInstall = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handleInstall)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstall)
    }
  }, [])

  // Avisa o aparelho a cada chamado novo. A primeira passagem apenas fotografa a fila.
  useEffect(() => {
    const pendingIds = calls.filter((call) => call.status === 'pending').map((call) => call.id)

    if (knownPending.current) {
      const fresh = calls.find(
        (call) => call.status === 'pending' && !knownPending.current?.has(call.id),
      )
      if (fresh) {
        setSelectedTable(fresh.table)
        void showWaiterAlert(
          `🔔 Mesa ${fresh.table} · ${fresh.reason}`,
          fresh.note || `Nova solicitação da mesa ${fresh.table}. Toque para abrir o painel.`,
          `k2tap-${fresh.id}`,
        )
      }
    }

    knownPending.current = new Set(pendingIds)
  }, [calls])

  const openCalls = useMemo(() => calls.filter((call) => call.status !== 'done'), [calls])
  const pending = useMemo(() => sortPendingWaiterCalls(calls), [calls])
  const accepted = openCalls.filter((call) => call.status === 'accepted')
  const readyOrders = orders.filter((order) => order.status === 'ready')

  const callsByTable = useMemo(() => {
    const grouped = new Map<string, WaiterCall[]>()
    for (const call of openCalls) {
      const current = grouped.get(call.table) ?? []
      grouped.set(call.table, [...current, call])
    }
    return grouped
  }, [openCalls])

  const tables = useMemo(
    () => Array.from({ length: tableCount }, (_, index) => String(index + 1)),
    [tableCount],
  )
  const visibleTable = selectedTable ?? openCalls[0]?.table ?? null
  const selectedCalls = visibleTable ? (callsByTable.get(visibleTable) ?? []) : []
  const selectedHistory = visibleTable
    ? calls.filter((call) => call.table === visibleTable && call.status === 'done').slice(0, 3)
    : []
  const selectedTablePath = visibleTable
    ? tablePath.replace(/\/[^/]+$/, `/${visibleTable}`)
    : tablePath

  const selectTable = (table: string) => {
    setSelectedTable(table)
    if (window.matchMedia('(max-width: 960px)').matches) {
      window.requestAnimationFrame(() =>
        tableDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    }
  }

  const enableAlerts = async () => {
    const granted = await requestNotificationPermission()
    setAskedPermission(granted ? 'granted' : notificationSupport())
    if (granted) {
      await showWaiterAlert(
        '✅ Alertas ativados',
        'Este aparelho está pronto para receber os chamados do salão.',
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

  const resetCalls = () => {
    knownPending.current = new Set()
    clearWaiterCalls()
  }

  const renderCall = (call: WaiterCall) => (
    <article
      className={cn(styles.call, call.status === 'pending' ? styles.pending : styles.accepted)}
      key={call.id}
      aria-label={`Mesa ${call.table} — ${call.reason}`}
    >
      <div className={styles.callHeading}>
        <span className={styles.callState}>
          {call.status === 'pending' && <span className={styles.dot} aria-hidden="true" />}
          <ReasonIcon name={call.icon} size={14} />
          {call.status === 'pending' ? 'Aguardando atendimento' : 'Você está a caminho'}
        </span>
        <CallWaiting call={call} />
      </div>

      <b className={styles.callReason}>{call.reason}</b>
      <div className={styles.callObservation}>
        <small>OBSERVAÇÕES</small>
        <p>{call.note || 'O cliente não escreveu nenhuma observação.'}</p>
      </div>

      <div className={styles.callActions}>
        {call.status === 'pending' ? (
          <button type="button" onClick={() => advance(call.id, 'accepted')}>
            <Check size={16} aria-hidden="true" />
            Atender mesa
          </button>
        ) : (
          <button type="button" onClick={() => advance(call.id, 'done')}>
            <CheckCheck size={16} aria-hidden="true" />
            Concluir atendimento
          </button>
        )}
      </div>
    </article>
  )

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <Link className={styles.back} href="/#experiencias">
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Site</span>
        </Link>
        <div className={styles.headerCopy}>
          <small>CENTRAL DO NEGÓCIO • {siteConfig.name}</small>
          <h1>Chamados do {role.toLowerCase()}</h1>
        </div>
        <div className={styles.liveStatus}>
          <span className={styles.liveDot} aria-hidden="true" />
          Ao vivo
        </div>
        <div className={styles.counter} aria-live="polite">
          <BellRing size={16} aria-hidden="true" />
          <b>{openCalls.length}</b>
          <span>chamados</span>
        </div>
      </header>

      <nav className={styles.viewTabs} aria-label="Visões do painel operacional">
        <button
          className={view === 'tables' ? styles.viewTabActive : undefined}
          type="button"
          aria-pressed={view === 'tables'}
          onClick={() => setView('tables')}
        >
          <Grid3X3 size={17} aria-hidden="true" />
          Mesas
          {openCalls.length > 0 && <span>{openCalls.length}</span>}
        </button>
        <button
          className={view === 'orders' ? styles.viewTabActive : undefined}
          type="button"
          aria-pressed={view === 'orders'}
          onClick={() => setView('orders')}
        >
          <ListChecks size={17} aria-hidden="true" />
          Pedidos
          {readyOrders.length > 0 && <span>{readyOrders.length}</span>}
        </button>
      </nav>

      <main className={styles.workspace}>
        <section className={styles.summary} aria-label="Resumo do salão">
          <div>
            <span className={styles.summaryIcon} data-tone="blue">
              <LayoutDashboard size={17} aria-hidden="true" />
            </span>
            <span>
              <small>Mesas no salão</small>
              <b>{tableCount}</b>
            </span>
          </div>
          <div>
            <span className={styles.summaryIcon} data-tone="red">
              <BellRing size={17} aria-hidden="true" />
            </span>
            <span>
              <small>Chamando</small>
              <b>{pending.length}</b>
            </span>
          </div>
          <div>
            <span className={styles.summaryIcon} data-tone="purple">
              <Smartphone size={17} aria-hidden="true" />
            </span>
            <span>
              <small>Em atendimento</small>
              <b>{accepted.length}</b>
            </span>
          </div>
          <div>
            <span className={styles.summaryIcon} data-tone="green">
              <UtensilsCrossed size={17} aria-hidden="true" />
            </span>
            <span>
              <small>Pedidos prontos</small>
              <b>{readyOrders.length}</b>
            </span>
          </div>
        </section>

        <section className={styles.setup} aria-label="Preparar e configurar este painel">
          <div className={styles.setupCopy}>
            <Smartphone size={19} aria-hidden="true" />
            <div>
              <b>O mesmo painel no celular do garçom e no PC principal</b>
              <span>Mesas, chamados, observações e pedidos reunidos em uma única tela.</span>
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
            <button type="button" onClick={() => setSettingsOpen((current) => !current)}>
              <Settings2 size={15} aria-hidden="true" />
              Configurar mesas
            </button>
          </div>
        </section>

        {settingsOpen && (
          <section className={styles.settings} aria-label="Configuração do salão">
            <div>
              <small>QUANTIDADE DE MESAS</small>
              <b>Mostre somente as mesas que existem no negócio</b>
              <span>Configure de 1 a {MAX_TABLE_COUNT}. A grade muda imediatamente.</span>
            </div>
            <div className={styles.quantityControl}>
              <button
                type="button"
                aria-label="Diminuir quantidade de mesas"
                disabled={tableCount <= 1}
                onClick={() => writeSalonTableCount(tableCount - 1)}
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <label>
                <span className="srOnly">Quantidade de mesas</span>
                <input
                  type="number"
                  min="1"
                  max={MAX_TABLE_COUNT}
                  value={tableCount}
                  onChange={(event) =>
                    writeSalonTableCount(normalizeTableCount(event.currentTarget.valueAsNumber))
                  }
                />
                <small>mesas</small>
              </label>
              <button
                type="button"
                aria-label="Aumentar quantidade de mesas"
                disabled={tableCount >= MAX_TABLE_COUNT}
                onClick={() => writeSalonTableCount(tableCount + 1)}
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
          </section>
        )}

        {view === 'tables' ? (
          <section className={styles.mapPanel} aria-labelledby="tables-title">
            <div className={styles.sectionHeader}>
              <div>
                <small>MAPA DO SALÃO</small>
                <h2 id="tables-title">
                  {tableCount} {tableCount === 1 ? 'mesa' : 'mesas'}
                </h2>
                <p>Toque em uma mesa para ver o motivo e as observações do cliente.</p>
              </div>
              <div className={styles.legend} aria-label="Legenda das mesas">
                <span>
                  <i data-tone="free" />
                  Livre
                </span>
                <span>
                  <i data-tone="calling" />
                  Chamando
                </span>
                <span>
                  <i data-tone="serving" />
                  Em atendimento
                </span>
              </div>
            </div>

            {openCalls.length === 0 && (
              <div className={styles.emptyBar}>
                <BellRing size={18} aria-hidden="true" />
                <span>
                  <b>Nenhuma mesa chamando</b> — o salão está tranquilo agora.
                </span>
              </div>
            )}

            {pending.length > 0 && (
              <section className={styles.serviceQueue} aria-labelledby="service-queue-title">
                <div className={styles.serviceQueueHead}>
                  <span>
                    <ListChecks size={17} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 id="service-queue-title">Fila de atendimento</h3>
                    <p>Ordem automática: quem chamou primeiro aparece primeiro.</p>
                  </div>
                </div>
                <ol>
                  {pending.map((call, index) => (
                    <li key={call.id}>
                      <button type="button" onClick={() => selectTable(call.table)}>
                        <strong>{index + 1}º</strong>
                        <span>
                          <b>Mesa {String(call.table).padStart(2, '0')}</b>
                          <small>{call.reason}</small>
                        </span>
                        <CallWaiting call={call} />
                        <ChevronRight size={15} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <div className={styles.salonLayout}>
              <div className={styles.tableGrid} aria-label="Mesas do salão">
                {tables.map((table) => {
                  const tableCalls = callsByTable.get(table) ?? []
                  const isCalling = tableCalls.some((call) => call.status === 'pending')
                  const isServing = !isCalling && tableCalls.length > 0
                  const state = isCalling ? 'calling' : isServing ? 'serving' : 'free'
                  const stateLabel = isCalling
                    ? 'chamando atendimento'
                    : isServing
                      ? 'em atendimento'
                      : 'livre'
                  const stateClass =
                    state === 'calling'
                      ? styles.tableCalling
                      : state === 'serving'
                        ? styles.tableServing
                        : styles.tableFree

                  return (
                    <button
                      className={cn(
                        styles.tableButton,
                        stateClass,
                        visibleTable === table && styles.tableSelected,
                      )}
                      type="button"
                      key={table}
                      aria-label={`Mesa ${table}, ${stateLabel}`}
                      aria-pressed={visibleTable === table}
                      onClick={() => selectTable(table)}
                    >
                      <span className={styles.tableTop}>
                        <i aria-hidden="true" />
                        {tableCalls.length > 0 && <small>{tableCalls.length}</small>}
                      </span>
                      <b>{String(table).padStart(2, '0')}</b>
                      <span>{isCalling ? 'Chamando' : isServing ? 'Atendendo' : 'Livre'}</span>
                    </button>
                  )
                })}
              </div>

              <aside ref={tableDetailRef} className={styles.tableDetail} aria-live="polite">
                {visibleTable ? (
                  <>
                    <div className={styles.detailHeader}>
                      <span>
                        MESA <b>{String(visibleTable).padStart(2, '0')}</b>
                      </span>
                      <div>
                        <small>DETALHES DA MESA</small>
                        <h3>
                          {selectedCalls.some((call) => call.status === 'pending') &&
                            'Cliente chamando'}
                          {selectedCalls.length > 0 &&
                            !selectedCalls.some((call) => call.status === 'pending') &&
                            'Atendimento em andamento'}
                          {selectedCalls.length === 0 && 'Mesa livre'}
                        </h3>
                      </div>
                    </div>

                    {selectedCalls.length > 0 ? (
                      <div className={styles.selectedCalls}>{selectedCalls.map(renderCall)}</div>
                    ) : (
                      <div className={styles.detailEmpty}>
                        <CheckCheck size={25} aria-hidden="true" />
                        <b>
                          {selectedHistory.length > 0
                            ? 'Atendimento concluído'
                            : 'Nenhum chamado em aberto'}
                        </b>
                        <span>
                          {selectedHistory.length > 0
                            ? 'A mesa voltou ao estado livre.'
                            : 'Quando o cliente chamar, o motivo e a observação aparecerão aqui.'}
                        </span>
                      </div>
                    )}

                    {selectedHistory.length > 0 && (
                      <div className={styles.history}>
                        <small>ÚLTIMOS ATENDIMENTOS</small>
                        {selectedHistory.map((call) => (
                          <span key={call.id}>
                            <Check size={13} aria-hidden="true" />
                            <span>{call.reason}</span>
                            <b>{formatWaiting(waitingSeconds(call, 0))}</b>
                          </span>
                        ))}
                      </div>
                    )}

                    <Link className={styles.customerLink} href={selectedTablePath} target="_blank">
                      Abrir tela da mesa {visibleTable}
                      <ChevronRight size={15} aria-hidden="true" />
                    </Link>
                  </>
                ) : (
                  <div className={styles.selectPrompt}>
                    <Grid3X3 size={30} aria-hidden="true" />
                    <b>Selecione uma mesa</b>
                    <span>Os detalhes do chamado aparecerão neste espaço.</span>
                  </div>
                )}
              </aside>
            </div>
          </section>
        ) : (
          <section className={styles.ordersPanel} aria-labelledby="orders-title">
            <div className={styles.sectionHeader}>
              <div>
                <small>GESTOR DE PEDIDOS</small>
                <h2 id="orders-title">Produção do salão</h2>
                <p>Os pedidos avançam da entrada até a entrega, como no painel da referência.</p>
              </div>
              <button
                className={styles.newOrder}
                type="button"
                onClick={() => addDemoSalonOrder(tableCount)}
              >
                <Plus size={16} aria-hidden="true" />
                Novo pedido teste
              </button>
            </div>

            <div className={styles.orderBoard}>
              {ORDER_COLUMNS.map((column) => {
                const columnOrders = orders.filter((order) => order.status === column.status)
                return (
                  <section
                    className={styles.orderColumn}
                    data-status={column.status}
                    key={column.status}
                    aria-labelledby={`column-${column.status}`}
                  >
                    <header>
                      <span>
                        <b id={`column-${column.status}`}>{column.title}</b>
                        <small>{column.description}</small>
                      </span>
                      <strong>{columnOrders.length}</strong>
                    </header>

                    <div className={styles.orderList}>
                      {columnOrders.length === 0 ? (
                        <div className={styles.orderEmpty}>
                          <ShoppingBag size={21} aria-hidden="true" />
                          Nenhum pedido
                        </div>
                      ) : (
                        columnOrders.map((order) => (
                          <article className={styles.orderCard} key={order.id}>
                            <div className={styles.orderCardHead}>
                              <span>
                                <b>{order.code}</b>
                                <small>{order.timeLabel}</small>
                              </span>
                              <strong>Mesa {order.table}</strong>
                            </div>
                            <div className={styles.orderItems}>
                              {order.items.map((item) => (
                                <span key={item}>{item}</span>
                              ))}
                            </div>
                            {order.note && (
                              <p>
                                <b>Obs.:</b> {order.note}
                              </p>
                            )}
                            <div className={styles.orderCardFoot}>
                              <b>{order.total}</b>
                              {column.action ? (
                                <button type="button" onClick={() => advanceSalonOrder(order.id)}>
                                  {column.action}
                                  <ChevronRight size={14} aria-hidden="true" />
                                </button>
                              ) : (
                                <span>
                                  <Check size={13} aria-hidden="true" />
                                  Entregue
                                </span>
                              )}
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                )
              })}
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <div>
          <button type="button" onClick={resetCalls}>
            <RotateCcw size={13} aria-hidden="true" />
            Limpar chamados
          </button>
          <button type="button" onClick={resetSalonOrders}>
            <RotateCcw size={13} aria-hidden="true" />
            Restaurar pedidos
          </button>
        </div>
        <span>
          Demonstração salva neste navegador. Na operação real, o banco de dados compartilha a mesma
          atualização entre o PC principal e todos os celulares da equipe.
        </span>
      </footer>
    </div>
  )
}
