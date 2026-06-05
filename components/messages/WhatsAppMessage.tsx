'use client'

import { cn } from '@/lib/utils'
import { MessageImage, formatTime, type SkinMessageProps } from './shared'

/** WhatsApp — bolhas com “rabinho”, verde claro enviado, branco recebido */
export function WhatsAppMessage({ message, isOwn, showSender }: SkinMessageProps) {
  const time = formatTime(message.created_at)

  return (
    <div
      className={cn(
        'flex w-full px-3 py-0.5',
        isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'relative max-w-[82%] px-3 py-1.5 shadow-sm',
          isOwn
            ? 'rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-sm'
            : 'rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm'
        )}
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
          <p className="whitespace-pre-wrap break-words text-[14.2px] leading-snug">
            {message.content}
          </p>
        )}
        {message.image_url && <MessageImage url={message.image_url} />}
        <div className="mt-0.5 flex justify-end">
          <span className="text-[11px] text-[var(--text-secondary)]">{time}</span>
        </div>
      </div>
    </div>
  )
}
