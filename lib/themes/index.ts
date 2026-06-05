import type { Skin, SkinId, ColorMode, SkinVars } from '@/types'
import { defaultSkin } from './default'
import { whatsappSkin } from './whatsapp'
import { slackSkin } from './slack'
import { telegramSkin } from './telegram'
import { discordSkin } from './discord'
import { teamsSkin } from './teams'

export const SKINS: Skin[] = [
  defaultSkin,
  whatsappSkin,
  teamsSkin,
  slackSkin,
  telegramSkin,
  discordSkin,
]

export function getSkin(id: SkinId): Skin {
  return SKINS.find((s) => s.id === id) ?? defaultSkin
}

export function getThemeVars(skin: Skin, mode: ColorMode): SkinVars {
  return mode === 'dark' ? skin.dark : skin.light
}

export function applyTheme(skinId: SkinId, mode: ColorMode): void {
  if (typeof document === 'undefined') return
  const skin = getSkin(skinId)
  const vars = getThemeVars(skin, mode)
  const root = document.documentElement

  Object.entries(vars).forEach(([key, val]) => {
    root.style.setProperty(key, val)
  })

  // Sincroniza tokens do shadcn para telas fora do chat (início, setup, etc.)
  root.style.setProperty('--background', vars['--bg-main'])
  root.style.setProperty('--foreground', vars['--text-primary'])
  root.style.setProperty('--card', vars['--bg-sidebar'])
  root.style.setProperty('--card-foreground', vars['--text-primary'])
  root.style.setProperty('--muted', vars['--bg-sidebar'])
  root.style.setProperty('--muted-foreground', vars['--text-secondary'])
  root.style.setProperty('--border', vars['--border-color'])
  root.style.setProperty('--input', vars['--bg-input'])
  root.style.setProperty('--primary', vars['--accent'])
  root.style.setProperty('--primary-foreground', vars['--accent-fg'])
  root.style.setProperty('--secondary', vars['--bg-sidebar'])
  root.style.setProperty('--secondary-foreground', vars['--text-primary'])
  root.style.setProperty('--ring', vars['--accent'])
  // Não sobrescrever --accent / --accent-fg da skin (cor da marca)

  root.classList.toggle('dark', mode === 'dark')
  root.setAttribute('data-skin', skinId)
  root.setAttribute('data-mode', mode)
}

export {
  defaultSkin,
  whatsappSkin,
  teamsSkin,
  slackSkin,
  telegramSkin,
  discordSkin,
}
