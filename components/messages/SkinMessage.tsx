'use client'

import type { Message as MessageType, Skin } from '@/types'
import { DefaultMessage } from './DefaultMessage'
import { WhatsAppMessage } from './WhatsAppMessage'
import { TelegramMessage } from './TelegramMessage'
import { TeamsMessage } from './TeamsMessage'
import { SlackMessage } from './SlackMessage'
import { DiscordMessage } from './DiscordMessage'

interface SkinMessageProps {
  message: MessageType
  isOwn: boolean
  skin: Skin
  showSender: boolean
}

const RENDERERS = {
  default: DefaultMessage,
  whatsapp: WhatsAppMessage,
  telegram: TelegramMessage,
  teams: TeamsMessage,
  slack: SlackMessage,
  discord: DiscordMessage,
} as const

/** Escolhe o formato de mensagem conforme a skin ativa */
export function SkinMessage({ message, isOwn, skin, showSender }: SkinMessageProps) {
  const Renderer = RENDERERS[skin.id] ?? DefaultMessage
  return (
    <Renderer
      message={message}
      isOwn={isOwn}
      showSender={showSender}
    />
  )
}
