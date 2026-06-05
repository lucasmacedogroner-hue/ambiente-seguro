'use client'

import type { ComponentType } from 'react'
import type { SkinId } from '@/types'
import { TeamsComposer } from '@/components/skins/TeamsComposer'
import { DefaultComposer } from './DefaultComposer'
import { WhatsAppComposer } from './WhatsAppComposer'
import { TelegramComposer } from './TelegramComposer'
import { DiscordComposer } from './DiscordComposer'
import { SlackComposer } from './SlackComposer'
import type { SkinComposerProps } from './types'

const COMPOSERS: Record<SkinId, ComponentType<SkinComposerProps>> = {
  default: DefaultComposer,
  whatsapp: WhatsAppComposer,
  telegram: TelegramComposer,
  teams: TeamsComposer,
  slack: SlackComposer,
  discord: DiscordComposer,
}

interface SkinComposerRouterProps extends SkinComposerProps {
  skinId: SkinId
}

/** Escolhe o campo de digitação conforme a skin ativa */
export function SkinComposer({ skinId, ...props }: SkinComposerRouterProps) {
  const Composer = COMPOSERS[skinId] ?? DefaultComposer
  return <Composer {...props} />
}
