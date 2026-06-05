'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  SquarePen,
} from 'lucide-react'
import { buildSidebarContacts, type SidebarContact } from '@/lib/fake-contacts'
import { cn } from '@/lib/utils'

const SIDEBAR_KEY = 'contacts_sidebar_open'

interface ContactsSidebarProps {
  roomId: string
  roomTitle: string
  participants: string[]
  isTeams?: boolean
}

function ContactRow({
  contact,
  isTeams,
}: {
  contact: SidebarContact
  isTeams: boolean
}) {
  return (
    <div
      className={cn(
        'flex cursor-default items-center gap-3 px-3 transition-colors',
        isTeams ? 'py-2 hover:bg-[#f5f5f5] dark:hover:bg-white/5' : 'border-b border-[var(--border-color)]/50 py-2.5',
        !isTeams && contact.isCurrentRoom
          ? 'border-l-[3px] border-l-[var(--accent)] bg-[var(--bg-header)]/15'
          : !isTeams && 'hover:bg-[var(--bg-header)]/8',
        isTeams && contact.isCurrentRoom && 'bg-[#f0f0f0] dark:bg-white/10'
      )}
      role="presentation"
    >
      <div className="relative shrink-0">
        <img
          src={contact.avatarUrl}
          alt=""
          width={isTeams ? 40 : 48}
          height={isTeams ? 40 : 48}
          className={cn(
            'rounded-full object-cover bg-[var(--border-color)]',
            isTeams ? 'h-10 w-10' : 'h-12 w-12'
          )}
          loading="lazy"
        />
        {(contact.isCurrentRoom || isTeams) && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-[var(--bg-sidebar)]',
              contact.isCurrentRoom ? 'h-3 w-3 bg-[#6bb700]' : 'h-2.5 w-2.5 bg-[#adadad]'
            )}
            aria-hidden
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-1">
          <span
            className={cn(
              'truncate text-sm',
              contact.isCurrentRoom ? 'font-semibold text-[var(--text-primary)]' : 'font-medium'
            )}
          >
            {contact.name}
            {contact.isCurrentRoom && !isTeams ? ' (esta sala)' : ''}
          </span>
          <span className="shrink-0 text-[10px] text-[var(--text-secondary)]">
            {contact.time}
          </span>
        </div>
        <p className="truncate text-xs text-[var(--text-secondary)]">{contact.preview}</p>
      </div>
      {contact.unread != null && contact.unread > 0 && !contact.isCurrentRoom && (
        <span
          className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {contact.unread > 9 ? '9+' : contact.unread}
        </span>
      )}
    </div>
  )
}

function ContactSection({
  title,
  contacts,
  isTeams,
}: {
  title: string
  contacts: SidebarContact[]
  isTeams: boolean
}) {
  if (contacts.length === 0) return null
  return (
    <li>
      {isTeams && (
        <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          {title}
        </p>
      )}
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <ContactRow contact={contact} isTeams={isTeams} />
          </li>
        ))}
      </ul>
    </li>
  )
}

export function ContactsSidebar({
  roomId,
  roomTitle,
  participants,
  isTeams = false,
}: ContactsSidebarProps) {
  const [open, setOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY)
    setOpen(saved !== 'false')
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = !open
    setOpen(next)
    localStorage.setItem(SIDEBAR_KEY, String(next))
  }

  const contacts = useMemo(
    () => buildSidebarContacts(roomId, participants, roomTitle),
    [roomId, participants, roomTitle]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return contacts
    return contacts.filter((c) => c.name.toLowerCase().includes(q))
  }, [contacts, query])

  const pinned = useMemo(
    () => filtered.filter((c) => c.isCurrentRoom),
    [filtered]
  )
  const recent = useMemo(
    () => filtered.filter((c) => !c.isCurrentRoom),
    [filtered]
  )

  const sidebarWidth = isTeams ? 'min(100%,320px)' : 'min(100%,280px)'

  if (!mounted) {
    return (
      <aside
        className={cn(
          'hidden shrink-0 border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] md:block',
          isTeams ? 'w-[320px]' : 'w-[280px]'
        )}
        aria-hidden
      />
    )
  }

  if (!open) {
    return (
      <aside
        className="flex w-12 shrink-0 flex-col border-r border-[var(--border-color)] bg-[var(--bg-sidebar)]"
        aria-label="Abrir lista de conversas"
      >
        <button
          type="button"
          onClick={toggle}
          className="flex h-12 w-full items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-header)] hover:text-[var(--text-primary)]"
          title="Mostrar conversas"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-[var(--border-color)]',
        'bg-[var(--bg-sidebar)] text-[var(--text-primary)]',
        'max-md:absolute max-md:z-20 max-md:h-full max-md:shadow-xl'
      )}
      style={{ width: sidebarWidth }}
      aria-label={isTeams ? 'Chat' : 'Lista de conversas'}
    >
      <div
        className={cn(
          'flex items-center gap-2 border-b border-[var(--border-color)] px-3',
          isTeams ? 'py-3.5' : 'py-3'
        )}
        style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}
      >
        <button
          type="button"
          onClick={toggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md opacity-90 hover:bg-black/5 dark:hover:bg-white/10"
          title="Ocultar barra lateral"
          aria-label="Ocultar conversas"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
        <span className="flex-1 truncate text-sm font-semibold">
          {isTeams ? 'Chat' : 'Conversas'}
        </span>
        {isTeams && (
          <>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10"
              title="Filtrar"
              aria-label="Filtrar"
            >
              <Filter className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10"
              title="Nova conversa"
              aria-label="Nova conversa"
            >
              <SquarePen className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="border-b border-[var(--border-color)] p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isTeams ? 'Pesquisar' : 'Pesquisar...'}
            className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto overscroll-contain">
        {isTeams ? (
          <>
            <ContactSection title="Fixadas" contacts={pinned} isTeams />
            <ContactSection title="Recentes" contacts={recent} isTeams />
          </>
        ) : (
          filtered.map((contact) => (
            <li key={contact.id}>
              <ContactRow contact={contact} isTeams={false} />
            </li>
          ))
        )}
      </ul>

      <div className="border-t border-[var(--border-color)] p-2 md:hidden">
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-header)]/10"
        >
          <ChevronLeft className="h-4 w-4" />
          Ocultar lista
        </button>
      </div>
    </aside>
  )
}

/** Botão para reabrir a barra quando fechada (uso no header do chat em mobile) */
export function ContactsSidebarToggle({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-color)]',
        'bg-[var(--bg-input)] text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)]',
        className
      )}
      title="Mostrar conversas"
      aria-label="Mostrar lista de conversas"
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  )
}
