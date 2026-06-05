'use client'

import { Loader2, Mic, Paperclip, Send, Smile } from 'lucide-react'
import { MessageComposer } from '@/components/MessageComposer'
import type { SkinComposerProps } from './types'

/** WhatsApp — barra arredondada branca com ícones e botão verde */
export function WhatsAppComposer({
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
      className="border-t border-[var(--border-color)] px-3 py-2"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <div className="flex items-end gap-2 rounded-full bg-[var(--bg-input)] px-3 py-1.5 shadow-sm">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--text-secondary)]"
          aria-label="Emoji"
        >
          <Smile className="h-5 w-5" />
        </button>
        <MessageComposer
          ref={composerRef}
          value={content}
          onChange={onChange}
          onSend={onSend}
          placeholder="Mensagem"
          sending={sending}
          variant="whatsapp"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--text-secondary)]"
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
        <button
          type="button"
          onClick={onSend}
          disabled={sending || !content.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)' }}
          aria-label="Enviar"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : content.trim() ? (
            <Send className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  )
}
