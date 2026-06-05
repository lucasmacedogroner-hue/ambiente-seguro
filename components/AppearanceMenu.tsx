'use client'

import { useState } from 'react'
import { Lock, Menu, Moon, Sun } from 'lucide-react'
import { SKINS } from '@/lib/themes'
import type { SkinId } from '@/types'
import { cn } from '@/lib/utils'
import { getUserPlan, isSkinAllowed } from '@/lib/plan'
import { PremiumUpgradeDialog } from '@/components/PremiumUpgradeDialog'
import { useSkin } from '@/components/SkinPicker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface AppearanceMenuProps {
  inHeader?: boolean
}

export function AppearanceMenu({ inHeader = false }: AppearanceMenuProps) {
  const { skin, mode, setSkin, toggleMode, mounted } = useSkin()
  const [open, setOpen] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const plan = mounted ? getUserPlan() : 'free'
  const isPremium = plan === 'premium'

  const iconBtnClass = cn(
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors',
    inHeader
      ? 'border-[var(--header-fg)]/25 bg-[var(--header-fg)]/10 text-[var(--header-fg)] hover:bg-[var(--header-fg)]/20'
      : 'border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)]'
  )

  const handleSkinClick = (id: SkinId) => {
    if (isSkinAllowed(id, plan)) {
      setSkin(id)
      setOpen(false)
      return
    }
    setUpgradeOpen(true)
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-2" aria-hidden>
        <div className="h-9 w-9 rounded-md bg-[var(--bg-sidebar)]" />
        <div className="h-9 w-9 rounded-md bg-[var(--bg-sidebar)]" />
      </div>
    )
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleMode}
          className={iconBtnClass}
          aria-label={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          title={mode === 'light' ? 'Modo escuro' : 'Modo claro'}
        >
          {mode === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={iconBtnClass}
              aria-label="Escolher aparência"
              title="Skins"
            >
              <Menu className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-72 border-[var(--border-color)] bg-[var(--bg-sidebar)] p-0 text-[var(--text-primary)] shadow-lg"
          >
            <div className="border-b border-[var(--border-color)] px-4 py-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Aparência
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                A skin é sua, não da sala.{' '}
                {!isPremium && (
                  <span className="text-amber-600 dark:text-amber-400">
                    Gratuito: Padrão e WhatsApp.
                  </span>
                )}
              </p>
            </div>
            <ul className="max-h-[min(60vh,320px)] overflow-y-auto p-2">
              {SKINS.map((s) => {
                const locked = !isSkinAllowed(s.id, plan)
                const active = skin === s.id
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => handleSkinClick(s.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                        active
                          ? 'bg-[var(--bg-main)] ring-1 ring-[var(--accent)]'
                          : 'hover:bg-[var(--bg-main)]/80',
                        locked && 'opacity-75'
                      )}
                    >
                      <span className="text-lg leading-none">{s.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-[var(--text-primary)]">
                          {s.name}
                        </span>
                        {locked && (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400">
                            Premium
                          </span>
                        )}
                      </span>
                      {locked ? (
                        <Lock className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                      ) : active ? (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: 'var(--accent)' }}
                        />
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      <PremiumUpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        featureTitle="Todas as skins"
      />
    </>
  )
}
