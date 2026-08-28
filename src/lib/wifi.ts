import type { ProjectConfig } from '@/types/project'

const escapeWifiValue = (value: string) => value.replace(/([\\;,:"])/g, '\\$1')

export function createWifiPayload(wifi: ProjectConfig['wifi']) {
  const hidden = false
  return `WIFI:T:${wifi.security};S:${escapeWifiValue(wifi.ssid)};P:${escapeWifiValue(wifi.password)};H:${hidden};;`
}
