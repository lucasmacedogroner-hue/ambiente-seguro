"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { Share2, KeyRound } from "lucide-react"
import { toast } from "sonner"
import type { ChatRoom as ChatRoomType, Message as MessageType } from "@/types"
import { Button } from "@/components/ui/button"
import { MessageList } from "./MessageList"
import { ContactsSidebar } from "./ContactsSidebar"
import { ApprovalPanel } from "./ApprovalPanel"
import { CountdownTimer } from "./CountdownTimer"
import { SkinPicker, useSkin } from "./SkinPicker"
import { getSkin } from "@/lib/themes"
import { TeamsAppRail } from "./skins/TeamsAppRail"
import { TeamsChatHeader } from "./skins/TeamsChatHeader"
import { SkinComposer } from "./composers/SkinComposer"
import {
  focusMessageComposer,
  type MessageComposerHandle,
} from "./MessageComposer"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface ChatRoomProps {
  room: ChatRoomType
  myName: string
  sessionId: string
  isCreator: boolean
}

export function ChatRoom({ room, myName, sessionId, isCreator }: ChatRoomProps) {
  const router = useRouter()
  const { skin: skinId } = useSkin()
  const skin = getSkin(skinId)
  const isTeams = skin.chrome === "teams"

  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const composerRef = useRef<MessageComposerHandle>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: messages, mutate } = useSWR<MessageType[]>(
    `/api/messages/${room.id}`,
    fetcher,
    { refreshInterval: 3000, fallbackData: [] }
  )

  const messagesList = Array.isArray(messages) ? messages : []

  const participants = Array.from(
    new Set([myName, ...messagesList.map((m) => m.sender_name)])
  ).filter(Boolean)

  const roomTitle = room.is_private ? "Sala privada" : "Sala aberta"

  useLayoutEffect(() => {
    focusMessageComposer(composerRef)
  }, [])

  useEffect(() => {
    focusMessageComposer(composerRef)
  }, [skinId])

  useEffect(() => {
    if (!sending) {
      focusMessageComposer(composerRef)
    }
  }, [sending])

  const handleSend = async () => {
    const text = content.trim()
    if (!text || sending) return

    const optimistic: MessageType = {
      id: `pending-${Date.now()}`,
      room_id: room.id,
      sender_name: myName,
      content: text,
      image_url: null,
      created_at: new Date().toISOString(),
    }

    setContent("")
    focusMessageComposer(composerRef)
    setSending(true)

    try {
      await mutate(
        async (current) => {
          const res = await fetch(`/api/messages/${room.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderName: myName, content: text }),
          })
          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || "Erro ao enviar")
          }
          const created = (await res.json()) as MessageType
          const list = current ?? []
          return [...list.filter((m) => m.id !== optimistic.id), created]
        },
        {
          optimisticData: (current) => [...(current ?? []), optimistic],
          rollbackOnError: true,
          revalidate: false,
        }
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro"
      toast.error(msg)
    } finally {
      setSending(false)
      focusMessageComposer(composerRef)
    }
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Imagem maior que 4MB")
      e.target.value = ""
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const upRes = await fetch("/api/upload", {
        method: "POST",
        body: form,
      })
      if (!upRes.ok) {
        const err = await upRes.json()
        throw new Error(err.error || "Erro no upload")
      }
      const { url } = await upRes.json()

      const msgRes = await fetch(`/api/messages/${room.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderName: myName, imageUrl: url }),
      })
      if (!msgRes.ok) {
        const err = await msgRes.json()
        throw new Error(err.error || "Erro ao enviar imagem")
      }
      mutate()
      toast.success("Imagem enviada")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro"
      toast.error(msg)
    } finally {
      setUploading(false)
      e.target.value = ""
      focusMessageComposer(composerRef)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/room/${room.id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copiado!")
    } catch {
      toast.error("Não foi possível copiar o link")
    }
  }

  const handleExpire = () => {
    toast.error("Sala expirada")
    setTimeout(() => router.push("/"), 1500)
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      {isTeams && <TeamsAppRail />}

      <ContactsSidebar
        roomId={room.id}
        roomTitle={roomTitle}
        participants={participants}
        isTeams={isTeams}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {isTeams ? (
          <TeamsChatHeader
            title={roomTitle}
            subtitle={`Você como ${myName}`}
            participantCount={participants.length}
            expiresAt={room.expires_at}
            accessCode={room.is_private ? room.access_code : null}
            onExpire={handleExpire}
            onShare={handleShare}
          />
        ) : (
          <header
            className="flex items-center justify-between gap-2 border-b border-[var(--border-color)] px-4 py-2"
            style={{
              backgroundColor: "var(--bg-header)",
              color: "var(--header-fg)",
            }}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-semibold">
                  {myName}{" "}
                  <span className="text-xs font-normal opacity-80">
                    · Sala {room.is_private ? "privada" : "aberta"}
                  </span>
                </h1>
              </div>
              <CountdownTimer expiresAt={room.expires_at} onExpire={handleExpire} />
            </div>

            <div className="flex items-center gap-2">
              {room.is_private && room.access_code && (
                <div className="hidden items-center gap-1 rounded-md border border-[var(--border-color)] bg-[var(--bg-sidebar)] px-2 py-1 text-xs font-mono text-[var(--text-primary)] sm:flex">
                  <KeyRound className="h-3 w-3" />
                  {room.access_code}
                </div>
              )}
              <SkinPicker compact />
              <Button
                size="sm"
                variant="outline"
                onClick={handleShare}
                className="border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] hover:text-[var(--text-primary)]"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Compartilhar</span>
              </Button>
            </div>
          </header>
        )}

        {isCreator && room.is_private && (
          <ApprovalPanel roomId={room.id} sessionId={sessionId} />
        )}

        <MessageList messages={messagesList} myName={myName} skin={skin} />

        <SkinComposer
          skinId={skinId}
          content={content}
          sending={sending}
          uploading={uploading}
          composerRef={composerRef}
          fileRef={fileRef}
          onChange={setContent}
          onSend={handleSend}
          onFileChange={handleFile}
        />
      </div>
    </div>
  )
}
