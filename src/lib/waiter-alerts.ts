export const ALERT_VIBRATION = [350, 120, 350, 120, 700]

export const WAITER_SCOPE = '/garcom'

export type NotificationSupport = 'unsupported' | 'default' | 'granted' | 'denied'

/** Opções que os navegadores aceitam mas que ainda não estão no lib.dom padrão. */
type WaiterNotificationOptions = NotificationOptions & {
  renotify?: boolean
  vibrate?: number[]
}

export function notificationSupport(): NotificationSupport {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission
}

export async function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return false
  try {
    return (await Notification.requestPermission()) === 'granted'
  } catch {
    return false
  }
}

export async function registerWaiterServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker.register('/sw.js', { scope: WAITER_SCOPE })
  } catch {
    return null
  }
}

/**
 * O celular de quem atende precisa perceber o chamado sem estar olhando a tela:
 * vibra sempre e, com permissão, mostra uma notificação persistente.
 *
 * A notificação sai pelo service worker quando ele já está ativo — só assim ela
 * sobrevive com o app em segundo plano — e cai para a Notification comum quando
 * não há registro disponível. `getRegistration` é usado no lugar de `ready`
 * porque `ready` nunca resolve se a página estiver fora do escopo do worker.
 */
export async function showWaiterAlert(title: string, body: string, tag: string) {
  if (typeof navigator !== 'undefined') navigator.vibrate?.(ALERT_VIBRATION)

  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return false

  const options: WaiterNotificationOptions = {
    body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag,
    renotify: true,
    requireInteraction: true,
    silent: false,
    vibrate: ALERT_VIBRATION,
    data: { url: WAITER_SCOPE },
  }

  try {
    const registration = await navigator.serviceWorker?.getRegistration(WAITER_SCOPE)
    if (registration) {
      await registration.showNotification(title, options)
      return true
    }
    new Notification(title, options)
    return true
  } catch {
    // A fila continua funcionando mesmo se o sistema bloquear a notificação.
    return false
  }
}
