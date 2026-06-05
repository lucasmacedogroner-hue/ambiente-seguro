'use client'

import { cn } from '@/lib/utils'
import { MessageImage, formatTime, type SkinMessageProps } from './shared'

/** Telegram — bolhas arredondadas, verde claro enviado, branco recebido */
export function TelegramMessage({ message, isOwn, showSender }: SkinMessageProps) {
  const time = formatTime(message.created_at)

  return (
    <div
      className={cn(
        'flex w-full px-3 py-0.5',
        isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className="max-w-[78%] rounded-2xl px-3 py-2 shadow-sm"
        style={{
          backgroundColor: isOwn
            ? 'var(--bg-bubble-sent)'
            : 'var(--bg-bubble-received)',
          color: isOwn
            ? 'var(--text-bubble-sent)'
            : 'var(--text-bubble-received)',
        }}
      >
        {!isOwn && showSender && (
          <p
            className="mb-0.5 text-xs font-semibold"
            style={{ color: 'var(--name-color)' }}
          >
            {message.sender_name}
          </p>
        )}
        {message.content && (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </p>
        )}
        {message.image_url && <MessageImage url={message.image_url} />}
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10px] text-[var(--text-secondary)]">{time}</span>
        </div>
      </div>
    </div>
  )
}
