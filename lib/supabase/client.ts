import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from './config'

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, configured } = getSupabaseConfig()
  if (!configured) return null
  if (!client) {
    client = createClient(url, anonKey)
  }
  return client
}

export async function testSupabaseConnection(): Promise<{
  ok: boolean
  message: string
}> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return {
      ok: false,
      message: 'Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local',
    }
  }

  const { error } = await supabase.from('chat_rooms').select('id', { count: 'exact', head: true })

  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      return {
        ok: false,
        message: 'Conexão OK, mas a tabela chat_rooms não existe. Execute supabase/schema.sql no SQL Editor.',
      }
    }
    return { ok: false, message: error.message }
  }

  return { ok: true, message: 'Conectado ao Supabase. Tabela chat_rooms acessível.' }
}
