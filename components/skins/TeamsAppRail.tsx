'use client'

import {
  Calendar,
  Files,
  LayoutGrid,
  MessageSquare,
  Phone,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const RAIL_ITEMS = [
  { icon: MessageSquare, label: 'Chat', active: true },
  { icon: Users, label: 'Teams', active: false },
  { icon: Calendar, label: 'Calendário', active: false },
  { icon: Phone, label: 'Chamadas', active: false },
  { icon: Files, label: 'Arquivos', active: false },
  { icon: LayoutGrid, label: 'Apps', active: false },
] as const

export function TeamsAppRail() {
  return (
    <nav
      className="hidden w-[68px] shrink-0 flex-col items-center border-r border-[#3d3d3d] bg-[#252423] py-3 sm:flex"
      aria-label="Navegação Microsoft Teams"
    >
      <div
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #5b5fc7 0%, #464eb8 100%)' }}
        title="Microsoft Teams"
      >
        T
      </div>
      <ul className="flex flex-1 flex-col items-center gap-1">
        {RAIL_ITEMS.map(({ icon: Icon, label, active }) => (
          <li key={label}>
            <button
              type="button"
              title={label}
              className={cn(
                'relative flex h-12 w-12 items-center justify-center rounded-lg transition-colors',
                active
                  ? 'bg-[#3d3d3d] text-white'
                  : 'text-[#adadad] hover:bg-[#3d3d3d]/60 hover:text-white'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-[#5b5fc7]"
                  aria-hidden
                />
              )}
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
