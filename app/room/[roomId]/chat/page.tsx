"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ChatRoom } from "@/components/ChatRoom"
import { getSessionId } from "@/lib/session"
import type { ChatRoom as ChatRoomType } from "@/types"

const NAME_KEY = "chat_user_name"

export default function ChatPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = use(params)
  const router = useRouter()

  const [room, setRoom] = useState<ChatRoomType | null>(null)
  const [myName, setMyName] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [isCreator, setIsCreator] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const name = localStorage.getItem(NAME_KEY)
    const sid = getSessionId()

    if (!name) {
      router.replace(`/room/${roomId}`)
      return
    }

    setMyName(name)
    setSessionId(sid)

    const init = async () => {
      try {
        const roomRes = await fetch(`/api/rooms/${roomId}`)
        if (!roomRes.ok) {
          const err = await roomRes.json()
          throw new Error(err.error || "Sala indisponível")
        }
        const roomData: ChatRoomType = await roomRes.json()

        const joinRes = await fetch(`/api/rooms/${roomId}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid,
            userName: name,
            accessCode: roomData.access_code ?? "",
          }),
        })
        const joinData = await joinRes.json()

        if (!joinRes.ok) throw new Error(joinData.error || "Sem acesso")
        if (joinData.status !== "approved") {
          router.replace(`/room/${roomId}`)
          return
        }

        setRoom(roomData)
        setIsCreator(!!joinData.isCreator)
        setLoading(false)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro"
        setError(msg)
        setLoading(false)
      }
    }

    init()
  }, [roomId, router])

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "var(--accent)" }}
        />
      </main>
    )
  }

  if (error || !room) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Não foi possível entrar na sala
        </h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {error || "Sala não disponível"}
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-md px-4 py-2 text-sm"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--accent-fg)",
          }}
        >
          Voltar
        </button>
      </main>
    )
  }

  return (
    <ChatRoom
      room={room}
      myName={myName}
      sessionId={sessionId}
      isCreator={isCreator}
    />
  )
}
