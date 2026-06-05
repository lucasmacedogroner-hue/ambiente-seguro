"use client"

import { useEffect, useRef } from "react"
import type { Message as MessageType, Skin, SkinId } from "@/types"
import { cn } from "@/lib/utils"
import { Message } from "./Message"

interface MessageListProps {
  messages: MessageType[]
  myName: string
  skin: Skin
}

const AREA_STYLES: Record<SkinId, string> = {
  default: "py-3",
  whatsapp: "chat-area--whatsapp py-2",
  telegram: "py-2",
  teams: "chat-area--teams py-4",
  slack: "chat-area--slack py-2",
  discord: "chat-area--discord py-2",
}

const EMPTY_HINTS: Record<SkinId, string> = {
  default: "Nenhuma mensagem ainda. Seja o primeiro a enviar!",
  whatsapp: "As mensagens são protegidas com criptografia de ponta a ponta.",
  telegram: "Nenhuma mensagem aqui ainda…",
  teams: "Esta é o início da conversa em equipe.",
  slack: "Este é o início do canal #sala-geral.",
  discord: "Este é o início do canal #sala-geral.",
}

export function MessageList({ messages, myName, skin }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto", block: "end" })
  }, [messages])

  const areaClass = AREA_STYLES[skin.id] ?? AREA_STYLES.default
  const emptyHint = EMPTY_HINTS[skin.id] ?? EMPTY_HINTS.default

  if (messages.length === 0) {
    return (
      <div
        className={cn(
          "chat-area flex h-full items-center justify-center px-6 text-center text-sm text-[var(--text-secondary)]",
          areaClass
        )}
      >
        {emptyHint}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "chat-area scrollbar-thin flex-1 overflow-y-auto",
        areaClass
      )}
    >
      {messages.map((msg, idx) => {
        const prev = messages[idx - 1]
        const isOwn = msg.sender_name === myName
        const showSender =
          !prev ||
          prev.sender_name !== msg.sender_name ||
          new Date(msg.created_at).getTime() -
            new Date(prev.created_at).getTime() >
            60_000

        return (
          <Message
            key={msg.id}
            message={msg}
            isOwn={isOwn}
            skin={skin}
            showSender={showSender}
          />
        )
      })}
      <div ref={endRef} />
    </div>
  )
}
