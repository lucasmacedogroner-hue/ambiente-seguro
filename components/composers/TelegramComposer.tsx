'use client'

import { Loader2, Paperclip, Send, Smile } from 'lucide-react'
import { MessageComposer } from '@/components/MessageComposer'
import type { SkinComposerProps } from './types'

/** Telegram — input limpo com anexo e envio azul */
export function TelegramComposer({
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
      className="flex items-end gap-2 border-t border-[var(--border-color)] px-3 py-2"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="mb-1 flex h-9 w-9 items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)]"
        aria-label="Anexar"
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Paperclip className="h-5 w-5" />
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
      <div className="flex flex-1 items-end gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-1">
        <MessageComposer
          ref={composerRef}
          value={content}
          onChange={onChange}
          onSend={onSend}
          placeholder="Mensagem"
          sending={sending}
          variant="telegram"
        />
        <button
          type="button"
          className="mb-0.5 flex h-8 w-8 items-center justify-center text-[var(--text-secondary)]"
          aria-label="Emoji"
        >
          <Smile className="h-5 w-5" />
        </button>
      </div>
      <button
        type="button"
        onClick={onSend}
        disabled={sending || !content.trim()}
        className="mb-1 flex h-9 w-9 items-center justify-center rounded-full text-white disabled:opacity-40"
        style={{ backgroundColor: 'var(--accent)' }}
        aria-label="Enviar"
      >
        {sending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </button>
    </div>
  )
}
