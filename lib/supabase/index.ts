import type { SupabaseClient } from '@supabase/supabase-js'
export { getSupabaseClient, testSupabaseConnection } from './client'
export { getSupabaseConfig } from './config'
import { getSupabaseClient } from './client'

/** Mantido para rotas API do chat */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error('Supabase não configurado. Defina .env.local')
    }
    const value = client[prop as keyof SupabaseClient]
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(client) : value
  },
})
