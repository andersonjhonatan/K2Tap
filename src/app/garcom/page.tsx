import type { Metadata } from 'next'
import { WaiterPanel } from '@/components/waiter/WaiterPanel'
import { tableProject } from '@/data/projects'
import { parseStaffCallRequest } from '@/lib/staff-call'

type WaiterPageProps = {
  searchParams: Promise<{ mesa?: string; motivo?: string }>
}

export const metadata: Metadata = {
  title: 'Painel da equipe',
  description: 'Painel demonstrativo de chamados para quem atende o salão.',
  robots: { index: false, follow: false },
}

export default async function WaiterPage({ searchParams }: WaiterPageProps) {
  const request = parseStaffCallRequest(await searchParams)
  const role = tableProject?.staffCall?.role ?? 'Garçom'

  return (
    <WaiterPanel
      incoming={request ? { table: request.table, reason: request.reason } : null}
      role={role}
    />
  )
}
