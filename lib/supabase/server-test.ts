import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { getSupabaseConfig } from './config'

export async function testSupabaseConnectionServer(): Promise<{
  ok: boolean
  message: string
  roomCount: number | null
}> {
  const { configured } = getSupabaseConfig()
  if (!configured) {
    return {
      ok: false,
      message:
        'Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no .env.local',
      roomCount: null,
    }
  }

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { count, error } = await supabase
      .from('chat_rooms')
      .select('id', { count: 'exact', head: true })

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        return {
          ok: false,
          message:
            'Conexão OK, mas chat_rooms não existe. Execute supabase/schema.sql no SQL Editor.',
          roomCount: null,
        }
      }
      return { ok: false, message: error.message, roomCount: null }
    }

    return {
      ok: true,
      message: `Conectado (SSR). Tabela chat_rooms acessível${count != null ? ` — ${count} sala(s)` : ''}.`,
      roomCount: count,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao conectar'
    return { ok: false, message, roomCount: null }
  }
}
