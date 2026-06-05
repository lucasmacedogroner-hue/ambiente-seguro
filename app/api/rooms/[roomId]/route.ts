import { createClientFromCookies } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const supabase = await createClientFromCookies()
    const { roomId } = await params
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Sala não encontrada' }, { status: 404 })
    }

    const now = new Date()
    const expiresAt = new Date(data.expires_at)
    if (now > expiresAt) {
      return NextResponse.json({ error: 'Sala expirada' }, { status: 410 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
