'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getNavLinksForApp } from '@/lib/nav-links'

interface AppNavProps {
  inHeader?: boolean
}

export function AppNav({ inHeader = false }: AppNavProps) {
  const pathname = usePathname()
  const links = getNavLinksForApp()

  return (
    <nav
      className={cn(
        'mt-3 flex flex-wrap gap-1 border-t pt-3',
        inHeader ? 'border-[var(--header-fg)]/15' : 'border-[var(--border-color)]'
      )}
    >
      {links.map(({ href, label, icon: Icon, external }) => {
        const active = !external && pathname === href
        const className = cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          inHeader
            ? active
              ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
              : 'text-[var(--header-fg)]/80 hover:bg-[var(--header-fg)]/10 hover:text-[var(--header-fg)]'
            : active
              ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)] hover:text-[var(--text-primary)]'
        )
        if (external) {
          return (
            <a key={href} href={href} className={className}>
              <Icon className="h-4 w-4" />
              {label}
            </a>
          )
        }
        return (
          <Link key={href} href={href} className={className}>
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
