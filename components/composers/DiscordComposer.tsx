'use client'

import { Gift, Loader2, Plus, Send, Smile } from 'lucide-react'
import { MessageComposer } from '@/components/MessageComposer'
import type { SkinComposerProps } from './types'

/** Discord — barra cinza com + à esquerda e ícones à direita */
export function DiscordComposer({
  content,
  sending,
  uploading,
  composerRef,
  fileRef,
  onChange,
  onSend,
  onFileChange,
}: SkinComposerProps) {
  return (
    <div
      className="border-t border-[var(--border-color)] px-4 py-3"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <div className="flex items-end gap-3 rounded-lg bg-[var(--bg-input)] px-3 py-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Anexar"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          aria-label="Selecionar imagem"
        />
        <MessageComposer
          ref={composerRef}
          value={content}
          onChange={onChange}
          onSend={onSend}
          placeholder="Conversar em #sala-geral"
          sending={sending}
          variant="discord"
        />
        <div className="mb-0.5 flex items-center gap-1 text-[var(--text-secondary)]">
          <button type="button" className="flex h-8 w-8 items-center justify-center" aria-label="Presente">
            <Gift className="h-5 w-5" />
          </button>
          <button type="button" className="flex h-8 w-8 items-center justify-center" aria-label="GIF">
            <span className="text-xs font-bold">GIF</span>
          </button>
          <button type="button" className="flex h-8 w-8 items-center justify-center" aria-label="Emoji">
            <Smile className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={sending || !content.trim()}
            className="flex h-8 w-8 items-center justify-center disabled:opacity-40"
            aria-label="Enviar"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
