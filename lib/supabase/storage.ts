import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const BUCKET = 'chat-images'

export function getStorageAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) return null

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function isImageUploadConfigured(): boolean {
  return getStorageAdminClient() !== null
}

export async function uploadChatImage(
  file: File,
  filename: string,
): Promise<{ url: string } | { error: string }> {
  const supabase = getStorageAdminClient()
  if (!supabase) {
    return {
      error:
        'Upload não configurado. Adicione SUPABASE_SERVICE_ROLE_KEY no .env.local (local) ou na Vercel (produção).',
    }
  }

  const bytes = await file.arrayBuffer()
  const path = `chat/${Date.now()}-${filename}`

  const { data, error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    if (error.message.toLowerCase().includes('bucket')) {
      return {
        error:
          'Bucket chat-images não encontrado. Execute supabase/storage.sql no SQL Editor do Supabase.',
      }
    }
    return { error: error.message }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path)

  return { url: publicUrl }
}
