'use client'

import { useSkin } from '@/components/SkinPicker'

/** Garante que skin e modo escuro/claro sejam aplicados em todas as páginas */
export function ThemeBootstrap() {
  useSkin()
  return null
}
