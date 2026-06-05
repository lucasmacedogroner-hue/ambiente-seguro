"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Globe, Clock, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SkinPicker } from "@/components/SkinPicker"
import { getSessionId } from "@/lib/session"
import type { ChatRoom } from "@/types"

const NAME_KEY = "chat_user_name"

export default function RoomEntryPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = use(params)
  const router = useRouter()

  const [room, setRoom] = useState<ChatRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [joining, setJoining] = useState(false)
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(NAME_KEY)
    if (saved) setName(saved)

    fetch(`/api/rooms/${roomId}`)
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json()
          throw new Error(err.error || "Erro")
        }
        return r.json()
      })
      .then((data: ChatRoom) => {
        setRoom(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [roomId])

  useEffect(() => {
    if (!pendingRequestId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/access-requests/${pendingRequestId}`)
        if (!res.ok) return
        const { status } = await res.json()
        if (status === "approved") {
          clearInterval(interval)
          localStorage.setItem(NAME_KEY, name)
          router.push(`/room/${roomId}/chat`)
        } else if (status === "rejected") {
          clearInterval(interval)
          setPendingRequestId(null)
          toast.error("Seu acesso foi rejeitado pelo criador da sala")
        }
      } catch {}
    }, 3000)

    return () => clearInterval(interval)
  }, [pendingRequestId, name, roomId, router])

  const handleJoin = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error("Digite seu nome")
      return
    }
    if (room?.is_private && !code.trim()) {
      toast.error("Digite o código de acesso")
      return
    }

    setJoining(true)
    try {
      const sessionId = getSessionId()
      const res = await fetch(`/api/rooms/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userName: trimmedName,
          accessCode: code.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao entrar")

      localStorage.setItem(NAME_KEY, trimmedName)

      if (data.status === "approved") {
        router.push(`/room/${roomId}/chat`)
      } else if (data.status === "pending") {
        setPendingRequestId(data.requestId)
        toast.info("Aguardando aprovação do criador da sala...")
      } else if (data.status === "rejected") {
        toast.error("Seu acesso foi rejeitado anteriormente")
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro"
      toast.error(msg)
    } finally {
      setJoining(false)
    }
  }

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
        className="flex min-h-screen items-center justify-center px-4"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Não foi possível abrir a sala</CardTitle>
            <CardDescription>
              {error || "Sala não disponível"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (pendingRequestId) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-4"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div
              className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--bg-sidebar)",
                color: "var(--accent)",
              }}
            >
              <Clock className="h-6 w-6 animate-pulse" />
            </div>
            <CardTitle>Aguardando aprovação</CardTitle>
            <CardDescription>
              O criador da sala precisa aprovar seu acesso. Esta página atualiza
              automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => {
                setPendingRequestId(null)
                router.push("/")
              }}
              className="w-full"
            >
              Cancelar
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-end">
          <SkinPicker compact />
        </div>

        <Card>
          <CardHeader>
            <div
              className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg"
              style={{
                backgroundColor: "var(--bg-sidebar)",
                color: "var(--accent)",
              }}
            >
              {room.is_private ? (
                <Lock className="h-6 w-6" />
              ) : (
                <Globe className="h-6 w-6" />
              )}
            </div>
            <CardTitle>
              {room.is_private ? "Sala Privada" : "Sala Aberta"}
            </CardTitle>
            <CardDescription>
              {room.is_private
                ? "Sem conta — digite seu nome e o código de acesso"
                : "Sem conta — digite seu nome para entrar na sala"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como você quer ser chamado"
                maxLength={40}
                autoFocus
              />
            </div>

            {room.is_private && (
              <div className="space-y-2">
                <Label htmlFor="code">Código de acesso</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                  className="font-mono uppercase tracking-widest"
                />
              </div>
            )}

            <p className="flex items-start gap-2 text-xs text-muted-foreground rounded-md border bg-muted/30 p-2">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-green-600 mt-0.5" />
              Nenhum cadastro necessário. Sua identidade aqui é só o nome que você digitar.
            </p>

            <Button
              onClick={handleJoin}
              disabled={joining}
              className="w-full"
            >
              {joining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Entrar na sala"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
