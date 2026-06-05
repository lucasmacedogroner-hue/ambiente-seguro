'use client'

import { MessageAvatar, MessageImage, formatTime, type SkinMessageProps } from './shared'

/** Slack — estilo canal: sem bolhas, nome + hora inline, hover na linha */
export function SlackMessage({ message, isOwn, showSender }: SkinMessageProps) {
  const time = formatTime(message.created_at)

  return (
    <div className="group flex gap-2 px-4 py-0.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
      {showSender ? (
        <MessageAvatar name={message.sender_name} shape="square" size="md" />
      ) : (
        <div className="flex w-9 shrink-0 items-start justify-center pt-0.5">
          <span className="text-[10px] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100">
            {time}
          </span>
        </div>
      )}
      <div className="min-w-0 flex-1 pb-1">
        {showSender && (
          <div className="flex items-baseline gap-2">
            <span
              className="text-sm font-bold"
              style={{ color: isOwn ? 'var(--name-color)' : 'var(--text-primary)' }}
            >
              {message.sender_name}
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">{time}</span>
          </div>
        )}
        {message.content && (
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-[var(--text-primary)]">
            {message.content}
          </p>
        )}
        {message.image_url && <MessageImage url={message.image_url} className="max-w-sm" />}
      </div>
    </div>
  )
}
