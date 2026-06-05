"use client"

import { Users } from "lucide-react"
import type { Message } from "@/types"

interface ParticipantsListProps {
  messages: Message[]
  myName: string
}

export function ParticipantsList({ messages, myName }: ParticipantsListProps) {
  const participants = Array.from(
    new Set([myName, ...messages.map((m) => m.sender_name)])
  ).filter(Boolean)

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-sidebar)]">
      <Users className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
      <span className="shrink-0 text-xs font-medium text-[var(--text-secondary)]">
        {participants.length}:
      </span>
      <div className="flex gap-1 overflow-x-auto">
        {participants.map((name) => (
          <span
            key={name}
            className="shrink-0 rounded-full bg-[var(--bg-header)] px-2 py-0.5 text-xs text-[var(--text-primary)]"
          >
            {name === myName ? `${name} (você)` : name}
          </span>
        ))}
      </div>
    </div>
  )
}
