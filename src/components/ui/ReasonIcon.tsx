import { CircleHelp, ConciergeBell, CupSoda, NotebookPen, Receipt } from 'lucide-react'
import type { StaffCallReasonIcon } from '@/types/project'

const icons = {
  bell: ConciergeBell,
  order: NotebookPen,
  drink: CupSoda,
  bill: Receipt,
  help: CircleHelp,
} satisfies Record<StaffCallReasonIcon, typeof ConciergeBell>

export function ReasonIcon({ name, size = 16 }: { name: StaffCallReasonIcon; size?: number }) {
  const Icon = icons[name] ?? ConciergeBell
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />
}
