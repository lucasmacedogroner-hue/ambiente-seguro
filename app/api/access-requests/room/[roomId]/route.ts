import { createClientFromCookies } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const supabase = await createClientFromCookies()
    const { roomId } = await params
    const sessionId = req.nextUrl.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId obrigatório' }, { status: 400 })
    }

    const { data: room } = await supabase
      .from('chat_rooms')
      .select('created_by_session_id')
      .eq('id', roomId)
      .single()

    if (!room || room.created_by_session_id !== sessionId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('access_requests')
      .select('*')
      .eq('room_id', roomId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
