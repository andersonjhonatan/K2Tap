import { WaiterPanel } from '@/components/waiter/WaiterPanel'
import { tableProject } from '@/data/projects'
import { parseStaffCallRequest } from '@/lib/staff-call'

type WaiterPageProps = {
  searchParams: Promise<{ mesa?: string; motivo?: string; id?: string; obs?: string }>
}

export default async function WaiterPage({ searchParams }: WaiterPageProps) {
  const request = parseStaffCallRequest(await searchParams)
  const staffCall = tableProject?.staffCall

  return (
    <WaiterPanel
      incoming={request}
      role={staffCall?.role ?? 'Garçom'}
      tablePath={staffCall?.customerPath ?? '/demo/mesa/12'}
    />
  )
}
