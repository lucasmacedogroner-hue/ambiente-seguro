'use client'

import { cn } from '@/lib/utils'
import {
  MessageAvatar,
  MessageImage,
  formatTime,
  type SkinMessageProps,
} from './shared'

/** Padrão — bolhas clássicas, enviadas à direita em azul */
export function DefaultMessage({ message, isOwn, showSender }: SkinMessageProps) {
  const time = formatTime(message.created_at)

  return (
    <div
      className={cn(
        'flex w-full gap-2 px-3 py-0.5',
        isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      {!isOwn && (
        <MessageAvatar
          name={message.sender_name}
          visible={showSender}
        />
      )}
      <div
        className="max-w-[75%] rounded-2xl px-3 py-2 shadow-sm"
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
            className="mb-1 text-xs font-semibold"
            style={{ color: 'var(--name-color)' }}
          >
            {message.sender_name}
          </p>
        )}
        {message.content && (
          <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
        )}
        {message.image_url && <MessageImage url={message.image_url} />}
        <div className="mt-1 text-right text-[10px] opacity-70">{time}</div>
      </div>
    </div>
  )
}
