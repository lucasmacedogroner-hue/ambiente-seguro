'use client'

import { Loader2, Plus, Send, Smile, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  MessageComposer,
  type MessageComposerHandle,
} from '@/components/MessageComposer'

interface TeamsComposerProps {
  content: string
  sending: boolean
  uploading: boolean
  composerRef: React.RefObject<MessageComposerHandle | null>
  fileRef: React.RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onSend: () => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function TeamsComposer({
  content,
  sending,
  uploading,
  composerRef,
  fileRef,
  onChange,
  onSend,
  onFileChange,
}: TeamsComposerProps) {
  return (
    <div className="border-t border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3">
      <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] shadow-sm">
        <MessageComposer
          ref={composerRef}
          value={content}
          onChange={onChange}
          onSend={onSend}
          placeholder="Digite uma mensagem"
          sending={sending}
          variant="teams"
        />
        <div className="flex items-center justify-between border-t border-[var(--border-color)] px-2 py-1">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)]"
              title="Formatação"
              aria-label="Formatação"
            >
              <Type className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)]"
              title="Emoji"
              aria-label="Emoji"
            >
              <Smile className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex h-8 w-8 items-center justify-center rounded text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)]"
              title="Anexar"
              aria-label="Anexar imagem"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
              aria-label="Selecionar imagem para anexar"
            />
          </div>
          <Button
            size="icon"
            onClick={onSend}
            disabled={sending || !content.trim()}
            className="h-8 w-8 bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90"
            aria-label="Enviar"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
