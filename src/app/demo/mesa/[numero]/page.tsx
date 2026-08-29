import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DemoExperience } from '@/components/demo/DemoExperience'
import { tableProject } from '@/data/projects'

type TablePageProps = {
  params: Promise<{ numero: string }>
}

/** Aceita apenas identificadores curtos de mesa, como 12, A3 ou 07. */
const sanitizeTable = (value: string) => {
  const table = decodeURIComponent(value).trim().toUpperCase()
  return /^[A-Z0-9]{1,4}$/.test(table) ? table : null
}

export async function generateMetadata({ params }: TablePageProps): Promise<Metadata> {
  const { numero } = await params
  const table = sanitizeTable(numero)

  return {
    title: table ? `Mesa ${table} • ${tableProject?.name ?? 'demonstração'}` : 'Mesa',
    description: 'Experiência demonstrativa aberta a partir da peça de mesa.',
    robots: { index: false, follow: false },
  }
}

export default async function TablePage({ params }: TablePageProps) {
  const { numero } = await params
  const table = sanitizeTable(numero)
  if (!table || !tableProject) notFound()

  return <DemoExperience project={tableProject} table={table} />
}
