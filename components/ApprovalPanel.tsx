"use client"

import useSWR from "swr"
import { Check, X, UserPlus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { AccessRequest } from "@/types"
import { Button } from "@/components/ui/button"

interface ApprovalPanelProps {
  roomId: string
  sessionId: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ApprovalPanel({ roomId, sessionId }: ApprovalPanelProps) {
  const [open, setOpen] = useState(false)
  const { data, mutate } = useSWR<AccessRequest[]>(
    `/api/access-requests/room/${roomId}?sessionId=${sessionId}`,
    fetcher,
    { refreshInterval: 3000 }
  )

  const requests = Array.isArray(data) ? data : []
  const pendingCount = requests.length

  const handleDecide = async (
    requestId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const res = await fetch(`/api/access-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, sessionId }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro ao decidir")
      }
      toast.success(
        status === "approved" ? "Acesso aprovado" : "Acesso rejeitado"
      )
      mutate()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro"
      toast.error(msg)
    }
  }

  if (pendingCount === 0 && !open) return null

  return (
    <div className="border-b border-[var(--border-color)] bg-[var(--bg-sidebar)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-header)]"
      >
        <span className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Pedidos de acesso
          {pendingCount > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-bold"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-fg)",
              }}
            >
              {pendingCount}
            </span>
          )}
        </span>
        <span className="text-xs text-[var(--text-secondary)]">
          {open ? "Ocultar" : "Ver"}
        </span>
      </button>
      {open && (
        <div className="space-y-2 px-3 pb-3">
          {requests.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)]">
              Nenhum pedido pendente.
            </p>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-header)] px-3 py-2"
              >
                <span className="truncate text-sm text-[var(--text-primary)]">
                  {req.user_name}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => handleDecide(req.id, "approved")}
                    className="h-7 px-2"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDecide(req.id, "rejected")}
                    className="h-7 px-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
