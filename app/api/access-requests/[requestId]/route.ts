import { createClientFromCookies } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const supabase = await createClientFromCookies()
    const { requestId } = await params
    const { status, sessionId } = await req.json()

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    const { data: request } = await supabase
      .from('access_requests')
      .select('room_id')
      .eq('id', requestId)
      .single()

    if (!request) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    const { data: room } = await supabase
      .from('chat_rooms')
      .select('created_by_session_id')
      .eq('id', request.room_id)
      .single()

    if (!room || room.created_by_session_id !== sessionId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('access_requests')
      .update({ status })
      .eq('id', requestId)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const supabase = await createClientFromCookies()
    const { requestId } = await params

    const { data, error } = await supabase
      .from('access_requests')
      .select('status')
      .eq('id', requestId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ status: data.status })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
