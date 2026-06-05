'use client'

import { cn } from '@/lib/utils'
import {
  MessageAvatar,
  MessageImage,
  formatTime,
  type SkinMessageProps,
} from './shared'

/** Microsoft Teams — roxo claro enviado à direita, recebido com avatar à esquerda */
export function TeamsMessage({ message, isOwn, showSender }: SkinMessageProps) {
  const time = formatTime(message.created_at)

  if (isOwn) {
    return (
      <div className="flex w-full justify-end px-6 py-1">
        <div
          className="max-w-[70%] rounded-xl px-4 py-2.5"
          style={{
            backgroundColor: 'var(--bg-bubble-sent)',
            color: 'var(--text-bubble-sent)',
          }}
        >
          {message.content && (
            <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
          )}
          {message.image_url && <MessageImage url={message.image_url} />}
          <div className="mt-1 text-right text-[10px] opacity-60">{time}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full gap-3 px-6 py-1">
      <MessageAvatar
        name={message.sender_name}
        size={showSender ? 'md' : 'md'}
        visible={showSender}
      />
      <div className="min-w-0 max-w-[75%]">
        {showSender && (
          <p
            className="mb-0.5 text-xs font-semibold"
            style={{ color: 'var(--name-color)' }}
          >
            {message.sender_name}
          </p>
        )}
        <div
          className={cn(
            'rounded-xl border border-[var(--border-color)] px-4 py-2.5',
            !showSender && 'ml-0'
          )}
          style={{
            backgroundColor: 'var(--bg-bubble-received)',
            color: 'var(--text-bubble-received)',
          }}
        >
          {message.content && (
            <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
          )}
          {message.image_url && <MessageImage url={message.image_url} />}
          <div className="mt-1 text-[10px] text-[var(--text-secondary)]">{time}</div>
        </div>
      </div>
    </div>
  )
}
