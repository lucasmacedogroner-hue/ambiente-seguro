'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Lock, Loader2, Link2, ShieldCheck } from 'lucide-react'
import { AppLogo } from '@/components/AppLogo'
import { toast } from 'sonner'
import { AppNav } from '@/components/app-nav'
import { AppearanceMenu } from '@/components/AppearanceMenu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSessionId } from '@/lib/session'
import { getSupabaseConfig } from '@/lib/supabase'
import { FREE_DURATION_HOURS } from '@/lib/plan'
import { PremiumOptionsPanel } from '@/components/PremiumOptionsPanel'
import { cn } from '@/lib/utils'

function HomeCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'rounded-xl border border-[var(--border-color)] bg-[var(--bg-sidebar)] text-[var(--text-primary)] shadow-sm',
        className
      )}
    >
      {children}
    </section>
  )
}

export default function HomePage() {
  const router = useRouter()
  const supabaseReady = getSupabaseConfig().configured
  const [creating, setCreating] = useState<'public' | 'private' | null>(null)
  const [joinId, setJoinId] = useState('')
  const [joining, setJoining] = useState(false)

  const createRoom = async (isPrivate: boolean) => {
    if (!supabaseReady) {
      toast.error('Configure o Supabase em .env.local (veja /setup)')
      return
    }

    setCreating(isPrivate ? 'private' : 'public')
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPrivate,
          createdBySessionId: getSessionId(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao criar sala')

      const link = `${window.location.origin}/room/${data.id}`
      if (isPrivate && data.access_code) {
        toast.success(`Sala criada! Código: ${data.access_code}`, {
          description: 'Compartilhe o link e o código com quem deve entrar.',
          duration: 8000,
        })
        try {
          await navigator.clipboard.writeText(`${link}\nCódigo: ${data.access_code}`)
        } catch {
          /* clipboard opcional */
        }
      } else {
        toast.success('Sala aberta criada!', {
          description: 'Link copiado para a área de transferência.',
        })
        try {
          await navigator.clipboard.writeText(link)
        } catch {
          /* clipboard opcional */
        }
      }

      router.push(`/room/${data.id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar sala'
      toast.error(msg, {
        duration: msg.includes('Premium') || msg.includes('1 sala') ? 7000 : 4000,
      })
    } finally {
      setCreating(null)
    }
  }

  const handleJoinById = () => {
    const raw = joinId.trim()
    if (!raw) {
      toast.error('Cole o ID ou o link da sala')
      return
    }

    let roomId = raw
    try {
      if (raw.includes('/room/')) {
        const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`)
        const parts = url.pathname.split('/').filter(Boolean)
        const idx = parts.indexOf('room')
        if (idx >= 0 && parts[idx + 1]) roomId = parts[idx + 1]
      }
    } catch {
      roomId = raw.split('/').pop() || raw
    }

    roomId = roomId.replace(/[^a-f0-9-]/gi, '')
    if (!roomId) {
      toast.error('ID da sala inválido')
      return
    }

    setJoining(true)
    router.push(`/room/${roomId}`)
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
        <header
          className="border-b border-[var(--header-fg)]/15 text-[var(--header-fg)]"
          style={{ backgroundColor: 'var(--bg-header)' }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-start gap-3">
              <AppLogo size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold text-[var(--header-fg)]">
                      Ambiente Seguro
                    </h1>
                    <p className="text-sm text-[var(--header-fg)]/80">
                      Sem cadastro — entre só com seu nome
                    </p>
                  </div>
                  <AppearanceMenu inHeader />
                </div>
                <AppNav inHeader />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto max-w-lg flex-1 space-y-6 px-4 py-8">
          <HomeCard className="!border-green-500/40 !bg-green-500/10 p-5">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
              <div className="space-y-1 text-sm">
                <p className="font-medium text-[var(--text-primary)]">
                  Acesso gratuito sem conta
                </p>
                <p className="leading-relaxed text-[var(--text-secondary)]">
                  Crie ou entre na sala só com seu nome. Skins{' '}
                  <strong className="text-[var(--text-primary)]">Padrão</strong> e{' '}
                  <strong className="text-[var(--text-primary)]">WhatsApp</strong> no
                  gratuito; demais visuais no Premium.
                </p>
              </div>
            </div>
          </HomeCard>

          {process.env.NODE_ENV === 'development' && !supabaseReady && (
            <HomeCard className="!border-amber-500/50 !bg-amber-500/10 p-5">
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Ambiente local: configure o Supabase em{' '}
                <code className="rounded bg-[var(--bg-sidebar)] px-1 text-xs text-[var(--text-primary)]">
                  .env.local
                </code>{' '}
                (veja <code className="rounded bg-[var(--bg-sidebar)] px-1 text-xs">.env.local.example</code>).
              </p>
            </HomeCard>
          )}

          <HomeCard>
            <div className="space-y-1 border-b border-[var(--border-color)] px-6 py-5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Criar nova sala
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Plano gratuito: sala de {FREE_DURATION_HOURS} horas (fixo). Salas
                privadas exigem código e aprovação do criador.
              </p>
            </div>
            <div className="grid gap-3 p-6 sm:grid-cols-2">
              <button
                type="button"
                disabled={!!creating}
                onClick={() => createRoom(false)}
                className={cn(
                  'flex min-h-[7.5rem] w-full flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors',
                  'border-[var(--border-color)] bg-[var(--bg-input)] hover:bg-[var(--bg-sidebar)]',
                  'whitespace-normal disabled:opacity-60'
                )}
              >
                {creating === 'public' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--accent)]" />
                ) : (
                  <Globe className="h-5 w-5 text-[var(--accent)]" />
                )}
                <span className="font-semibold text-[var(--text-primary)]">
                  Sala aberta
                </span>
                <span className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  Qualquer pessoa com o link entra com o nome
                </span>
              </button>
              <button
                type="button"
                disabled={!!creating}
                onClick={() => createRoom(true)}
                className={cn(
                  'flex min-h-[7.5rem] w-full flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors',
                  'border-[var(--border-color)] bg-[var(--bg-input)] hover:bg-[var(--bg-sidebar)]',
                  'whitespace-normal disabled:opacity-60'
                )}
              >
                {creating === 'private' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--accent)]" />
                ) : (
                  <Lock className="h-5 w-5 text-[var(--accent)]" />
                )}
                <span className="font-semibold text-[var(--text-primary)]">
                  Sala privada
                </span>
                <span className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  Código de acesso + você aprova quem entra
                </span>
              </button>
            </div>
          </HomeCard>

          <PremiumOptionsPanel />

          <HomeCard>
            <div className="space-y-1 border-b border-[var(--border-color)] px-6 py-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
                <Link2 className="h-5 w-5" />
                Entrar em uma sala
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Sem conta: cole o link e digite seu nome na próxima tela
              </p>
            </div>
            <div className="space-y-3 p-6">
              <div className="space-y-2">
                <Label htmlFor="roomId" className="text-[var(--text-primary)]">
                  Link ou ID
                </Label>
                <Input
                  id="roomId"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  placeholder="https://…/room/uuid ou uuid"
                  className="border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                />
              </div>
              <Button
                className="w-full bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90"
                disabled={joining}
                onClick={handleJoinById}
              >
                {joining ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Ir para a sala'
                )}
              </Button>
            </div>
          </HomeCard>
        </div>

        <footer className="mt-auto border-t border-[var(--border-color)]">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-[var(--text-secondary)]">
            Ambiente Seguro · Comunicação efêmera
          </div>
        </footer>
    </div>
  )
}
