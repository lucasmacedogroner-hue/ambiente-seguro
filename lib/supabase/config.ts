export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    ''

  const configured =
    url.length > 0 &&
    anonKey.length > 0 &&
    !url.includes('seu-projeto') &&
    !anonKey.includes('sua_anon_key')

  return { url, anonKey, configured }
}
