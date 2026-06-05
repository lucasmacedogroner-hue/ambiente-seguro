"use client"

import type { Message as MessageType, Skin } from "@/types"
import { SkinMessage } from "./messages/SkinMessage"

interface MessageProps {
  message: MessageType
  isOwn: boolean
  skin: Skin
  showSender: boolean
}

export function Message(props: MessageProps) {
  return <SkinMessage {...props} />
}
