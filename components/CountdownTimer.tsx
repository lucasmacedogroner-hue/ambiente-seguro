"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  expiresAt: string
  onExpire?: () => void
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Expirada"
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<number>(() => {
    return new Date(expiresAt).getTime() - Date.now()
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const ms = new Date(expiresAt).getTime() - Date.now()
      setRemaining(ms)
      if (ms <= 0) {
        onExpire?.()
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt, onExpire])

  return (
    <div className="flex items-center gap-1 text-xs opacity-80">
      <Clock className="h-3 w-3" />
      <span>{formatRemaining(remaining)}</span>
    </div>
  )
}
