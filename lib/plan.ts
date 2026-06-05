import type { SkinId } from '@/types'

export type UserPlan = 'free' | 'premium'

const PLAN_KEY = 'ambiente_seguro_plan'

/** Plano gratuito: sala fixa de 6h */
export const FREE_DURATION_HOURS = 6

/** Skins liberadas no plano gratuito */
export const FREE_SKIN_IDS: SkinId[] = ['default', 'whatsapp']

export const PREMIUM_PRICE = 'US$ 5,99/mês'

export const PREMIUM_FEATURES = [
  {
    id: 'multi-rooms',
    title: 'Várias salas ao mesmo tempo',
    description: 'Crie mais de uma sala ativa sem esperar a anterior expirar.',
  },
  {
    id: 'duration',
    title: 'Duração personalizada',
    description: 'Escolha entre 1 hora e 24 horas para cada sala.',
  },
  {
    id: 'skins',
    title: 'Todas as skins',
    description: 'Teams, Slack, Telegram, Discord e demais visuais premium.',
  },
] as const

export function isPremium(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(PLAN_KEY) === 'premium'
}

export function getUserPlan(): UserPlan {
  return isPremium() ? 'premium' : 'free'
}

/** Apenas para testes em /setup — pagamento real virá depois */
export function setUserPlan(plan: UserPlan): void {
  if (typeof window === 'undefined') return
  if (plan === 'premium') {
    localStorage.setItem(PLAN_KEY, 'premium')
  } else {
    localStorage.removeItem(PLAN_KEY)
  }
}

export function isSkinAllowed(skinId: SkinId, plan: UserPlan = getUserPlan()): boolean {
  if (plan === 'premium') return true
  return FREE_SKIN_IDS.includes(skinId)
}

export function getAllowedSkins(plan: UserPlan = getUserPlan()): SkinId[] {
  if (plan === 'premium') {
    return ['default', 'whatsapp', 'teams', 'slack', 'telegram', 'discord']
  }
  return [...FREE_SKIN_IDS]
}
