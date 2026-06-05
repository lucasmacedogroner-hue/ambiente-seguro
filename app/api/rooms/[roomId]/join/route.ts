import { createClientFromCookies } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const supabase = await createClientFromCookies()
    const { roomId } = await params
    const { sessionId, userName, accessCode } = await req.json()

    if (!sessionId || !userName) {
      return NextResponse.json({ error: 'sessionId e userName obrigatórios' }, { status: 400 })
    }

    const { data: room, error: roomError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'Sala não encontrada' }, { status: 404 })
    }

    const now = new Date()
    if (now > new Date(room.expires_at)) {
      return NextResponse.json({ error: 'Sala expirada' }, { status: 410 })
    }

    if (sessionId === room.created_by_session_id) {
      return NextResponse.json({ status: 'approved', isCreator: true })
    }

    if (!room.is_private) {
      return NextResponse.json({ status: 'approved', isCreator: false })
    }

    if (!accessCode || accessCode.toUpperCase() !== room.access_code) {
      return NextResponse.json({ error: 'Código de acesso inválido' }, { status: 403 })
    }

    const { data: existing } = await supabase
      .from('access_requests')
      .select('*')
      .eq('room_id', roomId)
      .eq('session_id', sessionId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({
        status: existing.status,
        requestId: existing.id,
        isCreator: false,
      })
    }

    const { data: request, error: reqError } = await supabase
      .from('access_requests')
      .insert({
        room_id: roomId,
        session_id: sessionId,
        user_name: userName,
        status: 'pending',
      })
      .select()
      .single()

    if (reqError) {
      return NextResponse.json({ error: reqError.message }, { status: 500 })
    }

    return NextResponse.json({
      status: 'pending',
      requestId: request.id,
      isCreator: false,
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
