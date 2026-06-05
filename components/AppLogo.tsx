import { cn } from '@/lib/utils'

interface AppLogoProps {
  size?: number
  className?: string
}

/** Logo Ambiente Seguro — balões de conversa azuis */
export function AppLogo({ size = 40, className }: AppLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label="Ambiente Seguro"
      className={cn('shrink-0 rounded-lg', className)}
    >
      <rect width="64" height="64" rx="14" fill="#ffffff" />
      <path
        fill="#5B8DFA"
        d="M10 14h26c3.3 0 6 2.7 6 6v14c0 3.3-2.7 6-6 6h-8l-5 5v-5c-3.3 0-6-2.7-6-6V14z"
      />
      <path
        fill="#5B8DFA"
        d="M28 24h26c3.3 0 6 2.7 6 6v14c0 3.3-2.7 6-6 6h-8l-5 5v-5c-3.3 0-6-2.7-6-6V24z"
      />
    </svg>
  )
}
