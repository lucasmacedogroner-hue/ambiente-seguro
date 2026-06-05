"use client"

import { useEffect, useState } from "react"
import { Lock, Moon, Sun } from "lucide-react"
import { SKINS, applyTheme } from "@/lib/themes"
import type { SkinId, ColorMode } from "@/types"
import { cn } from "@/lib/utils"
import {
  FREE_SKIN_IDS,
  getUserPlan,
  isSkinAllowed,
} from "@/lib/plan"
import { PremiumUpgradeDialog } from "@/components/PremiumUpgradeDialog"

const SKIN_KEY = "chat_skin"
const MODE_KEY = "color_mode"

export function useSkin() {
  const [skin, setSkinState] = useState<SkinId>("default")
  const [mode, setModeState] = useState<ColorMode>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const plan = getUserPlan()
    let savedSkin = (localStorage.getItem(SKIN_KEY) as SkinId) ?? "default"
    if (!isSkinAllowed(savedSkin, plan)) {
      savedSkin = FREE_SKIN_IDS[0]
      localStorage.setItem(SKIN_KEY, savedSkin)
    }
    const savedMode = (localStorage.getItem(MODE_KEY) as ColorMode) ?? "light"
    setSkinState(savedSkin)
    setModeState(savedMode)
    applyTheme(savedSkin, savedMode)
    setMounted(true)
  }, [])

  const setSkin = (id: SkinId) => {
    const plan = getUserPlan()
    if (!isSkinAllowed(id, plan)) return
    setSkinState(id)
    localStorage.setItem(SKIN_KEY, id)
    applyTheme(id, mode)
  }

  const setMode = (m: ColorMode) => {
    setModeState(m)
    localStorage.setItem(MODE_KEY, m)
    applyTheme(skin, m)
  }

  const toggleMode = () => setMode(mode === "light" ? "dark" : "light")

  return { skin, mode, setSkin, setMode, toggleMode, mounted }
}

interface SkinPickerProps {
  compact?: boolean
}

export function SkinPicker({ compact = false }: SkinPickerProps) {
  const { skin, mode, setSkin, toggleMode, mounted } = useSkin()
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const plan = mounted ? getUserPlan() : "free"
  const isPremium = plan === "premium"

  if (!mounted) {
    return (
      <div
        className="flex h-8 items-center gap-2"
        aria-hidden
        suppressHydrationWarning
      >
        <div className="h-8 w-24 rounded-md bg-muted/50" />
        <div className="h-8 w-8 rounded-md bg-muted/50" />
      </div>
    )
  }

  const handleSkinClick = (id: SkinId) => {
    if (isSkinAllowed(id, plan)) {
      setSkin(id)
      return
    }
    setUpgradeOpen(true)
  }

  if (compact) {
    return (
      <>
        <div className="flex items-center gap-2">
          <select
            value={skin}
            onChange={(e) => {
              const id = e.target.value as SkinId
              if (isSkinAllowed(id, plan)) setSkin(id)
              else setUpgradeOpen(true)
            }}
            className="h-8 rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-2 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] [&_option]:bg-[var(--bg-input)] [&_option]:text-[var(--text-primary)]"
            aria-label="Aparência do chat"
          >
            {SKINS.map((s) => {
              const locked = !isSkinAllowed(s.id, plan)
              return (
                <option key={s.id} value={s.id} disabled={locked}>
                  {locked ? "🔒 " : ""}
                  {s.icon} {s.name}
                  {locked ? " (Premium)" : ""}
                </option>
              )
            })}
          </select>
          <button
            onClick={toggleMode}
            aria-label="Alternar modo claro/escuro"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] [&_svg]:text-[var(--text-primary)]"
          >
            {mode === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
        <PremiumUpgradeDialog
          open={upgradeOpen}
          onOpenChange={setUpgradeOpen}
          featureTitle="Todas as skins"
        />
      </>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-sm font-medium text-[var(--text-primary)]">
          Aparência da interface
        </p>
        <p className="mb-2 text-xs text-[var(--text-secondary)]">
          A skin é sua, não da sala.{" "}
          {!isPremium && (
            <span className="text-amber-600 dark:text-amber-400">
              Plano gratuito: Padrão e WhatsApp.
            </span>
          )}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {SKINS.map((s) => {
            const locked = !isSkinAllowed(s.id, plan)
            return (
              <button
                key={s.id}
                onClick={() => handleSkinClick(s.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all",
                  locked
                    ? "cursor-pointer opacity-70 border-[var(--border-color)] bg-[var(--bg-header)]"
                    : "hover:scale-105",
                  !locked && skin === s.id
                    ? "border-[var(--accent)] bg-[var(--bg-sidebar)]"
                    : !locked && "border-[var(--border-color)] bg-[var(--bg-header)]"
                )}
                type="button"
                aria-disabled={locked}
              >
                {locked && (
                  <span className="absolute top-1 right-1">
                    <Lock className="h-3 w-3 text-amber-500" />
                  </span>
                )}
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {s.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-[var(--text-primary)]">Modo</p>
        <div className="flex gap-2">
          <button
            onClick={() => mode !== "light" && toggleMode()}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all",
              mode === "light"
                ? "border-[var(--accent)] bg-[var(--bg-sidebar)] text-[var(--text-primary)]"
                : "border-[var(--border-color)] bg-[var(--bg-header)] text-[var(--text-secondary)]"
            )}
            type="button"
          >
            <Sun className="h-4 w-4" /> Claro
          </button>
          <button
            onClick={() => mode !== "dark" && toggleMode()}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all",
              mode === "dark"
                ? "border-[var(--accent)] bg-[var(--bg-sidebar)] text-[var(--text-primary)]"
                : "border-[var(--border-color)] bg-[var(--bg-header)] text-[var(--text-secondary)]"
            )}
            type="button"
          >
            <Moon className="h-4 w-4" /> Escuro
          </button>
        </div>
      </div>

      <PremiumUpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        featureTitle="Todas as skins"
      />
    </div>
  )
}
