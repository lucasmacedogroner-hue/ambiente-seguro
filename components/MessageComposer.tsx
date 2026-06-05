'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { SkinId } from '@/types'
import { cn } from '@/lib/utils'

export interface MessageComposerHandle {
  focus: () => void
}

interface MessageComposerProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  sending?: boolean
  variant?: SkinId | 'default'
  className?: string
}

export function focusMessageComposer(
  ref: React.RefObject<MessageComposerHandle | null>
) {
  requestAnimationFrame(() => {
    ref.current?.focus()
  })
}

const VARIANT_CLASSES: Partial<Record<SkinId, string>> = {
  default:
    'min-h-9 max-h-32 flex-1 rounded-md border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]',
  whatsapp: 'min-h-[36px] max-h-28 flex-1 px-1 py-2 text-[15px]',
  telegram: 'min-h-[36px] max-h-28 flex-1 py-2 text-sm',
  teams: 'min-h-[44px] max-h-32 px-4 py-3 text-sm',
  slack: 'min-h-[44px] max-h-32 px-3 py-2 text-sm',
  discord: 'min-h-[36px] max-h-28 flex-1 py-1 text-[15px]',
}

export const MessageComposer = forwardRef<MessageComposerHandle, MessageComposerProps>(
  function MessageComposer(
    {
      value,
      onChange,
      onSend,
      placeholder = 'Digite sua mensagem...',
      sending = false,
      variant = 'default',
      className,
    },
    ref
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => {
        const el = textareaRef.current
        if (!el) return
        el.focus()
        const end = el.value.length
        el.setSelectionRange(end, end)
      },
    }))

    useEffect(() => {
      const el = textareaRef.current
      if (!el) return
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 128)}px`
    }, [value])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSend()
      }
    }

    const baseClass =
      'w-full resize-none border-0 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus-visible:ring-0'

    const variantClass =
      VARIANT_CLASSES[variant as SkinId] ?? VARIANT_CLASSES.default!

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        aria-label="Mensagem"
        aria-busy={sending}
        className={cn(baseClass, variantClass, className)}
      />
    )
  }
)
