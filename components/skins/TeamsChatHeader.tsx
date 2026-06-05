'use client'

import {
  KeyRound,
  Pencil,
  Phone,
  Share2,
  Users,
  Video,
} from 'lucide-react'
import { CountdownTimer } from '@/components/CountdownTimer'
import { SkinPicker } from '@/components/SkinPicker'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TeamsChatHeaderProps {
  title: string
  subtitle: string
  participantCount: number
  expiresAt: string
  accessCode?: string | null
  onExpire: () => void
  onShare: () => void
}

export function TeamsChatHeader({
  title,
  subtitle,
  participantCount,
  expiresAt,
  accessCode,
  onExpire,
  onShare,
}: TeamsChatHeaderProps) {
  return (
    <header className="border-b border-[var(--border-color)] bg-[var(--bg-header)] text-[var(--header-fg)]">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold">{title}</h1>
            <Pencil className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
          </div>
          <p className="truncate text-xs text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)]"
            title="Vídeo"
            aria-label="Vídeo"
          >
            <Video className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)]"
            title="Chamada"
            aria-label="Chamada"
          >
            <Phone className="h-4 w-4" />
          </button>
          <Button
            size="sm"
            variant="outline"
            onClick={onShare}
            className="h-9 border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)]"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
          <div className="hidden items-center gap-1 rounded-md border border-[var(--border-color)] px-2 py-1 text-xs text-[var(--text-secondary)] sm:flex">
            <Users className="h-3.5 w-3.5" />
            {participantCount}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[var(--border-color)] px-4">
        <div className="flex gap-4">
          <button
            type="button"
            className={cn(
              'border-b-2 border-[var(--accent)] py-2.5 text-sm font-semibold text-[var(--accent)]'
            )}
          >
            Chat
          </button>
          <button
            type="button"
            className="border-b-2 border-transparent py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Arquivos
          </button>
        </div>
        <div className="flex items-center gap-2 py-1">
          {accessCode && (
            <span className="hidden items-center gap-1 rounded border border-[var(--border-color)] px-2 py-0.5 font-mono text-xs sm:inline-flex">
              <KeyRound className="h-3 w-3" />
              {accessCode}
            </span>
          )}
          <CountdownTimer expiresAt={expiresAt} onExpire={onExpire} />
          <SkinPicker compact />
        </div>
      </div>
    </header>
  )
}
