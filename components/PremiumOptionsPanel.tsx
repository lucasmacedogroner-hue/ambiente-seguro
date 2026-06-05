'use client'

import { useState } from 'react'
import { Lock, Clock, Layers, Palette } from 'lucide-react'
import { PremiumUpgradeDialog } from '@/components/PremiumUpgradeDialog'
import { PREMIUM_PRICE, FREE_DURATION_HOURS } from '@/lib/plan'
import { cn } from '@/lib/utils'

const LOCKED_OPTIONS = [
  {
    id: 'duration',
    icon: Clock,
    title: 'Duração da sala',
    freeLabel: `${FREE_DURATION_HOURS}h (fixo no gratuito)`,
    premiumLabel: '1h a 24h — você escolhe',
  },
  {
    id: 'multi-rooms',
    icon: Layers,
    title: 'Salas simultâneas',
    freeLabel: '1 sala ativa por vez',
    premiumLabel: 'Várias salas ao mesmo tempo',
  },
  {
    id: 'skins',
    icon: Palette,
    title: 'Aparência (skin)',
    freeLabel: 'Padrão e WhatsApp',
    premiumLabel: 'Teams, Slack, Telegram, Discord + mais',
  },
] as const

export function PremiumOptionsPanel() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [lockedFeature, setLockedFeature] = useState<string | undefined>()

  const openUpgrade = (title: string) => {
    setLockedFeature(title)
    setDialogOpen(true)
  }

  return (
    <>
      <section className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-sidebar)] shadow-sm">
        <div className="space-y-1 border-b border-[var(--border-color)] px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Opções Premium
            </h2>
            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--bg-sidebar)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)]">
              <Lock className="h-3 w-3" />
              {PREMIUM_PRICE}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Visíveis para transparência — ficam travadas até você criar conta ou
            assinar.
          </p>
        </div>
        <div className="space-y-2 p-6">
          {LOCKED_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => openUpgrade(opt.title)}
              className={cn(
                'relative w-full overflow-hidden rounded-lg border p-3 text-left transition-colors',
                'border-[var(--border-color)] bg-[var(--bg-input)] hover:bg-[var(--bg-sidebar)]'
              )}
            >
              <div className="pointer-events-none absolute inset-0 bg-[var(--bg-main)]/50 backdrop-blur-[1px]" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--bg-sidebar)]">
                  <opt.icon className="h-4 w-4 text-[var(--text-secondary)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {opt.title}
                    </span>
                    <Lock className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {opt.freeLabel}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-600 dark:text-amber-400">
                    Premium: {opt.premiumLabel}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <PremiumUpgradeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        featureTitle={lockedFeature}
      />
    </>
  )
}
