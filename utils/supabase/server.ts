import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const createClient = (
  cookieStore: Awaited<ReturnType<typeof cookies>>
) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ou ANON_KEY) no .env.local'
    )
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // setAll chamado em Server Component — middleware pode renovar a sessão
        }
      },
    },
  })
}

/** Atalho para Route Handlers e Server Components */
export async function createClientFromCookies() {
  const cookieStore = await cookies()
  return createClient(cookieStore)
}
