'use client'

import { Bold, Image as ImageIcon, Italic, Link2, List, Loader2, Send, Smile } from 'lucide-react'
import { MessageComposer } from '@/components/MessageComposer'
import type { SkinComposerProps } from './types'

/** Slack — caixa com barra de formatação acima do texto */
export function SlackComposer({
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
      <div className="overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] shadow-sm">
        <div className="flex items-center gap-0.5 border-b border-[var(--border-color)] px-2 py-1 text-[var(--text-secondary)]">
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-[var(--bg-sidebar)]" aria-label="Negrito">
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-[var(--bg-sidebar)]" aria-label="Itálico">
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-[var(--bg-sidebar)]" aria-label="Link">
            <Link2 className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-[var(--bg-sidebar)]" aria-label="Lista">
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
        <MessageComposer
          ref={composerRef}
          value={content}
          onChange={onChange}
          onSend={onSend}
          placeholder="Enviar mensagem para #sala-geral"
          sending={sending}
          variant="slack"
        />
        <div className="flex items-center justify-between border-t border-[var(--border-color)] px-2 py-1">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex h-8 w-8 items-center justify-center rounded text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)]"
              aria-label="Anexar imagem"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4" />
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
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)]" aria-label="Emoji">
              <Smile className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={onSend}
            disabled={sending || !content.trim()}
            className="flex h-8 items-center gap-1 rounded px-3 text-sm font-medium text-white disabled:opacity-40"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
