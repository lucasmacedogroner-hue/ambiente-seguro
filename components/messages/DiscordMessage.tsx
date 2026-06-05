'use client'

import {
  MessageAvatar,
  MessageImage,
  formatTime,
  getDiscordNameColor,
  type SkinMessageProps,
} from './shared'

/** Discord — estilo servidor: avatar redondo, nome colorido, sem bolhas */
export function DiscordMessage({ message, isOwn, showSender }: SkinMessageProps) {
  const time = formatTime(message.created_at)
  const nameColor = getDiscordNameColor(message.sender_name)

  return (
    <div className="group flex gap-4 px-4 py-0.5 hover:bg-[var(--bg-sidebar)]/60">
      {showSender ? (
        <MessageAvatar name={message.sender_name} shape="round" size="lg" />
      ) : (
        <div className="flex w-10 shrink-0 items-start justify-center pt-1">
          <span className="text-[10px] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100">
            {time}
          </span>
        </div>
      )}
      <div className="min-w-0 flex-1 pb-1">
        {showSender && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold" style={{ color: nameColor }}>
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
        {message.image_url && <MessageImage url={message.image_url} className="max-w-md" />}
      </div>
    </div>
  )
}
