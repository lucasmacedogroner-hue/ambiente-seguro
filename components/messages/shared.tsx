'use client'

import { Download } from 'lucide-react'
import type { AvatarShape } from '@/types'
import { cn } from '@/lib/utils'

export interface SkinMessageProps {
  message: {
    sender_name: string
    content: string | null
    image_url: string | null
    created_at: string
  }
  isOwn: boolean
  showSender: boolean
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
]

const DISCORD_NAME_COLORS = [
  '#f23f43', '#f0b232', '#3ba55d', '#5865f2',
  '#eb459e', '#ed4245', '#faa61a', '#57f287',
]

export function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function getDiscordNameColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return DISCORD_NAME_COLORS[Math.abs(hash) % DISCORD_NAME_COLORS.length]
}

async function handleDownload(url: string) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `imagem-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank')
  }
}

export function MessageImage({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  return (
    <div className={cn('group/img relative mt-1 inline-block max-w-xs', className)}>
      <img src={url} alt="Imagem enviada" className="rounded-md" />
      <button
        type="button"
        onClick={() => handleDownload(url)}
        className="absolute right-2 top-2 hidden h-8 w-8 items-center justify-center rounded-md bg-black/70 text-white hover:bg-black/90 group-hover/img:flex"
        aria-label="Baixar imagem"
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  )
}

export function MessageAvatar({
  name,
  shape = 'round',
  size = 'md',
  visible = true,
}: {
  name: string
  shape?: AvatarShape
  size?: 'sm' | 'md' | 'lg'
  visible?: boolean
}) {
  const sizeClass =
    size === 'sm' ? 'h-5 w-5 text-[9px]' :
    size === 'lg' ? 'h-10 w-10 text-sm' :
    'h-9 w-9 text-xs'

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center font-semibold text-white',
        sizeClass,
        shape === 'round' ? 'rounded-full' : 'rounded-md',
        !visible && 'invisible'
      )}
      style={{ backgroundColor: getAvatarColor(name) }}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  )
}
