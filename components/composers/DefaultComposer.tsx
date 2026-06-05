'use client'

import { Image as ImageIcon, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MessageComposer } from '@/components/MessageComposer'
import type { SkinComposerProps } from './types'

export function DefaultComposer({
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
      style={{ backgroundColor: 'var(--bg-header)' }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
        aria-label="Selecionar imagem para enviar"
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        aria-label="Enviar imagem"
        className="mb-0.5 text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)]"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
      </Button>
      <MessageComposer
        ref={composerRef}
        value={content}
        onChange={onChange}
        onSend={onSend}
        placeholder="Digite sua mensagem..."
        sending={sending}
        variant="default"
      />
      <Button
        onClick={onSend}
        disabled={sending || !content.trim()}
        className="mb-0.5 bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90"
        aria-label="Enviar mensagem"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
