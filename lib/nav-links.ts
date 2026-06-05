import type { LucideIcon } from 'lucide-react'
import { BookOpen, Database, Home, Map } from 'lucide-react'

export interface NavLink {
  href: string
  label: string
  icon: LucideIcon
  external?: boolean
  devOnly?: boolean
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/como-usar.html', label: 'Como usar', icon: BookOpen, external: true },
  { href: '/mapa-pendencias.html', label: 'Mapa', icon: Map, external: true, devOnly: true },
  { href: '/setup', label: 'Supabase', icon: Database, devOnly: true },
]

/** Links visíveis no app público (GitHub / produção) */
export function getPublicNavLinks(): NavLink[] {
  return NAV_LINKS.filter((link) => !link.devOnly)
}

/** Inclui Mapa e Supabase — só com NEXT_PUBLIC_DEV_NAV=true no .env.local */
export function getNavLinksForApp(): NavLink[] {
  const showDev =
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_DEV_NAV === 'true'
  return showDev ? NAV_LINKS : getPublicNavLinks()
}
